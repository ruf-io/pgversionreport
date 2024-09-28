import type data from "@/data/pg_release_data";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type FeatureObject = PromiseResulver<typeof data>["features"][0];

export default function Feature({ feature }: { feature: FeatureObject }) {
    let contributor: React.ReactNode = "";
    if (feature.contributor) {
        contributor = (
            <span className="font-bold">
                {" "}(contributed by {feature.contributor})
            </span>
        );
    }

    return (
        <div className="border-2 border-code-green-1 p-2 text-center max-w-64">
            <h3 className="font-title text-xl select-all mb-2">{feature.title}</h3>
            <p className="select-none">{feature.description}{contributor}</p>
        </div>
    );
}
