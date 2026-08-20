export interface Stylelint16CompatCommandSpec {
    readonly args: readonly string[];
    readonly captureOutput?: boolean | undefined;
    readonly command: string;
    readonly shell: boolean;
    readonly workingDirectory: string;
}

export function getNpmCommand(platform?: string): string;

export function getWindowsCommandShell(environment?: NodeJS.ProcessEnv): string;

export function isDirectExecution(input: {
    readonly argvEntry?: string | undefined;
    readonly currentImportUrl: string;
}): boolean;

export function createConsumerInstallCommand(input: {
    readonly npmCommand: string;
    readonly platform: string;
    readonly tarballPath: string;
    readonly workingDirectory: string;
}): Stylelint16CompatCommandSpec;

export function runCommand(input: {
    readonly args: readonly string[];
    readonly captureOutput?: boolean | undefined;
    readonly command: string;
    readonly shell: boolean;
    readonly workingDirectory: string;
    readonly windowsCommandShell?: string | undefined;
}): string;

export function runStylelint16Compat(input?: {
    readonly mkdtempFn?: ((prefix: string) => Promise<string>) | undefined;
    readonly nodeCommand?: string | undefined;
    readonly npmCommand?: string | undefined;
    readonly packageJsonPath?: string | undefined;
    readonly platform?: string | undefined;
    readonly readFileFn?:
        typeof import("node:fs/promises").readFile | undefined;
    readonly repositoryRootPath?: string | undefined;
    readonly rmFn?: typeof import("node:fs/promises").rm | undefined;
    readonly runCommandFn?:
        | ((
              input: Stylelint16CompatCommandSpec & {
                  readonly windowsCommandShell?: string | undefined;
              }
          ) => string)
        | undefined;
    readonly stylelintCompatSmokeScriptPath?: string | undefined;
    readonly tmpDirectoryPath?: string | undefined;
    readonly windowsCommandShell?: string | undefined;
    readonly writeFileFn?:
        typeof import("node:fs/promises").writeFile | undefined;
}): Promise<void>;

export function runCli(): Promise<void>;
