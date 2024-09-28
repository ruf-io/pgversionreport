import type data from "@/data/pg_release_data";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type Features = PromiseResulver<typeof data>["features"];

export default function Features({ features }: { features: Features }) {
    return null;
}
