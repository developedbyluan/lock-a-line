"use client";

import React from "react";
import { UploadMP3 } from "@/components/UploadMP3";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [mp3, setMP3] = React.useState<File | null>(null);
  const [isEditorVisible, setIsEditorVisible] = React.useState(false);

  React.useEffect(() => {
    if (mp3) {
      toggleEditor();
    }
  }, [mp3]);

  function toggleEditor() {
    setIsEditorVisible(prev => !prev);
  }

  return (
    <div className="w-full">
      <UploadMP3 setMP3={setMP3} mp3={mp3} />
      <div
        id="text-editor" 
        className={cn("fixed bg-red-200 inset-0 opacity-50", isEditorVisible ? "translate-y-0" : "translate-y-full")}
      >
        <div className="w-full h-full flex flex-col p-4">

        </div>

      </div>
    </div>
  );
}
