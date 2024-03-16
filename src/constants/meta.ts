import { Metadata } from "next";

const META_DEFAULT = {
  title: "INTERNATIONAL BIOETHICS & HUMANITIES CONFERENCE 2024 ",
  description:
    "Welcome to INTERNATIONAL BIOETHICS & HUMANITIES CONFERENCE 2024 Official Website",
  keywords: "ibhc,ibhc 2024,INTERNATIONAL BIOETHICS & HUMANITIES CONFERENCE, INTERNATIONAL BIOETHICS & HUMANITIES CONFERENCE 2024",
};

export const META: Metadata = {
  description: META_DEFAULT.description,
  keywords: META_DEFAULT.keywords?.split(","),
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: "IBHC 2024",
    type: "website",
    url: "https://www.ibhc2024.id",
    title: META_DEFAULT.title,
    description: META_DEFAULT.description,
    images: "/logo.png",
  },
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo-icon.png",
    },
  },
};
