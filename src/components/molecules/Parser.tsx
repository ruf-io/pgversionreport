import { useEffect, useState } from "react";
import Alert from "../atoms/Alert";
import GeneralStats from "./GeneralStats";
import SecuritySection from "./SecuritySection";
import BugsSection from "./BugsSection";
import FeaturesSection from "./FeaturesSection";
import PerformanceSection from "./PerformanceSection";
import data from "@/data/pg_release_data";
import Semver from "@/utils/Semver";
import { sortedVersions } from "@/utils/postgresDates";
import Panel from "../atoms/Panel";
import HowToUpgrade from "./HowToUpgrade";
import { versionRegex } from "@/utils/regexes";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type ResolvedData = PromiseResolver<typeof data>;

const semverCache: Map<string, Semver> = new Map();

function getFromCache(version: string) {
    if (semverCache.has(version)) {
        return semverCache.get(version);
    }
    const semver = new Semver(version);
    semverCache.set(version, semver);
    return semver;
}

export function parseVersion(version: Semver, data: ResolvedData) {
    return {
        version,
        bugs: data.bugs.filter((bug) => {
            // Check if the bug is fixed in the version.
            const fixedIn = getFromCache(bug.fixedIn);
            return (
                fixedIn.greaterThan(version) && fixedIn.major === version.major
            );
        }),
        security: data.security.filter((cve) => {
            // Check if the bug is fixed in the version.
            const fixedIn = getFromCache(cve.fixedIn);
            return (
                fixedIn.greaterThan(version) &&
                fixedIn.major === version.major &&
                cve.cve
            );
        }),
        features: data.features.filter((feature) => {
            // Check if the feature is available in the version.
            const sinceVersion = getFromCache(feature.sinceVersion);
            return sinceVersion.greaterThan(version);
        }),
        performance: data.performance.filter((performanceImprovement) => {
            // Check if the performance improvement is available in the version.
            const sinceVersion = getFromCache(
                performanceImprovement.sinceVersion,
            );
            return sinceVersion.greaterThan(version);
        }),
    };
}

function parseText(text: string, data: ResolvedData) {
    // Extract the version.
    const versionMatch = text.match(versionRegex);
    if (!versionMatch) {
        return null;
    }
    const version = new Semver(versionMatch[1]);

    // Return the parsed data.
    return parseVersion(version, data);
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
        // TODO: add the showcase here.
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
                The text you entered is invalid. Please make sure you copied the
                entire result of the query.
            </Alert>
        );
    }

    if (result.version.major < 10) {
        return (
            <Alert isError={true}>
                The version you entered is too old. Please enter a version that
                is 10 or newer. If you are on this version, please consider
                upgrading as soon as possible since this is an extremely old
                version.
            </Alert>
        );
    }

    // Find the version.
    const versionIndex = sortedVersions.findIndex((version) =>
        version[0].greaterThan(result.version),
    );
    let minorVersionsBehind = 0;
    let majorVersionsBehind = 0;
    if (versionIndex !== -1) {
        // Handle semver.
        let versionsAfter = sortedVersions.slice(versionIndex + 1);
        const majors = versionsAfter.filter((version) => {
            return (
                version[0].major !== result.version.major &&
                version[0].minor === 0 &&
                version[0].patch === 0
            );
        });
        const minors = versionsAfter.filter((version) => {
            return (
                version[0].major === result.version.major &&
                version[0].minor !== result.version.minor &&
                version[0].patch === 0
            );
        });
        majorVersionsBehind = majors.length;
        minorVersionsBehind = minors.length;

        // Process the date.
        const [, date] = sortedVersions[versionIndex];
        let latest = "You are on the latest version.";
        if (versionsAfter.length > 0) {
            let numberOfReleasesArr: string[] = [];
            if (minors.length > 0) {
                numberOfReleasesArr.push(
                    `${minors.length} minor release${minors.length === 1 ? "" : "s"}`,
                );
            }
            if (majors.length > 0) {
                numberOfReleasesArr.push(
                    `${majors.length} major release${majors.length === 1 ? "" : "s"}`,
                );
            }
            const numberOfReleases = numberOfReleasesArr.join(" and ");
            const [latestVersion] = versionsAfter[versionsAfter.length - 1];
            latest = `The latest version is ${latestVersion.major}.${latestVersion.minor}.${latestVersion.patch}. There are ${numberOfReleases} since the build you are running.`;
        }

        // Handle the timestamp.
        let ago = "less than a day ago";
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        if (diffInDays > 1) {
            ago = `${Math.floor(diffInDays)} day${diffInDays === 1 ? "" : "s"} ago`;
        }
    }

    // Return the fragment.
    return (
        <>
            <hr />
            <GeneralStats
                data={result}
                latest={majorVersionsBehind === 0 && minorVersionsBehind === 0}
            />
            {(majorVersionsBehind !== 0 || minorVersionsBehind !== 0) && (
                <>
                    <SecuritySection
                        cves={result.security}
                        version={result.version}
                    />
                    <BugsSection bugs={result.bugs} version={result.version} />
                    <PerformanceSection
                        performanceImprovements={result.performance}
                        version={result.version}
                    />
                    <FeaturesSection
                        features={result.features}
                        version={result.version}
                    />
                    <hr />
                    <Panel
                        title={`How to Upgrade`}
                        description={`Resources for upgrading your PostgreSQL version.`}
                        size="secondary"
                    >
                        <HowToUpgrade />
                    </Panel>
                </>
            )}
        </>
    );
}
