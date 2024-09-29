import Semver from "@/utils/Semver";
import type data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import Timeline from "../atoms/Timeline";
import { sortedVersions } from "@/utils/postgresDates";
import type { DataItemCollectionType } from "vis-timeline/standalone";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type Data = PromiseResulver<typeof data> & { version: Semver };

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
            <Timeline {...buildTimeline()} />
        </Panel>
    );
}
