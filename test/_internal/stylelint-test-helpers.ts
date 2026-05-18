import stylelint, {
    type Config,
    type Plugin as StylelintPlugin,
} from "stylelint";

import plugins from "../../src/plugin";

export type LintWithConfigOptions = Readonly<{
    code: string;
    codeFilename?: string;
    config?: ConfigLike;
    fix?: boolean;
}>;

export type StylelintLintResult = Awaited<
    ReturnType<typeof stylelint.lint>
>["results"][number];

type ConfigLike = Omit<Config, "plugins"> & {
    plugins?: ConfigPluginEntry | readonly ConfigPluginEntry[];
};

type ConfigPluginEntry = string | StylelintPlugin;

function isConfigPluginEntryArray(
    value: Readonly<ConfigLike["plugins"]> | undefined
): value is readonly ConfigPluginEntry[] {
    return Array.isArray(value);
}

const defaultCodeFilename = "styles.css";

export async function lintWithConfig({
    code,
    codeFilename = defaultCodeFilename,
    config,
    fix = false,
}: LintWithConfigOptions): Promise<StylelintLintResult> {
    const mergedConfig: Config = {
        ...config,
        plugins: [...plugins, ...normalizePlugins(config?.plugins)],
        rules: {
            ...config?.rules,
        },
    };

    const lintResult = await stylelint.lint({
        code,
        codeFilename,
        config: mergedConfig,
        fix,
    });

    const [firstResult] = lintResult.results;

    if (firstResult === undefined) {
        throw new TypeError(
            "Expected Stylelint to return at least one result."
        );
    }

    return firstResult;
}

function normalizePlugins(
    pluginsConfig: Readonly<ConfigLike["plugins"]> | undefined
): readonly ConfigPluginEntry[] {
    if (pluginsConfig === undefined) {
        return [];
    }

    if (isConfigPluginEntryArray(pluginsConfig)) {
        return [...pluginsConfig];
    }

    return [pluginsConfig];
}

export const getWarningTexts = (
    result: Readonly<StylelintLintResult>
): readonly string[] => result.warnings.map((warning) => warning.text);
