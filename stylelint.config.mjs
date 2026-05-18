import sharedConfig from "stylelint-config-nick2bad4u";

const retiredDocusaurusConfigSegment = "/configs/docusaurus-";
const docusaurusRulePrefix = "docusaurus/";

const sharedExtends = Array.isArray(sharedConfig.extends)
    ? sharedConfig.extends.filter(
          (entry) =>
              typeof entry === "string" &&
              !entry.includes(retiredDocusaurusConfigSegment)
      )
    : sharedConfig.extends;

const sharedRules =
    sharedConfig.rules === undefined
        ? {}
        : Object.fromEntries(
              Object.entries(sharedConfig.rules).filter(
                  ([ruleName]) =>
                      typeof ruleName === "string" &&
                      !ruleName.startsWith(docusaurusRulePrefix)
              )
          );

const sharedOverrides = Array.isArray(sharedConfig.overrides)
    ? sharedConfig.overrides.map((override) => {
          if (
              typeof override !== "object" ||
              override === null ||
              !("rules" in override)
          ) {
              return override;
          }

          const overrideRules = override.rules;

          if (typeof overrideRules !== "object" || overrideRules === null) {
              return override;
          }

          return {
              ...override,
              rules: Object.fromEntries(
                  Object.entries(overrideRules).filter(
                      ([ruleName]) =>
                          typeof ruleName === "string" &&
                          !ruleName.startsWith(docusaurusRulePrefix)
                  )
              ),
          };
      })
    : sharedConfig.overrides;

/** @type {import("stylelint").Config} */
const stylelintConfig = {
    ...sharedConfig,
    ...(sharedExtends === undefined ? {} : { extends: sharedExtends }),
    ...(sharedOverrides === undefined ? {} : { overrides: sharedOverrides }),
    rules: sharedRules,
};

export default stylelintConfig;
