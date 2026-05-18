import type { Rule as PostcssRule } from "postcss";

import stylelint, { type RuleBase } from "stylelint";
import { setHas } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    paintEffectProperties,
    resetKeywords,
} from "../_internal/performance-value-sets.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";
import { selectorListContainsBroadGlobalSelector } from "../_internal/selector-performance.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-global-expensive-effects");

const messages: {
    globalEffect: (property: string, selector: string) => string;
} = ruleMessages(ruleName, {
    globalEffect: (property: string, selector: string): string =>
        `Avoid paint-heavy property "${property}" on broad selector "${selector}". Scope the effect to a smaller component selector.`,
});

const docs = {
    description:
        "Warn when paint-heavy effects are applied to broad global selectors.",
    recommended: true,
    url: createRuleDocsUrl("no-global-expensive-effects"),
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

        if (!isValid) {
            return;
        }

        const ignoredProperties: ReadonlySet<string> = new Set(
            (secondary?.ignoreProperties ?? []).map((entry) =>
                entry.toLowerCase()
            )
        );

        root.walkRules((ruleNode) => {
            if (!selectorListContainsBroadGlobalSelector(ruleNode.selector)) {
                return;
            }

            inspectRuleNode(ruleNode, ignoredProperties, result);
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

function inspectRuleNode(
    ruleNode: PostcssRule,
    ignoredProperties: ReadonlySet<string>,
    result: Parameters<typeof report>[0]["result"]
): void {
    ruleNode.walkDecls((declaration) => {
        const propertyName = declaration.prop.toLowerCase();

        if (
            !setHas<string, string>(paintEffectProperties, propertyName) ||
            setHas<string, string>(ignoredProperties, propertyName) ||
            setHas<string, string>(
                resetKeywords,
                declaration.value.trim().toLowerCase()
            )
        ) {
            return;
        }

        report({
            message: messages.globalEffect(propertyName, ruleNode.selector),
            node: declaration,
            result,
            ruleName,
            word: declaration.prop,
        });
    });
}
