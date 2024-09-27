import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UploadAudioFile({
  setAudioFile,
  audioFile,
}: {
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  audioFile: File | null;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("audio")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid audio file",
        variant: "destructive",
      });
      return;
    }
    setAudioFile(file);
    toast({
      title: "Audio File uploaded",
      description: "Next step: generate subtitle",
    });
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <input
        type="file"
        accept="audio/*"
        onChange={handleChange}
        ref={inputRef}
        className="hidden"
        aria-label="Select Audio File"
      />
      <Button onClick={() => inputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        {audioFile ? "Change Audio File" : "Select Audio File"}
      </Button>
      {audioFile && (
        <p className="text-sm text-neutral-600">Uploaded: {audioFile.name}</p>
      )}
    </div>
  );
}
