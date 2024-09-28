type Props = {
    title: string;
    description: string;
    children: React.ReactNode;
};

export default function Panel({ title, description, children }: Props) {
    return (
        <div className="font-title select-none p-2 my-2">
            <div className="mb-4">
                <h2 className="font-bold">{title}</h2>
                <p>
                    {description}
                </p>
            </div>
            {children}
        </div>
    );
}
