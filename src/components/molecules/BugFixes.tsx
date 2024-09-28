import type data from "@/data/pg_release_data";

type PromiseResulver<T> = T extends Promise<infer U> ? U : never;
type BugFixes = PromiseResulver<typeof data>["bugs"];

export default function BugFixes({ bugs }: { bugs: BugFixes }) {
    return null;
}
