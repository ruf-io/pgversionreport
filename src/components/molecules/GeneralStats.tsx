import Semver from "@/utils/Semver";
import type data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import Alert from "../atoms/Alert";
import OverviewStats from "./OverviewStats";
import TimelineChart from "../atoms/TimelineChart";
import {
  sortedVersions,
  getPgVersionDate,
  eolDates,
} from "@/utils/postgresDates";
import humanizeDuration from "humanize-duration";
import {
  Siren,
  Bug,
  CircleGauge,
  CircleFadingArrowUp
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type Data = PromiseResulver<typeof data> & { version: Semver };

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
  const major_versions = {};
  for (const [semver, date] of sortedVersions) {
    if (!major_versions[semver.major]) {
      major_versions[semver.major] = {
        major_version: semver.major,
        first_release_date: date,
        eol_date: eolDates[semver.major] ? eolDates[semver.major] : "TBD",
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
    } else {
      major_versions[semver.major].minor_versions.push({
        minor_version: semver.minor,
        release_date: date,
      });
    }
  }
  const active_major_versions = Object.values(major_versions)
    .filter((v) => !v.is_eol)
    .sort((a, b) => a.major_version - b.major_version);

  const min_epoch = new Date(
    active_major_versions[0].first_release_date.getFullYear(),
    0,
    1
  ).getTime();
  const max_duration =
      new Date(active_major_versions
        .at(-1)
        .minor_versions.at(-1)
        .release_date.getTime() + (120 * 24 * 60 * 60 * 1000)).getTime() - min_epoch;
  const num_years = max_duration / (365 * 24 * 60 * 60 * 1000);
  const start_year = new Date(min_epoch).getFullYear();

  return (
    <Panel
      title={`Postgres ${data.version.major}.${data.version.minor} Version Report`}
      description="Here are the general stats for this version."
    >
      <div className="flex flex-col gap-4">
      <OverviewStats data={data} />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Version Timeline</CardTitle>
          <Siren className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
        <div className="relative">
        <div className="h-8 w-full">
          {[...Array(Math.floor(num_years))].map((e, i) => (
            <div
              key={i}
              className="inline-block"
              style={{
                width: `${(1 / num_years) * 100}%`,
              }}
            >
              <div className="absolute w-px h-full bg-black opacity-20" />
              {start_year + i}
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
      <DataHeader version={data.version} />
      </div>
    </Panel>
  );
}
