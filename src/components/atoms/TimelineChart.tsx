import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MinorVersionInfo, VersionData } from "../molecules/VersionMapCard";
import Semver from "@/utils/Semver";

type Props = {
    data: VersionData;
    min_epoch: number;
    max_duration: number;
    current_version: Semver;
    showXAxis: boolean;
};

export default function TimelineChart({
    data,
    min_epoch,
    max_duration,
    current_version,
}: Props) {
    const isCurrentVersion = (minor: MinorVersionInfo) => {
        return (
            current_version.major === data.major_version &&
            current_version.minor === minor.minor_version
        );
    };

    return (
        <div className="h-8 w-full">
            <div
                className="inline-block text-right leading-6 pr-2 h-auto font-bold"
                style={{
                    width: `${
                        ((new Date(data.first_release_date).getTime() -
                            min_epoch) /
                            max_duration) *
                        100
                    }%`,
                }}
            >
                Postgres {data.major_version}
            </div>

            {data.minor_versions.map((minor, i) => (
                <TooltipProvider key={i}>
                    <Tooltip>
                        <TooltipTrigger
                            className={`relative inline-block text-xs text-white h-auto leading-6 ${isCurrentVersion(minor) ? "shadow-lg border border-black bg-foreground/80" : "bg-muted-foreground/80 hover:bg-muted-foreground/90"} `}
                            style={{
                                width: `${
                                    i < data.minor_versions.length - 1
                                        ? ((new Date(
                                              data.minor_versions[
                                                  i + 1
                                              ].release_date,
                                          ).getTime() -
                                              new Date(
                                                  minor.release_date,
                                              ).getTime()) /
                                              max_duration) *
                                          100
                                        : 2
                                }%`,
                            }}
                        >
                            <div className="absolute w-px h-full bg-black opacity-20" />
                            <span className="ml-1">.{minor.minor_version}</span>
                            {isCurrentVersion(minor) && (
                                <div className="absolute -top-10 block -left-8 text-sm text-primary-foreground bg-primary border border-foreground rounded w-28 px-2 py-1">
                                    You are here.
                                </div>
                            )}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {data.major_version}.{minor.minor_version}:{" "}
                                {new Date(minor.release_date)
                                    .toISOString()
                                    .substring(0, 10)}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
}
