import { useEffect, useState } from "react";
import Alert from "../atoms/Alert";
import BugFixes from "./BugFixes";
import Features from "./Features";
import PerformanceImprovements from "./PerformanceImprovements";
import data from "@/data/pg_release_data";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type ResolvedData = PromiseResulver<typeof data>;

const versionRegex = /PostgreSQL ([0-9.]+)/;

class Semver {
    major: number;
    minor: number;
    patch: number;

    constructor(version: string) {
        const split = version.split(".");
        try {
            this.major = parseInt(split[0]);
        } catch {
            throw new Error("Invalid version");
        }
        try {
            this.minor = parseInt(split[1]);
        } catch {
            this.minor = 0;
        }
        try {
            this.patch = parseInt(split[2]);
        } catch {
            this.patch = 0;
        }
    }

    newerOrEqual(version: Semver) {
        if (this.major > version.major) {
            return true;
        }
        if (this.major === version.major) {
            if (this.minor > version.minor) {
                return true;
            }
            if (this.minor === version.minor) {
                return this.patch >= version.patch;
            }
        }
        return false;
    }
}

const semverCache: Map<string, Semver> = new Map();

function getFromCache(version: string) {
    if (semverCache.has(version)) {
        return semverCache.get(version);
    }
    const semver = new Semver(version);
    semverCache.set(version, semver);
    return semver;
}

function parseText(text: string, data: ResolvedData) {
    // Extract the version.
    const versionMatch = text.match(versionRegex);
    if (!versionMatch) {
        return null;
    }

    // Extract the version.
    const version = new Semver(versionMatch[1]);

    // Filter the content.
    const res: ResolvedData = {
        bugs: data.bugs.filter((bug) => {
            // Check if the bug is fixed in the version.
            const fixedIn = getFromCache(bug.fixedIn);
            return fixedIn.newerOrEqual(version);
        }),
        features: data.features.filter((feature) => {
            // Check if the feature is available in the version.
            const sinceVersion = getFromCache(feature.sinceVersion);
            return sinceVersion.newerOrEqual(version);
        }),
        performanceImprovements: data.performanceImprovements.filter((performanceImprovement) => {
            // Check if the performance improvement is available in the version.
            const sinceVersion = getFromCache(performanceImprovement.sinceVersion);
            return sinceVersion.newerOrEqual(version);
        }),
    };
    return res;
}

export default function Parser({ text }: { text: string }) {
    // Defines the release data.
    const [loadedData, setLoadedData] = useState<ResolvedData | null>(null);

    // Load the release data.
    useEffect(() => {
        data.then((result) => {
            setLoadedData(result);
        });
    }, []);

    // Ignore if the text is empty.
    if (text === "") {
        return null;
    }

    // Return early if the data is not loaded.
    if (!loadedData) {
        return null;
    }

    // Parse the text.
    const result = parseText(text, loadedData);
    if (!result) {
        // Return a message saying that the text is invalid.
        return (
            <Alert isError={true}>
                The text you entered is invalid. Please make sure you copied the entire result of the query.
            </Alert>
        );
    }

    // Bail early if there are no results.
    if (
        result.bugs.length === 0 &&
        result.features.length === 0 &&
        result.performanceImprovements.length === 0
    ) {
        return (
            <Alert isError={false}>
                No security issues or missing features found in the version you entered.
            </Alert>
        );
    }

    // Return the fragment.
    return (
        <>
            {result.bugs.length > 0 && <BugFixes bugs={result.bugs} />}
            {result.features.length > 0 && <Features features={result.features} />}
            {result.performanceImprovements.length > 0 && <PerformanceImprovements performanceImprovements={result.performanceImprovements} />}
        </>
    );
}
