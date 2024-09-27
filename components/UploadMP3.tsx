import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function UploadMP3({
  setMP3,
  mp3,
}: {
  setMP3: React.Dispatch<React.SetStateAction<File | null>>;
  mp3: File | null;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "audio/mpeg") {
      alert("Please upload a valid MP3 file");
      return;
    }
    setMP3(file);
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <input
        type="file"
        accept="audio/mp3"
        onChange={handleChange}
        ref={inputRef}
        className="hidden"
        aria-label="Select MP3 File"
      />
      <Button onClick={() => inputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        {mp3 ? "Change File" : "Select MP3"}
      </Button>
      {mp3 && (
        <p className="text-sm text-neutral-600">Uploaded: {mp3.name}</p>
      )}
    </div>
  );
}