import stylelint, { type RuleBase } from "stylelint";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-render-blocking-import");

const messages: {
    rejectedImport: (params: string) => string;
} = ruleMessages(ruleName, {
    rejectedImport: (params: string): string =>
        `Avoid CSS @import ${params}; external stylesheet imports can block rendering. Bundle CSS or load it through the document pipeline instead.`,
});

const docs = {
    description:
        "Warn on CSS `@import` rules that can block stylesheet rendering.",
    recommended: true,
    url: createRuleDocsUrl("no-render-blocking-import"),
} as const;

type SecondaryOptions = Readonly<{
    allowLayerImports?: boolean;
    ignoreUrls?: string[];
}>;

const isBoolean = (value: unknown): boolean => typeof value === "boolean";
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
                    allowLayerImports: [isBoolean],
                    ignoreUrls: [isStringArray],
                },
            }
        );

        if (!isValid) {
            return;
        }

        const allowLayerImports = secondary?.allowLayerImports ?? false;
        const ignoredUrlFragments = (secondary?.ignoreUrls ?? []).map((entry) =>
            entry.toLowerCase()
        );

        root.walkAtRules("import", (atRule) => {
            const params = atRule.params.trim();
            const normalizedParams = params.toLowerCase();

            if (
                allowLayerImports &&
                (normalizedParams.includes(" layer(") ||
                    normalizedParams.endsWith(" layer"))
            ) {
                return;
            }

            if (
                ignoredUrlFragments.some((fragment) =>
                    normalizedParams.includes(fragment)
                )
            ) {
                return;
            }

            report({
                message: messages.rejectedImport(params),
                node: atRule,
                result,
                ruleName,
                word: atRule.name,
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
