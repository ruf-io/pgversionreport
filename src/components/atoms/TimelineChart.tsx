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
    minEpoch: number;
    maxDuration: number;
    currentVersion: Semver;
};

export default function TimelineChart({
    data,
    minEpoch,
    maxDuration,
    currentVersion,
}: Props) {
    const isCurrentVersion = (minor: MinorVersionInfo) => {
        return (
            currentVersion.major === data.majorVersion &&
            currentVersion.minor === minor.minorVersion
        );
    };

    return (
        <div className="h-8 w-full">
            <div
                className="inline-block text-right leading-6 pr-2 h-auto font-bold"
                style={{
                    width: `${
                        ((new Date(data.firstReleaseDate).getTime() -
                        minEpoch) /
                            maxDuration) *
                        100
                    }%`,
                }}
            >
                Postgres {data.majorVersion}
            </div>

            {data.minorVersions.map((minor, i) => (
                <TooltipProvider key={i}>
                    <Tooltip>
                        <TooltipTrigger
                            className={`relative inline-block text-xs text-white h-auto leading-6 ${isCurrentVersion(minor) ? "shadow-lg border border-black bg-foreground/80" : "bg-muted-foreground/80 hover:bg-muted-foreground/90"} `}
                            style={{
                                width: `${
                                    i < data.minorVersions.length - 1
                                        ? ((new Date(
                                              data.minorVersions[
                                                  i + 1
                                              ].releaseDate,
                                          ).getTime() -
                                              new Date(
                                                  minor.releaseDate,
                                              ).getTime()) /
                                              maxDuration) *
                                          100
                                        : 2
                                }%`,
                            }}
                        >
                            <div className="absolute w-px h-full bg-black opacity-20" />
                            <span className="ml-1">.{minor.minorVersion}</span>
                            {isCurrentVersion(minor) && (
                                <div className="absolute -top-10 block -left-8 text-sm text-primary-foreground bg-primary border border-foreground rounded w-28 px-2 py-1">
                                    You are here.
                                </div>
                            )}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {data.majorVersion}.{minor.minorVersion}:{" "}
                                {new Date(minor.releaseDate)
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
