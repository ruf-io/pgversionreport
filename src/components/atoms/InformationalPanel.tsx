import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    icon: IconDefinition;
    className: string;
    title: string;
    description: string;
};

export default function InformationalPanel({
    icon,
    className,
    title,
    description,
}: Props) {
    return (
        <div className={`${className} border-2 p-2 text-center flex-col`}>
            <div className="text-2xl">
                <FontAwesomeIcon icon={icon} />
            </div>
            <h3 className="text-lg font-bold mt-2">{title}</h3>
            <p>{description}</p>
        </div>
    );
}
