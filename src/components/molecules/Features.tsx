import type data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import Collapsable from "../atoms/Collapsable";
import Feature from "../atoms/Feature";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type Features = PromiseResolver<typeof data>["features"];

export default function Features({ features }: { features: Features }) {
    // Filter out significant and insignificant features. We want to emphasize significant features.
    const significantFeatures = features
        .filter((feature) => feature.significant)
        .map((feature, i) => {
            return <Feature key={i} feature={feature} />;
        });
    const insignificantFeatures = features
        .filter((feature) => !feature.significant)
        .map((feature, i) => {
            return <Feature key={i} feature={feature} />;
        });

    return (
        <Panel
            title="Features"
            description="Here are the features that are not in your Postgres version."
        >
            <Collapsable
                collapseText="Hide smaller features"
                expandText="Show smaller features"
                collapsedValues={insignificantFeatures}
                initialValues={significantFeatures}
            />
        </Panel>
    );
}
