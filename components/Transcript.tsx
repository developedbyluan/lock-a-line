import { type Transcript as TranscriptType } from "@/types/Transcript";
import CustomizedImage from "./CustomizedImage";

export default function Transcript(props: {
  transcriptArray: TranscriptType[] | Partial<TranscriptType>[];
  addToSubtitles: () => void;
  isAudioPlaying: boolean;
}) {
  const lineElements = props.transcriptArray.map((line) => {
    if (Object.keys(line).length !== 7) {
      return (
        <div key={crypto.randomUUID()}>
          <p>{line.text}</p>
        </div>
      );
    }
    return (
      <div key={crypto.randomUUID()}>
        <p>{line.text}</p>
        <p>{line.ipa}</p>
        <p>{line.translation}</p>
        {!(line.imgUrl === "no-imgUrl") && (
          <CustomizedImage
            imgUrl={line.imgUrl}
            altText={line.altText}
            imgCredit={line.imgCredit}
          />
        )}
        <div className="w-2/3 flex justify-between items-center mt-2">
          <p className="inline-block bg-neutral-200 px-2 py-1 rounded-md text-xs text-neutral-800">
            {line.type}
          </p>
        </div>
      </div>
    );
  });
  return <div className="flex flex-col gap-7 p-4">{lineElements}</div>;
}
