/** @type {import("dependency-cruiser").IConfiguration} */
export default {
    forbidden: [
        {
            comment: "Keep the plugin module graph acyclic.",
            from: {},
            name: "no-circular",
            severity: "error",
            to: {
                circular: true,
            },
        },
    ],
    options: {
        doNotFollow: {
            path: "node_modules",
        },
        includeOnly: "^src",
        tsConfig: {
            fileName: "tsconfig.json",
        },
    },
};
