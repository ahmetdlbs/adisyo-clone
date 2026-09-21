"use client";

import React, { useState } from "react";
import { 
  Filter, Download, Printer, ChevronRight, Maximize2, X,
  PieChart, CheckSquare, FilePlus, Utensils, Receipt, TrendingDown, RefreshCw, ClipboardList, Bike,
  Activity, ArrowRightLeft, ShoppingCart, Truck, Coffee, FileText, Clock, Users, Hash
} from "lucide-react";

type TabKey = "ozet" | "tum_adisyonlar" | "yogunluk" | "masa" | "gel_al" | "paket" | "acik_hesap" | "odenmezler" | "garson" | "iptal_iade" | "masraflar" | "zayi" | "silinen_urun" | "silinen_tahsilat";

interface Tab {
  id: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { id: "ozet", label: "Özet" },
  { id: "tum_adisyonlar", label: "Tüm Adisyonlar" },
  { id: "yogunluk", label: "Yoğunluk Raporu" },
  { id: "masa", label: "Masa Siparişleri" },
  { id: "gel_al", label: "Gel Al Siparişler" },
  { id: "paket", label: "Paket Siparişler" },
  { id: "acik_hesap", label: "Açık Hesap Hareketleri" },
  { id: "odenmezler", label: "Ödenmezler" },
  { id: "garson", label: "Garson Bazlı Satışlar" },
  { id: "iptal_iade", label: "İptal / İadeler" },
  { id: "masraflar", label: "Masraflar" },
  { id: "zayi", label: "Zayi Olan Ürünler" },
  { id: "silinen_urun", label: "Silinen Ürünler" },
  { id: "silinen_tahsilat", label: "Silinen Tahsilatlar" },
];

