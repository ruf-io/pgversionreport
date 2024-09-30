import type data from "@/data/pg_release_data";
import Semver from "@/utils/Semver";
import { Siren, Bug, CircleGauge, CircleFadingArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type Data = PromiseResolver<typeof data> & { version: Semver };

export default function OverviewStats({ data }: { data: Data }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">
                        Security
                    </CardTitle>
                    <Siren className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{data.cves.length}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        CVEs fixed after {data.version.major}.
                        {data.version.minor}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Bugs</CardTitle>
                    <Bug className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{data.bugs.length}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        bugs fixed after {data.version.major}.
                        {data.version.minor}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">
                        Performance
                    </CardTitle>
                    <CircleGauge className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                        {data.performanceImprovements.length}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        improvements after {data.version.major}.
                        {data.version.minor}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">
                        Features
                    </CardTitle>
                    <CircleFadingArrowUp className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                        {data.features.length}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        new features after {data.version.major}.
                        {data.version.minor}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
