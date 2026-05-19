import stylelint, { type RuleBase } from "stylelint";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";
import { containsTopLevelToken } from "../_internal/value-function-analysis.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-fixed-background-attachment");

const messages: {
    fixedBackground: (property: string) => string;
} = ruleMessages(ruleName, {
    fixedBackground: (property: string): string =>
        `Avoid ${property}: fixed; fixed backgrounds can force expensive repaint work, especially during scroll.`,
});

const docs = {
    description:
        "Warn on fixed background attachment patterns that commonly cause expensive scroll repaints.",
    recommended: true,
    url: createRuleDocsUrl("no-fixed-background-attachment"),
} as const;

const ruleFunction: RuleBase<boolean> = (primary) => (root, result) => {
    const isValid = validateOptions(result, ruleName, {
        actual: primary,
        possible: [true],
    });

    if (!isValid) {
        return;
    }

    root.walkDecls((declaration) => {
        const propertyName = declaration.prop.toLowerCase();

        if (
            propertyName !== "background" &&
            propertyName !== "background-attachment"
        ) {
            return;
        }

        if (!containsTopLevelToken(declaration.value, "fixed")) {
            return;
        }

        report({
            message: messages.fixedBackground(propertyName),
            node: declaration,
            result,
            ruleName,
            word: declaration.prop,
        });
    });
};

/** Public Stylelint rule definition exported by this module. */
const rule: StylelintPluginRule<boolean, undefined> = createStylelintRule<
    boolean,
    undefined
>({
    docs,
    messages,
    rule: ruleFunction,
    ruleName,
});

export default rule;
