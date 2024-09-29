import Semver from "@/utils/Semver";
import type data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import Timeline from "../atoms/Timeline";
import { sortedVersions, getPgVersionDate } from "@/utils/postgresDates";
import type { DataItemCollectionType } from "vis-timeline/standalone";
import Alert from "../atoms/Alert";

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
    const endOfLife = new Date(date).setFullYear(date.getFullYear() + 5);
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

    // Tell the user when the version will be EOL in years/months/days.
    const timeLeft = endOfLife.valueOf() - now.valueOf();
    const years = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const parts: string[] = [];
    if (years) parts.push(`${years} year${years === 1 ? "" : "s"}`);
    if (months) parts.push(`${months} month${months === 1 ? "" : "s"}`);
    if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);
    const chunk2 = parts.pop();
    const chunk1 = parts.join(", ");
    const chunk = chunk1 ? `${chunk1} and ${chunk2}` : chunk2;

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

export default function GeneralStats({ data }: { data: Data }) {
    return (
        <Panel title="General Stats" description="Here are the general stats for this version.">
            <DataHeader version={data.version} />
            <Timeline {...buildTimeline()} />
        </Panel>
    );
}
