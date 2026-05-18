import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars = {
    rules: [
        {
            id: "overview",
            label: "Overview",
            type: "doc",
        },
        {
            id: "getting-started",
            label: "Getting Started",
            type: "doc",
        },
        {
            items: [
                {
                    id: "configs/index",
                    label: "Config Overview",
                    type: "doc",
                },
                {
                    id: "configs/performance-budget-recommended",
                    label: "performance-budget-recommended",
                    type: "doc",
                },
                {
                    id: "configs/performance-budget-all",
                    label: "performance-budget-all",
                    type: "doc",
                },
                {
                    id: "configs/performance-budget-strict",
                    label: "performance-budget-strict",
                    type: "doc",
                },
            ],
            label: "Configs",
            type: "category",
        },
        {
            items: [
                {
                    id: "guides/current-status",
                    label: "Current Status",
                    type: "doc",
                },
            ],
            label: "Guides",
            type: "category",
        },
        {
            items: [
                {
                    id: "no-heavy-selectors",
                    label: "no-heavy-selectors",
                    type: "doc",
                },
                {
                    id: "no-giant-selector-lists",
                    label: "no-giant-selector-lists",
                    type: "doc",
                },
                {
                    id: "no-excessive-filter-effects",
                    label: "no-excessive-filter-effects",
                    type: "doc",
                },
                {
                    id: "no-expensive-animation-properties",
                    label: "no-expensive-animation-properties",
                    type: "doc",
                },
                {
                    id: "no-layout-thrashing-properties",
                    label: "no-layout-thrashing-properties",
                    type: "doc",
                },
                {
                    id: "no-paint-heavy-declarations",
                    label: "no-paint-heavy-declarations",
                    type: "doc",
                },
                {
                    id: "no-will-change-abuse",
                    label: "no-will-change-abuse",
                    type: "doc",
                },
            ],
            label: "Rules",
            type: "category",
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
