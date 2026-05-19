/**
 * @packageDocumentation
 * Advanced rule registry slice covering motion, positioning, and import budgets.
 */
import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import * as noExpensiveAnimationPropertiesModule from "../rules/no-expensive-animation-properties.js";
import * as noExpensivePositioningPatternsModule from "../rules/no-expensive-positioning-patterns.js";
import * as noFixedBackgroundAttachmentModule from "../rules/no-fixed-background-attachment.js";
import * as noOversizedCssCustomPropertyValuesModule from "../rules/no-oversized-css-custom-property-values.js";
import * as noRenderBlockingImportModule from "../rules/no-render-blocking-import.js";

/**
 * Advanced motion, positioning, and import-focused rules keyed by unqualified
 * name.
 */
export const advancedPerformanceBudgetRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = {
    "no-expensive-animation-properties":
        noExpensiveAnimationPropertiesModule.default,
    "no-expensive-positioning-patterns":
        noExpensivePositioningPatternsModule.default,
    "no-fixed-background-attachment": noFixedBackgroundAttachmentModule.default,
    "no-oversized-css-custom-property-values":
        noOversizedCssCustomPropertyValuesModule.default,
    "no-render-blocking-import": noRenderBlockingImportModule.default,
};
