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
  LayoutGrid,
  ArrowLeft,
  Trash2,
  Save,
  Utensils
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    price: "",
    cost: "",
    isCustomPrice: false,
    masaPrice: "",
    gelalPrice: "",
    paketPrice: "",
    isFavorite: false,
    showOnSales: true,
    noVat: false,
    autoAsk: false,
    showOnKitchen: true,
    defaultPortion: true,
    useRecipe: false,
    addBarcode: false,
    defineFeature: false,
    trackStock: false,
    defineMenu: false,
  });

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

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      cost: "",
      isCustomPrice: false,
      masaPrice: "",
      gelalPrice: "",
      paketPrice: "",
      isFavorite: false,
      showOnSales: true,
      noVat: false,
      autoAsk: false,
      showOnKitchen: true,
      defaultPortion: true,
      useRecipe: false,
      addBarcode: false,
      defineFeature: false,
      trackStock: false,
      defineMenu: false,
    });
    setIsModalOpen(true);
  };

  const openEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      price: prod.price.toString(),
      cost: "",
      isCustomPrice: false,
      masaPrice: prod.price.toString(),
      gelalPrice: prod.price.toString(),
      paketPrice: prod.price.toString(),
      isFavorite: favorites.includes(prod.id),
      showOnSales: true,
      noVat: false,
      autoAsk: false,
      showOnKitchen: true,
      defaultPortion: true,
      useRecipe: false,
      addBarcode: false,
      defineFeature: false,
      trackStock: false,
      defineMenu: false,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!form.name) return;
    
    const price = parseFloat(form.price) || 0;

    if (editingProduct) {
      setLocalProducts(localProducts.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: form.name, price: form.isCustomPrice ? parseFloat(form.masaPrice) || 0 : price } 
          : p
      ));
      if (form.isFavorite && !favorites.includes(editingProduct.id)) {
        setFavorites([...favorites, editingProduct.id]);
      } else if (!form.isFavorite) {
        setFavorites(favorites.filter(id => id !== editingProduct.id));
      }
    } else {
      const newProd: ProductItem = {
        id: `p-new-${Date.now()}`,
        name: form.name,
        category: (selectedCategory === "favori" ? "icecekler" : selectedCategory) as any,
        price: form.isCustomPrice ? parseFloat(form.masaPrice) || 0 : price,
      };
      setLocalProducts([...localProducts, newProd]);
      if (form.isFavorite) {
        setFavorites([...favorites, newProd.id]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = () => {
    if (editingProduct) {
      setLocalProducts(localProducts.filter(p => p.id !== editingProduct.id));
      setFavorites(favorites.filter(id => id !== editingProduct.id));
    }
    setIsModalOpen(false);
  };

  const CustomSwitch = ({ checked, onChange, label, subtext, type = "default" }: any) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {subtext && <span className="text-xs text-[#df3232] mt-0.5">{subtext}</span>}
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer flex shrink-0 border ${
          checked 
            ? type === "red" ? 'bg-[#df3232] border-[#df3232]' : 'bg-[#df3232] border-[#df3232]'
            : 'bg-gray-200 border-gray-300'
        }`}
      >
        <div className={`absolute top-[1px] left-[1px] w-[16px] h-[16px] bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-[#edf0f5] overflow-hidden select-none">


      {isModalOpen ? (
        // Product Modal Overlay (Full Page)
        <div className="flex-1 flex bg-[#edf0f5] h-full overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 bg-[#f8fafc] border-r border-[#d8dde4] flex flex-col shrink-0">
            <div className="p-8 flex flex-col items-center justify-center border-b border-gray-200">
              <div className="w-24 h-24 bg-transparent flex items-center justify-center text-gray-800 mb-4">
                <Utensils className="w-20 h-20" strokeWidth={1} />
              </div>
              <h2 className="text-xl font-medium text-gray-800">
                {form.name || "Ürün Adı"}
              </h2>
              <div className="flex w-full justify-between items-end mt-4">
                <span className="text-xl font-bold text-gray-800">₺{parseFloat(form.price || "0").toFixed(2).replace(".", ",")}</span>
                <span className="text-sm font-semibold text-gray-600">Tam</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              <span className="text-xs font-medium text-gray-500 mb-2 block">Parametreler</span>
              
              <CustomSwitch label="Favori Ürün" checked={form.isFavorite} onChange={(v: boolean) => setForm({...form, isFavorite: v})} />
              <CustomSwitch label="Satış Ekranında Göster" checked={form.showOnSales} onChange={(v: boolean) => setForm({...form, showOnSales: v})} type="red" />
              <CustomSwitch label="KDV hariç olsun" checked={form.noVat} onChange={(v: boolean) => setForm({...form, noVat: v})} />
              <CustomSwitch label="Özellik ve Porsiyon Otomatik Sorulsun" checked={form.autoAsk} onChange={(v: boolean) => setForm({...form, autoAsk: v})} />
              <CustomSwitch label="Mutfak Ekranında Göster" checked={form.showOnKitchen} onChange={(v: boolean) => setForm({...form, showOnKitchen: v})} type="red" />
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Top Toolbar */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-[#d8dde4] bg-[#f8fafc]">
              <span className="font-semibold text-gray-700 text-lg">Ürün Detay</span>
              <div className="flex items-center gap-5 font-bold text-sm">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex items-center gap-1 hover:text-gray-600 transition-colors cursor-pointer text-gray-800">
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>
                {editingProduct && (
                  <button type="button" onClick={handleDeleteProduct} className="flex items-center gap-1 text-[#df3232] hover:text-[#c22b2b] transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" /> Ürünü Sil
                  </button>
                )}
                <button type="button" onClick={openNewProduct} className="flex items-center gap-1 text-[#df3232] hover:text-[#c22b2b] transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Yeni Ürün Ekle
                </button>
                <button type="button" onClick={handleSaveProduct} className="flex items-center gap-1.5 px-4 py-2 bg-[#df3232] hover:bg-[#c22b2b] text-white rounded transition-colors cursor-pointer shadow-sm">
                  <Save className="w-4 h-4" /> {editingProduct ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* Genel Bilgiler */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Genel Bilgiler</h3>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <label className="text-xs font-bold text-gray-500 bg-white px-1 absolute -top-2 left-2 z-10">Kategoriler</label>
                    <div className="relative">
                      <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded p-3 text-gray-700 appearance-none bg-white outline-none focus:border-gray-400 font-medium"
                      >
                        {categories.filter(c => c.id !== "favori").map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="flex-2 relative">
                    <label className="text-xs font-bold text-[#df3232] bg-white px-1 absolute -top-2 left-2 z-10">Ürün Adı*</label>
                    <input 
                      type="text" 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full border-2 border-[#df3232] rounded p-3 text-gray-800 outline-none font-medium" 
                    />
                  </div>

                  <button className="px-6 border border-gray-300 rounded bg-[#f8fafc] flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer font-semibold text-gray-700">
                    <Palette className="w-4 h-4" /> Ürün Rengi
                  </button>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <label className="text-xs font-bold text-gray-500 bg-white px-1 absolute -top-2 left-2 z-10">Ürün KDV Grubu</label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 rounded p-3 text-gray-700 appearance-none bg-white outline-none font-medium">
                        <option>Yiyecek (%10)</option>
                        <option>İçecek (%20)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex-1 relative">
                    <label className="text-xs font-bold text-gray-500 bg-white px-1 absolute -top-2 left-2 z-10">Mutfak Grubu</label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 rounded p-3 text-gray-700 appearance-none bg-white outline-none font-medium">
                        <option>Mutfak</option>
                        <option>Bar</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                    <p className="text-[11px] font-medium text-gray-500 mt-1 pl-1">Not: Mutfağınızı bölümlere ayırarak ürün bazlı yazdırma ve görüntüleme işlemi yapabilirsiniz</p>
                  </div>

                  <div className="w-32 relative">
                    <input type="text" placeholder="Ürün Kodu" className="w-full border border-gray-300 rounded p-3 text-gray-700 outline-none font-medium bg-[#f8fafc]" />
                  </div>

                  <div className="flex-1 relative">
                    <label className="text-xs font-bold text-gray-500 bg-white px-1 absolute -top-2 left-2 z-10">Marş Grubu</label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 rounded p-3 text-gray-700 appearance-none bg-[#f8fafc] outline-none font-medium">
                        <option>Marş 1</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                    <p className="text-[11px] font-medium text-gray-500 mt-1 pl-1">Not: Ürünlerinizin mutfakta hangi sırayla hazırlanması gerektiğini belirleyebilirsiniz</p>
                  </div>
                </div>
              </div>

              {/* Porsiyon Bilgileri */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Porsiyon Bilgileri</h3>
                <p className="text-sm font-medium text-gray-500 mb-4">Bir ürünün farklı porsiyonlarını oluşturmak için kullanılır. Örneğin; yarım döner veya 3 çeyrek kokoreç gibi</p>
                
                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-300 mb-6">
                  <div className="relative px-2 py-3">
                    <span className="font-bold text-[#df3232] text-sm flex items-center gap-2">Tam <Trash2 className="w-3.5 h-3.5" /></span>
                    <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#df3232]"></div>
                  </div>
                  <div className="px-2 py-3 cursor-pointer">
                    <span className="font-semibold text-[#df3232] text-sm">Porsiyon Ekle</span>
                  </div>
                </div>

                <div className="bg-[#f8fafc] border border-gray-200 rounded p-6">
                  <label className="flex items-center gap-2 cursor-pointer mb-6">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${form.defaultPortion ? 'bg-gray-400' : 'border-2 border-gray-300'}`}>
                      {form.defaultPortion && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Varsayılan Porsiyon</span>
                  </label>

                  {form.isCustomPrice ? (
                    <div className="space-y-4 mb-6">
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 bg-[#f8fafc] px-1 absolute -top-2 left-2 z-10">Tek Fiyat</label>
                        <input type="text" disabled className="w-full border border-gray-300 rounded p-3 text-gray-500 outline-none font-medium bg-gray-50 text-right pr-6" />
                        <span className="absolute right-3 top-3.5 text-gray-500">₺</span>
                      </div>
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 bg-[#f8fafc] px-1 absolute -top-2 left-2 z-10">Masa Siparişi*</label>
                        <input type="text" value={form.masaPrice} onChange={(e) => setForm({...form, masaPrice: e.target.value})} className="w-full border border-gray-300 rounded p-3 text-gray-800 outline-none font-medium bg-white text-right pr-6" />
                        <span className="absolute right-3 top-3.5 text-gray-800 font-medium">₺</span>
                      </div>
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 bg-[#f8fafc] px-1 absolute -top-2 left-2 z-10">Gel Al Sipariş*</label>
                        <input type="text" value={form.gelalPrice} onChange={(e) => setForm({...form, gelalPrice: e.target.value})} className="w-full border border-gray-300 rounded p-3 text-gray-800 outline-none font-medium bg-white text-right pr-6" />
                        <span className="absolute right-3 top-3.5 text-gray-800 font-medium">₺</span>
                      </div>
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 bg-[#f8fafc] px-1 absolute -top-2 left-2 z-10">Paket Sipariş*</label>
                        <input type="text" value={form.paketPrice} onChange={(e) => setForm({...form, paketPrice: e.target.value})} className="w-full border border-gray-300 rounded p-3 text-gray-800 outline-none font-medium bg-white text-right pr-6" />
                        <span className="absolute right-3 top-3.5 text-gray-800 font-medium">₺</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 mb-2">
                      <div className="flex-1 relative">
                        <label className="text-xs font-bold text-gray-500 bg-[#f8fafc] px-1 absolute -top-2 left-2 z-10">Birim</label>
                        <div className="relative">
                          <select className="w-full border border-gray-300 rounded p-3 text-gray-700 appearance-none bg-white outline-none font-medium">
                            <option>Tam</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          placeholder="Fiyat" 
                          value={form.price} 
                          onChange={(e) => setForm({...form, price: e.target.value})}
                          className="w-full border border-gray-300 rounded p-3 text-gray-800 outline-none font-medium bg-white text-right pr-6" 
                        />
                        <span className="absolute right-3 top-3.5 text-gray-800 font-medium">₺</span>
                      </div>
                    </div>
                  )}

                  {!form.isCustomPrice && (
                    <div className="flex items-center justify-center relative -mt-4 mb-6 z-20">
                       <button 
                         type="button" 
                         onClick={() => setForm({...form, isCustomPrice: true})} 
                         className="bg-[#f8fafc] px-2 text-xs font-bold text-[#df3232] cursor-pointer"
                       >
                         Sipariş türüne göre özelleştir
                       </button>
                    </div>
                  )}

                  <div className="flex gap-4 mb-6">
                    {form.isCustomPrice && (
                      <div className="flex-1 relative">
                        <label className="text-xs font-bold text-gray-500 bg-[#f8fafc] px-1 absolute -top-2 left-2 z-10">Birim</label>
                        <div className="relative">
                          <select className="w-full border border-gray-300 rounded p-3 text-gray-700 appearance-none bg-white outline-none font-medium">
                            <option>Tam</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        placeholder="Maliyet Tutarı" 
                        value={form.cost} 
                        onChange={(e) => setForm({...form, cost: e.target.value})}
                        className="w-full border border-gray-300 rounded p-3 text-gray-800 outline-none font-medium bg-[#f8fafc] text-right pr-6" 
                      />
                      <span className="absolute right-3 top-3.5 text-gray-800 font-medium">₺</span>
                    </div>
                  </div>

                  <div className="space-y-1 w-full max-w-lg mt-6 border-t border-gray-200 pt-6">
                    <CustomSwitch label="Reçeteli ürün kullan" subtext="Reçete eklemeden önce ürün kaydedilmelidir." checked={form.useRecipe} onChange={(v: boolean) => setForm({...form, useRecipe: v})} />
                    <CustomSwitch label="Barkod Ekle" checked={form.addBarcode} onChange={(v: boolean) => setForm({...form, addBarcode: v})} />
                    <CustomSwitch label="Özellik Tanımlama" subtext="Özellik tanımlamadan önce ürün kaydedilmelidir." checked={form.defineFeature} onChange={(v: boolean) => setForm({...form, defineFeature: v})} />
                    
                    <div className="h-6" />
                    
                    <CustomSwitch label="Stok takibi yap" checked={form.trackStock} onChange={(v: boolean) => setForm({...form, trackStock: v})} />
                    <CustomSwitch label="Menü Tanımla" subtext="Menü tanımlamadan önce ürün kaydedilmelidir." checked={form.defineMenu} onChange={(v: boolean) => setForm({...form, defineMenu: v})} />
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        // Main 2-column split (Categories on left, Products on right)
        <div className="flex-1 flex overflow-hidden">
          {/* Left Category Sidebar */}
          <div className="w-60 bg-[#f8fafc] border-r border-[#d8dde4] flex flex-col shrink-0">
            {/* Top: + Kategori Ekle */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <button
                type="button"
                className="flex items-center gap-1 text-[13px] font-bold text-[#df3232] cursor-pointer transition-opacity hover:opacity-80"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="tracking-tight">Kategori Ekle</span>
              </button>
              <button type="button" className="text-[#df3232] cursor-pointer p-1">
                <MoreVertical className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center justify-between px-4 py-3.5 text-sm font-semibold cursor-pointer transition-colors group ${
                      isActive
                        ? "bg-[#d5d8dc] text-[#111827]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {cat.id === "favori" ? (
                        <span className="text-gray-600 font-medium tracking-wide">Favori Ürünler</span>
                      ) : (
                        <>
                          <LayoutGrid className="w-4 h-4 text-gray-400" />
                          <span className="tracking-wide">{cat.name}</span>
                        </>
                      )}
                    </div>
                    {cat.id === "favori" ? (
                      <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                    ) : (
                      <MoreVertical className={`w-4 h-4 text-gray-500 cursor-pointer ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Product Grid Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Filter and Actions Bar */}
            <div className="h-16 bg-[#f8fafc] border-b border-[#d8dde4] px-6 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 flex-1 max-w-xl">
                {/* Dropdown: Tüm Kategoriler */}
                <button
                  type="button"
                  className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-[#d8dde4] rounded text-sm font-medium text-gray-700 shrink-0 cursor-pointer hover:bg-gray-50"
                >
                  <span>Tüm Kategoriler</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Search input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Arama..."
                    className="w-full h-9 pl-4 pr-10 bg-white border border-[#d8dde4] rounded text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Right Buttons: AI ile Menü Oluştur & Yeni Ürün Ekle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded border border-[#fecaca] bg-[#fff5f5] text-[#df3232] text-sm font-bold hover:bg-[#fee2e2] cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI ile Menü Oluştur</span>
                </button>

                <button
                  type="button"
                  onClick={openNewProduct}
                  className="flex items-center gap-1 px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Ürün Ekle</span>
                </button>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filtered.map((prod) => {
                  const isFav = favorites.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => openEditProduct(prod)}
                      className="h-36 rounded bg-white border border-[#d8dde4] p-3 flex flex-col justify-between shadow-sm hover:border-[#df3232] transition-colors relative group cursor-pointer"
                    >
                      {/* Top Icons */}
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(prod.id, e)}
                          className={`cursor-pointer transition-colors ${isFav ? 'text-[#8cb8f2]' : 'text-gray-800'}`}
                        >
                          <Heart
                            className="w-[18px] h-[18px]"
                            strokeWidth={2.5}
                            fill={isFav ? "currentColor" : "none"}
                          />
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className={`cursor-pointer transition-colors ${isFav ? 'text-[#8cb8f2]' : 'text-gray-800'}`}
                            title="Renk Değiştir"
                          >
                            <Palette className="w-[18px] h-[18px]" strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            className={`cursor-pointer transition-colors ${isFav ? 'text-[#8cb8f2]' : 'text-gray-800'}`}
                            title="Ürünü Çoğalt"
                          >
                            <Copy className="w-[18px] h-[18px]" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      {/* Center: Title & Portion */}
                      <div className="text-center">
                        <span className="font-bold text-sm text-gray-900 block truncate">
                          {prod.name}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 block mt-0.5">
                          Tam
                        </span>
                      </div>

                      {/* Bottom: Price */}
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-gray-900">
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
      )}
    </div>
  );
}
