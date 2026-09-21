"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  X,
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowUpDown
} from "lucide-react";

interface UserItem {
  id: number;
  no: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  lastLogin: string;
}

const initialUsers: UserItem[] = [
  { id: 1, no: "1", name: "Ahmet Can", email: "softdeap@gmail.com", phone: "5443071160", role: "Yönetici", lastLogin: "20.09.2026 13:27 / 20.09.2026 16:23" },
  { id: 2, no: "2", name: "ali", email: "", phone: "555555555", role: "Garson", lastLogin: "- / -" },
];

export default function UsersView() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    role: "Garson",
    name: "",
    email: "",
    phone: "",
    password: "",
    region: "",
    callerId: false,
    blockLogin: false,
    usePin: false,
  });

  const handleSave = () => {
    // Basic save logic for demo
    setUsers((prev) => [
      ...prev,
      {
        id: Date.now(),
        no: String(prev.length + 1),
        name: formData.name || "Yeni Kullanıcı",
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        lastLogin: "- / -",
      },
    ]);
    setIsModalOpen(false);
    setFormData({
      role: "Garson",
      name: "",
      email: "",
      phone: "",
      password: "",
      region: "",
      callerId: false,
      blockLogin: false,
      usePin: false,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
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
              backgroundColor: "#d97706", // Orange background for icon
              padding: "16px", 
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Users size={24} color="white" />
            </div>
            
            <div style={{ paddingTop: "4px" }}>
              <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#111827" }}>
                Kullanıcılar
              </h1>
              <div style={{ marginTop: "8px", fontSize: "14px", color: "#4b5563", fontWeight: 500 }}>
                Kullanıcı Sayısı : {users.length}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#dc2626", // Red button
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
          >
            <Plus size={16} />
            Ekle
          </button>
        </div>

        {/* Table Section */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>No</th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    Ad/Soyad
                    <ArrowUpDown size={14} color="#dc2626" />
                  </div>
                </th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Email</th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>No</th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Görev</th>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Son Giriş / Çıkış Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563" }}>{user.no}</td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563" }}>{user.name}</td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563" }}>{user.email}</td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {user.phone}
                      {user.phone && (
                        <button 
                          onClick={() => copyToClipboard(user.phone)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af", display: "flex" }}
                          title="Kopyala"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#111827", fontWeight: 500 }}>{user.role}</td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#9ca3af" }}>{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "4px",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            {/* Modal Header */}
            <div style={{ padding: "24px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 500, color: "#111827" }}>Kullanıcı Ekle</h2>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>Yeni eklemek istediğiniz kullanıcının bilgilerini giriniz</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "0 24px 24px" }}>
              
              {/* Role Select */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Görev Seçiniz*</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      border: "none",
                      borderBottom: "1px solid #d1d5db",
                      fontSize: "14px",
                      outline: "none",
                      appearance: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      color: "#111827"
                    }}
                  >
                    <option value="Garson">Garson</option>
                    <option value="Yönetici">Yönetici</option>
                    <option value="Kasiyer">Kasiyer</option>
                  </select>
                  <ChevronDown size={16} color="#9ca3af" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* Name & Email Row */}
              <div style={{ display: "flex", gap: "24px", marginBottom: "20px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Ad Soyad*</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%", padding: "8px 0", border: "none", borderBottom: "1px solid #d1d5db",
                      fontSize: "14px", outline: "none", color: "#111827"
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>E-Mail (İsteğe Bağlı)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%", padding: "8px 0", border: "none", borderBottom: "1px solid #d1d5db",
                      fontSize: "14px", outline: "none", color: "#111827"
                    }}
                  />
                </div>
              </div>

              {/* Phone & Password Row */}
              <div style={{ display: "flex", gap: "24px", marginBottom: "20px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Telefon Numarası*</label>
                  <div style={{ display: "flex", borderBottom: "1px solid #d1d5db" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingRight: "8px", borderRight: "1px solid #e5e7eb", marginRight: "8px" }}>
                      <span style={{ fontSize: "14px" }}>🇹🇷</span>
                      <span style={{ fontSize: "14px", color: "#111827" }}>+90</span>
                      <ChevronDown size={12} color="#9ca3af" />
                    </div>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        flex: 1, padding: "8px 0", border: "none",
                        fontSize: "14px", outline: "none", color: "#111827"
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Şifre Değiştir*</label>
                  <div style={{ position: "relative", borderBottom: "1px solid #d1d5db" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{
                        width: "100%", padding: "8px 24px 8px 0", border: "none",
                        fontSize: "14px", outline: "none", color: "#111827"
                      }}
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Region Select */}
              <div style={{ marginBottom: "32px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Bölge Seçiniz</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    style={{
                      width: "100%", padding: "8px 0", border: "none", borderBottom: "1px solid #d1d5db",
                      fontSize: "14px", outline: "none", appearance: "none", backgroundColor: "transparent",
                      cursor: "pointer", color: "#111827"
                    }}
                  >
                    <option value=""></option>
                    <option value="Tümü">Tüm Bölgeler</option>
                  </select>
                  <ChevronDown size={16} color="#9ca3af" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Caller ID Toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button 
                    onClick={() => setFormData({ ...formData, callerId: !formData.callerId })}
                    style={{ 
                      width: "36px", height: "20px", borderRadius: "10px", 
                      backgroundColor: formData.callerId ? "#dc2626" : "#9ca3af",
                      position: "relative", border: "none", cursor: "pointer", transition: "background-color 0.2s"
                    }}
                  >
                    <div style={{
                      width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white",
                      position: "absolute", top: "2px", left: formData.callerId ? "18px" : "2px",
                      transition: "left 0.2s"
                    }} />
                  </button>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>CallerID kullanıcısı</span>
                </div>

                {/* Block Login Toggle */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                    <button 
                      onClick={() => setFormData({ ...formData, blockLogin: !formData.blockLogin })}
                      style={{ 
                        width: "36px", height: "20px", borderRadius: "10px", 
                        backgroundColor: formData.blockLogin ? "#dc2626" : "#9ca3af",
                        position: "relative", border: "none", cursor: "pointer", transition: "background-color 0.2s"
                      }}
                    >
                      <div style={{
                        width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white",
                        position: "absolute", top: "2px", left: formData.blockLogin ? "18px" : "2px",
                        transition: "left 0.2s"
                      }} />
                    </button>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>Kullanıcı Girişi Engellensin</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginLeft: "48px" }}>
                    Aktif durumda iken kullanıcı Adisyo'ya giriş yapamaz.
                  </div>
                </div>

                {/* Pin Use Toggle */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                    <button 
                      onClick={() => setFormData({ ...formData, usePin: !formData.usePin })}
                      style={{ 
                        width: "36px", height: "20px", borderRadius: "10px", 
                        backgroundColor: formData.usePin ? "#dc2626" : "#9ca3af",
                        position: "relative", border: "none", cursor: "pointer", transition: "background-color 0.2s"
                      }}
                    >
                      <div style={{
                        width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white",
                        position: "absolute", top: "2px", left: formData.usePin ? "18px" : "2px",
                        transition: "left 0.2s"
                      }} />
                    </button>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>Pin Kullanılsın</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginLeft: "48px", lineHeight: "1.4" }}>
                    Birden fazla kullanıcının tek bir ekranı kullandığı durumlarda, kullanıcılar arasında hızlıca geçiş yapmak için kullanılır. Mail ve şifre ile giriş yapma zorunluluğu ortadan kalkar.
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 32px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
              >
                Ekle
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
