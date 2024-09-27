import React from "react";

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
    <div>
      <input
        type="file"
        accept="audio/mp3"
        onChange={handleChange}
        ref={inputRef}
        className="hidden"
      />
      <button onClick={() => inputRef.current?.click()}>Upload</button>
      {mp3 ? <p>Uploaded: {mp3.name}</p> : <p>No file uploaded</p>}
    </div>
  );
}