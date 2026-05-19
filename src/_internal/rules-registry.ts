/**
 * @packageDocumentation
 * Canonical registry of public Stylelint rules exported by this package.
 */
import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import { advancedPerformanceBudgetRules } from "./rule-registry-advanced.js";
import { corePerformanceBudgetRules } from "./rule-registry-core.js";
import { policyPerformanceBudgetRules } from "./rule-registry-policy.js";

/** Public rule registry keyed by unqualified rule name. */
export const performanceBudgetRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = {
    ...corePerformanceBudgetRules,
    ...advancedPerformanceBudgetRules,
    ...policyPerformanceBudgetRules,
};

/** Public rule registry type. */
export type PerformanceBudgetRulesRegistry = typeof performanceBudgetRules;
