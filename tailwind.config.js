/* eslint-disable import/no-extraneous-dependencies, global-require */
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
                title: ["ESBuild", ...defaultTheme.fontFamily.sans],
                mono: [
                    "IBM Plex Mono",
                    "IBM Plex Mono Fallback",
                    ...defaultTheme.fontFamily.mono,
                ],
            },
            animation: {
                "text-blink": "text-blink 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "fade-in-overlay": "fadeInOverlay 0.2s",
                "fade-out-overlay": "fadeOutOverlay 0.2s",
                "dialog-show": "dialogShow 0.3s cubic-bezier(.16,1,.3,1)",
                "dialog-hide": "dialogHide 0.3s cubic-bezier(.16,1,.3,1)",
                "logo-move":
                    "logoMove 1s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate",
                loading: "loading 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            typography:
                "() => ({\n                DEFAULT: {\n                    css: {\n                        h2: {\n                            fontWeight: 600,\n                        },\n                        a: {\n                            fontWeight: 600,\n                        },\n                    },\n                },\n            })",
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-safe-area"),
        require("@tailwindcss/typography"),
        require("@headlessui/tailwindcss"),
        require("tailwindcss/plugin")(({ addVariant }) => {
            addVariant("search-cancel", "&::-webkit-search-cancel-button");
        }),
        plugin(({ matchUtilities, theme }) => {
            matchUtilities(
                {
                    "border-image": (value) => ({
                        border: "1px solid transparent",
                        background: `${value.replaceAll(/(, ?[a-z]+-gradient)/g, " border-box$1")} border-box`,
                        mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                        maskComposite: "exclude",
                    }),
                },
                { values: theme("backgroundImage") },
            );
        }),
        require("tailwindcss-animate"),
    ],
};
