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

export default function VersionMapCard({ data }: { data: Data }) {
    const major_versions = {};
    let minor_versions_behind = 0;
    let major_versions_behind = 0;
    for (const [semver, date] of sortedVersions) {
        if (!major_versions[semver.major]) {
            major_versions[semver.major] = {
                major_version: semver.major,
                first_release_date: date,
                eol_date: eolDates[semver.major]
                    ? eolDates[semver.major]
                    : "TBD",
                is_eol: eolDates[semver.major]
                    ? new Date(eolDates[semver.major]).getTime() < +new Date()
                    : false,
                minor_versions: [
                    {
                        minor_version: semver.minor,
                        release_date: date,
                    },
                ],
            };
            if (semver.major > data.version.major) {
                major_versions_behind++;
            }
        } else {
            major_versions[semver.major].minor_versions.push({
                minor_version: semver.minor,
                release_date: date,
            });

            if (
                semver.major === data.version.major &&
                semver.minor > data.version.minor
            ) {
                minor_versions_behind++;
            }
        }
    }
    const active_major_versions = Object.values(major_versions)
        .filter((v) => !v.is_eol)
        .sort((a, b) => a.major_version - b.major_version);

    const min_epoch = new Date(
        active_major_versions[0].first_release_date.getFullYear(),
        0,
        1,
    ).getTime();
    const max_duration =
        new Date(
            active_major_versions
                .at(-1)
                .minor_versions.at(-1)
                .release_date.getTime() +
                120 * 24 * 60 * 60 * 1000,
        ).getTime() - min_epoch;
    const num_years = max_duration / (365 * 24 * 60 * 60 * 1000);
    const start_year = new Date(min_epoch).getFullYear();

    const current_version_release_date = getPgVersionDate(
        `${data.version.major}.${data.version.minor}`,
    );
    const current_version_release_date_nice =
        current_version_release_date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    const current_version_release_days_ago = Math.floor(
        (new Date().getTime() - current_version_release_date.getTime()) /
            86400000,
    );

    const current_version_eol_date = new Date(eolDates[data.version.major]);
    const current_version_eol_date_nice =
        current_version_eol_date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    const current_version_eol_days_remaining = Math.floor(
        (current_version_eol_date.getTime() - new Date().getTime()) / 86400000,
    );

    return (
        <Card className="p-2">
            <CardHeader className="p-4 pb-0">
                <CardTitle>Version Map</CardTitle>
                <CardDescription>
                    You are <InlineCode>{minor_versions_behind}</InlineCode>{" "}
                    minor versions behind and{" "}
                    <InlineCode>{major_versions_behind}</InlineCode> major
                    versions behind.
                    <Button variant="link" href="#" className="">
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
                                {current_version_release_date_nice}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <code>{current_version_release_days_ago}</code>{" "}
                                days ago
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
                                {current_version_eol_date_nice}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                in{" "}
                                <code>
                                    {current_version_eol_days_remaining}
                                </code>{" "}
                                days
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto relative w-full max-w-[80%]">
                    <div className="h-8 w-full">
                        {[...Array(Math.floor(num_years))].map((e, i) => (
                            <div
                                key={i}
                                className="inline-block"
                                style={{
                                    width: `${(1 / num_years) * 100}%`,
                                }}
                            >
                                <div className="absolute w-px h-full bg-gradient-to-b from-foreground to-background opacity-10" />
                                <span className="pl-2 text-muted-foreground text-sm">
                                    {start_year + i}
                                </span>
                            </div>
                        ))}
                    </div>
                    {active_major_versions.map((major, i) => (
                        <TimelineChart
                            key={i}
                            data={major}
                            min_epoch={min_epoch}
                            max_duration={max_duration}
                            current_version={data.version}
                            showXAxis={i === active_major_versions.length - 1}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
