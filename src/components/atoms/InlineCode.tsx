type Props = {
    children: React.ReactNode;
};

export default function InlineCode({ children }: Props) {
    return (
        <code className="text-destructive bg-muted-foreground/10 px-1 py-0.5 rounded border border-muted-foreground/20">
            {children}
        </code>
    );
}
