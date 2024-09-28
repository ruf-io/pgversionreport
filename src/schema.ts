import z from "zod";

const Bug = z.object({
    cve: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    fixedIn: z.string(),
    contributors: z.array(z.string()),
});

const Feature = z.object({
    title: z.string(),
    description: z.string(),
    sinceVersion: z.string(),
    significant: z.boolean(),
    contributors: z.array(z.string()),
});

const PerformanceImprovement = z.object({
    title: z.string(),
    description: z.string(),
    sinceVersion: z.string(),
    significant: z.boolean(),
    contributors: z.array(z.string()),
});

export const MainSchema = z.object({
    bugs: z.array(Bug),
    features: z.array(Feature),
    performanceImprovements: z.array(PerformanceImprovement),
});
