import { Badge } from "@/components/ui/badge"

type Props = {
    title: string;
    description: string;
    children: React.ReactNode;
};

export default function Panel({ title, description, children }: Props) {
    return (
        <div className="my-4">
            <div className="mb-4 flex flex-col items-start gap-2">
                <h2 className="font-title font-extrabold text-4xl">{title}</h2>
                <p>
                    {description}
                </p>
            </div>
            {children}
        </div>
    );
}
