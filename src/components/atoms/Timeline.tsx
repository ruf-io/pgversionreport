import { useEffect, useRef } from "react";
import type { DataItemCollectionType } from "vis-timeline/standalone";

type Props = {
    items: DataItemCollectionType;
    groups: string[];
};

export default function Timeline({ items, groups }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    // Import the library async since it is quite large.
    useEffect(() => {
        if (!ref.current) return;
        let done = false;
        let cleanup = () => { done = true; };
        import("vis-timeline/standalone").then(({ Timeline }) => {
            if (done) return;
            const timeline = new Timeline(ref.current, items, {
                editable: false,
                groupEditable: false,
                height: "16rem",
            });
            timeline.setGroups(groups.map(
                (name, index) => ({ id: index, content: name, order: index })
            ));
            cleanup = () => {
                timeline.destroy();
            };
        });
        return () => cleanup();
    }, [items, groups]);

    // Avoid content shift by having a fixed size.
    return (
        <div ref={ref} className="h-64" />
    );
}
