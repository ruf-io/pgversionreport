import type data from "@/data/pg_release_data";
import { getPgVersionDate } from "@/utils/postgresDates";
import { generatePgDeepLink } from "@/utils/pgDeepLinks";
import { Badge } from "@/components/ui/badge";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type Bug = PromiseResolver<typeof data>["bugs"][0];

export default function Bug({ bug }: { bug: Bug }) {
    let contributors: React.ReactNode = "";
    if (bug.contributors.length > 0) {
        contributors = (
            <span className="font-bold">
                {" "}
                (contributed by{" "}
                {bug.contributors.map((contributor, i) => (
                    <span key={i}>{contributor}</span>
                ))}
            </span>
        );
    }

    const date = getPgVersionDate(bug.fixedIn);
    const fixed = `Fixed on ${date.toLocaleDateString()}`;
    const deepLink = generatePgDeepLink(bug.fixedIn, bug.title);

    return (
        <div className="">
            {bug.cve && (
                <Badge variant="secondary">
                    <a
                        href={`https://www.cve.org/CVERecord?id=${encodeURIComponent(bug.cve)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {bug.cve}
                    </a>
                </Badge>
            )}
            <h2 className="mb-2 text-lg font-bold font-title">
                <a
                    href={deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    {bug.title}
                </a>{" "}
                ({fixed})
            </h2>
            <p className="">
                {bug.description}
                {contributors}
            </p>
        </div>
    );
}
