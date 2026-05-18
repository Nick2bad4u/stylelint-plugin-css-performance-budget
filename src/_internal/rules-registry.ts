/**
 * @packageDocumentation
 * Canonical registry of public Stylelint rules exported by this package.
 */
import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import * as noExcessiveFilterEffectsModule from "../rules/no-excessive-filter-effects.js";
import * as noExpensiveAnimationPropertiesModule from "../rules/no-expensive-animation-properties.js";
import * as noExpensivePositioningPatternsModule from "../rules/no-expensive-positioning-patterns.js";
import * as noFixedBackgroundAttachmentModule from "../rules/no-fixed-background-attachment.js";
import * as noGiantSelectorListsModule from "../rules/no-giant-selector-lists.js";
import * as noGlobalExpensiveEffectsModule from "../rules/no-global-expensive-effects.js";
import * as noHeavySelectorsModule from "../rules/no-heavy-selectors.js";
import * as noLayoutThrashingPropertiesModule from "../rules/no-layout-thrashing-properties.js";
import * as noOversizedCssCustomPropertyValuesModule from "../rules/no-oversized-css-custom-property-values.js";
import * as noPaintHeavyDeclarationsModule from "../rules/no-paint-heavy-declarations.js";
import * as noRenderBlockingImportModule from "../rules/no-render-blocking-import.js";
import * as noWillChangeAbuseModule from "../rules/no-will-change-abuse.js";
import * as requireReducedMotionForExpensiveAnimationsModule from "../rules/require-reduced-motion-for-expensive-animations.js";

/** Public rule registry keyed by unqualified rule name. */
export const performanceBudgetRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = {
    "no-excessive-filter-effects": noExcessiveFilterEffectsModule.default,
    "no-expensive-animation-properties":
        noExpensiveAnimationPropertiesModule.default,
    "no-expensive-positioning-patterns":
        noExpensivePositioningPatternsModule.default,
    "no-fixed-background-attachment": noFixedBackgroundAttachmentModule.default,
    "no-giant-selector-lists": noGiantSelectorListsModule.default,
    "no-global-expensive-effects": noGlobalExpensiveEffectsModule.default,
    "no-heavy-selectors": noHeavySelectorsModule.default,
    "no-layout-thrashing-properties": noLayoutThrashingPropertiesModule.default,
    "no-oversized-css-custom-property-values":
        noOversizedCssCustomPropertyValuesModule.default,
    "no-paint-heavy-declarations": noPaintHeavyDeclarationsModule.default,
    "no-render-blocking-import": noRenderBlockingImportModule.default,
    "no-will-change-abuse": noWillChangeAbuseModule.default,
    "require-reduced-motion-for-expensive-animations":
        requireReducedMotionForExpensiveAnimationsModule.default,
};

/** Public rule registry type. */
export type PerformanceBudgetRulesRegistry = typeof performanceBudgetRules;
