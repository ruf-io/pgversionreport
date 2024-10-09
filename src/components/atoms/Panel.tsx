type Props = {
    title: string;
    description?: string;
    children: React.ReactNode;
    size?: "primary" | "secondary";
};

const slug = (title: string) =>
    title.toLowerCase().replace(/\W+/g, " ").trim().replace(/\s+/g, "-");

export default function Panel({
    title,
    description,
    children,
    size = "primary",
}: Props) {
    return (
        <div className="pt-2 pb-6">
            <div className="mb-4 flex flex-col items-start gap-2">
                <h2
                    className={`group text-foreground font-title font-extrabold ${
                        size === "secondary" ? "text-3xl" : "text-4xl"
                    }`}
                >
                    <a href={`#${slug(title)}`} id={slug(title)}>
                        {title}
                        <span className="ml-2 group-hover:visible invisible opacity-50">
                            #
                        </span>
                    </a>
                </h2>
                {description && (
                    <p className="text-muted-foreground">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}
