import stylelint, { type RuleBase } from "stylelint";
import { isFinite as isFiniteNumber, setHas } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";
import {
    extractBlurRadiiPx,
    parseCssFunctionCalls,
} from "../_internal/value-function-analysis.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-excessive-filter-effects");

const messages: {
    tooManyFunctions: (property: string, count: number, max: number) => string;
    tooMuchBlur: (
        property: string,
        blurPx: number,
        maxBlurPx: number
    ) => string;
} = ruleMessages(ruleName, {
    tooManyFunctions: (property: string, count: number, max: number): string =>
        `Avoid stacking too many ${property} functions (${count}). Keep it at or below ${max} to reduce paint/composite cost.`,
    tooMuchBlur: (
        property: string,
        blurPx: number,
        maxBlurPx: number
    ): string =>
        `Avoid ${property} blur radius ${blurPx}px. Keep blur at or below ${maxBlurPx}px to stay within the performance budget.`,
});

const docs = {
    description:
        "Warn when `filter` or `backdrop-filter` values stack too many effects or excessive blur radii.",
    recommended: true,
    url: createRuleDocsUrl("no-excessive-filter-effects"),
} as const;

type SecondaryOptions = Readonly<{
    maxBlurRadiusPx?: number;
    maxFunctions?: number;
}>;

const filterProperties = new Set([
    "-webkit-backdrop-filter",
    "backdrop-filter",
    "filter",
]);

const defaultMaxBlurRadiusPx = 8;
const defaultMaxFunctions = 2;

const isPositiveNumber = (value: unknown): boolean =>
    typeof value === "number" && isFiniteNumber(value) && value > 0;

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
                    maxBlurRadiusPx: [isPositiveNumber],
                    maxFunctions: [isPositiveNumber],
                },
            }
        );

        if (!isValid) {
            return;
        }

        const maxBlurRadiusPx =
            secondary.maxBlurRadiusPx ?? defaultMaxBlurRadiusPx;
        const maxFunctions = secondary.maxFunctions ?? defaultMaxFunctions;

        root.walkDecls((declaration) => {
            const propertyName = declaration.prop.toLowerCase();

            if (!setHas(filterProperties, propertyName)) {
                return;
            }

            const functionCount = parseCssFunctionCalls(
                declaration.value
            ).length;

            if (functionCount > maxFunctions) {
                report({
                    message: messages.tooManyFunctions(
                        propertyName,
                        functionCount,
                        maxFunctions
                    ),
                    node: declaration,
                    result,
                    ruleName,
                    word: declaration.prop,
                });
            }

            for (const blurRadiusPx of extractBlurRadiiPx(declaration.value)) {
                if (blurRadiusPx > maxBlurRadiusPx) {
                    report({
                        message: messages.tooMuchBlur(
                            propertyName,
                            blurRadiusPx,
                            maxBlurRadiusPx
                        ),
                        node: declaration,
                        result,
                        ruleName,
                        word: declaration.prop,
                    });
                }
            }
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
