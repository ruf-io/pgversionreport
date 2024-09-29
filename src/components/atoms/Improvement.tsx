import type data from "@/data/pg_release_data";
import { generatePgDeepLink } from "@/utils/pgDeepLinks";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type Improvement = PromiseResulver<typeof data>["performanceImprovements"][0];

export default function Improvement({ improvement }: { improvement: Improvement }) {
    let contributors: React.ReactNode = "";
    if (improvement.contributors.length > 0) {
        contributors = (
            <>
                ,{" "}<span className="font-bold">
                contributed by {improvement.contributors.map((contributor, i) => (<span key={i}>{contributor}</span>))}
                </span>
            </>
        );
    }

    const deepLink = generatePgDeepLink(improvement.sinceVersion, improvement.title);

    return (
        <li>
            <a href={deepLink} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">
                {improvement.title}
            </a>:
            {" "}{improvement.description} (added in {improvement.sinceVersion}{contributors})
        </li>
    );
}
