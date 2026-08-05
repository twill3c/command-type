import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "command-type",
  description: "Linux コマンドの落ちものタイピング練習",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
