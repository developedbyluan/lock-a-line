import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";


export default function TextEditor(props: {
  toggleEditor: () => void;
  text: string;
  setText: (text: string) => void;
}) {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={props.toggleEditor}>
          <X className="w-6 h-6" />
        </Button>
      </div>
      <Textarea
        placeholder="Start writing transcription..."
        className="resize-none flex-grow p-4 text-lg"
        value={props.text}
        onChange={(e) => props.setText(e.target.value)}
      />
    </div>
  );
}
