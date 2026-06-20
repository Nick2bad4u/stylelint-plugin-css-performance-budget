import type { Declaration, Rule as PostcssRule } from "postcss";

import stylelint, { type RuleBase } from "stylelint";
import {
    arrayJoin,
    isDefined,
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
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";
import { splitTopLevelValueList } from "../_internal/value-function-analysis.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-expensive-animation-properties");

const messages: {
    expensiveKeyframesProperty: (
        property: string,
        keyframesName: string,
        reason: string
    ) => string;
    expensiveTransitionProperty: (property: string, reason: string) => string;
    transitionAll: () => string;
} = ruleMessages(ruleName, {
    expensiveKeyframesProperty: (
        property: string,
        keyframesName: string,
        reason: string
    ): string =>
        `Keyframes "${keyframesName}" animates paint-heavy property "${property}" (${reason}). Prefer transform/opacity when possible.`,
    expensiveTransitionProperty: (property: string, reason: string): string =>
        `Transitioning paint-heavy property "${property}" is expensive (${reason}). Prefer transform/opacity-driven transitions when possible.`,
    transitionAll: (): string =>
        "Avoid `transition: all`; scope transitions to specific low-cost properties such as transform or opacity.",
});

const docs = {
    description:
        "Warn on `transition: all` and transitions or keyframes that target high-cost paint effects.",
    recommended: true,
    url: createRuleDocsUrl("no-expensive-animation-properties"),
} as const;

type SecondaryOptions = Readonly<{
    allowTransitionAll?: boolean;
    checkKeyframes?: boolean;
    ignoreProperties?: string[];
    maxFilterBlurRadiusPx?: number;
    maxFilterFunctions?: number;
    maxShadowBlurRadiusPx?: number;
    maxShadowLayers?: number;
}>;

const expensiveAnimationProperties: ReadonlySet<string> = new Set([
    "-webkit-backdrop-filter",
    "backdrop-filter",
    "background-position",
    "background-size",
    "box-shadow",
    "clip-path",
    "filter",
    "mask",
    "mask-image",
    "mix-blend-mode",
    "text-shadow",
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

        const allowTransitionAll = secondary.allowTransitionAll ?? false;
        const checkKeyframes = secondary.checkKeyframes ?? true;
        const ignoredProperties: ReadonlySet<string> = new Set(
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
                    const reason = getTransitionTargetReason(
                        declaration,
                        target,
                        thresholds
                    );

                    if (isDefined(reason)) {
                        report({
                            message: messages.expensiveTransitionProperty(
                                target,
                                reason
                            ),
                            node: declaration,
                            result,
                            ruleName,
                            word: declaration.prop,
                        });
                    }
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
                    const reason = getDeclarationPaintReason(
                        propertyName,
                        declaration.value,
                        thresholds
                    );

                    if (isDefined(reason)) {
                        report({
                            message: messages.expensiveKeyframesProperty(
                                propertyName,
                                keyframesName,
                                reason
                            ),
                            node: declaration,
                            result,
                            ruleName,
                            word: declaration.prop,
                        });
                    }
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

function getDeclarationPaintReason(
    propertyName: string,
    value: string,
    thresholds: PaintCostThresholds
): string | undefined {
    const reasons = getPaintCostReasons(propertyName, value, thresholds);

    if (reasons.length > 0) {
        return arrayJoin(
            reasons.map((reason) => formatPaintCostReason(reason)),
            "; "
        );
    }

    return isHighRiskAnimationProperty(propertyName)
        ? "high-cost compositing effect"
        : undefined;
}

function getDirectSiblingDeclarationValue(
    declaration: Readonly<Declaration>,
    propertyName: string
): string | undefined {
    if (!isPostcssRuleNode(declaration.parent)) {
        return undefined;
    }

    for (const node of declaration.parent.nodes) {
        if (node.type === "decl" && node.prop.toLowerCase() === propertyName) {
            return node.value;
        }
    }

    return undefined;
}

function getTransitionTargetReason(
    declaration: Readonly<Declaration>,
    target: string,
    thresholds: PaintCostThresholds
): string | undefined {
    const directTargetValue = getDirectSiblingDeclarationValue(
        declaration,
        target
    );

    if (isDefined(directTargetValue)) {
        return getDeclarationPaintReason(target, directTargetValue, thresholds);
    }

    if (isHighRiskAnimationProperty(target)) {
        return "high-cost compositing effect";
    }

    return undefined;
}

function getTransitionTargets(
    propertyName: string,
    value: string
): readonly string[] {
    if (
        propertyName === "transition-property" ||
        propertyName === "-webkit-transition-property"
    ) {
        return splitTopLevelValueList(value)
            .map((entry) => entry.trim().toLowerCase())
            .filter((entry) => entry.length > 0);
    }

    if (
        propertyName === "transition" ||
        propertyName === "-webkit-transition"
    ) {
        return splitTopLevelValueList(value)
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

function isHighRiskAnimationProperty(propertyName: string): boolean {
    switch (propertyName.toLowerCase()) {
        case "background-position":
        case "background-size": {
            return true;
        }
        default: {
            return isAlwaysHighRiskPaintProperty(propertyName);
        }
    }
}

function isPositiveNumber(value: unknown): boolean {
    return typeof value === "number" && isFiniteNumber(value) && value > 0;
}

function isPostcssRuleNode(
    node: Readonly<Declaration>["parent"]
): node is PostcssRule {
    return node?.type === "rule";
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

    return !token.startsWith("steps(");
}
