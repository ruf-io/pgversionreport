import type data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import Bug from "../atoms/Bug";
import Collapsable from "../atoms/Collapsable";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type BugFixes = PromiseResulver<typeof data>["bugs"];

export default function BugFixes({ bugs }: { bugs: BugFixes }) {
    // Filter out CVE's and not CVE's. We want to emphasize CVE's.
    const cves = bugs.filter((bug) => bug.cve);
    const notCves = bugs.filter((bug) => !bug.cve);

    // If there are no CVE's, we should just show bugs.
    if (!cves.length) {
        return (
            <Panel title="Bug Fixes" description="Here are the bug fixes that are not in your Postgres version.">
                <div className="flex flex-wrap space-y-2 space-x-2 mb-4">
                    {notCves.map((bug, i) => (
                        <Bug key={i} bug={bug} />
                    ))}
                </div>
            </Panel>
        );
    }

    // If there are only CVE's, we should just show them.
    if (!notCves.length) {
        return (
            <Panel title="CVE's" description="Here are the vulnerabilities in your Postgres version.">
                <div className="flex flex-wrap space-y-2 space-x-2 mb-4">
                    {cves.map((bug, i) => (
                        <Bug key={i} bug={bug} />
                    ))}
                </div>
            </Panel>
        );
    }

    // If there are CVE's and bug fixes, we should show them first in a collapsable panel.
    return (
        <Panel title="Bug Fixes" description="Here are the bug fixes that are not in your Postgres version.">
            <Collapsable
                collapseText="Hide smaller bug fixes" expandText="Show smaller bug fixes"
                initialValues={cves.map((bug, i) => (
                    <Bug key={i} bug={bug} />
                ))}
                collapsedValues={notCves.map((bug, i) => (
                    <Bug key={i} bug={bug} />
                ))}
            />
        </Panel>
    );
}