export default function ReportsView() {
  const [activeTab, setActiveTab] = useState<TabKey>("ozet");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const today = new Date();
  const dateStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
  const dateRange = `(${dateStr} 06:00 - ${dateStr} 23:45)`;

  const renderSummaryCards = () => {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", padding: "24px", paddingTop: 0 }}>
        
        {/* Brüt Kâr */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", position: "relative", paddingTop: "24px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ position: "absolute", top: "-12px", left: "16px", backgroundColor: "#0f766e", padding: "16px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <PieChart color="white" size={24} />
          </div>
          <div style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Brüt Kâr</div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111827" }}>₺0,00</div>
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af", textAlign: "right" }}>(Ciro - Satılan Ürün Maliyeti)</div>
        </div>

        {/* Net Kâr */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", position: "relative", paddingTop: "24px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ position: "absolute", top: "-12px", left: "16px", backgroundColor: "#4338ca", padding: "16px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <CheckSquare color="white" size={24} />
          </div>
          <div style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Net Kâr</div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111827" }}>₺0,00</div>
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af", textAlign: "right" }}>(Brüt Kâr - Gider Toplamı)</div>
        </div>

        {/* Alınan Ödemeler */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", position: "relative", paddingTop: "24px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ position: "absolute", top: "-12px", left: "16px", backgroundColor: "#ea580c", padding: "16px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <FilePlus color="white" size={24} />
          </div>
          <div style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Alınan Ödemeler</div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111827" }}>₺0,00</div>
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af", textAlign: "right" }}>Açık Hesap Tahsilatlar: 0,00 | Adisyonlu Tahsilatlar: 0,00</div>
        </div>

        {/* Tahsil Edilmemiş Tutar */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", position: "relative", paddingTop: "24px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ position: "absolute", top: "-12px", left: "16px", backgroundColor: "#65a30d", padding: "16px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Utensils color="white" size={24} />
          </div>
          <div style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Tahsil Edilmemiş Tutar</div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111827" }}>₺0,00</div>
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af", textAlign: "right" }}>Açık Hesap Detayları için Açık Hesap Hareketleri<br/>Raporunu İnceleyiniz</div>
        </div>

        {/* Satılan Ürün Maliyeti */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", position: "relative", paddingTop: "24px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ position: "absolute", top: "-12px", left: "16px", backgroundColor: "#3b82f6", padding: "16px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Receipt color="white" size={24} />
          </div>
          <div style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Satılan Ürün Maliyeti</div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111827" }}>₺0,00</div>
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af", textAlign: "right" }}>Satış Anındaki Ortalama Maliyet</div>
        </div>

        {/* Toplam Masraf */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", position: "relative", paddingTop: "24px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ position: "absolute", top: "-12px", left: "16px", backgroundColor: "#1d4ed8", padding: "16px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <TrendingDown color="white" size={24} />
          </div>
          <div style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Toplam Masraf</div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111827" }}>₺0,00</div>
          </div>
          <div style={{ fontSize: "12px", color: "#3b82f6", textAlign: "right", cursor: "pointer" }}>Ödeme Tipi Detayı</div>
        </div>

        {/* İade Tutarı */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", position: "relative", paddingTop: "24px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ position: "absolute", top: "-12px", left: "16px", backgroundColor: "#b91c1c", padding: "16px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <RefreshCw color="white" size={24} />
          </div>
          <div style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>İade Tutarı</div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111827" }}>₺0,00</div>
          </div>
        </div>

        {/* Toplam Bahşiş */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", position: "relative", paddingTop: "24px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ position: "absolute", top: "-12px", left: "16px", backgroundColor: "#15803d", padding: "16px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <ClipboardList color="white" size={24} />
          </div>
          <div style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Toplam Bahşiş</div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111827" }}>₺0,00</div>
          </div>
          <div style={{ fontSize: "12px", color: "#16a34a", textAlign: "right" }}>Ciroya Göre Oran: %0.00</div>
        </div>

        {/* Kurye Başarı Yüzdesi */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", position: "relative", paddingTop: "24px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ position: "absolute", top: "-12px", left: "16px", backgroundColor: "#0ea5e9", padding: "16px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Bike color="white" size={24} />
          </div>
          <div style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Kurye Başarı Yüzdesi</div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111827" }}>%0</div>
          </div>
        </div>

      </div>
    );
  };

  const renderCharts = () => {
    return (
      <div style={{ display: "flex", gap: "24px", padding: "0 24px 24px 24px" }}>
        
        {/* Chart 1 */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "16px" }}>Sipariş Tipine Göre Satışlar (Adet)</h3>
          <div style={{ display: "flex", height: "300px" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: "16px", paddingBottom: "40px" }}>
              {["Kasadan Satış(0)", "Paket Servis(0)", "Masa Siparişi(0)", "Yemek Sepeti(0)", "Mobil Siparişler(0)", "Web Siparişleri(0)"].map(label => (
                <div key={label} style={{ fontSize: "11px", color: "#4b5563", textAlign: "right", height: "30px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>{label}</div>
              ))}
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100% - 40px)", borderLeft: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{ borderTop: "1px solid #f3f4f6", width: "100%", height: "30px" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#0ea5e9", fontSize: "12px", marginTop: "8px", fontWeight: 500 }}>
                <span>0.0</span><span>0.5</span><span>1.0</span><span>1.5</span><span>2.0</span>
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginTop: "16px", fontSize: "11px", color: "#111827" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "12px", backgroundColor: "#3b82f6" }}/> Kasadan Satış(0)</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "12px", backgroundColor: "#111827" }}/> Paket Servis(0)</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "12px", backgroundColor: "#f59e0b" }}/> Masa Siparişi(0)</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "12px", backgroundColor: "#ef4444" }}/> Yemek Sepeti(0)</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "12px", backgroundColor: "#8b5cf6" }}/> Mobil Siparişler(0)</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "12px", backgroundColor: "#475569" }}/> Web Siparişleri(0)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2 */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "16px" }}>Ödeme Tipi İstatistikleri(₺)</h3>
          <div style={{ display: "flex", height: "300px" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: "16px", paddingBottom: "24px" }}>
              {[10,9,8,7,6,5,4,3,2,1,0].map(val => (
                <div key={val} style={{ fontSize: "11px", color: "#111827", textAlign: "right" }}>{val}</div>
              ))}
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100% - 24px)", borderLeft: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
                {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
                  <div key={i} style={{ borderTop: "1px solid #f3f4f6", width: "100%", height: "100%" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#0ea5e9", fontSize: "12px", marginTop: "8px", fontWeight: 500, paddingLeft: "8px" }}>
                <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderPayments = () => {
    return (
      <div style={{ padding: "0 24px 24px 24px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280", letterSpacing: "1px", marginBottom: "16px", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px", display: "inline-block" }}>ÖDEMELER</h3>
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", padding: "40px", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
          Bu dönem için ödeme verisi bulunmamaktadır.
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === "ozet") {
      return (
        <div style={{ paddingTop: "24px" }}>
          {renderSummaryCards()}
          {renderCharts()}
          {renderPayments()}
        </div>
      );
    }
    
    if (activeTab === "tum_adisyonlar") {
      return (
        <div style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280", letterSpacing: "0.5px", marginBottom: "16px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>ADİSYONLU TAHSİLATLAR ((0) ADET ADİSYON BULUNUYOR.)</h3>
          
          <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280", letterSpacing: "0.5px", marginBottom: "16px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginTop: "40px" }}>AÇIK HESAP TAHSİLAT HAREKETLERİ (CARİ MÜŞTERİLERDEN YAPILAN TAHSİLATLAR) (0 MÜŞTERİYE AİT TAHSİLAT BULUNUYOR.)</h3>
          
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Açık Hesap Müşterileri</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Tahsilat Tarihi <span style={{ color: "#ef4444" }}>⇅</span></th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Kullanıcı</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>İndirim(₺)</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>Tutar(₺)</th>
                  <th style={{ padding: "16px", textAlign: "right", fontWeight: 500 }}>Tahsilat</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6", borderTop: "1px solid #e5e7eb", fontWeight: 500, color: "#111827" }}>
                  <td style={{ padding: "16px" }}>Toplam</td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                  <td style={{ padding: "16px", textAlign: "right" }}></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style={{ backgroundColor: "#f3f4f6", padding: "16px", marginTop: "16px", borderRadius: "4px", textAlign: "right", color: "#22c55e", fontWeight: 500, fontSize: "15px" }}>
            Toplam Tahsilat (Adisyonlu Tahsilat + Açık Hesap Tahsilat): ₺0,00
          </div>
        </div>
      );
    }
    
    if (activeTab === "yogunluk") {
      return (
        <div style={{ padding: "24px", minHeight: "60vh", display: "flex", flexDirection: "column" }}>
        </div>
      );
    }
    
    if (activeTab === "masa" || activeTab === "paket" || activeTab === "iptal_iade" || activeTab === "masraflar") {
      const titleMap = {
        "masa": "GARSON BAZLI ÖDEME DETAYLARI",
        "paket": "KURYE BAZLI ÖDEME TİPLERİ",
        "iptal_iade": "İPTAL / İADE SİPARİŞLERİNİZ",
        "masraflar": "YAPILAN MASRAF DETAYLARI"
      };
      return (
        <div style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280", letterSpacing: "0.5px", marginBottom: "16px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>{titleMap[activeTab as "masa" | "paket" | "iptal_iade" | "masraflar"]}</h3>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: "14px", fontWeight: 500, letterSpacing: "0.5px" }}>
            LÜTFEN FİLTRELEME YAPINIZ
          </div>
        </div>
      );
    }

    if (activeTab === "gel_al") {
      return (
        <div style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280", letterSpacing: "0.5px", marginBottom: "16px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>ADİSYONLU TAHSİLATLAR ((0) ADET ADİSYON BULUNUYOR.)</h3>
          
          <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280", letterSpacing: "0.5px", marginBottom: "16px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginTop: "40px" }}>AÇIK HESAP TAHSİLAT HAREKETLERİ (CARİ MÜŞTERİLERDEN YAPILAN TAHSİLATLAR) (0 MÜŞTERİYE AİT TAHSİLAT BULUNUYOR.)</h3>
          
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Açık Hesap Müşterileri</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Tahsilat Tarihi <span style={{ color: "#ef4444" }}>⇅</span></th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Kullanıcı</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>İndirim(₺)</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>Tutar(₺)</th>
                  <th style={{ padding: "16px", textAlign: "right", fontWeight: 500 }}>Tahsilat</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6", borderTop: "1px solid #e5e7eb", fontWeight: 500, color: "#111827" }}>
                  <td style={{ padding: "16px" }}>Toplam</td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                  <td style={{ padding: "16px", textAlign: "right" }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (activeTab === "acik_hesap") {
      return (
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#ef4444", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>AÇIK HESAP TAHSİLAT HAREKETLERİ (CARİ MÜŞTERİLERDEN YAPILAN TAHSİLATLAR)</h3>
            <div style={{ fontSize: "11px", color: "#6b7280", borderBottom: "1px solid #e5e7eb", paddingBottom: "16px" }}>(0 MÜŞTERİYE AİT TAHSİLAT BULUNUYOR.)</div>
          </div>
          
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: "40px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Müşteri</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Tahsilat Tarihi <span style={{ color: "#ef4444" }}>⇅</span></th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Kullanıcı</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>İndirim(₺)</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>Tutar(₺)</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Ödeme Tipi</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6", borderTop: "1px solid #e5e7eb", fontWeight: 500, color: "#111827" }}>
                  <td style={{ padding: "16px" }}>Toplam</td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                  <td style={{ padding: "16px", textAlign: "left" }}></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#ef4444", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>AÇIK HESAP BORÇ HAREKETLERİ (CARİ MÜŞTERİLERİN HESABINA AKTARILAN TAHSİLATLAR)</h3>
            <div style={{ fontSize: "11px", color: "#6b7280", borderBottom: "1px solid #e5e7eb", paddingBottom: "16px" }}>(0 ADET ADİSYON BULUNUYOR.)</div>
          </div>
          
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: "40px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>#Adisyon No</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Açılış Tarihi <span style={{ color: "#ef4444" }}>⇅</span></th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Sipariş Tipi</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Masa Adı</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Müşteri</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Kullanıcı</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>İndirim(₺)</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>Tutar(₺)</th>
                  <th style={{ padding: "16px", textAlign: "right", fontWeight: 500 }}>Tahsil Edilmeyen Tutar(₺)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6", borderTop: "1px solid #e5e7eb", fontWeight: 500, color: "#111827" }}>
                  <td style={{ padding: "16px" }}>Toplam</td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0</td>
                  <td style={{ padding: "16px", textAlign: "right" }}>₺0</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#ef4444", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>AÇIK HESAP BAKİYE GÜNCELLEME HAREKETLERİ</h3>
            <div style={{ fontSize: "11px", color: "#6b7280", borderBottom: "1px solid #e5e7eb", paddingBottom: "16px" }}>(0 ADET HAREKET BULUNUYOR.)</div>
          </div>
          
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Müşteri</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Tahsilat Tarihi <span style={{ color: "#ef4444" }}>⇅</span></th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Kullanıcı</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>İşlem Tipi</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Tutar(₺)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6", borderTop: "1px solid #e5e7eb", fontWeight: 500, color: "#111827" }}>
                  <td style={{ padding: "16px" }}>Toplam</td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}>
                    <div>Borç Fişi Toplam (0 Adet)</div>
                    <div>₺0,00</div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div>Alacak Fişi Toplam (0 Adet)</div>
                    <div>₺0,00</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (activeTab === "odenmezler") {
      return (
        <div style={{ padding: "24px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>#Adisyon No</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Açılış Tarihi <span style={{ color: "#ef4444" }}>⇅</span></th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Sipariş Tipi</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Masa Adı</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Ödenmez</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>Tutar(₺)</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>Tahsilat(₺)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6", borderTop: "1px solid #e5e7eb", fontWeight: 500, color: "#111827" }}>
                  <td style={{ padding: "16px" }}>Toplam</td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px" }}></td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (activeTab === "garson") {
      return (
        <div style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280", letterSpacing: "0.5px", marginBottom: "16px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>GARSON BAZLI SATIŞLAR</h3>
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Ürün Adı</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>Adet</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>Bahşiş Tutarı(₺)</th>
                  <th style={{ padding: "16px", textAlign: "center", fontWeight: 500 }}>Tutar(₺)</th>
                  <th style={{ padding: "16px", textAlign: "right", fontWeight: 500 }}>Ürün Bazlı İndirim(₺)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6", borderTop: "1px solid #e5e7eb", fontWeight: 500, color: "#111827" }}>
                  <td style={{ padding: "16px" }}>Genel Toplam</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>0</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₺0,00</td>
                  <td style={{ padding: "16px", textAlign: "right" }}>₺0,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (activeTab === "zayi") {
      return (
        <div style={{ padding: "24px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Ürün</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Zayi Nedeni</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Adet</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Zayi Tarihi</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Eklenme Tarihi</th>
                  <th style={{ padding: "16px", textAlign: "right", fontWeight: 500 }}>Maliyet Tutarı(₺)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6", borderTop: "1px solid #e5e7eb", fontWeight: 500, color: "#111827" }}>
                  <td colSpan={5}></td>
                  <td style={{ padding: "16px", textAlign: "right" }}>TOPLAM: ₺0,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (activeTab === "silinen_urun") {
      return (
        <div style={{ padding: "24px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Sipariş numarası...</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Sipariş Detay No</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Ürün Adı</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Ürün Tutarı ₺</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Miktar</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>İptal Eden Kullanıcı</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>İptal Nedeni</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#f3f4f6", borderTop: "1px solid #e5e7eb", fontWeight: 500, color: "#111827" }}>
                  <td colSpan={3}></td>
                  <td style={{ padding: "16px" }}>Toplam Tutar: ₺0,00</td>
                  <td style={{ padding: "16px" }}>Toplam Miktar: 0</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (activeTab === "silinen_tahsilat") {
      return (
        <div style={{ padding: "24px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#374151" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Sipariş numarası...</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Ödeme Tipi</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>Tutar</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>İptal Eden Kullanıcı</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: 500 }}>İptal Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {/* No summary row needed based on screenshot */}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
        {/* Fallback for other tabs */}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", backgroundColor: "#f3f4f6" }}>
      
      {/* Left Sidebar Menu */}
      <div style={{ width: "260px", backgroundColor: "#f3f4f6", borderRight: "1px solid #e5e7eb", flexShrink: 0 }}>
        <div style={{ padding: "16px 24px", fontSize: "16px", fontWeight: 600, color: "#111827", borderBottom: "1px solid #e5e7eb" }}>
          Gün Sonu Raporları
        </div>
        <div style={{ overflowY: "auto", height: "calc(100vh - 120px)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                backgroundColor: activeTab === tab.id ? "#e5e7eb" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: 600,
                color: "#111827",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = "#e5e7eb"; }}
              onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {tab.label}
              {activeTab === tab.id && <ChevronRight size={16} color="#4b5563" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: "auto", height: "calc(100vh - 64px)" }}>
        
        {/* Header */}
        <div style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, backgroundColor: "#f3f4f6", zIndex: 10 }}>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#111827" }}>
            {TABS.find(t => t.id === activeTab)?.label} <span style={{ color: "#6b7280", fontWeight: 400 }}>{dateRange}</span>
          </h1>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <Filter size={16} />
              Filtrele
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              <Download size={16} />
              İndir
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              <Printer size={16} />
              Yazdır
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}

      </div>

      {/* Filter Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[380px] bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[16px] font-medium text-gray-800">Filtreler</h2>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-auto px-6 py-4 flex flex-col gap-6">
              
              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Tarih</label>
                <select className="w-full text-sm outline-none bg-transparent appearance-none">
                  <option>Bugün</option>
                  <option>Dün</option>
                  <option>Bu Hafta</option>
                  <option>Bu Ay</option>
                </select>
                <ChevronRight className="absolute right-0 bottom-2 w-4 h-4 text-gray-400 rotate-90" />
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Başlangıç Tarihi</label>
                <input type="text" defaultValue="20.09.2026" className="w-full text-sm outline-none bg-transparent" />
                <div className="absolute right-0 bottom-1.5 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Bitiş Tarihi</label>
                <input type="text" defaultValue="20.09.2026" className="w-full text-sm outline-none bg-transparent" />
                <div className="absolute right-0 bottom-1.5 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Başlangıç Saati</label>
                <input type="text" defaultValue="06:00" className="w-full text-sm outline-none bg-transparent" />
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Bitiş Saati*</label>
                <input type="text" defaultValue="23:45" className="w-full text-sm outline-none bg-transparent" />
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Sipariş Tipi</label>
                <select className="w-full text-sm outline-none bg-transparent appearance-none">
                  <option></option>
                </select>
                <ChevronRight className="absolute right-0 bottom-2 w-4 h-4 text-gray-400 rotate-90" />
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3 text-[14px] font-medium text-white bg-[#dc3545] rounded hover:bg-red-700 transition-colors"
              >
                Filtrele
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
