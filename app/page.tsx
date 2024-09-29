"use client";

import React from "react";
import { UploadAudioFile } from "@/components/UploadAudioFile";
import { cn } from "@/lib/utils";
import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import Transcript from "@/components/Transcript";
import { type Transcript as TranscriptType } from "@/types/Transcript";

export default function HomePage() {
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [isEditorVisible, setIsEditorVisible] = React.useState(false);
  const [text, setText] = React.useState("");
  const [transcriptArray, setTranscriptArray] = React.useState<TranscriptType[] | Partial<TranscriptType>[]>([]);

  const fileName = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (audioFile) {
      toggleEditor();
      fileName.current = audioFile.name;
    }
  }, [audioFile]);

  //TODO: Load audio file => Create new text in local storage if no local text is found
  // otherwise, load the local text to the editor (setText)
  React.useEffect(() => {
    if (!fileName.current) return;
    const localText = localStorage.getItem((`${formatFileName(fileName.current)}--src`))
    if (!localText) {
      console.log("No local text found");
      localStorage.setItem(`${formatFileName(fileName.current)}--src`, "");
      return;
    };
    setText(localText);
  }, [audioFile])

  //TODO: Save text to local storage every time (the state) text changes
  React.useEffect(() => {
    if (!fileName.current) return;
    localStorage.setItem(`${formatFileName(fileName.current)}--src`, text);
  }, [text]);

  function toggleEditor() {
    setIsEditorVisible((prev) => !prev);
  }

  function formatFileName(fileName: string) {
    return fileName.toLowerCase().split(".")[0].replaceAll(" ", "-");
  }

  function formatText() {
    const lines = text.split("\n");
    const formattedLines = lines.reduce((acc: string[], line: string) => {
      if (line.trim() === "") {
        return [...acc];
      }
      return [...acc, line];
    }, []);
    setText(formattedLines.join("\n\n"));
  }

  function toggleLogTimestamps() {
    setIsEditorVisible(false);
  }

  function textToTranscriptArray(text: string): TranscriptType[] | Partial<TranscriptType>[] {
    const lineObjectsArray = text.split("\n\n").map((line) => {
      const parts = line.split("---");

      if (parts.length !== 5) {
        const [text] = parts;
        return {text: text.trim()};
      }

      const [text, ipa, translation, imgUrlandAlt, type ] = parts;
      const [imgUrl, altText, imgCredit] = imgUrlandAlt.split("|");
      return {
        text: text.trim(),
        ipa: ipa.trim(),
        translation: translation.trim(),
        imgUrl: imgUrl.trim(),
        altText: altText.trim(),
        imgCredit: imgCredit.trim(),
        type: type.trim(),
      };
    });

    return lineObjectsArray;
  }

  function editTranscript() {
    setIsEditorVisible(true);
  }

  function addToSubtitles() {
  }

  return (
    <div className="w-full">
      {!isEditorVisible ? (
        <UploadAudioFile setAudioFile={setAudioFile} audioFile={audioFile} />
      ) : null}
      <div
        id="text-editor"
        className={cn(
          "fixed bg-background inset-0 transition-transform duration-300 ease-in-out z-50",
          isEditorVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="absolute top-4 right-4 flex gap-4">
          <Button
            onClick={() => formatText()}
            disabled={!text}
            variant="secondary"
          >
            Format Text
          </Button>
          <Button onClick={toggleLogTimestamps}>Log Timestamps</Button>
        </div>
        <TextEditor text={text} setText={setText} toggleEditor={toggleEditor} />
        <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center text-xs text-muted-foreground">
          Transcription for {fileName.current || "Untitled"}
        </p>
      </div>
      <div className="fixed bg-red-200/50 h-1/2 top-1/2 -translate-y-1/2 p-4 right-4 flex flex-col justify-between">
        <Button>Placeholder</Button>
        <Button onClick={editTranscript}>Edit transcript</Button>
      </div>
      <Transcript transcriptArray={textToTranscriptArray(text)} />
    </div>
  );
}
