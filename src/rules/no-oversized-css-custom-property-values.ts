import stylelint, { type RuleBase } from "stylelint";
import { isInteger, setHas, stringSplit } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";
import { parseCssFunctionCalls } from "../_internal/value-function-analysis.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-oversized-css-custom-property-values");

const messages: {
    tooManyFunctions: (property: string, count: number, max: number) => string;
    tooManyListItems: (property: string, count: number, max: number) => string;
} = ruleMessages(ruleName, {
    tooManyFunctions: (property: string, count: number, max: number): string =>
        `Custom property "${property}" contains ${count} expensive rendering functions. Keep it at or below ${max}.`,
    tooManyListItems: (property: string, count: number, max: number): string =>
        `Custom property "${property}" contains ${count} comma-separated rendering layers. Keep it at or below ${max}.`,
});

const docs = {
    description:
        "Warn when custom properties hide oversized shadow, filter, or gradient values.",
    recommended: false,
    url: createRuleDocsUrl("no-oversized-css-custom-property-values"),
} as const;

type SecondaryOptions = Readonly<{
    maxFunctions?: number;
    maxListItems?: number;
}>;

const defaultMaxFunctions = 8;
const defaultMaxListItems = 10;
const expensiveFunctionNames: ReadonlySet<string> = new Set([
    "blur",
    "conic-gradient",
    "drop-shadow",
    "linear-gradient",
    "radial-gradient",
    "repeating-conic-gradient",
    "repeating-linear-gradient",
    "repeating-radial-gradient",
]);
const expensiveCustomPropertyNameHints = [
    "backdrop",
    "blur",
    "filter",
    "gradient",
    "shadow",
] as const;

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
                    maxFunctions: [isPositiveInteger],
                    maxListItems: [isPositiveInteger],
                },
            }
        );

        if (!isValid) {
            return;
        }

        const maxFunctions = secondary.maxFunctions ?? defaultMaxFunctions;
        const maxListItems = secondary.maxListItems ?? defaultMaxListItems;

        root.walkDecls((declaration) => {
            if (!declaration.prop.startsWith("--")) {
                return;
            }

            const functionCount = parseCssFunctionCalls(
                declaration.value
            ).filter((cssFunction) =>
                setHas(expensiveFunctionNames, cssFunction.name)
            ).length;

            if (functionCount > maxFunctions) {
                report({
                    message: messages.tooManyFunctions(
                        declaration.prop,
                        functionCount,
                        maxFunctions
                    ),
                    node: declaration,
                    result,
                    ruleName,
                    word: declaration.prop,
                });
            }

            const listItemCount = stringSplit(declaration.value, ",").length;

            if (
                hasExpensiveCustomPropertyNameHint(declaration.prop) &&
                listItemCount > maxListItems
            ) {
                report({
                    message: messages.tooManyListItems(
                        declaration.prop,
                        listItemCount,
                        maxListItems
                    ),
                    node: declaration,
                    result,
                    ruleName,
                    word: declaration.prop,
                });
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

function hasExpensiveCustomPropertyNameHint(propertyName: string): boolean {
    const normalizedPropertyName = propertyName.toLowerCase();

    return expensiveCustomPropertyNameHints.some((hint) =>
        normalizedPropertyName.includes(hint)
    );
}
