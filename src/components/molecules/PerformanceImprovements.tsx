import { useId, useState } from "react";
import type data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import Improvement from "../atoms/Improvement";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type PerformanceImprovements = PromiseResulver<typeof data>["performanceImprovements"];

export default function PerformanceImprovements(
    { performanceImprovements }: { performanceImprovements: PerformanceImprovements },
) {
    const [collapsed, setCollapsed] = useState(true);
    const id = useId();

    const significant = performanceImprovements.filter((improvement) => improvement.significant);
    const insignificant = performanceImprovements.filter((improvement) => !improvement.significant);

    return (
        <Panel
            title="Performance Inprovements"
            description="Here are the performance improvements over the version you are using. A faster database means potentially less usage and bills."
        >
            <ul
                id={id}
                className="list-disc list-inside"
            >
                {
                    significant.map((improvement, i) => (
                        <Improvement key={i} improvement={improvement} />
                    ))
                }
                {
                    !collapsed || significant.length === 0 && insignificant.map((improvement, i) => (
                        <Improvement key={i} improvement={improvement} />
                    ))
                }
            </ul>

            {
                significant.length !== 0 && insignificant.length !== 0 && (
                    <button
                        className="text-sm text-code-blue-1 dark:text-code-blue-2 hover:underline"
                        onClick={() => setCollapsed((prev) => !prev)}
                        aria-expanded={!collapsed}
                        aria-controls={id}
                    >
                        {collapsed ? "Show all performance improvements..." : "Hide less significant performance improvements..."}
                    </button>
                )
            }
        </Panel>
    );
}
