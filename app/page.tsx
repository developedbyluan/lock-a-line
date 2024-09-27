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

  function saveText(name: string, text: string) {
    if (!db) return;
    const transaction = db.transaction("texts", "readwrite");
    const textsStore = transaction.objectStore("texts");
    textsStore.put({ name: name, text: text });
  }

  function toggleEditor() {
    setIsEditorVisible((prev) => !prev);
  }

  function formatFileName(fileName: string) {
    return fileName.toLowerCase().split(".")[0].replaceAll(" ", "-");
  }

  function startLogging(fileName: string, text: string) {
    saveText(fileName, text);

    setTimeout(() => {
      console.log("router.push('/logging')");
    }, 3000);
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
        <Button
          className="absolute top-4 right-4"
          onClick={() =>
            startLogging(`${formatFileName(fileName.current || "Untitled")}--src`, text)
          }
        >
          Start Logging
        </Button>
        <TextEditor
          text={text}
          setText={setText}
          fileName={formatFileName(fileName.current || "Untitled")}
          toggleEditor={toggleEditor}
        />
      </div>
    </div>
  );
}
