import { type Transcript as TranscriptType } from "@/types/Transcript";

export default function Transcript(props: { text: string }) {
  const lineElements = props.text.split("\n\n").map(
    (line, index) => {
      return <div key={index}>{line}</div>;
    }
  );
  return <div>{lineElements}</div>;
}
