import z from "zod";

const Bug = z.object({
    cve: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    fixedIn: z.string(),
    contributor: z.string().nullable(),
});

const Feature = z.object({
    title: z.string(),
    description: z.string(),
    sinceVersion: z.string(),
    significant: z.boolean(),
    contributor: z.string().nullable(),
});

const PerformanceImprovement = z.object({
    title: z.string(),
    description: z.string(),
    sinceVersion: z.string(),
    significant: z.boolean(),
    contributor: z.string().nullable(),
});

export const MainSchema = z.object({
    bugs: z.array(Bug),
    features: z.array(Feature),
    performanceImprovements: z.array(PerformanceImprovement),
});
