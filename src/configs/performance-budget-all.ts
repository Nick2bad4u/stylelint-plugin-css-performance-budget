/**
 * @packageDocumentation
 * Shareable Stylelint config: performance-budget-all.
 */
import {
    performanceBudgetPluginConfigs,
    type PerformanceBudgetShareableConfig,
} from "../plugin.js";

/** Fully expanded shareable config enabling every published rule. */
const performanceBudgetAllConfig: PerformanceBudgetShareableConfig =
    performanceBudgetPluginConfigs["performance-budget-all"];

export default performanceBudgetAllConfig;
