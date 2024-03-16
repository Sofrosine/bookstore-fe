import PopupError from "@/components/Popup/PopupError";
import { lato } from "@/constants/fonts";
import { META } from "@/constants/meta";
import clsx from "clsx";
import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  ...META,
  title: {
    template: "%s | IBHC 2024",
    default: "IBHC 2024",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(lato.className, "text-black-text")}>
        <div className="min-h-[100vh]">
          <div className="absolute h-[100vh] w-[100vw] z-10">
            <Image
              src={"/backgrounds/bg-dashboard.png"}
              fill
              alt="bg-dashboard"
            />
          </div>
          <div className="z-20 relative">{children}</div>
        </div>
        <PopupError />
      </body>
    </html>
  );
}
