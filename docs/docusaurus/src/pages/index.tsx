import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import GitHubStats from "../components/GitHubStats";
import styles from "./index.module.css";

type HeroBadge = Readonly<{
    description: string;
    icon: string;
    label: string;
}>;

type HeroStat = Readonly<{
    description: string;
    icon: string;
    label: string;
    value: string;
}>;

type HomeCard = Readonly<{
    description: string;
    icon: string;
    label: string;
    title: string;
    to: string;
}>;

type RuleLane = Readonly<{
    description: string;
    icon: string;
    links: readonly Readonly<{
        label: string;
        to: string;
    }>[];
    title: string;
}>;

const packageName = "stylelint-plugin-css-performance-budget";
const homepageDescription =
    "Stylelint rules for CSS performance budgets: selector cost, render-blocking imports, paint-heavy effects, layout thrashing, and expensive motion.";
const homepageKeywords =
    "stylelint, css performance, css budget, selector performance, paint performance, layout thrashing, reduced motion";
const siteUrl = `https://nick2bad4u.github.io/${packageName}/`;
const socialImageUrl = `${siteUrl}img/logo.png`;
const startButtonIcon = "\uf135";
const rulesButtonIcon = "\uf0ca";

const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    codeRepository: `https://github.com/Nick2bad4u/${packageName}`,
    description: homepageDescription,
    image: socialImageUrl,
    license: `https://github.com/Nick2bad4u/${packageName}/blob/main/LICENSE`,
    name: packageName,
    programmingLanguage: "TypeScript",
    runtimePlatform: "Node.js",
    url: siteUrl,
} as const;

const heroBadges = [
    {
        description:
            "Starts with low-noise rules that catch expensive rendering patterns before they ship.",
        icon: "\uf058",
        label: "Release-safe defaults",
    },
    {
        description:
            "Rules use targeted PostCSS walks and parser-aware value helpers instead of full-root rescans.",
        icon: "\ue749",
        label: "AST-first checks",
    },
    {
        description:
            "Every rule includes examples, options, and preset membership generated from metadata.",
        icon: "\uf02d",
        label: "Static rule docs",
    },
] as const satisfies readonly HeroBadge[];

const heroStats = [
    {
        description:
            "Selector, layout, paint, animation, import, and accessibility budget checks.",
        icon: "\uf0ca",
        label: "• Rule coverage",
        value: "13 rules",
    },
    {
        description:
            "Recommended, strict, and all profiles for different adoption levels.",
        icon: "\ue690",
        label: "• Config surfaces",
        value: "3 configs",
    },
    {
        description:
            "Supports Stylelint 16 and 17 with a single codebase and unified docs.",
        icon: "\uf00c",
        label: "• Release gate",
        value: "Stylelint 16+",
    },
] as const satisfies readonly HeroStat[];

const configCards = [
    {
        description:
            "Enable the practical baseline for teams that want performance warnings without a noisy first run.",
        icon: "\uf135",
        label: "🟢 Start here",
        title: "🟢 Recommended budget",
        to: "/docs/rules/configs/performance-budget-recommended",
    },
    {
        description:
            "Use the stricter public profile when performance regressions should block review earlier.",
        icon: "\uf0e7",
        label: "🛡️ Tighten review",
        title: "🛡️ Strict budget",
        to: "/docs/rules/configs/performance-budget-strict",
    },
    {
        description:
            "Turn on every rule, including specialized audits for custom properties and fixed layers.",
        icon: "\uf0ad",
        label: "🟣 Full audit",
        title: "🟣 All rules",
        to: "/docs/rules/configs/performance-budget-all",
    },
] as const satisfies readonly HomeCard[];

const resourceCards = [
    {
        description:
            "Install the package, choose a config, and wire the plugin into an ESM Stylelint config.",
        icon: "\uf019",
        label: "Install",
        title: "• Getting started",
        to: "/docs/rules/getting-started",
    },
    {
        description:
            "Browse the full rule list with examples, options, and guidance for rollout decisions.",
        icon: "\uf02d",
        label: "Reference",
        title: "• Rule catalog",
        to: "/docs/rules/overview",
    },
    {
        description:
            "Inspect exported types, config contracts, and generated API documentation for maintainers.",
        icon: "\ue795",
        label: "Maintain",
        title: "• Developer docs",
        to: "/docs/developer",
    },
] as const satisfies readonly HomeCard[];

