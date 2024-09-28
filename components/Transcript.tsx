import { type Transcript as TranscriptType } from "@/types/Transcript";

export default function Transcript(props: {
  transcriptArray: TranscriptType[] | Partial<TranscriptType>[];
}) {
  const lineElements = props.transcriptArray.map((line) => {
    return <div key={crypto.randomUUID()}>{line.text}</div>;
  });
  return <div>{lineElements}</div>;
}
