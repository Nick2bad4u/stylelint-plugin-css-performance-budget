import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

const cards = [
    {
        description:
            "Start with the plugin purpose, exported configs, and rule catalog.",
        title: "Overview",
        to: "/docs/rules/overview",
    },
    {
        description:
            "Install the package and wire the recommended performance budget profile.",
        title: "Getting Started",
        to: "/docs/rules/getting-started",
    },
    {
        description:
            "Compare recommended, all, and strict configuration surfaces.",
        title: "Configs",
        to: "/docs/rules/configs",
    },
] as const;

/** Render the documentation landing page for the performance-budget plugin. */
export default function Home() {
    return (
        <Layout
            description="Stylelint plugin docs for CSS performance budget rules."
            title="CSS Performance Budgets"
        >
            <Head>
                <meta
                    content="stylelint, stylelint-plugin, css performance, layout, paint"
                    name="keywords"
                />
            </Head>
            <header className={styles["heroBanner"]}>
                <div className="container">
                    <Heading as="h1" className={styles["heroTitle"]}>
                        stylelint-plugin-css-performance-budget
                    </Heading>
                    <p className={styles["heroSubtitle"]}>
                        Performance-focused Stylelint rules for selector cost,
                        filter effects, layout thrashing, and paint-heavy CSS.
                    </p>
                </div>
            </header>
            <main className={styles["mainContent"]}>
                <section className="container">
                    <div className={styles["cardGrid"]}>
                        {cards.map((card) => (
                            <article
                                key={card.title}
                                className={styles["card"]}
                            >
                                <Heading
                                    as="h2"
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
                                    Open
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    );
}
