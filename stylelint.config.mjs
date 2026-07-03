import sharedConfig from "stylelint-config-nick2bad4u";

const unsupportedExtends = new Set([
    "stylelint-plugin-container-query-sanity/configs/container-query-sanity-all",
    "stylelint-plugin-docusaurus/configs/docusaurus-all",
    "stylelint-plugin-font/configs/font-all",
    "stylelint-plugin-grid/configs/grid-all",
]);
const unsupportedPlugins = new Set([
    "stylelint-plugin-container-query-sanity",
    "stylelint-plugin-docusaurus",
    "stylelint-plugin-font",
    "stylelint-plugin-grid",
]);
const unsupportedRulePrefixes = [
    "container-query-sanity/",
    "docusaurus/",
    "font/",
    "grid/",
];
const normalizedExtends = Array.isArray(sharedConfig.extends)
    ? sharedConfig.extends.filter(
          (entry) => typeof entry === "string" && !unsupportedExtends.has(entry)
      )
    : [];
const normalizedPlugins = Array.isArray(sharedConfig.plugins)
    ? sharedConfig.plugins.filter(
          (entry) => typeof entry === "string" && !unsupportedPlugins.has(entry)
      )
    : sharedConfig.plugins;
const sharedRules = sharedConfig.rules ?? {};
const normalizedRules = Object.fromEntries(
    Object.entries(sharedRules).filter(([ruleName]) =>
        unsupportedRulePrefixes.every((prefix) => !ruleName.startsWith(prefix))
    )
);
const normalizedOverrides = Array.isArray(sharedConfig.overrides)
    ? sharedConfig.overrides.map((override) => {
          if (override.rules === undefined) {
              return override;
          }

          const overrideRules = Object.fromEntries(
              Object.entries(override.rules).filter(([ruleName]) =>
                  unsupportedRulePrefixes.every(
                      (prefix) => !ruleName.startsWith(prefix)
                  )
              )
          );

          return {
              ...override,
              rules: overrideRules,
          };
      })
    : sharedConfig.overrides;
const projectOverrides = [
    ...(normalizedOverrides ?? []),
    {
        files: ["docs/docusaurus/**/*.css"],
        rules: {
            "css-performance-budget/no-giant-selector-lists": null,
            "css-performance-budget/no-paint-heavy-declarations": null,
        },
    },
];

/** @type {import("stylelint").Config} */
const stylelintConfig = {
    ...sharedConfig,
    extends: normalizedExtends,
    overrides: projectOverrides,
    rules: normalizedRules,
};

if (normalizedPlugins !== undefined) {
    stylelintConfig.plugins = normalizedPlugins;
}

export default stylelintConfig;
