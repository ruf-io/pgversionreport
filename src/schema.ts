import z from "zod";

const Bug = z.object({
    cve: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    fixedIn: z.string(),
});

const Feature = z.object({
    sqlExample: z.string(),
    title: z.string(),
    description: z.string(),
    sinceVersion: z.string(),
    significant: z.boolean(),
});

const PerformanceImprovement = z.object({
    title: z.string(),
    description: z.string(),
    sinceVersion: z.string(),
    significant: z.boolean(),
});

export const MainSchema = z.object({
    bugs: z.array(Bug),
    features: z.array(Feature),
    performanceImprovements: z.array(PerformanceImprovement),
});
