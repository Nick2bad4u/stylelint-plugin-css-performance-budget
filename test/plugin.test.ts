import { describe, expect, it } from "vitest";

import {
    configNames,
    meta,
    performanceBudgetPluginConfigs,
    ruleIds,
    ruleNames,
    rules,
} from "../src/plugin";

describe("plugin surface", () => {
    it("exports package metadata", () => {
        expect.hasAssertions();
        expect(meta.name).toBe("stylelint-plugin-css-performance-budget");
        expect(meta.namespace).toBe("css-performance-budget");
        expect(meta.version).toMatch(/^\d+\.\d+\.\d+/v);
    });

    it("keeps rule registry and rule ids aligned", () => {
        expect.hasAssertions();
        expect(ruleNames).toHaveLength(ruleIds.length);
        expect(Object.keys(rules)).toStrictEqual([...ruleNames]);
        expect(ruleIds).not.toHaveLength(0);

        for (const ruleId of ruleIds) {
            expect(ruleId.startsWith("css-performance-budget/")).toBe(true);
        }
    });

    it("exposes the expected shareable config names", () => {
        expect.hasAssertions();
        expect(configNames).toStrictEqual([
            "performance-budget-all",
            "performance-budget-recommended",
            "performance-budget-strict",
        ]);
    });

    it("wires recommended and all/strict configs as intended", () => {
        expect.hasAssertions();
        expect(
            performanceBudgetPluginConfigs["performance-budget-recommended"]
                .rules
        ).toStrictEqual({
            "css-performance-budget/no-excessive-filter-effects": true,
            "css-performance-budget/no-expensive-animation-properties": true,
            "css-performance-budget/no-layout-thrashing-properties": true,
            "css-performance-budget/no-paint-heavy-declarations": true,
            "css-performance-budget/no-will-change-abuse": true,
        });

        expect(
            performanceBudgetPluginConfigs["performance-budget-all"].rules
        ).toStrictEqual({
            "css-performance-budget/no-excessive-filter-effects": true,
            "css-performance-budget/no-expensive-animation-properties": true,
            "css-performance-budget/no-giant-selector-lists": true,
            "css-performance-budget/no-heavy-selectors": true,
            "css-performance-budget/no-layout-thrashing-properties": true,
            "css-performance-budget/no-paint-heavy-declarations": true,
            "css-performance-budget/no-will-change-abuse": true,
        });

        expect(
            performanceBudgetPluginConfigs["performance-budget-strict"].rules
        ).toStrictEqual(
            performanceBudgetPluginConfigs["performance-budget-all"].rules
        );
    });
});
