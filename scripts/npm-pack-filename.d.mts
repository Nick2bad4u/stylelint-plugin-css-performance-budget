export function parseNpmPackFilename(jsonText: string): string;

export function runCli(input?: {
    readonly argumentList?: readonly string[];
    readonly logger?: {
        readonly error: (...values: readonly unknown[]) => void;
    };
    readonly readText?: (path: string, encoding: "utf8") => Promise<string>;
    readonly stdout?: {
        readonly write: (value: string) => void;
    };
}): Promise<number>;
