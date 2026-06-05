"use client";

import { Plane } from "lucide-react";

type Props = {
  title: string;

  subtitle: string;

  rightContent?: React.ReactNode;
};

export default function Navbar({ title, subtitle, rightContent }: Props) {
  return (
    <div className="fixed top-0 left-0 z-[999] w-full border-b bg-white/90 backdrop-blur-md">
      <div className="flex min-h-[92px] w-full flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-0">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* LOGO */}
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-blue-600 shadow-lg md:h-[58px] md:w-[58px]">
            <Plane className="h-6 w-6 text-white md:h-7 md:w-7" />
          </div>

          {/* TITLE */}
          <div>
            <h1 className="text-2xl font-bold md:text-4xl">{title}</h1>

            <p className="text-sm text-gray-500 md:text-lg">{subtitle}</p>
          </div>
        </div>

        {/* RIGHT */}
        {rightContent && (
          <div className="flex items-center gap-3">{rightContent}</div>
        )}
      </div>
    </div>
  );
}
