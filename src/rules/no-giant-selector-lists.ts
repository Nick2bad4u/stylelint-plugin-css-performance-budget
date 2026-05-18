import stylelint, { type RuleBase } from "stylelint";
import { isInteger } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";
import { getSelectorListLength } from "../_internal/selector-performance.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-giant-selector-lists");

const messages: {
    tooManySelectors: (count: number, max: number) => string;
} = ruleMessages(ruleName, {
    tooManySelectors: (count: number, max: number): string =>
        `Avoid giant selector lists with ${count} selectors. Keep selector lists at or below ${max} selectors.`,
});

const docs = {
    description:
        "Warn when one rule contains an oversized comma-separated selector list.",
    recommended: false,
    url: createRuleDocsUrl("no-giant-selector-lists"),
} as const;

type SecondaryOptions = Readonly<{
    maxSelectors?: number;
}>;

const defaultMaxSelectors = 4;
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
                    maxSelectors: [isPositiveInteger],
                },
            }
        );

        if (!isValid) {
            return;
        }

        const maxSelectors = secondary?.maxSelectors ?? defaultMaxSelectors;

        root.walkRules((ruleNode) => {
            const selectorCount = getSelectorListLength(ruleNode.selector);

            if (selectorCount <= maxSelectors || selectorCount === 0) {
                return;
            }

            report({
                message: messages.tooManySelectors(selectorCount, maxSelectors),
                node: ruleNode,
                result,
                ruleName,
                word: ruleNode.selector,
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
