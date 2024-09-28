import versions from "@/data/version_dates.json";

const dateCache: Map<string, Date> = new Map();

export function getPgVersionDate(version: string) {
    if (dateCache.has(version)) {
        return dateCache.get(version);
    }
    const date = new Date(versions[version]);
    dateCache.set(version, date);
    return date;
}
