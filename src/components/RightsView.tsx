"use client";

import React, { useState } from "react";
import { User, Save, Search, Info } from "lucide-react";

const ROLES = ["Garson", "Mutfak", "Kurye", "Kasa", "Müdür", "Çağrı Merkezi"];

const PERMISSIONS = [
  {
    id: "table_area",
    title: "Masa ve Bölge İşlemleri.",
    description: "Kullanıcının salon düzenini yönetmesini; bölge ve masa eklemesini, düzenlemesini ve silmesini sağlar."
  },
  {
    id: "general_defs",
    title: "Restoran ile ilgili genel tanımlamalar.",
    description: "Kullanıcının işletmenin temel tanımlarını yönetmesini sağlar: KDV oranları, indirimler, müşteriler, kuver/garsoniye, yazıcılar ve cihazlar."
  },
  {
    id: "general_users",
    title: "Genel kullanıcı işlemleri.",
    description: "Kullanıcının yeni kullanıcı eklemesini, mevcut kullanıcıları düzenlemesini, silmesini ve şifrelerini yenilemesini sağlar."
  },
  {
    id: "auth_ops",
    title: "Yetkilendirme işlemleri",
    description: "Kullanıcının rollere yetki tanımlamasını veya mevcut yetkileri kaldırmasını sağlar."
  },
  {
    id: "stock_entry",
    title: "Stok girişi,stok sayımı işlemleri.",
    description: "Kullanıcının stok girişi yapmasını, sayım kaydetmesini ve açılış maliyeti girmesini sağlar."
  },
  {
    id: "package_integration",
    title: "Paket Sipariş Entegrasyon durumunu değiştirebilir",
    description: "Kullanıcının Yemeksepeti ve Trendyol gibi satış kanallarını sipariş almaya açmasını veya kapatmasını sağlar."
  },
  {
    id: "b2b_order",
    title: "B2B Sipariş Verebilir",
    description: "Kullanıcının merkeze B2B siparişi oluşturmasını, siparişi onaya göndermesini, B2B ödeme geçmişini ve sipariş itirazlarını görüntülemesini sağlar."
  },
  {
    id: "view_stock",
    title: "Stok Miktarlarını görüntüleyebilir.",
    description: "Kullanıcının ürünlerin kalan stok miktarını görüntülemesini sağlar."
  },
  {
    id: "central_integration",
    title: "Merkezi entegrasyon durumlarını yönetebilir",
    description: "Kullanıcının merkezi entegrasyon ayarlarını yapılandırmasını sağlar."
  }
];

// Initial mock state where 'Müdür' has mostly everything, and 'Garson' has some.
const initialRights: Record<string, Record<string, boolean>> = {
  table_area: { "Müdür": true },
  general_defs: { "Müdür": true },
  general_users: { "Müdür": true },
  auth_ops: {},
  stock_entry: {},
  package_integration: {},
  b2b_order: {},
  view_stock: { "Garson": true, "Kasa": true, "Müdür": true, "Çağrı Merkezi": true },
  central_integration: {}
};

export default function RightsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rights, setRights] = useState(initialRights);

  const filteredPermissions = PERMISSIONS.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRight = (permId: string, role: string) => {
    setRights(prev => ({
      ...prev,
      [permId]: {
        ...prev[permId],
        [role]: !prev[permId]?.[role]
      }
    }));
  };

  const handleSave = () => {
    // Save logic
    console.log("Saved rights:", rights);
    // You could show a success toast here
  };

  return (
    <div style={{ padding: "24px", minHeight: "calc(100vh - 64px)", backgroundColor: "#f3f4f6" }}>
      
      {/* Main Card */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "8px", 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e5e7eb",
        overflow: "hidden"
      }}>
        
        {/* Header Section */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ 
              backgroundColor: "#ea580c", // Orange background for icon
              padding: "16px", 
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <User size={24} color="white" />
            </div>
            
            <div style={{ paddingTop: "4px" }}>
              <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#111827" }}>
                Yetki / İzin Ekranı
              </h1>
              <div style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>
                Kullanıcılarınızın yetkilerini/izinlerini buradan güncelleyebilirsiniz
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#dc2626", // Red button
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
          >
            <Save size={18} />
            Kaydet
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#fafafa" }}>
          <div style={{ position: "relative" }}>
            <Search size={18} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Yetki ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 40px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
                outline: "none",
                color: "#111827",
                backgroundColor: "white",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#ea580c"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
        </div>

        {/* Permissions Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                  Restaurant Tanım Yetkilendirmeleri
                </th>
                {ROLES.map(role => (
                  <th key={role} style={{ textAlign: "center", padding: "16px 12px", fontSize: "14px", fontWeight: 500, color: "#374151", width: "80px" }}>
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.map((perm, index) => (
                <tr key={perm.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "16px 24px", verticalAlign: "top" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <Info size={16} color="#9ca3af" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "4px" }}>
                          {perm.title}
                        </div>
                        <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.4" }}>
                          {perm.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  {ROLES.map(role => {
                    const isChecked = rights[perm.id]?.[role] || false;
                    return (
                      <td key={role} style={{ textAlign: "center", padding: "16px 12px", verticalAlign: "top" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "2px" }}>
                          <button
                            onClick={() => toggleRight(perm.id, role)}
                            style={{
                              width: "20px",
                              height: "20px",
                              border: isChecked ? "none" : "2px solid #d1d5db",
                              borderRadius: "4px",
                              backgroundColor: isChecked ? "#dc2626" : "transparent",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 0
                            }}
                          >
                            {isChecked && (
                              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.00004 7.79998L1.20004 4.99998L0.266708 5.93331L4.00004 9.66665L12 1.66665L11.0667 0.733315L4.00004 7.79998Z" fill="white"/>
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {filteredPermissions.length === 0 && (
                <tr>
                  <td colSpan={ROLES.length + 1} style={{ textAlign: "center", padding: "40px 24px", color: "#6b7280", fontSize: "14px" }}>
                    Aranan kriterlere uygun yetki bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
