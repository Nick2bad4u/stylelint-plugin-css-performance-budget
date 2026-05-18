import stylelint, { type RuleBase } from "stylelint";
import { setHas } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-layout-thrashing-properties");

const messages: {
    layoutThrashingProperty: (property: string) => string;
} = ruleMessages(ruleName, {
    layoutThrashingProperty: (property: string): string =>
        `Property "${property}" can trigger layout recalculation and layout thrashing. Prefer transform/opacity-driven approaches where possible.`,
});

const docs = {
    description:
        "Warn on declarations that commonly trigger layout/reflow work in the rendering pipeline.",
    recommended: true,
    url: createRuleDocsUrl("no-layout-thrashing-properties"),
} as const;

type SecondaryOptions = Readonly<{
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
            (secondary?.ignoreProperties ?? []).map((propertyName) =>
                propertyName.toLowerCase()
            )
        );

        root.walkDecls((declaration) => {
            const propertyName = declaration.prop.toLowerCase();

            if (!setHas(layoutThrashingProperties, propertyName)) {
                return;
            }

            if (setHas(ignoredProperties, propertyName)) {
                return;
            }

            report({
                message: messages.layoutThrashingProperty(propertyName),
                node: declaration,
                result,
                ruleName,
                word: declaration.prop,
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
