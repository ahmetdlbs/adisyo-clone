"use client";

import React from "react";
import {
  Menu,
  Gift,
  Users,
  RotateCw,
  MoreVertical,
  Megaphone,
  Headphones,
  User,
} from "lucide-react";

interface TopHeaderProps {
  onToggleMenu: () => void;
}

export default function TopHeader({ onToggleMenu }: TopHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-[#e5e7eb] px-4 flex items-center justify-between select-none z-20 shrink-0">
      {/* Left side: Hamburger + "Ahmet" */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMenu}
          className="p-1.5 rounded-lg text-[#374151] hover:bg-gray-100 transition-colors cursor-pointer"
          title="Menüyü Aç"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="font-semibold text-[17px] text-[#111827]">
          Ahmet
        </span>
      </div>

      {/* Right side icons matching dashboard_screen_1789837022002.png */}
      <div className="flex items-center gap-2">
        {/* Gold circular Gift box button */}
        <button
          type="button"
          onClick={() => alert("Kampanyalar")}
          className="w-8 h-8 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center hover:bg-[#fde68a] transition-colors cursor-pointer"
        >
          <Gift className="w-4 h-4" />
        </button>

        {/* Katıl button */}
        <button
          type="button"
          onClick={() => alert("Katıl")}
          className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-[#4b5563] text-xs font-medium rounded-full transition-colors cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Katıl</span>
        </button>

        {/* Refresh button */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-8 h-8 rounded-full hover:bg-gray-100 text-[#4b5563] flex items-center justify-center transition-colors cursor-pointer"
          title="Sayfayı Yenile"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* 3-dots */}
        <button
          type="button"
          className="w-8 h-8 rounded-full hover:bg-gray-100 text-[#4b5563] flex items-center justify-center transition-colors cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Announcements */}
        <button
          type="button"
          onClick={() => alert("Duyurular")}
          className="w-8 h-8 rounded-full hover:bg-gray-100 text-[#4b5563] flex items-center justify-center transition-colors cursor-pointer"
          title="Duyurular"
        >
          <Megaphone className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-gray-200 mx-1" />

        {/* Destek İste button */}
        <button
          type="button"
          onClick={() => alert("Adisyo Destek")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fef2f2] text-[#b84a43] hover:bg-[#fee2e2] text-xs font-semibold rounded-full border border-[#fecaca] transition-colors cursor-pointer"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Destek İste</span>
        </button>

        {/* User Badge: 84425 - Ahmet */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff6ff] text-[#1d4ed8] rounded-full border border-[#dbeafe] text-xs font-semibold">
          <User className="w-3.5 h-3.5" />
          <span>84425 - Ahmet</span>
        </div>
      </div>
    </header>
  );
}
