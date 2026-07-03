#!/usr/bin/env node

/**
 * @packageDocumentation
 * Smoke test the built plugin against the installed Stylelint runtime.
 */
// @ts-check

import { isDeepStrictEqual } from "node:util";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pc from "picocolors";

const expectedStylelintMajorArgumentPrefix = "--expect-stylelint-major=";
const builtPluginCjsPath = fileURLToPath(
    new URL("../dist/plugin.cjs", import.meta.url)
);

/** @param {readonly string[]} argv */
const parseExpectedStylelintMajor = (argv) => {
    const argument = argv.find((entry) =>
        entry.startsWith(expectedStylelintMajorArgumentPrefix)
    );

    if (argument === undefined) {
        return undefined;
    }

    const value = argument.slice(expectedStylelintMajorArgumentPrefix.length);

    if (!/^[1-9]\d*$/u.test(value)) {
        throw new TypeError(`Invalid Stylelint major argument: ${argument}`);
    }

    return Number.parseInt(value, 10);
};

/** @param {unknown} value */
const toRecord = (value) =>
    (typeof value === "object" && value !== null) || typeof value === "function"
        ? /** @type {Record<string, unknown>} */ (value)
        : {};

/** @param {unknown} runtimeCandidate */
const normalizeStylelintRuntime = (runtimeCandidate) => {
    if (
        typeof runtimeCandidate === "function" ||
        toRecord(runtimeCandidate)["lint"] instanceof Function
    ) {
        return /** @type {{ lint: Function }} */ (runtimeCandidate);
    }

    const defaultCandidate = toRecord(runtimeCandidate)["default"];

    if (toRecord(defaultCandidate)["lint"] instanceof Function) {
        return /** @type {{ lint: Function }} */ (defaultCandidate);
    }

    throw new TypeError("Unable to load Stylelint runtime.");
};

const getStylelintRuntimeVersion = () => {
    const requireFn = createRequire(import.meta.url);
    const pkgPath = requireFn.resolve("stylelint/package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

    if (typeof pkg.version !== "string" || pkg.version.length === 0) {
        throw new TypeError("Unable to determine Stylelint version.");
    }

    return pkg.version;
};

const assertStylelintMajor = (expectedMajor, runtimeVersion) => {
    const [majorText] = runtimeVersion.split(".", 1);
    const runtimeMajor = Number.parseInt(majorText ?? "", 10);

    if (!Number.isFinite(runtimeMajor)) {
        throw new TypeError(
            `Invalid Stylelint runtime version: ${runtimeVersion}`
        );
    }

    if (expectedMajor !== undefined && runtimeMajor !== expectedMajor) {
        throw new Error(
            `Expected Stylelint major ${expectedMajor}, detected ${runtimeVersion}.`
        );
    }

    console.log(
        `${pc.green("✓")} Stylelint runtime ${pc.bold(runtimeVersion)} detected.`
    );
};

const createSnapshot = (candidate) => {
    const record = toRecord(candidate);
    const configs = toRecord(record["performanceBudgetPluginConfigs"]);

    return {
        configNames: Array.isArray(record["configNames"])
            ? record["configNames"]
            : [],
        meta: record["meta"],
        ruleIds: Array.isArray(record["ruleIds"]) ? record["ruleIds"] : [],
        ruleNames: Array.isArray(record["ruleNames"])
            ? record["ruleNames"]
            : [],
        rules: Object.keys(toRecord(record["rules"])),
        allRules: Object.keys(
            toRecord(toRecord(configs["performance-budget-all"])["rules"])
        ),
        recommendedRules: Object.keys(
            toRecord(
                toRecord(configs["performance-budget-recommended"])["rules"]
            )
        ),
    };
};

const loadBuiltSurface = async () => {
    const esmModule = await import("../dist/plugin.js");
    const requireFn = createRequire(import.meta.url);
    const cjsModule = requireFn(builtPluginCjsPath);

    return {
        cjsModule,
        esmModule,
    };
};

const assertBuiltSurface = (esmModule, cjsModule) => {
    const esmRecord = toRecord(esmModule);
    const meta = toRecord(esmRecord["meta"]);

    if (meta["namespace"] !== "css-performance-budget") {
        throw new Error(
            `Expected namespace css-performance-budget, got ${String(meta["namespace"])}.`
        );
    }

    const configs = toRecord(esmRecord["performanceBudgetPluginConfigs"]);

    for (const configName of [
        "performance-budget-recommended",
        "performance-budget-all",
        "performance-budget-strict",
    ]) {
        if (!(configName in configs)) {
            throw new Error(`Missing config export: ${configName}`);
        }
    }

    if (
        !isDeepStrictEqual(createSnapshot(esmModule), createSnapshot(cjsModule))
    ) {
        throw new Error("CJS build does not preserve ESM plugin surface.");
    }

    console.log(`${pc.green("✓")} Plugin surface exports are valid.`);
};

const runScenario = async (stylelintRuntime, scenarioName, config) => {
    const lintResult = await stylelintRuntime.lint({
        code: ".component { color: #0b63f6; }",
        codeFilename: "component.css",
        config,
    });
    const [firstResult] = lintResult.results;

    if (firstResult === undefined) {
        throw new Error(`${scenarioName}: missing stylelint result.`);
    }

    if ((firstResult.parseErrors ?? []).length > 0) {
        throw new Error(`${scenarioName}: parse errors detected.`);
    }

    if ((firstResult.invalidOptionWarnings ?? []).length > 0) {
        throw new Error(`${scenarioName}: invalid option warnings detected.`);
    }

    if ((firstResult.warnings ?? []).length > 0) {
        throw new Error(`${scenarioName}: expected zero warnings.`);
    }

    console.log(`${pc.green("✓")} ${pc.bold(scenarioName)} passed.`);
};

const runStylelintCompatSmoke = async (argv = process.argv.slice(2)) => {
    console.log(
        pc.bold(pc.cyan("Running Stylelint compatibility smoke checks..."))
    );

    const expectedMajor = parseExpectedStylelintMajor(argv);
    const runtimeVersion = getStylelintRuntimeVersion();

    assertStylelintMajor(expectedMajor, runtimeVersion);

    const stylelintRuntime = normalizeStylelintRuntime(
        await import("stylelint")
    );
    const { esmModule, cjsModule } = await loadBuiltSurface();

    assertBuiltSurface(esmModule, cjsModule);

    const configs =
        /**
         * @type {Record<
         *     string,
         *     { plugins: unknown[]; rules: Record<string, unknown> }
         * >}
         */ (toRecord(toRecord(esmModule)["performanceBudgetPluginConfigs"]));

    await runScenario(stylelintRuntime, "recommended-config", {
        ...configs["performance-budget-recommended"],
        plugins: [...configs["performance-budget-recommended"].plugins],
        rules: { ...configs["performance-budget-recommended"].rules },
    });

    await runScenario(stylelintRuntime, "all-config", {
        ...configs["performance-budget-all"],
        plugins: [...configs["performance-budget-all"].plugins],
        rules: { ...configs["performance-budget-all"].rules },
    });

    console.log(
        pc.bold(pc.green("Stylelint compatibility smoke checks passed."))
    );
};

const runCli = async () => {
    try {
        await runStylelintCompatSmoke();
        return 0;
    } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        return 1;
    }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const exitCode = await runCli();

    if (exitCode !== 0) {
        process.exitCode = exitCode;
    }
}
