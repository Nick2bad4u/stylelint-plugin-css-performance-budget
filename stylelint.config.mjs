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
                  ([ruleName]) => !ruleName.startsWith(docusaurusRulePrefix)
              )
          );

const sharedOverrides = Array.isArray(sharedConfig.overrides)
    ? sharedConfig.overrides.map((override) => {
          if (typeof override !== "object") {
              return override;
          }

          const overrideRules = override.rules;

          return {
              ...override,
              ...(overrideRules === undefined
                  ? {}
                  : {
                        rules: Object.fromEntries(
                            Object.entries(overrideRules).filter(
                                ([ruleName]) =>
                                    !ruleName.startsWith(docusaurusRulePrefix)
                            )
                        ),
                    }),
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
