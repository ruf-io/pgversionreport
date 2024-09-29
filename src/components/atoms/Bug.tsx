import type data from "@/data/pg_release_data";
import { getPgVersionDate } from "@/utils/postgresDates";
import { generatePgDeepLink } from "@/utils/pgDeepLinks";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type Bug = PromiseResulver<typeof data>["bugs"][0];

export default function Bug({ bug }: { bug: Bug }) {
    let contributors: React.ReactNode = "";
    if (bug.contributors.length > 0) {
        contributors = (
            <span className="font-bold">
                {" "}(contributed by {bug.contributors.map((contributor, i) => (<span key={i}>{contributor}</span>))}
            </span>
        );
    }

    const date = getPgVersionDate(bug.fixedIn);
    const fixed = `Fixed on ${date.toLocaleDateString()}`;
    const deepLink = generatePgDeepLink(bug.fixedIn, bug.title);

    return (
        <div className="p-2 text-center border-2 border-code-red-1 max-w-64">
            {
                bug.cve && (
                    <h3 className="mb-2 text-xl select-all font-title">
                        <a href={`https://www.cve.org/CVERecord?id=${encodeURIComponent(bug.cve)}`} target="_blank" rel="noopener noreferrer">
                            {bug.cve}
                        </a>
                    </h3>
                )
            }
            <h4 className="mb-2 text-lg select-all font-title">
                <a href={deepLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {bug.title}
                </a>
                {" "}({fixed})
            </h4>
            <p className="select-none">{bug.description}{contributors}</p>
        </div>
    );
}
