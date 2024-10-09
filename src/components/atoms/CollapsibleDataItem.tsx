import * as React from "react";
import { ChevronsUpDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import MarkdownBlock from "../atoms/MarkdownBlock";

type Props = {
    title: string;
    children: React.ReactNode;
    isMarkdown?: boolean;
};

export function CollapsibleDataItem({
    title,
    children,
    isMarkdown = false,
}: Props) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-2"
        >
            <div className="flex items-center space-x-4 px-4">
                <CollapsibleTrigger>
                    {isMarkdown ? <MarkdownBlock text={title} /> : title}
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="px-4 max-w-prose text-muted-foreground">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}
