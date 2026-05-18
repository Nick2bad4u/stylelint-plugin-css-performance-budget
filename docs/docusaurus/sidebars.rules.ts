import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars = {
    rules: [
        {
            className: "sb-doc-overview",
            id: "overview",
            label: "Overview",
            type: "doc",
        },
        {
            className: "sb-doc-getting-started",
            id: "getting-started",
            label: "Getting Started",
            type: "doc",
        },
        {
            className: "sb-cat-configs",
            collapsed: false,
            items: [
                {
                    className: "sb-config-overview",
                    id: "configs/index",
                    label: "Config Overview",
                    type: "doc",
                },
                {
                    className: "sb-config-recommended",
                    id: "configs/performance-budget-recommended",
                    label: "🟢 performance-budget-recommended",
                    type: "doc",
                },
                {
                    className: "sb-config-all",
                    id: "configs/performance-budget-all",
                    label: "🟣 performance-budget-all",
                    type: "doc",
                },
                {
                    className: "sb-config-strict",
                    id: "configs/performance-budget-strict",
                    label: "🛡️ performance-budget-strict",
                    type: "doc",
                },
            ],
            label: "Configs",
            type: "category",
        },
        {
            className: "sb-cat-guides",
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
            className: "sb-cat-rules",
            collapsed: false,
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
                    id: "no-expensive-positioning-patterns",
                    label: "no-expensive-positioning-patterns",
                    type: "doc",
                },
                {
                    id: "no-fixed-background-attachment",
                    label: "no-fixed-background-attachment",
                    type: "doc",
                },
                {
                    id: "no-global-expensive-effects",
                    label: "no-global-expensive-effects",
                    type: "doc",
                },
                {
                    id: "no-layout-thrashing-properties",
                    label: "no-layout-thrashing-properties",
                    type: "doc",
                },
                {
                    id: "no-oversized-css-custom-property-values",
                    label: "no-oversized-css-custom-property-values",
                    type: "doc",
                },
                {
                    id: "no-paint-heavy-declarations",
                    label: "no-paint-heavy-declarations",
                    type: "doc",
                },
                {
                    id: "no-render-blocking-import",
                    label: "no-render-blocking-import",
                    type: "doc",
                },
                {
                    id: "no-will-change-abuse",
                    label: "no-will-change-abuse",
                    type: "doc",
                },
                {
                    id: "require-reduced-motion-for-expensive-animations",
                    label: "require-reduced-motion-for-expensive-animations",
                    type: "doc",
                },
            ],
            label: "Rules",
            type: "category",
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
