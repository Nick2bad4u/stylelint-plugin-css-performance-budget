/**
 * @packageDocumentation
 * Canonical registry of public Stylelint rules exported by this package.
 */
import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import * as noExcessiveFilterEffectsModule from "../rules/no-excessive-filter-effects.js";
import * as noExpensiveAnimationPropertiesModule from "../rules/no-expensive-animation-properties.js";
import * as noGiantSelectorListsModule from "../rules/no-giant-selector-lists.js";
import * as noHeavySelectorsModule from "../rules/no-heavy-selectors.js";
import * as noLayoutThrashingPropertiesModule from "../rules/no-layout-thrashing-properties.js";
import * as noPaintHeavyDeclarationsModule from "../rules/no-paint-heavy-declarations.js";
import * as noWillChangeAbuseModule from "../rules/no-will-change-abuse.js";

/** Public rule registry keyed by unqualified rule name. */
export const performanceBudgetRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = {
    "no-excessive-filter-effects": noExcessiveFilterEffectsModule.default,
    "no-expensive-animation-properties":
        noExpensiveAnimationPropertiesModule.default,
    "no-giant-selector-lists": noGiantSelectorListsModule.default,
    "no-heavy-selectors": noHeavySelectorsModule.default,
    "no-layout-thrashing-properties": noLayoutThrashingPropertiesModule.default,
    "no-paint-heavy-declarations": noPaintHeavyDeclarationsModule.default,
    "no-will-change-abuse": noWillChangeAbuseModule.default,
};

/** Public rule registry type. */
export type PerformanceBudgetRulesRegistry = typeof performanceBudgetRules;
