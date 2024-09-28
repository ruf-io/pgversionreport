import type data from "@/data/pg_release_data";

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

    return (
        <li>
            <span className="font-bold">{improvement.title}</span>:
            {" "}{improvement.description} (added in {improvement.sinceVersion}{contributors})
        </li>
    );
}
