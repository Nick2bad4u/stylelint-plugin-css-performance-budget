import stylelint, { type RuleBase } from "stylelint";
import { setHas } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-paint-heavy-declarations");

const messages: {
    paintHeavyProperty: (property: string) => string;
} = ruleMessages(ruleName, {
    paintHeavyProperty: (property: string): string =>
        `Property "${property}" is paint-heavy. Prefer lighter alternatives or isolate usage to avoid frequent expensive repaints.`,
});

const docs = {
    description:
        "Warn on declaration properties that are typically expensive for paint/compositing.",
    recommended: true,
    url: createRuleDocsUrl("no-paint-heavy-declarations"),
} as const;

type SecondaryOptions = Readonly<{
    ignoreProperties?: string[];
}>;

const paintHeavyProperties = new Set([
    "-webkit-backdrop-filter",
    "backdrop-filter",
    "box-shadow",
    "clip-path",
    "filter",
    "mask",
    "mask-image",
    "mix-blend-mode",
    "text-shadow",
]);

const resetValues = new Set([
    "initial",
    "none",
    "revert",
    "unset",
]);

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
                    ignoreProperties: [
                        (value: unknown): boolean =>
                            Array.isArray(value) &&
                            value.every((entry) => typeof entry === "string"),
                    ],
                },
            }
        );

        if (!isValid) {
            return;
        }

        const ignoredProperties = new Set(
            (secondary.ignoreProperties ?? []).map((propertyName) =>
                propertyName.toLowerCase()
            )
        );

        root.walkDecls((declaration) => {
            const propertyName = declaration.prop.toLowerCase();

            if (!setHas(paintHeavyProperties, propertyName)) {
                return;
            }

            if (setHas(ignoredProperties, propertyName)) {
                return;
            }

            if (setHas(resetValues, declaration.value.trim().toLowerCase())) {
                return;
            }

            report({
                message: messages.paintHeavyProperty(propertyName),
                node: declaration,
                result,
                ruleName,
                word: declaration.prop,
            });
        });
    };

/** Public Stylelint rule definition exported by this module. */
const rule: StylelintPluginRule<boolean, SecondaryOptions> =
    createStylelintRule<boolean, SecondaryOptions>({
        docs,
        messages,
        rule: ruleFunction,
        ruleName,
    });

export default rule;
