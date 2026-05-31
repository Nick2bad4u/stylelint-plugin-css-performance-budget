import stylelint, { type RuleBase } from "stylelint";
import { isDefined, setHas } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";
import { splitTopLevelValueList } from "../_internal/value-function-analysis.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-layout-thrashing-properties");

const messages: {
    layoutKeyframesProperty: (
        property: string,
        keyframesName: string
    ) => string;
    layoutTransitionProperty: (property: string) => string;
} = ruleMessages(ruleName, {
    layoutKeyframesProperty: (
        property: string,
        keyframesName: string
    ): string =>
        `Keyframes "${keyframesName}" animates layout-affecting property "${property}", which can force layout work on every frame. Prefer transform/opacity motion.`,
    layoutTransitionProperty: (property: string): string =>
        `Transitioning layout-affecting property "${property}" can force layout work on every frame. Prefer transform/opacity motion.`,
});

const docs = {
    description:
        "Warn when transitions or keyframes target layout-affecting properties.",
    recommended: true,
    url: createRuleDocsUrl("no-layout-thrashing-properties"),
} as const;

type SecondaryOptions = Readonly<{
    checkKeyframes?: boolean;
    ignoreProperties?: string[];
}>;

const layoutThrashingProperties = new Set([
    "bottom",
    "height",
    "inset",
    "inset-block-end",
    "inset-block-start",
    "inset-inline-end",
    "inset-inline-start",
    "left",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "max-height",
    "max-width",
    "min-height",
    "min-width",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "right",
    "top",
    "width",
]);

const isBoolean = (value: unknown): boolean => typeof value === "boolean";

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
                    checkKeyframes: [isBoolean],
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
        const checkKeyframes = secondary.checkKeyframes ?? true;

        root.walkDecls((declaration) => {
            const propertyName = declaration.prop.toLowerCase();
            const transitionTargets = getTransitionTargets(
                propertyName,
                declaration.value
            );

            for (const transitionTarget of transitionTargets) {
                const target = transitionTarget.toLowerCase();

                if (
                    setHas(layoutThrashingProperties, target) &&
                    !setHas(ignoredProperties, target)
                ) {
                    report({
                        message: messages.layoutTransitionProperty(target),
                        node: declaration,
                        result,
                        ruleName,
                        word: declaration.prop,
                    });
                }
            }
        });

        if (!checkKeyframes) {
            return;
        }

        root.walkAtRules((atRule) => {
            const atRuleName = atRule.name.toLowerCase();

            if (
                atRuleName !== "keyframes" &&
                atRuleName !== "-webkit-keyframes"
            ) {
                return;
            }

            const keyframesName = atRule.params.trim() || "<anonymous>";

            atRule.walkDecls((declaration) => {
                const propertyName = declaration.prop.toLowerCase();

                if (
                    !setHas(layoutThrashingProperties, propertyName) ||
                    setHas(ignoredProperties, propertyName)
                ) {
                    return;
                }

                report({
                    message: messages.layoutKeyframesProperty(
                        propertyName,
                        keyframesName
                    ),
                    node: declaration,
                    result,
                    ruleName,
                    word: declaration.prop,
                });
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

function getTransitionTargets(
    propertyName: string,
    value: string
): readonly string[] {
    if (
        propertyName === "transition-property" ||
        propertyName === "-webkit-transition-property"
    ) {
        return splitTopLevelValueList(value)
            .map((entry) => entry.trim().toLowerCase())
            .filter((entry) => entry.length > 0 && entry !== "all");
    }

    if (
        propertyName === "transition" ||
        propertyName === "-webkit-transition"
    ) {
        return splitTopLevelValueList(value)
            .map((entry) => inferTransitionTarget(entry))
            .filter((entry) => entry.length > 0 && entry !== "all");
    }

    return [];
}

function inferTransitionTarget(transitionSegment: string): string {
    const firstTokenPattern = /^\S+/v;
    const firstTokenMatch = firstTokenPattern.exec(
        transitionSegment.trim().toLowerCase()
    );
    const firstToken = firstTokenMatch?.[0];

    if (!isDefined(firstToken)) {
        return "";
    }

    return isTransitionPropertyToken(firstToken) ? firstToken : "all";
}

function isTimingFunctionKeyword(token: string): boolean {
    switch (token) {
        case "ease":
        case "ease-in":
        case "ease-in-out":
        case "ease-out":
        case "linear":
        case "step-end":
        case "step-start": {
            return true;
        }
        default: {
            return false;
        }
    }
}

function isTransitionBehaviorKeyword(token: string): boolean {
    switch (token) {
        case "allow-discrete":
        case "normal": {
            return true;
        }
        default: {
            return false;
        }
    }
}

function isTransitionPropertyToken(token: string): boolean {
    if (isTimingFunctionKeyword(token) || isTransitionBehaviorKeyword(token)) {
        return false;
    }

    if (token.endsWith("ms") || token.endsWith("s")) {
        return false;
    }

    return (
        !token.startsWith("cubic-bezier(") &&
        !token.startsWith("linear(") &&
        !token.startsWith("steps(")
    );
}
