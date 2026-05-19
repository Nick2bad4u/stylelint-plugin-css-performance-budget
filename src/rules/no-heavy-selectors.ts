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
import { analyzeSelectorListComplexity } from "../_internal/selector-performance.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-heavy-selectors");

const messages: {
    heavySelector: (
        selector: string,
        complexity: number,
        max: number
    ) => string;
} = ruleMessages(ruleName, {
    heavySelector: (
        selector: string,
        complexity: number,
        max: number
    ): string =>
        `Selector "${selector}" is too heavy (complexity ${complexity}). Keep selector complexity at or below ${max}.`,
});

const docs = {
    description:
        "Warn when selector complexity exceeds a configurable performance budget.",
    recommended: false,
    url: createRuleDocsUrl("no-heavy-selectors"),
} as const;

type SecondaryOptions = Readonly<{
    maxComplexity?: number;
}>;

const defaultMaxComplexity = 8;
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
                    maxComplexity: [isPositiveInteger],
                },
            }
        );

        if (!isValid) {
            return;
        }

        const maxComplexity = secondary.maxComplexity ?? defaultMaxComplexity;

        root.walkRules((ruleNode) => {
            for (const selectorComplexity of analyzeSelectorListComplexity(
                ruleNode.selector
            )) {
                if (selectorComplexity.complexity > maxComplexity) {
                    report({
                        message: messages.heavySelector(
                            selectorComplexity.selectorText,
                            selectorComplexity.complexity,
                            maxComplexity
                        ),
                        node: ruleNode,
                        result,
                        ruleName,
                        word: selectorComplexity.selectorText,
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
