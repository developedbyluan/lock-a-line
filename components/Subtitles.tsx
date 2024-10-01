import type { Transcript as TranscriptType } from "@/types/Transcript";
import React from "react";
import CustomizedImage from "./CustomizedImage";

export default function Subtitles(props: {
  subtitlesArray: TranscriptType[] | Partial<TranscriptType>[];
  timestampsArray: number[];
}) {
  const lastElementRef = React.useRef<HTMLElement | null>(null);

  const subtitlesElements = props.subtitlesArray.map((line, index) => {
    const callbackRef = (e: HTMLDivElement) => {
      if (index === props.subtitlesArray.length - 1) {
        lastElementRef.current = e;
      }
    };
    if (Object.keys(line).length !== 7) {
      return (
        <div key={crypto.randomUUID()} ref={callbackRef}>
          <p>{index + 1}</p>
          <p>{line.text}</p>
        </div>
      );
    }
    return (
      <div key={crypto.randomUUID()} ref={callbackRef}>
        <p>{index + 1}</p>
        <p>
          {props.timestampsArray?.[index - 1] || 0} {"-->"}{" "}
          {props.timestampsArray?.[index]}
        </p>
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

  React.useEffect(() => {
    lastElementRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [props.subtitlesArray]);
  return (
    <div className="flex flex-col gap-7 bg-neutral-50 p-4">
      {subtitlesElements}
    </div>
  );
}
