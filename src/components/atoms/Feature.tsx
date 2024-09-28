import type data from "@/data/pg_release_data";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type FeatureObject = PromiseResulver<typeof data>["features"][0];

export default function Feature({ feature }: { feature: FeatureObject }) {
    let contributors: React.ReactNode = "";
    if (feature.contributors) {
        contributors = (
            <span className="font-bold">
                {" "}(contributed by {feature.contributors.map((contributor, i) => (<span key={i}>{contributor}</span>))}
            </span>
        );
    }

    return (
        <div className="border-2 border-code-green-1 p-2 text-center max-w-64">
            <h3 className="font-title text-xl select-all mb-2">{feature.title}</h3>
            <p className="select-none">{feature.description}{contributors}</p>
        </div>
    );
}
