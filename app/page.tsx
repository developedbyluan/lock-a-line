"use client";

import React from "react";
import { UploadMP3 } from "@/components/UploadMP3";

export default function HomePage() {
  const [mp3, setMP3] = React.useState<File | null>(null);
  return (
    <div>
      <UploadMP3 setMP3={setMP3} mp3={mp3} />
    </div>
  );
}