const ruleLanes = [
    {
        description:
            "Keep selector matching and parser work inside an explicit budget.",
        icon: "\ue749",
        links: [
            {
                label: "• Heavy Selectors",
                to: "/docs/rules/no-heavy-selectors",
            },
            {
                label: "• Giant Selector Lists",
                to: "/docs/rules/no-giant-selector-lists",
            },
        ],
        title: "Selector cost",
    },
    {
        description:
            "Catch declarations that push rendering back to layout or expensive paint paths.",
        icon: "\uf085",
        links: [
            {
                label: "• Layout Thrashing",
                to: "/docs/rules/no-layout-thrashing-properties",
            },
            {
                label: "• Paint-Heavy Declarations",
                to: "/docs/rules/no-paint-heavy-declarations",
            },
            {
                label: "• Global Effects",
                to: "/docs/rules/no-global-expensive-effects",
            },
        ],
        title: "Rendering pipeline",
    },
    {
        description:
            "Flag filters, fixed surfaces, and animation targets that are costly during scroll or motion.",
        icon: "\uf0e7",
        links: [
            {
                label: "• Filter Effects",
                to: "/docs/rules/no-excessive-filter-effects",
            },
            {
                label: "• Fixed Backgrounds",
                to: "/docs/rules/no-fixed-background-attachment",
            },
            {
                label: "• Expensive Motion",
                to: "/docs/rules/no-expensive-animation-properties",
            },
            {
                label: "• Reduced Motion",
                to: "/docs/rules/require-reduced-motion-for-expensive-animations",
            },
        ],
        title: "Paint and motion",
    },
    {
        description:
            "Surface hidden costs in imports, will-change hints, positioned layers, and custom values.",
        icon: "\uf0ad",
        links: [
            {
                label: "• Render-Blocking Imports",
                to: "/docs/rules/no-render-blocking-import",
            },
            {
                label: "• Will-Change Abuse",
                to: "/docs/rules/no-will-change-abuse",
            },
            {
                label: "• Positioned Effects",
                to: "/docs/rules/no-expensive-positioning-patterns",
            },
            {
                label: "• Oversized Variables",
                to: "/docs/rules/no-oversized-css-custom-property-values",
            },
        ],
        title: "Governance checks",
    },
] as const satisfies readonly RuleLane[];

