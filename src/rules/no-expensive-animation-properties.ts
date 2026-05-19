import stylelint, { type RuleBase } from "stylelint";
import { isDefined, setHas, stringSplit } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-expensive-animation-properties");

const messages: {
    expensiveKeyframesProperty: (
        property: string,
        keyframesName: string
    ) => string;
    expensiveTransitionProperty: (property: string) => string;
    transitionAll: () => string;
} = ruleMessages(ruleName, {
    expensiveKeyframesProperty: (
        property: string,
        keyframesName: string
    ): string =>
        `Keyframes "${keyframesName}" animates "${property}", which is usually expensive for layout or paint. Prefer transform/opacity when possible.`,
    expensiveTransitionProperty: (property: string): string =>
        `Transitioning "${property}" is usually expensive for layout or paint. Prefer transform/opacity-driven transitions when possible.`,
    transitionAll: (): string =>
        "Avoid `transition: all`; scope transitions to specific low-cost properties such as transform or opacity.",
});

const docs = {
    description:
        "Warn on expensive animation and transition targets, including `transition: all` and costly keyframe properties.",
    recommended: true,
    url: createRuleDocsUrl("no-expensive-animation-properties"),
} as const;

type SecondaryOptions = Readonly<{
    allowTransitionAll?: boolean;
    checkKeyframes?: boolean;
    ignoreProperties?: string[];
}>;

const expensiveAnimationProperties: ReadonlySet<string> = new Set([
    "-webkit-backdrop-filter",
    "backdrop-filter",
    "background-color",
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
    "margin-bottom",
    "margin-left",
    "margin-right",
    "margin-top",
    "max-height",
    "max-width",
    "min-height",
    "min-width",
    "padding",
    "padding-bottom",
    "padding-left",
    "padding-right",
    "padding-top",
    "right",
    "text-shadow",
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
                    allowTransitionAll: [isBoolean],
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

        const allowTransitionAll = secondary.allowTransitionAll ?? false;
        const checkKeyframes = secondary.checkKeyframes ?? true;
        const ignoredProperties: ReadonlySet<string> = new Set(
            (secondary.ignoreProperties ?? []).map((propertyName) =>
                propertyName.toLowerCase()
            )
        );

        root.walkDecls((declaration) => {
            const propertyName = declaration.prop.toLowerCase();
            const transitionTargets = getTransitionTargets(
                propertyName,
                declaration.value
            );

            for (const transitionTarget of transitionTargets) {
                const target = transitionTarget.toLowerCase();

                if (target === "all") {
                    if (!allowTransitionAll) {
                        report({
                            message: messages.transitionAll(),
                            node: declaration,
                            result,
                            ruleName,
                            word: declaration.prop,
                        });
                    }
                } else if (
                    !setHas<string, string>(ignoredProperties, target) &&
                    setHas<string, string>(expensiveAnimationProperties, target)
                ) {
                    report({
                        message: messages.expensiveTransitionProperty(target),
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
                    !setHas<string, string>(ignoredProperties, propertyName) &&
                    setHas<string, string>(
                        expensiveAnimationProperties,
                        propertyName
                    )
                ) {
                    report({
                        message: messages.expensiveKeyframesProperty(
                            propertyName,
                            keyframesName
                        ),
                        node: declaration,
                        result,
                        ruleName,
                        word: declaration.prop,
                    });
                }
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

function inferTransitionTarget(transitionSegment: string): string {
    const firstTokenPattern = /^\S+/v;
    const firstTokenMatch = firstTokenPattern.exec(
        transitionSegment.trim().toLowerCase()
    );
    const firstToken = firstTokenMatch?.[0];

    if (!isDefined(firstToken)) {
        return "";
    }

    if (isTransitionPropertyToken(firstToken)) {
        return firstToken;
    }

    // No explicit property token means shorthand defaults to `all`.
    return "all";
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

    if (token.endsWith("ms")) {
        return false;
    }

    if (token.endsWith("s")) {
        return false;
    }

    if (token.startsWith("cubic-bezier(")) {
        return false;
    }

    if (token.startsWith("linear(")) {
        return false;
    }

    if (token.startsWith("steps(")) {
        return false;
    }

    return true;
}
