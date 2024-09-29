import Semver from "@/utils/Semver";
import type data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import Timeline from "../atoms/Timeline";
import { sortedVersions, getPgVersionDate } from "@/utils/postgresDates";
import type { DataItemCollectionType } from "vis-timeline/standalone";
import Alert from "../atoms/Alert";
import humanizeDuration from "humanize-duration";
import BugFixes from "./BugFixes";
import InformationalPanel from "../atoms/InformationalPanel";
import { faBug, faCodeBranch, faStopwatch } from "@fortawesome/free-solid-svg-icons";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type Data = PromiseResulver<typeof data> & { version: Semver };

function UpToDate({ chunk }: { chunk: string }) {
    return (
        <div className="mb-6">
            <img src="/images/funny_elephant.png" aria-hidden={true} className="mx-auto h-52 mt-4" loading="lazy" />
            <h2 className="text-2xl font-bold text-center mt-4">You are up to date!</h2>
            <p className="text-center">
                You are using the latest version of PostgreSQL, which is going to be supported for another {chunk}.
                Are you getting frustrated with manually patching your PostgreSQL instance? <a href="https://neon.tech" className="hover:underline">
                    Neon makes it easy to be on the latest version of PostgreSQL and manages your instance for you!
                </a>
            </p>
        </div>
    );
}

function DataHeader({ version }: { version: Semver }) {
    // Handle if the version is not found.
    let date: Date;
    try {
        date = getPgVersionDate(`${version.major}.${version.minor}`);
    } catch {
        return null;
    }

    // Figure out if the version is still supported.
    const now = new Date();
    const endOfLife = new Date(date);
    endOfLife.setFullYear(date.getFullYear() + 5);
    const isSupported = endOfLife.valueOf() > now.valueOf();
    if (!isSupported) {
        // Throw up a alert if the version is not supported.
        return (
            <div className="mb-4">
                <Alert isError={true}>
                    <p>
                        PostgreSQL {version.major}.{version.minor} is no longer supported.
                        <strong className="font-bold"> This means unless you are using a commercially supported Postgres build, your version will not recieve security updates!</strong>  <a href="https://neon.tech" className="hover:underline">
                            Neon makes it easy to be on the latest version of PostgreSQL!
                        </a>
                    </p>
                </Alert>
            </div>
        );
    }

    // Calculate the duration chunk.
    const chunk = humanizeDuration(
        endOfLife.valueOf() - now.valueOf(),
        {
            round: true,
            conjunction: " and ",
            units: ["y", "mo", "w", "d"],
        },
    );

    // Figure out if this is the newest version.
    if (
        sortedVersions[sortedVersions.length - 1][0].major === version.major &&
        sortedVersions[sortedVersions.length - 1][0].minor === version.minor
    ) {
        return (
            <UpToDate chunk={chunk} />
        );
    }

    // Return the supported alert.
    return (
        <div className="mb-4">
            <Alert isError={false}>
                <p>
                    PostgreSQL {version.major}.{version.minor} will be supported for another <strong className="font-bold">{chunk}</strong>.
                    You will not, however, get all the latest features until you upgrade to the latest version. <a href="https://neon.tech" className="hover:underline">
                        Neon makes it easy to be on the latest version of PostgreSQL!
                    </a>
                </p>
            </Alert>
        </div>
    );
}

function buildTimeline() {
    let id = 1;
    const items: DataItemCollectionType = [];
    const groups: string[] = [];
    const majors = new Set<number>();

    for (const [semver, date] of sortedVersions) {
        if (majors.has(semver.major)) {
            // We have handled this major version before.
            continue;
        }

        // Get the end of life by adding 5 years to the release date.
        const endOfLife = new Date(date).setFullYear(date.getFullYear() + 5);
        const index = groups.length;
        groups.push(`${semver.major}.x`);
        majors.add(semver.major);
        items.push({
            id: id++,
            group: index,
            content: `PostgreSQL ${semver.major} Support`,
            start: date,
            end: endOfLife,
        });
    }

    return {
        items,
        groups,
    };
}

function Overview({ data }: { data: Data }) {
    const cards: React.ReactNode[] = [];

    if (data.bugs.length > 0) {
        let text = `There are ${data.bugs.length} bug fixes in this version that are patched in newer builds.`;
        const cves = data.bugs.filter((bug) => bug.cve !== null);
        if (cves.length > 0) {
            text += ` ${cves.length} of these bugs have a CVE associated with them meaning they are likely security issues.`;
        }
        cards.push(
            <InformationalPanel
                key="bug-fixes" className="border-code-red-1"
                icon={faBug} title="Bug Fixes" description={text}
            />
        );
    }

    if (data.features.length > 0) {
        cards.push(
            <InformationalPanel
                key="features" className="border-code-green-1"
                icon={faCodeBranch} title="New Features"
                description={`There are ${data.features.length} new features in newer versions.`}
            />
        );
    }

    if (data.performanceImprovements.length > 0) {
        cards.push(
            <InformationalPanel
                key="performance" className="border-code-green-1"
                icon={faStopwatch} title="Performance Improvements"
                description={`There are ${data.performanceImprovements.length} performance improvements in newer versions.`}
            />
        );
    }

    if (cards.length === 0) {
        return null;
    }

    return (
        <div className="block w-full">
            <div className="flex justify-center space-x-4 mt-4 flex-wrap">
                {cards}
            </div>
        </div>
    );
}

export default function GeneralStats({ data }: { data: Data }) {
    return (
        <Panel title="General Stats" description="Here are the general stats for this version.">
            <DataHeader version={data.version} />
            <Timeline {...buildTimeline()} />
            <Overview data={data} />
        </Panel>
    );
}
