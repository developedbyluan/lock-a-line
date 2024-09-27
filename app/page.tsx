"use client";

import React from "react";
import { UploadAudioFile } from "@/components/UploadAudioFile";
import { cn } from "@/lib/utils";
import TextEditor from "@/components/TextEditor";

export default function HomePage() {
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [isEditorVisible, setIsEditorVisible] = React.useState(false);
  const fileName = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (audioFile) {
      toggleEditor();
      fileName.current = audioFile.name;
    }
  }, [audioFile]);

  function toggleEditor() {
    setIsEditorVisible((prev) => !prev);
  }

  function formatFileName(fileName: string) {
    return fileName.toLowerCase().split(".")[0].replaceAll(" ", "-");
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
        <TextEditor fileName={formatFileName(fileName.current || "Untitled")} toggleEditor={toggleEditor} />
      </div>
    </div>

  );
}
