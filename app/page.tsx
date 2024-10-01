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
import { toast } from "@/hooks/use-toast";

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
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const [playbackRate, setPlaybackRate] = React.useState(1);
  const [timestampsArray, setTimestampsArray] = React.useState<number[]>([]);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const fileName = React.useRef<string | null>(null);

  //TODO: Load audio file => Create new text in local storage if no local text is found
  // otherwise, load the local text to the editor (setText)
  React.useEffect(() => {
    if (!fileName.current) return;

    setTimestampsArray(
      JSON.parse(
        localStorage.getItem(
          `${formatFileName(fileName.current)}--timestamps`
        ) || "[]"
      )
    );
    const localText = localStorage.getItem(
      `${formatFileName(fileName.current)}--src`
    );
    if (!localText) {
      console.log("No local text found");
      localStorage.setItem(`${formatFileName(fileName.current)}--src`, "");
      return;
    }
    setText(localText);
  }, [audioFile, isEditorVisible]);

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

  React.useEffect(() => {
    if (!fileName.current) return;
    localStorage.setItem(
      `${formatFileName(fileName.current)}--timestamps`,
      JSON.stringify(timestampsArray)
    );
  }, [timestampsArray]);

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

    if (!audioRef.current) return;
    audioRef.current.currentTime =
      timestampsArray[timestampsArray.length - 1] || 0;
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
    playPauseAudio();
    if (!isAudioPlaying) return;
    setTranscriptArray((prev) =>
      prev.filter((line, index) => index !== 0 && line.text !== "")
    );
    setSubtitlesArray((prev) => [...prev, transcriptArray[0]]);
    addCurrentTimeToTimestampsArray();
  }

  function removeFromSubtitles() {
    if (!audioRef.current) return;
    audioRef.current.currentTime = timestampsArray.at(-2) || 0;

    setSubtitlesArray((prev) =>
      prev.filter((line, index) => index !== prev.length - 1)
    );
    setTimestampsArray((prev) =>
      prev.filter((prev, index) => index !== timestampsArray.length - 1)
    );
    setTranscriptArray((prev) => [
      subtitlesArray[subtitlesArray.length - 1],
      ...prev,
    ]);
  }

  function playPauseAudio() {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsAudioPlaying((prev) => !prev);
  }

  function togglePlaybackRate() {
    if (!audioRef.current) return;
    const newPlaybackRate = playbackRate >= 1.5 ? 0.75 : playbackRate + 0.25;
    audioRef.current.playbackRate = newPlaybackRate;
    setPlaybackRate(newPlaybackRate);
  }

  function addCurrentTimeToTimestampsArray() {
    if (!audioRef.current) return;
    const currentTime = audioRef.current.currentTime;
    setTimestampsArray((prev) => [...prev, currentTime]);
  }

  function replayAudio() {
    if (!audioRef.current) return;
    const startTime = timestampsArray.at(-2) || 0;
    const endTime = timestampsArray.at(-1) || 0;
    const timeInterval = (endTime - startTime) * 1000;
    audioRef.current.currentTime = startTime;
    audioRef.current.play();
    setTimeout(() => {
      audioRef.current?.pause();
    }, timeInterval / playbackRate);
  }

  function backToPreviousPoint() {
    if (!audioRef.current) return;
    audioRef.current.currentTime = timestampsArray.at(-1) || 0;
    toast({
      title: `Go back to ${timestampsArray.at(-1)}`,
      duration: 1000,
    });
  }

  function exportSubtitles() {
    if (!fileName.current) return;
    const subtitles = [...subtitlesArray];
    const timestamps = [...timestampsArray];

    if (subtitles.length !== timestamps.length) return;

    const obj = subtitles.map((line, index) => {
      return {
        ...line,
        startTime: timestamps[index - 1] || 0,
        endTime: timestamps[index],
      };
    });

    const json = JSON.stringify(obj);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = formatFileName(fileName.current) + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full">
      <Button className={cn("absolute right-4 top-4", audioUrl ? "block" : "hidden")} variant={"destructive"} onClick={() => window.location.reload()}>
        Reset All
      </Button>
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
      <div className="fixed opacity-80 h-1/2 top-1/2 -translate-y-1/2 p-4 right-4 flex flex-col justify-between">
        <Button onClick={exportSubtitles}>Export Subtitles</Button>
        <Button onClick={editTranscript}>Edit transcript</Button>
      </div>
      <div className="flex flex-col gap-4">
        <Subtitles
          subtitlesArray={subtitlesArray}
          timestampsArray={timestampsArray}
        />
        <AudioPlayer
          ref={audioRef}
          audioUrl={audioUrl}
          isAudioPlaying={isAudioPlaying}
          setIsAudioPlaying={setIsAudioPlaying}
        />
        <div className="flex flex-col gap-4 p-4">
          <div className="flex gap-4">
            <Button onClick={removeFromSubtitles}>
              Remove
            </Button>
            <Button variant={"outline"} onClick={replayAudio}>
              Replay
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant={"outline"} onClick={togglePlaybackRate}>
              x{playbackRate}
            </Button>
            <Button
              variant={"secondary"}
              disabled={isAudioPlaying}
              onClick={backToPreviousPoint}
            >
              Back
            </Button>
            <Button
              disabled={!isAudioPlaying}
              variant={"secondary"}
              onClick={() => audioRef.current?.pause()}
            >
              Pause
            </Button>
            <Button onClick={() => addToSubtitles()}>
              {isAudioPlaying ? "Log" : "Play"}
            </Button>
          </div>
        </div>
        <Transcript
          transcriptArray={transcriptArray}
          addToSubtitles={addToSubtitles}
          isAudioPlaying={isAudioPlaying}
        />
      </div>
    </div>
  );
}
