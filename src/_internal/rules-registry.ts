/**
 * @packageDocumentation
 * Canonical registry of public Stylelint rules exported by this package.
 */
import { objectEntries } from "ts-extras";

import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import { advancedPerformanceBudgetRules } from "./rule-registry-advanced.js";
import { corePerformanceBudgetRules } from "./rule-registry-core.js";
import { policyPerformanceBudgetRules } from "./rule-registry-policy.js";

function createSortedRuleRegistry(
    rules: Readonly<Record<string, StylelintPluginRuleContract>>
): Readonly<Record<string, StylelintPluginRuleContract>> {
    const sortedRules: Record<string, StylelintPluginRuleContract> = {};

    for (const [ruleName, rule] of objectEntries(rules).toSorted(
        ([left], [right]) => left.localeCompare(right)
    )) {
        sortedRules[ruleName] = rule;
    }

    return sortedRules;
}

/** Public rule registry keyed by unqualified rule name. */
export const performanceBudgetRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = createSortedRuleRegistry({
    ...corePerformanceBudgetRules,
    ...advancedPerformanceBudgetRules,
    ...policyPerformanceBudgetRules,
});

/** Public rule registry type. */
export type PerformanceBudgetRulesRegistry = typeof performanceBudgetRules;
