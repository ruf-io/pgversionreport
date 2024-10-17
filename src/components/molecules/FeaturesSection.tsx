import data from "@/data/pg_release_data";
import Panel from "../atoms/Panel";
import { FeaturesDataTable } from "./FeaturesDataTable";
import { Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Semver from "@/utils/Semver";

type PromiseResolver<T> = T extends Promise<infer U> ? U : never;
type Features = PromiseResolver<typeof data>["features"];
type Props = {
    features: Features;
    version: Semver;
};

export default function FeaturesSection({ features, version }: Props) {
    return (
        <div className="relative mt-8">
            <div className="flex items-center mt-4 gap-2">
                <Siren className="h-6 w-6 text-foreground" />
                <Badge variant="secondary">{features.length} Features</Badge>
            </div>
            <Panel
                title={`Features`}
                description={
                    features.length > 0
                        ? `Contributors added ${features.length} new features to Postgres after ${version.major}.${version.minor}`
                        : "Your version is not missing out on any new features!"
                }
                size="secondary"
            >
                {features.length > 0 && (
                    <FeaturesDataTable data={features} version={version} />
                )}
            </Panel>
        </div>
    );
}
