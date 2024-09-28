import type data from "@/data/pg_release_data";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type FeatureObject = PromiseResulver<typeof data>["features"][0];

export default function Feature({ feature }: { feature: FeatureObject }) {
    // TODO
    return <></>;
}
