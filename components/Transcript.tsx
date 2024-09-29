import Image from "next/image";
import { Button } from "@/components/ui/button";

import { type Transcript as TranscriptType } from "@/types/Transcript";

export default function Transcript(props: {
  transcriptArray: TranscriptType[] | Partial<TranscriptType>[];
  addToSubtitles: () => void;
  isAudioPlaying: boolean;
}) {
  const lineElements = props.transcriptArray.map((line, index) => {

    if (Object.keys(line).length !== 7) {
      return (
        <div key={crypto.randomUUID()}>
          <p>{line.text}</p>
          {index === 0 && line.text !== "" ? <Button onClick={() => props.addToSubtitles()}>{ props.isAudioPlaying ? "Log" : "Play"}</Button> : null}
        </div>
      );
    }
    return (
      <div key={crypto.randomUUID()}>
        <p>{line.text}</p>
        <p>{line.ipa}</p>
        <p>{line.translation}</p>
        {!(line.imgUrl === "no-imgUrl") && (
          <div>
            <Image
              src={`/images/${line.imgUrl}`}
              alt={line.altText || ""}
              width={0}
              height={0}
              className="w-1/4 h-auto"
            />
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-bold">Credit: </span> {line.imgCredit}
            </p>
          </div>
        )}
        <div className="w-2/3 flex justify-between items-center mt-2">
          <p className="inline-block bg-neutral-200 px-2 py-1 rounded-md text-xs text-neutral-800">
            {line.type}
          </p>
          {index === 0 ? <Button onClick={() => props.addToSubtitles()}>{ props.isAudioPlaying ? "Log" : "Play"}</Button> : null}
        </div>
      </div>
    );
  });
  return <div className="flex flex-col gap-7 p-4">{lineElements}</div>;
}
