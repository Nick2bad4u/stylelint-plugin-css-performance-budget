export interface ActionlintReleaseAsset {
    readonly executableName: string;
    readonly filename: string;
    readonly sha256: string;
    readonly url: string;
}

export function resolveActionlintAsset(
    platform: NodeJS.Platform,
    architecture: string
): ActionlintReleaseAsset;

export function runActionlint(input?: {
    readonly argumentList?: readonly string[];
    readonly ensureExecutable?: () => Promise<string>;
    readonly execute?: (
        executablePath: string,
        arguments_: readonly string[]
    ) => Promise<number>;
    readonly logger?: {
        readonly error: (...values: readonly unknown[]) => void;
    };
}): Promise<number>;
