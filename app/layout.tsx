import "@/assets/styles/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lock a Line",
  description: "Generate subtitle for your mini stories",
  keywords: ["subtitle", "story", "generate"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Lock a Line</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
