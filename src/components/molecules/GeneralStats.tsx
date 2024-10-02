import Semver from "@/utils/Semver";
import type data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import OverviewStats from "./OverviewStats";
import VersionMapCard from "./VersionMapCard";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type Data = PromiseResolver<typeof data> & { version: Semver };

function UpToDate() {
    return (
        <div className="mb-6">
            <img
                src="/images/funny_elephant.png"
                aria-hidden={true}
                className="mx-auto h-52 mt-4"
                loading="lazy"
            />
            <h2 className="text-2xl font-bold text-center mt-4">
                You are up to date!
            </h2>
            <p className="text-center">
                You are using the latest version of PostgreSQL. Are you getting
                frustrated with manually patching your PostgreSQL instance?{" "}
                <a href="https://neon.tech" className="hover:underline">
                    Neon makes it easy to be on the latest version of PostgreSQL
                    and manages your instance for you!
                </a>
            </p>
        </div>
    );
}

export default function GeneralStats({
    data,
    latest,
}: {
    data: Data;
    latest: boolean;
}) {
    return (
        <Panel
            title={`Postgres ${data.version.major}.${data.version.minor} Version Report`}
        >
            <div className="flex flex-col gap-8 pt-2">
                {latest ? <UpToDate /> : <OverviewStats data={data} />}
                <VersionMapCard data={data} />
            </div>
        </Panel>
    );
}
