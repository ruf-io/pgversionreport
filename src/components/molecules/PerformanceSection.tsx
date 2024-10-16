import data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import { PerformanceDataTable } from "./PerformanceDataTable";
import { CircleGauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Semver from "@/utils/Semver";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type PerformanceImprovements = PromiseResolver<typeof data>["performance"];
type Props = {
    performanceImprovements: PerformanceImprovements;
    version: Semver;
};

export default function PerformanceSection({
    performanceImprovements,
    version,
}: Props) {
    return (
        <div className="relative mt-8">
            <div className="flex items-center mt-4 gap-2">
                <CircleGauge className="h-6 w-6 text-foreground" />
                <Badge variant="secondary">
                    {performanceImprovements.length} Perf Improvements
                </Badge>
            </div>
            <Panel
                title={`Performance Improvements`}
                description={performanceImprovements.length > 0 ? `Contributors shipped ${performanceImprovements.length} performance improvements in Postgres after ${version.major}.${version.minor}` : 'Your version is not missing out on any performance improvements!'} 
                size="secondary"
            >
                {performanceImprovements.length > 0 && (
                <PerformanceDataTable
                    data={performanceImprovements}
                    version={version}
                />)}
            </Panel>
        </div>
    );
}
