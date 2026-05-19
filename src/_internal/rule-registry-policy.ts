/**
 * @packageDocumentation
 * Policy rule registry slice covering global effects and motion safety budgets.
 */
import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import * as noGlobalExpensiveEffectsModule from "../rules/no-global-expensive-effects.js";
import * as noWillChangeAbuseModule from "../rules/no-will-change-abuse.js";
import * as requireReducedMotionForExpensiveAnimationsModule from "../rules/require-reduced-motion-for-expensive-animations.js";

/** Policy-oriented rules keyed by unqualified name. */
export const policyPerformanceBudgetRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = {
    "no-global-expensive-effects": noGlobalExpensiveEffectsModule.default,
    "no-will-change-abuse": noWillChangeAbuseModule.default,
    "require-reduced-motion-for-expensive-animations":
        requireReducedMotionForExpensiveAnimationsModule.default,
};
