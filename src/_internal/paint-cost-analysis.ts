/**
 * @packageDocumentation
 * Value-sensitive checks for paint-heavy CSS effects.
 */

import { isDefined, setHas } from "ts-extras";

import { resetKeywords } from "./performance-value-sets.js";
import {
    extractBlurRadiiPx,
    parseCssFunctionCalls,
    splitTopLevelValueList,
    toPixels,
} from "./value-function-analysis.js";

/** One reason a declaration value exceeds a paint-cost budget. */
export type PaintCostReason = Readonly<{
    actual: number;
    kind:
        | "filter-blur"
        | "filter-functions"
        | "shadow-blur"
        | "shadow-layers";
    max: number;
}>;

/** Numeric thresholds used when classifying expensive paint values. */
export type PaintCostThresholds = Readonly<{
    maxFilterBlurRadiusPx: number;
    maxFilterFunctions: number;
    maxShadowBlurRadiusPx: number;
    maxShadowLayers: number;
}>;

/** Default thresholds for low-noise paint value budget checks. */
export const defaultPaintCostThresholds: PaintCostThresholds = {
    maxFilterBlurRadiusPx: 30,
    maxFilterFunctions: 4,
    maxShadowBlurRadiusPx: 48,
    maxShadowLayers: 3,
};

const filterProperties: ReadonlySet<string> = new Set([
    "-webkit-backdrop-filter",
    "backdrop-filter",
    "filter",
]);

const shadowProperties: ReadonlySet<string> = new Set([
    "box-shadow",
    "text-shadow",
]);

/** Return paint budget reasons for values that are meaningfully expensive. */
export function getPaintCostReasons(
    propertyName: string,
    value: string,
    thresholds: PaintCostThresholds = defaultPaintCostThresholds
): readonly PaintCostReason[] {
    const normalizedPropertyName = propertyName.toLowerCase();
    const normalizedValue = value.trim().toLowerCase();

    if (setHas(resetKeywords, normalizedValue)) {
        return [];
    }

    if (setHas<string, string>(filterProperties, normalizedPropertyName)) {
        return getFilterCostReasons(value, thresholds);
    }

    if (setHas<string, string>(shadowProperties, normalizedPropertyName)) {
        return getShadowCostReasons(value, thresholds);
    }

    return [];
}

/**
 * Return true for paint properties that are high-risk without numeric
 * thresholds.
 */
export function isAlwaysHighRiskPaintProperty(propertyName: string): boolean {
    switch (propertyName.toLowerCase()) {
        case "clip-path":
        case "mask":
        case "mask-image":
        case "mix-blend-mode": {
            return true;
        }
        default: {
            return false;
        }
    }
}

function getFilterCostReasons(
    value: string,
    thresholds: PaintCostThresholds
): readonly PaintCostReason[] {
    const reasons: PaintCostReason[] = [];
    const functionCount = parseCssFunctionCalls(value).length;

    if (functionCount > thresholds.maxFilterFunctions) {
        reasons.push({
            actual: functionCount,
            kind: "filter-functions",
            max: thresholds.maxFilterFunctions,
        });
    }

    for (const blurRadiusPx of extractBlurRadiiPx(value)) {
        if (blurRadiusPx > thresholds.maxFilterBlurRadiusPx) {
            reasons.push({
                actual: blurRadiusPx,
                kind: "filter-blur",
                max: thresholds.maxFilterBlurRadiusPx,
            });
        }
    }

    return reasons;
}

function getLengthTokens(value: string): readonly string[] {
    const tokens: string[] = [];
    let tokenStart = -1;
    let parenthesisDepth = 0;

    for (let index = 0; index <= value.length; index += 1) {
        const character = value[index];

        if (character === "(") {
            parenthesisDepth += 1;
        } else if (character === ")") {
            parenthesisDepth = Math.max(0, parenthesisDepth - 1);
        }

        if (
            parenthesisDepth > 0 ||
            isTokenDelimiter(character) ||
            index === value.length
        ) {
            if (tokenStart !== -1) {
                tokens.push(value.slice(tokenStart, index));
                tokenStart = -1;
            }
        } else if (tokenStart === -1) {
            tokenStart = index;
        }
    }

    return tokens;
}

function getShadowBlurRadiiPx(layers: readonly string[]): readonly number[] {
    return layers
        .map((layer) => getLengthTokens(layer).map((token) => toPixels(token)))
        .map((lengths) => lengths.filter(isDefined)[2])
        .filter(isDefined);
}

function getShadowCostReasons(
    value: string,
    thresholds: PaintCostThresholds
): readonly PaintCostReason[] {
    const reasons: PaintCostReason[] = [];
    const layers = splitTopLevelValueList(value);

    if (layers.length > thresholds.maxShadowLayers) {
        reasons.push({
            actual: layers.length,
            kind: "shadow-layers",
            max: thresholds.maxShadowLayers,
        });
    }

    for (const blurRadiusPx of getShadowBlurRadiiPx(layers)) {
        if (blurRadiusPx > thresholds.maxShadowBlurRadiusPx) {
            reasons.push({
                actual: blurRadiusPx,
                kind: "shadow-blur",
                max: thresholds.maxShadowBlurRadiusPx,
            });
        }
    }

    return reasons;
}

function isTokenDelimiter(character: string | undefined): boolean {
    return (
        !isDefined(character) ||
        character === "/" ||
        character === "\t" ||
        character === "\n" ||
        character === "\r" ||
        character === " "
    );
}
