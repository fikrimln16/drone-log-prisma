"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-gray-500 md:flex-row xl:max-w-[1600px]">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <span>© 2026 Flight Check</span>

          <span className="text-gray-300">•</span>

          <span>Drone Flight Management System</span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <span>Made with</span>

          <span className="font-semibold text-black">by ICAPY</span>
        </div>
      </div>
    </footer>
  );
}
