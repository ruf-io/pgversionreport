import Semver from "@/utils/Semver";
import type data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import Alert from "../atoms/Alert";
import OverviewStats from "./OverviewStats";
import { sortedVersions, getPgVersionDate } from "@/utils/postgresDates";
import humanizeDuration from "humanize-duration";
import VersionMapCard from "./VersionMapCard";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type Data = PromiseResolver<typeof data> & { version: Semver };

function UpToDate({ chunk }: { chunk: string }) {
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
        You are using the latest version of PostgreSQL, which is going to be
        supported for another {chunk}. Are you getting frustrated with manually
        patching your PostgreSQL instance?{" "}
        <a href="https://neon.tech" className="hover:underline">
          Neon makes it easy to be on the latest version of PostgreSQL and
          manages your instance for you!
        </a>
      </p>
    </div>
  );
}

function DataHeader({ version }: { version: Semver }) {
  // Handle if the version is not found.
  let date: Date;
  try {
    date = getPgVersionDate(`${version.major}.${version.minor}`);
  } catch {
    return null;
  }

  // Figure out if the version is still supported.
  const now = new Date();
  const endOfLife = new Date(date);
  endOfLife.setFullYear(date.getFullYear() + 5);
  const isSupported = endOfLife.valueOf() > now.valueOf();
  if (!isSupported) {
    // Throw up a alert if the version is not supported.
    return (
      <div className="mb-4">
        <Alert isError={true}>
          <p>
            PostgreSQL {version.major}.{version.minor} is no longer supported.
            <strong className="font-bold">
              {" "}
              This means unless you are using a commercially supported Postgres
              build, your version will not recieve security updates!
            </strong>{" "}
            <a href="https://neon.tech" className="hover:underline">
              Neon makes it easy to be on the latest version of PostgreSQL!
            </a>
          </p>
        </Alert>
      </div>
    );
  }

  // Calculate the duration chunk.
  const chunk = humanizeDuration(endOfLife.valueOf() - now.valueOf(), {
    round: true,
    conjunction: " and ",
    units: ["y", "mo", "w", "d"],
  });

  // Figure out if this is the newest version.
  if (
    sortedVersions.at(-1)[0].major === version.major &&
    sortedVersions.at(-1)[0].minor === version.minor
  ) {
    return <UpToDate chunk={chunk} />;
  }

  // Return the supported alert.
  return (
    <div className="mb-4">
      <Alert isError={false}>
        <p>
          PostgreSQL {version.major}.{version.minor} will be supported for
          another <strong className="font-bold">{chunk}</strong>. You will not,
          however, get all the latest features until you upgrade to the latest
          version.{" "}
          <a href="https://neon.tech" className="hover:underline">
            Neon makes it easy to be on the latest version of PostgreSQL!
          </a>
        </p>
      </Alert>
    </div>
  );
}

export default function GeneralStats({ data }: { data: Data }) {
  return (
    <Panel
      title={`Postgres ${data.version.major}.${data.version.minor} Version Report`}
    >
      <div className="flex flex-col gap-8 pt-2">
        <OverviewStats data={data} />
        <VersionMapCard data={data} />
      </div>
    </Panel>
  );
}
