/**
 * @packageDocumentation
 * Core rule registry slice covering selector and declaration budget checks.
 */
import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import * as noExcessiveFilterEffectsModule from "../rules/no-excessive-filter-effects.js";
import * as noGiantSelectorListsModule from "../rules/no-giant-selector-lists.js";
import * as noHeavySelectorsModule from "../rules/no-heavy-selectors.js";
import * as noLayoutThrashingPropertiesModule from "../rules/no-layout-thrashing-properties.js";
import * as noPaintHeavyDeclarationsModule from "../rules/no-paint-heavy-declarations.js";

/** Core selector and declaration-focused rules keyed by unqualified name. */
export const corePerformanceBudgetRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = {
    "no-excessive-filter-effects": noExcessiveFilterEffectsModule.default,
    "no-giant-selector-lists": noGiantSelectorListsModule.default,
    "no-heavy-selectors": noHeavySelectorsModule.default,
    "no-layout-thrashing-properties": noLayoutThrashingPropertiesModule.default,
    "no-paint-heavy-declarations": noPaintHeavyDeclarationsModule.default,
};
