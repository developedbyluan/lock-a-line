"use client";

import React from "react";
import { UploadAudioFile } from "@/components/UploadAudioFile";
import { cn } from "@/lib/utils";
import TextEditor from "@/components/TextEditor";
import Subtitles from "@/components/Subtitles";
import { Button } from "@/components/ui/button";
import Transcript from "@/components/Transcript";
import AudioPlayer from "@/components/AudioPlayer";
import { type Transcript as TranscriptType } from "@/types/Transcript";

export default function HomePage() {
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [isEditorVisible, setIsEditorVisible] = React.useState(false);
  const [text, setText] = React.useState("");
  const [transcriptArray, setTranscriptArray] = React.useState<
    TranscriptType[] | Partial<TranscriptType>[]
  >([]);
  const [subtitlesArray, setSubtitlesArray] = React.useState<
    TranscriptType[] | Partial<TranscriptType>[]
  >([]);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const fileName = React.useRef<string | null>(null);

  //TODO: Load audio file => Create new text in local storage if no local text is found
  // otherwise, load the local text to the editor (setText)
  React.useEffect(() => {
    if (!fileName.current) return;
    const localText = localStorage.getItem(
      `${formatFileName(fileName.current)}--src`
    );
    if (!localText) {
      console.log("No local text found");
      localStorage.setItem(`${formatFileName(fileName.current)}--src`, "");
      return;
    }
    setText(localText);
  }, [audioFile]);

  //TODO: Save text to local storage every time (the state) text changes
  React.useEffect(() => {
    if (!fileName.current) return;
    localStorage.setItem(`${formatFileName(fileName.current)}--src`, text);
  }, [text]);

  React.useEffect(() => {
    if (!fileName.current) return;
    localStorage.setItem(
      `${formatFileName(fileName.current)}--subtitles`,
      JSON.stringify(subtitlesArray)
    );
  }, [subtitlesArray]);

  React.useEffect(() => {
    if (!audioFile) return;

    toggleEditor();
    fileName.current = audioFile.name;

    setAudioUrl(URL.createObjectURL(audioFile));
  }, [audioFile]);

  React.useEffect(() => {
    if (!audioUrl) return;

    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  React.useEffect(() => {
    const joinedTranscriptArrayValues = transcriptArray.map((line) => {
      return Object.values(line).join(" --- ");
    });
    setText(joinedTranscriptArrayValues.join("\n\n"));
  }, [transcriptArray]);

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
    if (!fileName.current) return;
    setTranscriptArray(textToTranscriptArray(text));
    setIsEditorVisible(false);
    setSubtitlesArray(
      JSON.parse(
        localStorage.getItem(
          `${formatFileName(fileName.current)}--subtitles`
        ) || "[]"
      )
    );
  }

  function textToTranscriptArray(
    text: string
  ): TranscriptType[] | Partial<TranscriptType>[] {
    const lineObjectsArray = text.split("\n\n").map((line) => {
      const parts = line.split("---");

      if (parts.length !== 7) {
        const [text] = parts;
        return { text: text.trim() };
      }

      const [text, ipa, translation, imgUrl, altText, imgCredit, type] = parts;
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
    setTranscriptArray((prev) =>
      prev.filter((line, index) => index !== 0 && line.text !== "")
    );
    setSubtitlesArray((prev) => [...prev, transcriptArray[0]]);
  }

  function removeFromSubtitles() {
    setSubtitlesArray((prev) =>
      prev.filter((line, index) => index !== prev.length - 1)
    );
    setTranscriptArray((prev) => [
      subtitlesArray[subtitlesArray.length - 1],
      ...prev,
    ]);
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
      <div className="flex flex-col gap-10">
        <Subtitles
          subtitlesArray={subtitlesArray}
          removeFromSubtitles={removeFromSubtitles}
        />
        <AudioPlayer audioUrl={audioUrl} />
        <Transcript
          transcriptArray={transcriptArray}
          addToSubtitles={addToSubtitles}
        />
      </div>
    </div>
  );
}
