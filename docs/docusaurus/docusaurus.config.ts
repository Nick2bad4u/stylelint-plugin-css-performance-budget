import { themes as prismThemes } from "prism-react-renderer";

import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const organizationName = "Nick2bad4u";
const projectName = "stylelint-plugin-css-performance-budget";
const siteOrigin = "https://nick2bad4u.github.io";
const baseUrl =
    process.env["DOCUSAURUS_BASE_URL"] ??
    "/stylelint-plugin-css-performance-budget/";

const config = {
    baseUrlIssueBanner: true,
    baseUrl,
    deploymentBranch: "gh-pages",
    favicon: "img/favicon.ico",
    future: {
        v4: {
            removeLegacyPostBuildHeadAttribute: true,
        },
    },
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        format: "detect",
        hooks: {
            onBrokenMarkdownLinks: "warn",
        },
    },
    onBrokenAnchors: "warn",
    onDuplicateRoutes: "warn",
    onBrokenLinks: "warn",
    organizationName,
    plugins: [
        [
            "@docusaurus/plugin-pwa",
            {
                debug: process.env["DOCUSAURUS_PWA_DEBUG"] === "true",
                offlineModeActivationStrategies: [
                    "appInstalled",
                    "queryString",
                    "standalone",
                ],
                pwaHead: [
                    {
                        href: "/img/favicon.ico",
                        rel: "icon",
                        tagName: "link",
                    },
                    {
                        href: "/manifest.json",
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        content: "#2563eb",
                        name: "theme-color",
                        tagName: "meta",
                    },
                ],
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                id: "rules",
                path: "../rules",
                routeBasePath: "docs/rules",
                sidebarPath: "./sidebars.rules.ts",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
            },
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: {
                    showReadingTime: true,
                },
                docs: {
                    path: "./site-docs",
                    routeBasePath: "docs",
                    sidebarPath: "./sidebars.ts",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],
    projectName,
    tagline: "Stylelint rules for CSS performance budgets.",
    trailingSlash: false,
    themeConfig: {
        colorMode: {
            defaultMode: "light",
            respectPrefersColorScheme: true,
        },
        image: "img/logo.svg",
        navbar: {
            items: [
                {
                    label: "Rules",
                    to: "/docs/rules/overview",
                },
                {
                    label: "Developer",
                    position: "left",
                    to: "/docs/developer",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "GitHub",
                    position: "right",
                },
                {
                    href: `https://www.npmjs.com/package/${projectName}`,
                    label: "NPM",
                    position: "right",
                },
            ],
            title: "stylelint-plugin-css-performance-budget",
        },
        prism: {
            darkTheme: prismThemes.dracula,
            theme: prismThemes.github,
        },
    } satisfies Preset.ThemeConfig,
    title: "stylelint-plugin-css-performance-budget",
    url: siteOrigin,
} satisfies Config;

export default config;
