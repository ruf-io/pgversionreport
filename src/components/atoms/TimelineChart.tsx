import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  data: any;
  min_epoch: number;
  max_duration: number;
  current_version: any;
  showXAxis: boolean;
};

export default function TimelineChart({
  data,
  min_epoch,
  max_duration,
  current_version
}: Props) {

  const isCurrentVersion = (minor) => {
    return (
      current_version.major === data.major_version && current_version.minor === minor.minor_version
    );
  }

  return (
    <div className="h-8 w-full">
      <div
        className="inline-block text-right leading-6 pr-2 h-auto  font-bold"
        style={{
          width: `${
            ((new Date(data.first_release_date).getTime() - min_epoch) /
              max_duration) *
            100
          }%`,
        }}
      >
        {data.major_version}
      </div>

      {data.minor_versions.map((minor, i) => (
        <TooltipProvider >
          <Tooltip>
            <TooltipTrigger
              className={`relative inline-block text-xs text-white overflow-hidden h-auto leading-6 ${isCurrentVersion(minor) ? 'shadow-lg border border-black' : 'opacity-50 hover:opacity-90'} `}
              key={i}
              style={{
                backgroundColor: `hsl(${data.is_eol ? 10 : 150}, ${isCurrentVersion(minor) ?  80 : 
                  50 + (i / data.minor_versions.length) * 20
                }%, ${isCurrentVersion(minor) ?  40 : 70 - (i / data.minor_versions.length) * 30}%)`,
                width: `${
                  i < data.minor_versions.length - 1
                    ? (new Date(
                        data.minor_versions[i + 1].release_date
                      ).getTime() - new Date(minor.release_date).getTime()
                    ) / max_duration * 100 : 2
                }%`,
              }}
            >
              <div className="absolute w-px h-full bg-black opacity-20" />
              <span className="ml-1">.{minor.minor_version}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {data.major_version}.{minor.minor_version}: {new Date(minor.release_date).toISOString().substring(0,10)}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
