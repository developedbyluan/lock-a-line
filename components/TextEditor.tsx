import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";


export default function TextEditor(props: {
  fileName: string | null;
  toggleEditor: () => void;
}) {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={props.toggleEditor}>
          <X className="w-6 h-6" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Audio to Text for {props.fileName || "Untitled"}
      </p>
      <Textarea
        placeholder="Start writing transcription..."
        className="resize-none flex-grow p-4 text-lg"
      />
    </div>
  );
}
