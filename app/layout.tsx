import "@/assets/styles/globals.css";
import { Toaster } from "@/components/ui/toaster"

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log a Line - Generate Subtitles Manually",
  description: "Generate subtitles for your mini stories",
  keywords: ["subtitle", "story", "generate"],
  icons: {
    icon: "favicon.ico"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
