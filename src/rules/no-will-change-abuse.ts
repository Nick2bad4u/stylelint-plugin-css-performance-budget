import stylelint, { type RuleBase } from "stylelint";
import { isDefined, isInteger, setHas, stringSplit } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-will-change-abuse");

const messages: {
    expensiveTarget: (target: string) => string;
    oversizedTargetList: (count: number, max: number) => string;
    reservedKeywordTarget: (target: string) => string;
} = ruleMessages(ruleName, {
    expensiveTarget: (target: string): string =>
        `Avoid will-change target "${target}"; it is usually expensive for layout or paint. Prefer transform/opacity where possible.`,
    oversizedTargetList: (count: number, max: number): string =>
        `Avoid broad will-change lists with ${count} targets. Keep will-change targets at or below ${max}.`,
    reservedKeywordTarget: (target: string): string =>
        `Avoid will-change keyword "${target}" in production styles. Scope will-change to concrete low-cost properties.`,
});

const docs = {
    description:
        "Warn when will-change is overly broad, uses risky keywords, or targets expensive properties.",
    recommended: true,
    url: createRuleDocsUrl("no-will-change-abuse"),
} as const;

type SecondaryOptions = Readonly<{
    checkExpensiveTargets?: boolean;
    disallowKeywords?: string[];
    ignoreProperties?: string[];
    maxProperties?: number;
}>;

const defaultMaxProperties = 2;
const defaultDisallowKeywords: ReadonlySet<string> = new Set([
    "all",
    "contents",
    "scroll-position",
]);
const resetKeywords: ReadonlySet<string> = new Set([
    "auto",
    "inherit",
    "initial",
    "revert",
    "revert-layer",
    "unset",
]);
const expensiveTargets: ReadonlySet<string> = new Set([
    "-webkit-backdrop-filter",
    "backdrop-filter",
    "background-position",
    "background-size",
    "border-radius",
    "bottom",
    "box-shadow",
    "clip-path",
    "filter",
    "height",
    "inset",
    "left",
    "margin",
    "max-height",
    "max-width",
    "min-height",
    "min-width",
    "padding",
    "right",
    "text-shadow",
    "top",
    "width",
]);

const isPositiveInteger = (value: unknown): boolean =>
    typeof value === "number" && isInteger(value) && value > 0;

const ruleFunction: RuleBase<boolean, SecondaryOptions> =
    (primary, secondary) => (root, result) => {
        const isValid = validateOptions(
            result,
            ruleName,
            {
                actual: primary,
                possible: [true],
            },
            {
                actual: secondary,
                optional: true,
                possible: {
                    checkExpensiveTargets: [
                        (value: unknown) => typeof value === "boolean",
                    ],
                    disallowKeywords: [
                        (value: unknown): boolean =>
                            Array.isArray(value) &&
                            value.every((entry) => typeof entry === "string"),
                    ],
                    ignoreProperties: [
                        (value: unknown): boolean =>
                            Array.isArray(value) &&
                            value.every((entry) => typeof entry === "string"),
                    ],
                    maxProperties: [isPositiveInteger],
                },
            }
        );

        if (!isValid) {
            return;
        }

        const checkExpensiveTargets = secondary?.checkExpensiveTargets ?? true;
        const maxProperties = secondary?.maxProperties ?? defaultMaxProperties;
        const ignoredProperties: ReadonlySet<string> = new Set(
            (secondary?.ignoreProperties ?? []).map((entry) =>
                entry.toLowerCase()
            )
        );
        const disallowKeywords: ReadonlySet<string> = new Set(
            (secondary?.disallowKeywords ?? [...defaultDisallowKeywords]).map(
                (entry) => entry.toLowerCase()
            )
        );

        root.walkDecls((declaration) => {
            const propertyName = declaration.prop.toLowerCase();

            if (
                propertyName !== "will-change" &&
                propertyName !== "-webkit-will-change"
            ) {
                return;
            }

            const rawTargets = parseWillChangeTargets(declaration.value);
            const targets = rawTargets.filter(
                (target) => !setHas<string, string>(resetKeywords, target)
            );

            const [firstTarget] = targets;

            if (!isDefined(firstTarget)) {
                return;
            }

            if (targets.length > maxProperties) {
                report({
                    message: messages.oversizedTargetList(
                        targets.length,
                        maxProperties
                    ),
                    node: declaration,
                    result,
                    ruleName,
                    word: declaration.prop,
                });
            }

            for (const target of targets) {
                if (setHas<string, string>(disallowKeywords, target)) {
                    report({
                        message: messages.reservedKeywordTarget(target),
                        node: declaration,
                        result,
                        ruleName,
                        word: target,
                    });
                } else if (
                    !setHas<string, string>(ignoredProperties, target) &&
                    checkExpensiveTargets &&
                    setHas<string, string>(expensiveTargets, target)
                ) {
                    report({
                        message: messages.expensiveTarget(target),
                        node: declaration,
                        result,
                        ruleName,
                        word: target,
                    });
                }
            }
        });
    };

const rule: StylelintPluginRule<boolean, SecondaryOptions, typeof messages> =
    createStylelintRule<boolean, SecondaryOptions, typeof messages>({
        docs,
        messages,
        rule: ruleFunction,
        ruleName,
    });

export default rule;

function parseWillChangeTargets(value: string): readonly string[] {
    return stringSplit(value, ",")
        .map((entry) => entry.trim().toLowerCase())
        .filter((entry) => entry.length > 0);
}
