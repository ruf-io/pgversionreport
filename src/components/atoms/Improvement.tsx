import type data from "@/data/pg_release_data";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type Improvement = PromiseResulver<typeof data>["performanceImprovements"][0];

export default function Improvement({ improvement }: { improvement: Improvement }) {
    let contributor: React.ReactNode = "";
    if (improvement.contributor) {
        contributor = (
            <>
                ,{" "}<span className="font-bold">
                    contributed by {improvement.contributor}
                </span>
            </>
        );
    }

    return (
        <li>
            <span className="font-bold">{improvement.title}</span>:
            {" "}{improvement.description} (added in {improvement.sinceVersion}{contributor})
        </li>
    );
}
