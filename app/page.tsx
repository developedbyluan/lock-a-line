"use client";

import React from "react";
import { UploadAudioFile } from "@/components/UploadAudioFile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

export default function HomePage() {
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [isEditorVisible, setIsEditorVisible] = React.useState(false);

  React.useEffect(() => {
    if (audioFile) {
      toggleEditor();
    }
  }, [audioFile]);

  function toggleEditor() {
    setIsEditorVisible((prev) => !prev);
  }

  return (
    <div className="w-full">
      {!isEditorVisible ? (
        <UploadAudioFile setAudioFile={setAudioFile} audioFile={audioFile} />
      ) : null}
      <div
        id="text-editor"
        className={cn(
          "fixed bg-background inset-0 transition-transform duration-300 ease-in-out",
          isEditorVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="w-full h-full flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" onClick={toggleEditor}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <Textarea
            placeholder="Start writing subtitles..."
            className="resize-none flex-grow p-4 text-lg"
          />
        </div>
      </div>
    </div>
  );
}
