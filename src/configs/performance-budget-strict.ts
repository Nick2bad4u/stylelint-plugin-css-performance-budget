/**
 * @packageDocumentation
 * Shareable Stylelint config: performance-budget-strict.
 */
import {
    performanceBudgetPluginConfigs,
    type PerformanceBudgetShareableConfig,
} from "../plugin.js";

/** Strict-policy shareable config currently matching all rule coverage. */
const performanceBudgetStrictConfig: PerformanceBudgetShareableConfig =
    performanceBudgetPluginConfigs["performance-budget-strict"];

export default performanceBudgetStrictConfig;
