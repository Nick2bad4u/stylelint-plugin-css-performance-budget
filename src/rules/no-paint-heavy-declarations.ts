import stylelint, { type RuleBase } from "stylelint";
import {
    arrayJoin,
    isEmpty,
    isFinite as isFiniteNumber,
    setHas,
} from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    defaultPaintCostThresholds,
    getPaintCostReasons,
    isAlwaysHighRiskPaintProperty,
    type PaintCostThresholds,
} from "../_internal/paint-cost-analysis.js";
import { resetKeywords } from "../_internal/performance-value-sets.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-paint-heavy-declarations");

const messages: {
    paintHeavyProperty: (property: string, reason: string) => string;
} = ruleMessages(ruleName, {
    paintHeavyProperty: (property: string, reason: string): string =>
        `Property "${property}" exceeds the paint budget (${reason}). Use a lighter effect, reduce the value, or isolate it from frequently repainted UI.`,
});

const docs = {
    description:
        "Warn on declarations whose values exceed paint/compositing budgets.",
    recommended: false,
    url: createRuleDocsUrl("no-paint-heavy-declarations"),
} as const;

type SecondaryOptions = Readonly<{
    ignoreProperties?: string[];
    maxFilterBlurRadiusPx?: number;
    maxFilterFunctions?: number;
    maxShadowBlurRadiusPx?: number;
    maxShadowLayers?: number;
}>;

const paintHeavyProperties = new Set([
    "-webkit-backdrop-filter",
    "backdrop-filter",
    "box-shadow",
    "clip-path",
    "filter",
    "mask",
    "mask-image",
    "mix-blend-mode",
    "text-shadow",
]);

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
                    ignoreProperties: [
                        (value: unknown): boolean =>
                            Array.isArray(value) &&
                            value.every((entry) => typeof entry === "string"),
                    ],
                    maxFilterBlurRadiusPx: [isPositiveNumber],
                    maxFilterFunctions: [isPositiveNumber],
                    maxShadowBlurRadiusPx: [isPositiveNumber],
                    maxShadowLayers: [isPositiveNumber],
                },
            }
        );

        if (!isValid) {
            return;
        }

        const ignoredProperties = new Set(
            (secondary.ignoreProperties ?? []).map((propertyName) =>
                propertyName.toLowerCase()
            )
        );
        const thresholds: PaintCostThresholds = {
            maxFilterBlurRadiusPx:
                secondary.maxFilterBlurRadiusPx ??
                defaultPaintCostThresholds.maxFilterBlurRadiusPx,
            maxFilterFunctions:
                secondary.maxFilterFunctions ??
                defaultPaintCostThresholds.maxFilterFunctions,
            maxShadowBlurRadiusPx:
                secondary.maxShadowBlurRadiusPx ??
                defaultPaintCostThresholds.maxShadowBlurRadiusPx,
            maxShadowLayers:
                secondary.maxShadowLayers ??
                defaultPaintCostThresholds.maxShadowLayers,
        };

        root.walkDecls((declaration) => {
            const propertyName = declaration.prop.toLowerCase();

            if (!setHas(paintHeavyProperties, propertyName)) {
                return;
            }

            if (setHas(ignoredProperties, propertyName)) {
                return;
            }

            const normalizedValue = declaration.value.trim().toLowerCase();

            if (setHas(resetKeywords, normalizedValue)) {
                return;
            }

            const paintCostReasons = getPaintCostReasons(
                propertyName,
                declaration.value,
                thresholds
            );

            if (
                isEmpty(paintCostReasons) &&
                !isAlwaysHighRiskPaintProperty(propertyName)
            ) {
                return;
            }

            const reason =
                arrayJoin(
                    paintCostReasons.map((paintCostReason) =>
                        formatPaintCostReason(paintCostReason)
                    ),
                    "; "
                ) || "high-cost compositing effect";

            report({
                message: messages.paintHeavyProperty(propertyName, reason),
                node: declaration,
                result,
                ruleName,
                word: declaration.prop,
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

function formatPaintCostReason(
    reason: Readonly<{
        actual: number;
        kind:
            | "filter-blur"
            | "filter-functions"
            | "shadow-blur"
            | "shadow-layers";
        max: number;
    }>
): string {
    switch (reason.kind) {
        case "filter-blur": {
            return `blur radius ${reason.actual}px is above ${reason.max}px`;
        }
        case "filter-functions": {
            return `${reason.actual} filter functions is above ${reason.max}`;
        }
        case "shadow-blur": {
            return `shadow blur radius ${reason.actual}px is above ${reason.max}px`;
        }
        case "shadow-layers": {
            return `${reason.actual} shadow layers is above ${reason.max}`;
        }
        default: {
            return "unknown paint cost";
        }
    }
}
