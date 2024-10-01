import Markdown from "react-markdown";
type Props = {
    text: string;
};
export default function MarkdownBlock({ text }: Props) {
    return <Markdown>{text}</Markdown>;
}
