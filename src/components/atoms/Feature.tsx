import type data from "@/data/pg_release_data";
import { generatePgDeepLink } from "@/utils/pgDeepLinks";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type FeatureObject = PromiseResulver<typeof data>["features"][0];

export default function Feature({ feature }: { feature: FeatureObject }) {
    let contributors: React.ReactNode = "";
    if (feature.contributors.length > 0) {
        contributors = (
            <span className="font-bold">
                {" "}(contributed by {feature.contributors.map((contributor, i) => (<span key={i}>{contributor}</span>))})
            </span>
        );
    }

    const deepLink = generatePgDeepLink(feature.sinceVersion, feature.title);

    return (
        <div className="p-2 text-center border-2 border-code-green-1 max-w-64">
            <h3 className="mb-2 text-xl select-all font-title">
                <a href={deepLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {feature.title}
                </a>
            </h3>
            <p className="select-none">{feature.description}{contributors}</p>
        </div>
    );
}
