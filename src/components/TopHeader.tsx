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
  Settings,
  CreditCard,
  Hash,
  Wand2,
  LogOut,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface TopHeaderProps {
  onToggleMenu: () => void;
}

export default function TopHeader({ onToggleMenu }: TopHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

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

        {/* User Badge Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff6ff] hover:bg-[#dbeafe] text-[#1d4ed8] rounded-full border border-[#dbeafe] text-xs font-semibold transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>84425 - Ahmet</span>
          </button>

          {isProfileOpen && (
            <div 
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 flex flex-col"
              onClick={() => setIsProfileOpen(false)}
            >
              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
                <User className="w-4 h-4 text-gray-500" />
                Profil
              </Link>
              <Link href="/restaurant-settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
                <Settings className="w-4 h-4 text-gray-500" />
                Restaurant Ayarları
              </Link>
              <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
                <CreditCard className="w-4 h-4 text-gray-500" />
                Hesap Bilgileri
              </Link>
              
              <div className="h-px bg-gray-100 my-1"></div>
              
              <button className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors w-full">
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-gray-500" />
                  Sosyal Medya
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors w-full">
                <Wand2 className="w-4 h-4 text-gray-500" />
                Hızlı Başlangıç Rehberi
              </button>
              
              <div className="h-px bg-gray-100 my-1"></div>
              
              <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-medium transition-colors w-full">
                <LogOut className="w-4 h-4 text-gray-500" />
                Çıkış
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
