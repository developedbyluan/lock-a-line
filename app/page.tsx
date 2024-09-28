"use client";

import React from "react";
import { UploadAudioFile } from "@/components/UploadAudioFile";
import { cn } from "@/lib/utils";
import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";

let db: IDBDatabase | null = null;


export default function HomePage() {
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [isEditorVisible, setIsEditorVisible] = React.useState(false);
  const [text, setText] = React.useState("");
    React.useState(false);

  const fileName = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (audioFile) {
      toggleEditor();
      fileName.current = audioFile.name;
    }
  }, [audioFile]);

  React.useEffect(() => {
    const request = indexedDB.open("LogALineDB", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      console.log("IndexedDB opened successfully");
    };

    request.onupgradeneeded = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore("texts", { keyPath: "name" });
    };
  }, []);

  React.useEffect(() => {
    if (!fileName.current) return;
    const request = loadText(`${formatFileName(fileName.current)}--src`);
    if (!request) return;

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
    };

    request.onsuccess = () => {
      if (request.result) {
        setText(request.result.text);
      } else {
        console.log("No text found");
        console.log("Create New Text");
        setText("");
      }
    };
  }, [audioFile]);

  React.useEffect(() => {
    if (!fileName.current) return;
    saveText(`${formatFileName(fileName.current)}--src`, text);
  }, [text]);

  function saveText(name: string, text: string) {
    if (!db) return;
    const transaction = db.transaction("texts", "readwrite");
    const textsStore = transaction.objectStore("texts");
    textsStore.put({ name: name, text: text });
  }

  function loadText(name: string) {
    if (!db) return;
    const transaction = db.transaction("texts", "readonly");
    const textsStore = transaction.objectStore("texts");
    return textsStore.get(name);
  }

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
    console.log(textToArray(text));
  }

  function textToArray(text: string) {
    const lines = text.split("\n\n");
    const lineObjectsArray = lines.map((line) => {
      const parts = line.split("---");

      if (parts.length !== 5) {
        const [text] = parts;
        return {text};
      }

      const [text, ipa, translation, imgUrlandAlt, type ] = parts;
      const [imgUrl, alt] = imgUrlandAlt.split("|");
      return {
        text,
        ipa,
        translation,
        imgUrl,
        alt,
        type,
      };
    });

    return lineObjectsArray;
  }

  function editTranscript() {
    setIsEditorVisible(true);
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
    </div>
  );
}
