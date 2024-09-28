import type data from "@/data/pg_release_data";
import { getPgVersionDate } from "@/utils/postgresDates";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type Bug = PromiseResulver<typeof data>["bugs"][0];

export default function Bug({ bug }: { bug: Bug }) {
    let contributors: React.ReactNode = "";
    if (bug.contributors) {
        contributors = (
            <span className="font-bold">
                {" "}(contributed by {bug.contributors.map((contributor, i) => (<span key={i}>{contributor}</span>))}
            </span>
        );
    }

    const date = getPgVersionDate(bug.fixedIn);
    const fixed = `Fixed on ${date.toLocaleDateString()}`;

    return (
        <div className="border-2 border-code-red-1 p-2 text-center max-w-64">
            {
                bug.cve && (
                    <h3 className="font-title text-xl select-all mb-2">
                        <a href={`https://www.cve.org/CVERecord?id=${encodeURIComponent(bug.cve)}`} target="_blank" rel="noopener noreferrer">
                            {bug.cve}
                        </a>
                    </h3>
                )
            }
            <h4 className="font-title text-lg select-all mb-2">{bug.title} ({fixed})</h4>
            <p className="select-none">{bug.description}{contributors}</p>
        </div>
    );
}
