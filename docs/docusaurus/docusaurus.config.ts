import { themes as prismThemes } from "prism-react-renderer";

import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const organizationName = "Nick2bad4u";
const projectName = "stylelint-plugin-css-performance-budget";
const siteOrigin = "https://nick2bad4u.github.io";
const baseUrl =
    process.env["DOCUSAURUS_BASE_URL"] ??
    "/stylelint-plugin-css-performance-budget/";
const siteUrl = `${siteOrigin}${baseUrl}`;
const siteDescription =
    "Stylelint rules for CSS performance budgets: selector cost, render-blocking imports, paint-heavy effects, layout thrashing, and expensive motion.";
const siteKeywords =
    "stylelint, css performance, css budget, selector performance, layout thrashing, paint performance";
const socialCardImagePath = "img/logo.png";
const socialCardImageUrl = new URL(socialCardImagePath, siteUrl).toString();
const pwaThemeColor = "#1d120a";
const footerCopyright =
    `© ${new Date().getFullYear()} ` +
    '<a href="https://github.com/Nick2bad4u/" target="_blank" rel="noopener noreferrer">Nick2bad4u</a> · Built with ' +
    '<a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">Docusaurus</a>.';

const config = {
    baseUrlIssueBanner: true,
    baseUrl,
    deploymentBranch: "gh-pages",
    favicon: "img/favicon.svg",
    future: {
        v4: {
            removeLegacyPostBuildHeadAttribute: true,
        },
    },
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    headTags: [
        {
            attributes: {
                content: siteDescription,
                name: "description",
            },
            tagName: "meta",
        },
        {
            attributes: {
                content: siteKeywords,
                name: "keywords",
            },
            tagName: "meta",
        },
        {
            attributes: {
                content: socialCardImageUrl,
                property: "og:image",
            },
            tagName: "meta",
        },
        {
            attributes: {
                content: "summary_large_image",
                name: "twitter:card",
            },
            tagName: "meta",
        },
        {
            attributes: {
                content: socialCardImageUrl,
                name: "twitter:image",
            },
            tagName: "meta",
        },
        {
            attributes: {
                type: "application/ld+json",
            },
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                description: siteDescription,
                image: socialCardImageUrl,
                name: `${projectName} documentation`,
                publisher: {
                    "@type": "Person",
                    name: "Nick2bad4u",
                    url: "https://github.com/Nick2bad4u",
                },
                url: siteUrl,
            }),
            tagName: "script",
        },
    ],
    markdown: {
        anchors: {
            maintainCase: true,
        },
        emoji: true,
        format: "detect",
        hooks: {
            onBrokenMarkdownImages: "warn",
            onBrokenMarkdownLinks: "warn",
        },
        mermaid: true,
    },
    onBrokenAnchors: "warn",
    onDuplicateRoutes: "warn",
    onBrokenLinks: "warn",
    organizationName,
    plugins: [
        "docusaurus-plugin-image-zoom",
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
                        href: `${baseUrl}img/favicon.svg`,
                        rel: "icon",
                        tagName: "link",
                    },
                    {
                        href: `${baseUrl}img/logo-180x180.png`,
                        rel: "apple-touch-icon",
                        tagName: "link",
                    },
                    {
                        href: `${baseUrl}manifest.json`,
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        color: pwaThemeColor,
                        href: `${baseUrl}img/logo.svg`,
                        rel: "mask-icon",
                        tagName: "link",
                    },
                    {
                        content: `${baseUrl}img/logo-192x192.png`,
                        name: "msapplication-TileImage",
                        tagName: "meta",
                    },
                    {
                        content: pwaThemeColor,
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
    tagline: siteDescription,
    themes: [
        "@docusaurus/theme-mermaid",
        [
            "@easyops-cn/docusaurus-search-local",
            {
                docsRouteBasePath: "docs",
                hashed: true,
                highlightSearchTermsOnTargetPage: true,
                indexBlog: true,
                indexDocs: true,
                language: ["en"],
                removeDefaultStemmer: true,
                searchBarPosition: "left",
                searchBarShortcut: true,
                searchBarShortcutHint: true,
                searchBarShortcutKeymap: "ctrl+k",
                searchResultContextMaxLength: 96,
                searchResultLimits: 8,
            },
        ],
    ],
    trailingSlash: false,
    themeConfig: {
        colorMode: {
            defaultMode: "light",
            respectPrefersColorScheme: true,
        },
        footer: {
            copyright: footerCopyright,
            links: [
                {
                    items: [
                        {
                            label: "Overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "Getting Started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            label: "Config Matrix",
                            to: "/docs/rules/configs",
                        },
                    ],
                    title: "Docs",
                },
                {
                    items: [
                        {
                            label: "🟢 Recommended",
                            to: "/docs/rules/configs/performance-budget-recommended",
                        },
                        {
                            label: "🛡️ Strict",
                            to: "/docs/rules/configs/performance-budget-strict",
                        },
                        {
                            label: "🟣 All Rules",
                            to: "/docs/rules/configs/performance-budget-all",
                        },
                    ],
                    title: "Configs",
                },
                {
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "GitHub",
                        },
                        {
                            href: `https://www.npmjs.com/package/${projectName}`,
                            label: "npm",
                        },
                        {
                            to: "/docs/developer",
                            label: "Developer Docs",
                        },
                    ],
                    title: "Project",
                },
            ],
            style: "dark",
        },
        image: socialCardImagePath,
        navbar: {
            hideOnScroll: true,
            items: [
                {
                    activeBaseRegex: "^/docs/rules",
                    label: "📚 Rules",
                    position: "left",
                    to: "/docs/rules/overview",
                },
                {
                    items: [
                        {
                            label: "🟢 Recommended",
                            to: "/docs/rules/configs/performance-budget-recommended",
                        },
                        {
                            label: "🛡️ Strict",
                            to: "/docs/rules/configs/performance-budget-strict",
                        },
                        {
                            label: "🟣 All",
                            to: "/docs/rules/configs/performance-budget-all",
                        },
                    ],
                    label: "⚙️ Configs",
                    position: "left",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "🐙 GitHub",
                    position: "right",
                },
                {
                    href: `https://www.npmjs.com/package/${projectName}`,
                    label: "📦 NPM",
                    position: "right",
                },
                {
                    label: "👨‍💻 Developer",
                    position: "right",
                    to: "/docs/developer",
                },
            ],
            logo: {
                alt: `${projectName} logo`,
                src: "img/logo.svg",
            },
            style: "dark",
            title: "stylelint-plugin-css-performance-budget",
        },
        prism: {
            darkTheme: prismThemes.dracula,
            theme: prismThemes.github,
        },
        tableOfContents: {
            maxHeadingLevel: 4,
            minHeadingLevel: 2,
        },
        zoom: {
            background: {
                dark: "rgb(23, 18, 14)",
                light: "rgb(255, 248, 230)",
            },
            selector: ".markdown > img",
        },
    } satisfies Preset.ThemeConfig,
    title: "stylelint-plugin-css-performance-budget",
    url: siteOrigin,
} satisfies Config;

export default config;
