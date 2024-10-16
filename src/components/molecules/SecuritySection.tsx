import data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import { SecurityDataTable } from "./SecurityDataTable";
import { Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Semver from "@/utils/Semver";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type CVEs = PromiseResolver<typeof data>["security"];
type Props = {
    cves: CVEs;
    version: Semver;
};

export default function SecuritySection({ cves, version }: Props) {
    return (
        <div className="relative mt-8">
            <div className="flex items-center mt-4 gap-2">
                <Siren className="h-6 w-6 text-foreground" />
                <Badge variant="secondary">{cves.length} CVEs</Badge>
            </div>
            <Panel
                title={`Security Issues (CVEs)`}
                description={cves.length > 0 ? `Contributors found and fixed ${cves.length} CVEs in Postgres after ${version.major}.${version.minor}` :  'All (known) CVEs have been patched in your version!'}
                size="secondary"
            >
                {cves.length > 0 && (
                    <SecurityDataTable data={cves} version={version} />
                )}
            </Panel>
        </div>
    );
}
