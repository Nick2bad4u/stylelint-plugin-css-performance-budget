/**
 * @packageDocumentation
 * Shared declaration/property sets for CSS rendering performance rules.
 */

/** Properties that are usually cheap to animate/composite. */
export const compositedAnimationProperties: ReadonlySet<string> = new Set([
    "opacity",
    "transform",
]);

/** Properties whose changes commonly trigger layout or expensive paint work. */
export const expensiveRenderingProperties: ReadonlySet<string> = new Set([
    "-webkit-backdrop-filter",
    "backdrop-filter",
    "background-attachment",
    "background-position",
    "background-size",
    "border-radius",
    "bottom",
    "box-shadow",
    "clip-path",
    "filter",
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
    "text-shadow",
    "top",
    "width",
]);

/**
 * Properties that are especially expensive when applied to broad selectors or
 * fixed layers.
 */
export const paintEffectProperties: ReadonlySet<string> = new Set([
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

/** CSS-wide keywords that reset a property instead of opting into an effect. */
export const resetKeywords: ReadonlySet<string> = new Set([
    "inherit",
    "initial",
    "none",
    "revert",
    "revert-layer",
    "unset",
]);
