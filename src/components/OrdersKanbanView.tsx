"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Settings,
  Globe,
  Clock,
  Bike,
  ExternalLink,
  Printer,
  CreditCard,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { KanbanOrder } from "@/data/posData";

/* ─── Custom SVGs (pixel-matched to live Adisyo icons) ─── */

// Chef hat / hazırlanıyor kolonu ikonu
function ChefHatIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  );
}

// Cloche / yemek kapağı ikonu (servis çanı)
function ClocheIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18" />
      <path d="M5 20a7 7 0 1 1 14 0" />
      <path d="M12 4v3" />
      <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Masa avatarı — sarı daire + masa SVG
function TableAvatar() {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        backgroundColor: "#f5b342",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <rect x="1" y="8" width="22" height="3" rx="1.5" />
        <rect x="4" y="11" width="3" height="8" rx="1" />
        <rect x="17" y="11" width="3" height="8" rx="1" />
        <rect x="7" y="11" width="10" height="2.5" rx="0.5" />
      </svg>
    </div>
  );
}

// Gel Al avatarı — yeşil daire + takeaway SVG
function TakeawayAvatar() {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        backgroundColor: "#4caf76",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <path d="M3 6h18" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" fill="none" />
        <path d="M16 10a4 4 0 01-8 0" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

interface OrdersKanbanViewProps {
  orders: KanbanOrder[];
  onSelectOrder: (order: KanbanOrder) => void;
}

export default function OrdersKanbanView({
  orders,
  onSelectOrder,
}: OrdersKanbanViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [integrationCollapsed, setIntegrationCollapsed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const integrationItems = filtered.filter((o) => o.status === "integration");
  const preparingItems = filtered.filter((o) => o.status === "preparing");
  const waitingItems = filtered.filter((o) => o.status === "waiting");
  const deliveryItems = filtered.filter((o) => o.status === "delivery");

  // Full date string like "19.09.2026 16:36"
  function fullDate(time: string) {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, "0");
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const y = now.getFullYear();
    return `${d}.${m}.${y} ${time}`;
  }

  function openMenu(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    const r = btn.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 6, left: r.left - 160 });
    setOpenMenuId(id);
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#eef0f5",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* ── Top bar: search + Ayarlar ── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
          minHeight: 52,
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", width: 300 }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri adı veya sipariş no ile arama..."
            style={{
              width: "100%",
              paddingLeft: 30,
              paddingRight: 10,
              paddingTop: 7,
              paddingBottom: 7,
              fontSize: 12,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              outline: "none",
              color: "#374151",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* Ayarlar */}
        <button
          type="button"
          onClick={() => alert("Kanban Görünüm Ayarları")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 12px",
            background: "transparent",
            border: "none",
            borderRadius: 8,
            color: "#374151",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <Settings size={14} />
          <span>Ayarlar</span>
        </button>
      </div>

      {/* ── Kanban Board ── */}
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          gap: 16,
          padding: "16px",
        }}
      >
        {/* ─── Col 1: Entegrasyon Siparişleri ─── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: integrationCollapsed ? 48 : undefined,
            flex: integrationCollapsed ? "none" : 1,
            minWidth: integrationCollapsed ? 48 : 240,
            maxWidth: integrationCollapsed ? 48 : 340,
            transition: "all 0.25s ease",
            background: "#fff",
            borderRadius: 16,
            padding: integrationCollapsed ? "10px 6px" : "12px",
            border: "1px solid #e9eaec",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
            }}
          >
            {!integrationCollapsed && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "#fff8f2",
                  border: "1px solid #f5d5b0",
                  borderRadius: 20,
                  padding: "7px 12px",
                  color: "#c47e30",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Globe size={14} />
                <span>Entegrasyon Siparişleri ({integrationItems.length})</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIntegrationCollapsed((p) => !p)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#6b7280",
                flexShrink: 0,
              }}
            >
              {integrationCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {!integrationCollapsed && (
            <div style={{ flex: 1, overflowY: "auto", marginTop: 10 }}>
              {integrationItems.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onSelect={() => onSelectOrder(order)}
                  onOpenMenu={(e) => openMenu(e, order.id)}
                  fullDate={fullDate}
                />
              ))}
              {integrationItems.length === 0 && <EmptyCol />}
            </div>
          )}
        </div>

        {/* ─── Col 2: Hazırlanıyor ─── */}
        <div style={colWrapStyle}>
          <div
            style={{
              ...colHeaderStyle,
              background: "#fff5f5",
              border: "1px solid #fbbdbd",
              color: "#c43030",
            }}
          >
            <ChefHatIcon size={15} />
            <span>Hazırlanıyor ({preparingItems.length} /{preparingItems.length} )</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {preparingItems.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={() => onSelectOrder(order)}
                onOpenMenu={(e) => openMenu(e, order.id)}
                fullDate={fullDate}
              />
            ))}
            {preparingItems.length === 0 && <EmptyCol />}
          </div>
        </div>

        {/* ─── Col 3: Bekleyen Siparişler ─── */}
        <div style={colWrapStyle}>
          <div
            style={{
              ...colHeaderStyle,
              background: "#fffcf0",
              border: "1px solid #f5e0a0",
              color: "#b59020",
            }}
          >
            <Clock size={15} />
            <span>Bekleyen Siparişler ({waitingItems.length})</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {waitingItems.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={() => onSelectOrder(order)}
                onOpenMenu={(e) => openMenu(e, order.id)}
                fullDate={fullDate}
              />
            ))}
            {waitingItems.length === 0 && <EmptyCol />}
          </div>
        </div>

        {/* ─── Col 4: Teslimata Çıkanlar ─── */}
        <div style={{ ...colWrapStyle, marginRight: 0 }}>
          <div
            style={{
              ...colHeaderStyle,
              background: "#f0f4ff",
              border: "1px solid #b5c5f5",
              color: "#3055c4",
            }}
          >
            <Bike size={15} />
            <span>Teslimata Çıkanlar ({deliveryItems.length})</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {deliveryItems.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={() => onSelectOrder(order)}
                onOpenMenu={(e) => openMenu(e, order.id)}
                fullDate={fullDate}
              />
            ))}
            {deliveryItems.length === 0 && <EmptyCol />}
          </div>
        </div>
      </div>

      {/* ─── Three-dots context menu ─── */}
      {openMenuId && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onMouseDown={() => setOpenMenuId(null)}
          />
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              width: 200,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 50,
              overflow: "hidden",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {[
              { label: "Adisyonu Aç", icon: ExternalLink },
              { label: "Fiş Yazdır", icon: Printer },
              { label: "Öde", icon: CreditCard },
              { label: "Sipariş İptal Et", icon: null, danger: true },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setOpenMenuId(null)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  fontSize: 13,
                  color: item.danger ? "#dc2626" : "#374151",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  borderTop: item.danger ? "1px solid #f3f4f6" : "none",
                }}
              >
                {item.icon && <item.icon size={14} />}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Shared styles ─── */
const colWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 240,
  maxWidth: 340,
  background: "#fff",
  borderRadius: 16,
  padding: 12,
  border: "1px solid #e9eaec",
  marginRight: 0,
};

const colHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  padding: "8px 16px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 10,
  flexShrink: 0,
};

function EmptyCol() {
  return (
    <div
      style={{
        textAlign: "center",
        color: "#9ca3af",
        fontSize: 12,
        padding: "32px 0",
      }}
    />
  );
}

/* ─── Order Card ─── */
interface OrderCardProps {
  order: KanbanOrder;
  onSelect: () => void;
  onOpenMenu: (e: React.MouseEvent) => void;
  fullDate: (t: string) => string;
}

function OrderCard({ order, onSelect, onOpenMenu, fullDate }: OrderCardProps) {
  const isTable = order.type === "table";

  return (
    <div
      onClick={onSelect}
      style={{
        background: "#fff",
        border: "1px solid #e9eaec",
        borderRadius: 14,
        marginBottom: 10,
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#c9cdd6";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#e9eaec";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
      }}
    >
      {/* Geciken Sipariş badge */}
      <div style={{ padding: "10px 14px 0" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 600,
            color: "#c47e30",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: 20,
            padding: "2px 10px",
          }}
        >
          Geciken Sipariş
        </span>
      </div>

      {/* Avatar + Title + OrderNo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px 0" }}>
        {isTable ? <TableAvatar /> : <TakeawayAvatar />}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2328", marginBottom: 2 }}>
            {order.title}
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>
            {fullDate(order.time)}
          </div>
        </div>

        <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", flexShrink: 0 }}>
          {order.orderNo}
        </span>
      </div>

      {/* Amount */}
      <div style={{ textAlign: "right", padding: "10px 14px 10px" }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#1f2328" }}>
          ₺{order.totalAmount.toFixed(2).replace(".", ",")}
        </span>
      </div>

      {/* Action bar */}
      <div
        style={{
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "6px 4px",
        }}
      >
        {/* Adisyonu Aç */}
        <IconBtn title="Adisyonu Aç" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          <ExternalLink size={16} />
        </IconBtn>

        {/* Yazdır — only for table orders */}
        {isTable && (
          <IconBtn title="Yazdır" onClick={(e) => { e.stopPropagation(); alert("Fiş yazdırılıyor..."); }}>
            <Printer size={16} />
          </IconBtn>
        )}

        {/* Öde */}
        <IconBtn title="Öde" onClick={(e) => { e.stopPropagation(); alert("Ödeme ekranı..."); }}>
          <CreditCard size={16} />
        </IconBtn>

        {/* Cloche */}
        <IconBtn title="Hazır İşaretle" onClick={(e) => { e.stopPropagation(); alert("Sipariş hazır!"); }}>
          <ClocheIcon size={16} />
        </IconBtn>

        {/* Üç nokta */}
        <IconBtn title="Daha fazla" onClick={onOpenMenu}>
          <MoreHorizontal size={16} />
        </IconBtn>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 34,
        height: 34,
        border: "none",
        borderRadius: 8,
        background: hovered ? "#f3f4f6" : "transparent",
        color: hovered ? "#374151" : "#9ca3af",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.12s",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
