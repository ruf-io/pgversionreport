import type data from "@/data/pg_release_data";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type BugObject = PromiseResulver<typeof data>["bugs"][0];

export default function Bug({ bug }: { bug: BugObject }) {
    let contributor: React.ReactNode = "";
    if (bug.contributor) {
        contributor = (
            <span className="font-bold">
                {" "}(contributed by {bug.contributor})
            </span>
        );
    }

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
            <h4 className="font-title text-lg select-all mb-2">{bug.title}</h4>
            <p className="select-none">{bug.description}{contributor}</p>
        </div>
    );
}
