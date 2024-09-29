import versions from "@/data/version_dates.json";
import Semver from "./Semver";

const dateCache: Map<string, Date> = new Map();

export function getPgVersionDate(version: string) {
    if (dateCache.has(version)) {
        return dateCache.get(version);
    }
    const date = new Date(versions[version]);
    dateCache.set(version, date);
    return date;
}

let sortedVersions: [Semver, Date][] = [];

// Sort the versions.
for (const version in versions) {
    const semver = new Semver(version);
    const date = new Date(versions[version]);
    sortedVersions.push([semver, date]);
}
sortedVersions = sortedVersions.sort((a, b) => {
    if (a[0].major !== b[0].major) {
        return a[0].major - b[0].major;
    }
    if (a[0].minor !== b[0].minor) {
        return a[0].minor - b[0].minor;
    }
    return a[0].patch - b[0].patch;
});

export { sortedVersions };
