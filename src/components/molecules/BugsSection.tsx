import data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import { BugsDataTable } from "./BugsDataTable";
import { Bug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Semver from "@/utils/Semver";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type Bugs = PromiseResolver<typeof data>["bugs"];
type Props = {
    bugs: Bugs;
    version: Semver;
};

export default function BugsSection({ bugs, version }: Props) {
    return (
        <div className="relative" id="bugs">
            <hr />
            <div className="flex items-center mt-4 gap-2">
                <Bug className="h-6 w-6 text-foreground" />
                <Badge variant="secondary">{bugs.length} Bugs</Badge>
            </div>
            <Panel
                title={`Bugs`}
                description={`Contributors patched ${bugs.length} bugs in Postgres after ${version.major}.${version.minor}`}
                size="secondary"
            >
                <BugsDataTable data={bugs} version={version} />
            </Panel>
        </div>
    );
}