/** Render the documentation landing page for the performance-budget plugin. */
export default function Home() {
    const logoSrc = useBaseUrl("/img/logo.svg");

    return (
        <Layout
            description={homepageDescription}
            title="CSS Performance Budgets"
        >
            <Head>
                <meta content={homepageKeywords} name="keywords" />
                <meta content={socialImageUrl} property="og:image" />
                <meta content="summary_large_image" name="twitter:card" />
                <meta content={socialImageUrl} name="twitter:image" />
                <script type="application/ld+json">
                    {JSON.stringify(homepageStructuredData)}
                </script>
            </Head>
            <header className={styles["heroBanner"]}>
                <div className={`container ${styles["heroContent"]}`}>
                    <div className={styles["heroGrid"]}>
                        <div className={styles["heroCopy"]}>
                            <p className={styles["heroKicker"]}>
                                Stylelint plugin for CSS performance budgets
                            </p>
                            <Heading as="h1" className={styles["heroTitle"]}>
                                Ship CSS with a rendering budget.
                            </Heading>
                            <p className={styles["heroSubtitle"]}>
                                {packageName} warns on heavy selectors,
                                render-blocking imports, expensive filters,
                                layout-thrashing declarations, paint-heavy
                                effects, fixed scroll surfaces, and motion that
                                needs a reduced-motion escape hatch.
                            </p>
                            <div className={styles["heroActions"]}>
                                <Link
                                    className={`button button--lg ${styles["heroActionButton"]} ${styles["heroActionPrimary"]}`}
                                    to="/docs/rules/getting-started"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={styles["nerdIcon"]}
                                    >
                                        {startButtonIcon}
                                    </span>
                                    Start linting CSS
                                </Link>
                                <Link
                                    className={`button button--lg ${styles["heroActionButton"]} ${styles["heroActionSecondary"]}`}
                                    to="/docs/rules/overview"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={styles["nerdIcon"]}
                                    >
                                        {rulesButtonIcon}
                                    </span>
                                    Browse rules
                                </Link>
                            </div>
                            <div className={styles["heroBadgeRow"]}>
                                {heroBadges.map((badge) => (
                                    <article
                                        className={styles["heroBadge"]}
                                        key={badge.label}
                                    >
                                        <p className={styles["heroBadgeLabel"]}>
                                            <span
                                                aria-hidden="true"
                                                className={styles["nerdIcon"]}
                                            >
                                                {badge.icon}
                                            </span>
                                            {badge.label}
                                        </p>
                                        <p
                                            className={
                                                styles["heroBadgeDescription"]
                                            }
                                        >
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                        <aside
                            aria-label="CSS performance budget status"
                            className={styles["heroPanel"]}
                        >
                            <img
                                alt={`${packageName} logo`}
                                className={styles["heroPanelLogo"]}
                                decoding="async"
                                height="240"
                                loading="eager"
                                src={logoSrc}
                                width="240"
                            />
                            <div className={styles["budgetMeter"]}>
                                <span className={styles["budgetMeterLabel"]}>
                                    Budget pressure
                                </span>
                                <span className={styles["budgetMeterTrack"]}>
                                    <span
                                        className={styles["budgetMeterFill"]}
                                    />
                                </span>
                                <span className={styles["budgetMeterValue"]}>
                                    catch before runtime
                                </span>
                            </div>
                        </aside>
                    </div>

                    <GitHubStats className={styles["heroLiveBadges"] ?? ""} />

                    <div className={styles["heroStats"]}>
                        {heroStats.map((stat) => (
                            <article
                                className={styles["heroStatCard"]}
                                key={stat.label}
                            >
                                <p className={styles["heroStatValue"]}>
                                    <span
                                        aria-hidden="true"
                                        className={styles["heroStatIcon"]}
                                    >
                                        {stat.icon}
                                    </span>
                                    {stat.value}
                                </p>
                                <p className={styles["heroStatLabel"]}>
                                    {stat.label}
                                </p>
                                <p className={styles["heroStatDescription"]}>
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </header>

            <main className={styles["mainContent"]}>
                <section className={`container ${styles["section"]}`}>
                    <div className={styles["sectionHeader"]}>
                        <p className={styles["sectionKicker"]}>Adoption path</p>
                        <Heading as="h2" className={styles["sectionTitle"]}>
                            Pick the budget that matches your release bar.
                        </Heading>
                    </div>
                    <div className={styles["cardGrid"]}>
                        {configCards.map((card) => (
                            <article
                                className={styles["card"]}
                                key={card.title}
                            >
                                <p className={styles["cardLabel"]}>
                                    <span
                                        aria-hidden="true"
                                        className={styles["nerdIcon"]}
                                    >
                                        {card.icon}
                                    </span>
                                    {card.label}
                                </p>
                                <Heading
                                    as="h3"
                                    className={styles["cardTitle"]}
                                >
                                    {card.title}
                                </Heading>
                                <p className={styles["cardDescription"]}>
                                    {card.description}
                                </p>
                                <Link
                                    className={styles["cardLink"] ?? ""}
                                    to={card.to}
                                >
                                    Open config
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={`container ${styles["section"]}`}>
                    <div className={styles["sectionHeader"]}>
                        <p className={styles["sectionKicker"]}>Rule lanes</p>
                        <Heading as="h2" className={styles["sectionTitle"]}>
                            Performance checks grouped by rendering risk.
                        </Heading>
                    </div>
                    <div className={styles["laneGrid"]}>
                        {ruleLanes.map((lane) => (
                            <article
                                className={styles["ruleLane"]}
                                key={lane.title}
                            >
                                <Heading
                                    as="h3"
                                    className={styles["ruleLaneTitle"]}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={styles["ruleLaneIcon"]}
                                    >
                                        {lane.icon}
                                    </span>
                                    {lane.title}
                                </Heading>
                                <p className={styles["ruleLaneDescription"]}>
                                    {lane.description}
                                </p>
                                <ul className={styles["ruleLinkList"]}>
                                    {lane.links.map((link) => (
                                        <li key={link.to}>
                                            <Link
                                                className={
                                                    styles["ruleLink"] ?? ""
                                                }
                                                to={link.to}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={`container ${styles["section"]}`}>
                    <div className={styles["sectionHeader"]}>
                        <p className={styles["sectionKicker"]}>
                            Project surfaces
                        </p>
                        <Heading as="h2" className={styles["sectionTitle"]}>
                            Docs, runtime metadata, and maintainer references
                            are linked from the front page.
                        </Heading>
                    </div>
                    <div className={styles["cardGrid"]}>
                        {resourceCards.map((card) => (
                            <article
                                className={styles["card"]}
                                key={card.title}
                            >
                                <p className={styles["cardLabel"]}>
                                    <span
                                        aria-hidden="true"
                                        className={styles["nerdIcon"]}
                                    >
                                        {card.icon}
                                    </span>
                                    {card.label}
                                </p>
                                <Heading
                                    as="h3"
                                    className={styles["cardTitle"]}
                                >
                                    {card.title}
                                </Heading>
                                <p className={styles["cardDescription"]}>
                                    {card.description}
                                </p>
                                <Link
                                    className={styles["cardLink"] ?? ""}
                                    to={card.to}
                                >
                                    Open section
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    );
}
