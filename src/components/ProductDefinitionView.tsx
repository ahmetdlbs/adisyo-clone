"use client";

import React, { useState } from "react";
import {
  Menu,
  Gift,
  Users,
  RefreshCw,
  MoreVertical,
  Megaphone,
  Headphones,
  UserCog,
  Plus,
  Search,
  Sparkles,
  Heart,
  Palette,
  Copy,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { ProductItem } from "@/data/posData";

interface ProductDefinitionViewProps {
  products: ProductItem[];
  onOpenDrawer: () => void;
}

export default function ProductDefinitionView({
  products,
  onOpenDrawer,
}: ProductDefinitionViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("icecekler");
  const [searchQuery, setSearchQuery] = useState("");
  const [localProducts, setLocalProducts] = useState<ProductItem[]>(products);
  const [favorites, setFavorites] = useState<string[]>(["p-cay", "p-cay-icecek"]);

  const categories = [
    { id: "favori", name: "Favori Ürünler", icon: true },
    { id: "icecekler", name: "İçecekler", count: 12 },
    { id: "milkshake", name: "Milkshake", count: 5 },
    { id: "tatli", name: "Tatlı ve Pastalar", count: 5 },
    { id: "yiyecekler", name: "Yiyecekler", count: 6 },
  ];

  const filtered = localProducts.filter((p) => {
    if (searchQuery.trim()) {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (selectedCategory === "favori") {
      return favorites.includes(p.id);
    }
    return p.category === selectedCategory;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddNewProduct = () => {
    const name = prompt("Yeni Ürün Adı:", "");
    if (!name) return;
    const priceStr = prompt("Ürün Fiyatı (₺):", "50");
    const price = priceStr ? parseFloat(priceStr) || 50 : 50;

    const newProd: ProductItem = {
      id: `p-new-${Date.now()}`,
      name,
      category: (selectedCategory === "favori" ? "icecekler" : selectedCategory) as any,
      price,
    };
    setLocalProducts([...localProducts, newProd]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#edf0f5] overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-14 bg-white border-b border-[#d8dde4] px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-1.5 hover:bg-gray-100 rounded-[4px] text-[#2b2f36] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm text-[#2b2f36]">
            Kategori ve Ürün Tanımlama / Şube Ürünleri
          </span>
        </div>

        {/* Right standard POS controls */}
        <div className="flex items-center gap-3 text-xs text-[#4b5563]">
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#fde68a] text-amber-900 flex items-center justify-center hover:opacity-90 cursor-pointer"
          >
            <Gift className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5e7eb] hover:bg-gray-200 text-xs font-semibold text-[#374151] cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Katıl</span>
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-8 h-8 rounded-full bg-[#e5e7eb] hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#4b5563]" />
          </button>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#e5e7eb] hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <MoreVertical className="w-4 h-4 text-[#4b5563]" />
          </button>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#e5e7eb] hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-[#4b5563]" />
          </button>

          <div className="h-5 w-px bg-gray-300 mx-1" />

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fee2e2] text-[#b84a43] text-xs font-semibold hover:bg-[#fecaca] cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Destek İste</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dbeafe] text-[#1e40af] text-xs font-semibold">
            <UserCog className="w-3.5 h-3.5" />
            <span>84425 - Ahmet</span>
          </div>
        </div>
      </div>

      {/* Main 2-column split (Categories on left, Products on right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Category Sidebar (Matching media_1789840611172.png) */}
        <div className="w-60 bg-white border-r border-[#d8dde4] flex flex-col shrink-0">
          {/* Top: + Kategori Ekle */}
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => alert("Kategori Ekle")}
              className="flex items-center gap-2 text-xs font-bold text-[#b84a43] hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Kategori Ekle</span>
            </button>
            <button type="button" className="text-gray-400 hover:text-gray-700">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#e5e7eb] text-[#111827] font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#111827]"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {cat.id === "favori" ? (
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <MoreVertical className="w-3.5 h-3.5 text-gray-400 opacity-60 hover:opacity-100" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Product Grid Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Filter and Actions Bar */}
          <div className="h-14 bg-[#f8fafc] border-b border-[#d8dde4] px-6 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              {/* Dropdown: Tüm Kategoriler */}
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d8dde4] rounded text-xs font-medium text-gray-700 shrink-0 cursor-pointer hover:bg-gray-50"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Tüm Kategoriler</span>
              </button>

              {/* Search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Arama..."
                  className="w-full h-8 pl-3 pr-8 bg-white border border-[#d8dde4] rounded text-xs text-gray-800 placeholder-gray-400 outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2" />
              </div>
            </div>

            {/* Right Buttons: AI ile Menü Oluştur & Yeni Ürün Ekle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert("AI Menü Sihirbazı Açılıyor...")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#fecaca] bg-[#fff5f5] text-[#b84a43] text-xs font-semibold hover:bg-[#fee2e2] cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI ile Menü Oluştur</span>
              </button>

              <button
                type="button"
                onClick={handleAddNewProduct}
                className="flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Ürün Ekle</span>
              </button>
            </div>
          </div>

          {/* Product Cards Grid matching media_1789840611172.png */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((prod) => {
                const isFav = favorites.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    className="h-36 rounded-lg bg-white border border-[#d8dde4] p-3 flex flex-col justify-between shadow-2xs hover:border-[#b84a43] transition-all relative group"
                  >
                    {/* Top Icons: Heart, Palette, Copy */}
                    <div className="flex items-center justify-between text-gray-400">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(prod.id)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFav ? "text-[#3b82f6] fill-[#3b82f6]" : ""
                          }`}
                        />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="hover:text-gray-700 cursor-pointer"
                          title="Renk Değiştir"
                        >
                          <Palette className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-gray-700 cursor-pointer"
                          title="Ürünü Çoğalt"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Center: Title & Portion */}
                    <div className="text-center py-1">
                      <span className="font-bold text-sm text-[#111827] block truncate">
                        {prod.name}
                      </span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        Tam
                      </span>
                    </div>

                    {/* Bottom: Price */}
                    <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827]">
                        ₺{prod.price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
