/**
 * @packageDocumentation
 * Public plugin entrypoint for `stylelint-plugin-css-performance-budget`.
 */
import type { Config, Plugin as StylelintPlugin } from "stylelint";

import { isDefined, objectKeys } from "ts-extras";

import type { StylelintPluginRuleContract } from "./_internal/create-stylelint-rule.js";

import {
    CONFIG_NAMES as configNamesValue,
    type PerformanceBudgetConfigName as InternalPerformanceBudgetConfigName,
    PACKAGE_NAME as packageNameValue,
    PACKAGE_VERSION as packageVersionValue,
    PLUGIN_NAMESPACE as pluginNamespaceValue,
} from "./_internal/plugin-constants.js";
import { performanceBudgetRules as performanceBudgetRulesValue } from "./_internal/rules-registry.js";

/** Map of exported shareable configuration names to concrete config objects. */
export type PerformanceBudgetConfigMap = Record<
    PerformanceBudgetConfigName,
    PerformanceBudgetShareableConfig
>;
/** Literal union of supported shareable configuration names. */
export type PerformanceBudgetConfigName = InternalPerformanceBudgetConfigName;
/** Fully-qualified Stylelint rule ID in this plugin namespace. */
export type PerformanceBudgetRuleId =
    `${typeof pluginNamespaceValue}/${string}`;
/** Public rule registry key names. */
export type PerformanceBudgetRuleName = Extract<
    keyof typeof performanceBudgetRulesValue,
    string
>;
/** Concrete shareable Stylelint config shape exported by this package. */
export type PerformanceBudgetShareableConfig = Config & {
    plugins: (string | StylelintPlugin)[];
    rules: NonNullable<Config["rules"]>;
};

type PerformanceBudgetRuleEntry = readonly [
    string,
    StylelintPluginRuleContract,
];
type PerformanceBudgetRulesMap = Readonly<
    Record<string, StylelintPluginRuleContract>
>;

const packageMetaName = packageNameValue;
const packageMetaNamespace = pluginNamespaceValue;
const packageMetaVersion = packageVersionValue;
const runtimeRules = performanceBudgetRulesValue;
const publicConfigNames = configNamesValue;

/** Package metadata exposed by the plugin entrypoint. */
export const meta: Readonly<{
    name: string;
    namespace: string;
    version: string;
}> = {
    name: packageMetaName,
    namespace: packageMetaNamespace,
    version: packageMetaVersion,
};

/** Canonical rules registry keyed by short rule name. */
export const rules: PerformanceBudgetRulesMap = runtimeRules;

/** Sorted list of short rule names exported by this plugin. */
export const ruleNames: readonly string[] = objectKeys(rules).toSorted(
    (left, right) => left.localeCompare(right)
);

const performanceBudgetRuleEntries: readonly PerformanceBudgetRuleEntry[] =
    (() => {
        const entries: PerformanceBudgetRuleEntry[] = [];

        for (const ruleName of ruleNames) {
            const rule = rules[ruleName];

            if (isDefined(rule)) {
                entries.push([ruleName, rule]);
            }
        }

        return entries;
    })();

/** Runtime plugin objects consumed by Stylelint's `plugins` array. */
export const plugins: readonly StylelintPlugin[] =
    performanceBudgetRuleEntries.map(([, rule]) => rule);

/** Fully-qualified rule IDs exported by this package. */
export const ruleIds: readonly PerformanceBudgetRuleId[] =
    performanceBudgetRuleEntries.map(
        ([, rule]) => rule.ruleName as PerformanceBudgetRuleId
    );

const recommendedRuleIds: readonly PerformanceBudgetRuleId[] =
    performanceBudgetRuleEntries
        .filter(([, rule]) => rule.docs.recommended)
        .map(([, rule]) => rule.ruleName as PerformanceBudgetRuleId);

function createConfig(
    enabledRuleIds: readonly PerformanceBudgetRuleId[]
): PerformanceBudgetShareableConfig {
    return {
        plugins: [...plugins],
        rules: (() => {
            const rulesConfig: NonNullable<Config["rules"]> = {};

            for (const ruleId of enabledRuleIds) {
                rulesConfig[ruleId] = true;
            }

            return rulesConfig;
        })(),
    };
}

/** Shareable configurations exposed by this package. */
export const performanceBudgetPluginConfigs: PerformanceBudgetConfigMap = {
    "performance-budget-all": createConfig(ruleIds),
    "performance-budget-recommended": createConfig(recommendedRuleIds),
    "performance-budget-strict": createConfig(ruleIds),
};

/** Public list of supported shareable config names. */
export const configNames: readonly PerformanceBudgetConfigName[] =
    publicConfigNames;

export default plugins;
