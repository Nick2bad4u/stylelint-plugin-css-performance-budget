/**
 * @packageDocumentation
 * Shareable Stylelint config: performance-budget-recommended.
 */
import {
    performanceBudgetPluginConfigs,
    type PerformanceBudgetShareableConfig,
} from "../plugin.js";

/** Low-noise shareable config for incremental adoption. */
const performanceBudgetRecommendedConfig: PerformanceBudgetShareableConfig =
    performanceBudgetPluginConfigs["performance-budget-recommended"];

export default performanceBudgetRecommendedConfig;
