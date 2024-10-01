import data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import { PerformanceDataTable } from "./PerformanceDataTable";
import { CircleGauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Semver from "@/utils/Semver";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type PerformanceImprovements = PromiseResolver<
    typeof data
>["performanceImprovements"];
type Props = {
    performanceImprovements: PerformanceImprovements;
    version: Semver;
};

export default function PerformanceSection({
    performanceImprovements,
    version,
}: Props) {
    return (
        <div className="relative">
            <hr />
            <div className="flex items-center mt-4 gap-2">
                <CircleGauge className="h-6 w-6 text-foreground" />
                <Badge variant="secondary">
                    {performanceImprovements.length} Perf Improvements
                </Badge>
            </div>
            <Panel
                title={`Performance Improvements`}
                description={`Contributors shipped ${performanceImprovements.length} performance improvements in Postgres after ${version.major}.${version.minor}`}
                size="secondary"
            >
                <PerformanceDataTable
                    data={performanceImprovements}
                    version={version}
                />
            </Panel>
        </div>
    );
}
