import type { Root } from "postcss";

import stylelint, { type RuleBase } from "stylelint";
import { isDefined, setHas, stringSplit } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    compositedAnimationProperties,
    expensiveRenderingProperties,
} from "../_internal/performance-value-sets.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";
import { containsTopLevelToken } from "../_internal/value-function-analysis.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName(
    "require-reduced-motion-for-expensive-animations"
);

const messages: {
    missingReducedMotion: (property: string) => string;
} = ruleMessages(ruleName, {
    missingReducedMotion: (property: string): string =>
        `Expensive animation target "${property}" needs a prefers-reduced-motion override that disables or shortens motion.`,
});

const docs = {
    description:
        "Require a `prefers-reduced-motion: reduce` override when expensive transition or keyframe properties are used.",
    recommended: false,
    url: createRuleDocsUrl("require-reduced-motion-for-expensive-animations"),
} as const;

type SecondaryOptions = Readonly<{
    ignoreProperties?: string[];
}>;

const isStringArray = (value: unknown): boolean =>
    Array.isArray(value) && value.every((entry) => typeof entry === "string");

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
                    ignoreProperties: [isStringArray],
                },
            }
        );

        if (!isValid || hasReducedMotionOverride(root)) {
            return;
        }

        const ignoredProperties: ReadonlySet<string> = new Set(
            (secondary?.ignoreProperties ?? []).map((entry) =>
                entry.toLowerCase()
            )
        );

        root.walkDecls((declaration) => {
            for (const target of getTransitionTargets(
                declaration.prop.toLowerCase(),
                declaration.value
            )) {
                if (
                    !setHas<string, string>(ignoredProperties, target) &&
                    isExpensiveMotionTarget(target)
                ) {
                    report({
                        message: messages.missingReducedMotion(target),
                        node: declaration,
                        result,
                        ruleName,
                        word: declaration.prop,
                    });
                }
            }
        });

        root.walkAtRules((atRule) => {
            const atRuleName = atRule.name.toLowerCase();

            if (
                atRuleName !== "keyframes" &&
                atRuleName !== "-webkit-keyframes"
            ) {
                return;
            }

            atRule.walkDecls((declaration) => {
                const propertyName = declaration.prop.toLowerCase();

                if (
                    !setHas<string, string>(ignoredProperties, propertyName) &&
                    isExpensiveMotionTarget(propertyName)
                ) {
                    report({
                        message: messages.missingReducedMotion(propertyName),
                        node: declaration,
                        result,
                        ruleName,
                        word: declaration.prop,
                    });
                }
            });
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

function getTransitionTargets(
    propertyName: string,
    value: string
): readonly string[] {
    if (
        propertyName === "transition-property" ||
        propertyName === "-webkit-transition-property"
    ) {
        return stringSplit(value, ",")
            .map((entry) => entry.trim().toLowerCase())
            .filter((entry) => entry.length > 0);
    }

    if (
        propertyName === "transition" ||
        propertyName === "-webkit-transition"
    ) {
        return stringSplit(value, ",")
            .map((entry) => inferTransitionTarget(entry))
            .filter((entry) => entry.length > 0);
    }

    return [];
}

function hasMotionResetToken(value: string): boolean {
    return (
        containsTopLevelToken(value, "none") ||
        containsTopLevelToken(value, "0") ||
        containsTopLevelToken(value, "0ms") ||
        containsTopLevelToken(value, "0s")
    );
}

function hasReducedMotionOverride(root: Root): boolean {
    let hasOverride = false;

    root.walkAtRules("media", (atRule) => {
        const params = atRule.params.toLowerCase();

        if (
            !params.includes("prefers-reduced-motion") ||
            !params.includes("reduce")
        ) {
            return;
        }

        atRule.walkDecls((declaration) => {
            const propertyName = declaration.prop.toLowerCase();
            const value = declaration.value.trim().toLowerCase();

            if (
                (propertyName.startsWith("animation") ||
                    propertyName.startsWith("transition")) &&
                hasMotionResetToken(value)
            ) {
                hasOverride = true;
            }
        });
    });

    return hasOverride;
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

function isExpensiveMotionTarget(propertyName: string): boolean {
    if (setHas<string, string>(compositedAnimationProperties, propertyName)) {
        return false;
    }

    return (
        propertyName === "all" ||
        setHas<string, string>(expensiveRenderingProperties, propertyName)
    );
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
