"use client";

import React from "react";
import { UploadAudioFile } from "@/components/UploadAudioFile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
      <UploadAudioFile setAudioFile={setAudioFile} audioFile={audioFile} />
      <div
        id="text-editor"
        className={cn(
          "fixed bg-red-200 inset-0 opacity-50 transition-transform duration-300 ease-in-out",
          isEditorVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="w-full h-full flex flex-col p-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={toggleEditor}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
