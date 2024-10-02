import Semver from "@/utils/Semver";
import type data from "@/data/pg_release_data";
import TimelineChart from "../atoms/TimelineChart";
import InlineCode from "../atoms/InlineCode";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    sortedVersions,
    eolDates,
    getPgVersionDate,
} from "@/utils/postgresDates";
import { Gift, Skull, Info } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type Data = PromiseResolver<typeof data> & { version: Semver };

export type MinorVersionInfo = {
    minorVersion: number;
    releaseDate: Date;
};

export type VersionData = {
    majorVersion: number;
    firstReleaseDate: Date;
    eolDate: string;
    isEol: boolean;
    minorVersions: MinorVersionInfo[];
};

export default function VersionMapCard({ data }: { data: Data }) {
    const majorVersions: Map<number, VersionData> = new Map();
    let minorVersionsBehind = 0;
    let majorVersionsBehind = 0;
    for (const [semver, date] of sortedVersions) {
        const majorVersionContainer = majorVersions.get(semver.major);
        if (!majorVersionContainer) {
            const eolDate =
                eolDates[String(semver.major) as keyof typeof eolDates];
            majorVersions.set(semver.major, {
                majorVersion: semver.major,
                firstReleaseDate: date,
                eolDate: eolDate ? eolDate : "TBD",
                isEol: eolDate
                    ? new Date(eolDate).getTime() < +new Date()
                    : false,
                minorVersions: [
                    {
                        minorVersion: semver.minor,
                        releaseDate: date,
                    },
                ],
            });
            if (semver.major > data.version.major) {
                majorVersionsBehind++;
            }
        } else {
            majorVersionContainer.minorVersions.push({
                minorVersion: semver.minor,
                releaseDate: date,
            });

            if (
                semver.major === data.version.major &&
                semver.minor > data.version.minor
            ) {
                minorVersionsBehind++;
            }
        }
    }
    const activeMajorVersions = Array.from(majorVersions.values())
        .filter((v) => !v.isEol)
        .sort((a, b) => a.majorVersion - b.majorVersion);

    const minEpoch = new Date(
        activeMajorVersions[0].firstReleaseDate.getFullYear(),
        0,
        1,
    ).getTime();
    const maxDuration =
        new Date(
            activeMajorVersions
                .at(-1)
                .minorVersions.at(-1)
                .releaseDate.getTime() +
                120 * 24 * 60 * 60 * 1000,
        ).getTime() - minEpoch;
    const numYears = maxDuration / (365 * 24 * 60 * 60 * 1000);
    const startYear = new Date(minEpoch).getFullYear();

    const current_version_releaseDate = getPgVersionDate(
        `${data.version.major}.${data.version.minor}`,
    );
    const currentVersionReleaseDateNice =
        current_version_releaseDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    const currentVersionDaysAgo = Math.floor(
        (new Date().getTime() - current_version_releaseDate.getTime()) /
            86400000,
    );

    const currentVersionEolDate = new Date(
        eolDates[String(data.version.major) as keyof typeof eolDates],
    );
    const currentVersionEolDateNice = currentVersionEolDate.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        },
    );
    const currentVersionEolDaysRemaining = Math.floor(
        (currentVersionEolDate.getTime() - new Date().getTime()) / 86400000,
    );

    return (
        <Card className="p-2">
            <CardHeader className="p-4 pb-0">
                <CardTitle>Version Map</CardTitle>
                <CardDescription>
                    You are <InlineCode>{minorVersionsBehind}</InlineCode> minor
                    versions behind and{" "}
                    <InlineCode>{majorVersionsBehind}</InlineCode> major
                    versions behind.
                    <Button variant="link" className="">
                        Learn how to upgrade.
                    </Button>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 p-4">
                <div className="flex-1 grid items-center gap-2">
                    <div className="flex-1 flex items-center gap-2">
                        <Gift className="h-6 w-6 text-muted-foreground" />
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-sm text-muted-foreground">
                                PG {data.version.major}.{data.version.minor}{" "}
                                Release Date
                            </div>
                            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                {currentVersionReleaseDateNice}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <code>{currentVersionDaysAgo}</code> days ago
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                        <Skull className="h-6 w-6 text-muted-foreground" />
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="flex gap-1 items-center text-sm text-muted-foreground">
                                PG {data.version.major} EOL Date
                                <Popover>
                                    <PopoverTrigger>
                                        <div className="hover:bg-muted-foreground/10 p-0.5 rounded">
                                            <Info size={14} />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <p className="text-sm">
                                            Postgres major versions have
                                            approximately 5 years of support.
                                            After that, they are considered End
                                            of Life (EOL).
                                        </p>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                {currentVersionEolDateNice}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                in <code>{currentVersionEolDaysRemaining}</code>{" "}
                                days
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto relative w-full max-w-[80%] xl:block hidden">
                    <div className="h-8 w-full">
                        {[...Array(Math.floor(numYears))].map((e, i) => (
                            <div
                                key={i}
                                className="inline-block"
                                style={{
                                    width: `${(1 / numYears) * 100}%`,
                                }}
                            >
                                <div className="absolute w-px h-full bg-gradient-to-b from-foreground to-background opacity-10" />
                                <span className="pl-2 text-muted-foreground text-sm">
                                    {startYear + i}
                                </span>
                            </div>
                        ))}
                    </div>
                    {activeMajorVersions.map((major, i) => (
                        <TimelineChart
                            key={i}
                            data={major}
                            minEpoch={minEpoch}
                            maxDuration={maxDuration}
                            currentVersion={data.version}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
