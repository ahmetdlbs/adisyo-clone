"use client";

import React, { useState } from "react";
import { Users, Plus, Upload, Download, Search, Info, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface Customer {
  id: string;
  no: number;
  firstName: string;
  lastName: string;
  phone1: string;
  phone2?: string;
  balance: number;
}

export default function RestaurantCustomersView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [balance, setBalance] = useState("0");

  const totalBalance = customers.reduce((acc, curr) => acc + curr.balance, 0);

  const handleOpenNew = () => {
    setFirstName("");
    setLastName("");
    setPhone1("");
    setPhone2("");
    setBalance("0");
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!firstName.trim()) return;

    setCustomers([
      ...customers,
      {
        id: Date.now().toString(),
        no: customers.length + 1,
        firstName,
        lastName,
        phone1,
        phone2,
        balance: parseFloat(balance) || 0,
      },
    ]);
    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone1.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full w-full bg-[#f4f6f8] p-6 overflow-hidden select-none relative">
      <div className="max-w-7xl w-full mx-auto bg-white border border-[#e5e7eb] rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
        
        {/* Header Section */}
        <div className="flex items-start justify-between p-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-[#e86c2e] rounded shadow-sm flex items-center justify-center shrink-0">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[18px] font-semibold text-gray-800">Müşteriler</h2>
              <p className="text-[13px] text-gray-500 font-medium">
                Müşteri Sayısı : {customers.length} &nbsp;&nbsp;&nbsp; Toplam Bakiye : ₺{totalBalance.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button className="flex items-center gap-2 text-[#d32f2f] hover:text-[#b71c1c] font-medium text-[14px] transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Müşterileri Yükle
            </button>
            <button className="flex items-center gap-2 text-[#d32f2f] hover:text-[#b71c1c] font-medium text-[14px] transition-colors cursor-pointer">
              <Download className="w-4 h-4" />
              İndir
            </button>
            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-4 py-2 rounded-md font-medium text-[14px] shadow-sm transition-colors cursor-pointer ml-2"
            >
              <Plus className="w-4 h-4" />
              Ekle
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 flex gap-6 mt-2 mb-6">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-b border-gray-300 py-1.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#d32f2f] transition-colors peer bg-transparent pr-8"
              placeholder=" "
            />
            <label className={`absolute left-0 text-[12px] transition-all duration-200 pointer-events-none ${
              searchTerm ? 'text-[#d32f2f] -top-3.5' : 'text-gray-400 -top-3.5 peer-focus:-top-3.5 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-[14px]'
            }`}>
              Müşteri Arama
            </label>
            <Search className="absolute right-0 top-1.5 w-4 h-4 text-gray-500" />
          </div>

          <div className="w-[200px] relative group">
            <select
              className="w-full border-b border-gray-300 py-1.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#d32f2f] transition-colors peer bg-transparent appearance-none cursor-pointer"
            >
              <option value="">Tümü</option>
            </select>
            <label className="absolute left-0 text-[12px] text-gray-400 -top-3.5 transition-all duration-200 pointer-events-none">
              Filtreler
            </label>
            <div className="absolute right-0 top-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-auto px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                    No <ArrowUpDown className="w-3.5 h-3.5 text-red-400" />
                  </div>
                </th>
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                    Ad Soyad <ArrowUpDown className="w-3.5 h-3.5 text-red-400" />
                  </div>
                </th>
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700">Telefon</th>
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700">Adres</th>
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700 text-center">Açık Hesap Müşterisi</th>
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-900">
                    Bakiye <ArrowUpDown className="w-3.5 h-3.5 text-red-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-2 text-[14px] text-gray-800">{customer.no}</td>
                  <td className="py-3 px-2 text-[14px] text-gray-800">{customer.firstName} {customer.lastName}</td>
                  <td className="py-3 px-2 text-[14px] text-gray-800">{customer.phone1}</td>
                  <td className="py-3 px-2 text-[14px] text-gray-800 text-center">-</td>
                  <td className="py-3 px-2 text-center">
                    {/* Add logic for Open Account later if needed */}
                  </td>
                  <td className="py-3 px-2 text-[14px] text-gray-800 text-right">₺{customer.balance.toFixed(2).replace('.', ',')}</td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 text-[14px]">
                    {searchTerm ? "Arama kriterlerine uygun müşteri bulunamadı." : "Hiç müşteri kaydı bulunamadı."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end items-center gap-4 text-[13px] text-gray-600">
          <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>1 / {Math.max(1, Math.ceil(filteredCustomers.length / 10))}</span>
          <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-[700px] max-w-[95vw] overflow-hidden flex flex-col">
            {/* Modal Body */}
            <div className="px-8 pt-8 pb-4 flex flex-col flex-1 overflow-auto">
              
              <div className="mb-8">
                <h3 className="text-[20px] font-semibold text-gray-900">Müşteri Ekle</h3>
                <p className="text-[14px] text-gray-500 mt-1">Yeni eklemek istediğiniz müşteri bilgilerini giriniz</p>
              </div>

              <div className="flex flex-col gap-6">
                
                <div className="flex gap-6">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border-b border-gray-300 py-1.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#d32f2f] transition-colors peer bg-transparent"
                      placeholder=" "
                    />
                    <label className={`absolute left-0 text-[12px] transition-all duration-200 pointer-events-none ${
                      firstName ? 'text-[#d32f2f] -top-3.5' : 'text-[#d32f2f] -top-3.5 peer-focus:-top-3.5 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-[14px]'
                    }`}>
                      Ad*
                    </label>
                  </div>
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border-b border-gray-300 py-1.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#d32f2f] transition-colors peer bg-transparent"
                      placeholder=" "
                    />
                    <label className={`absolute left-0 text-[12px] transition-all duration-200 pointer-events-none ${
                      lastName ? 'text-[#d32f2f] -top-3.5' : 'text-gray-400 -top-3.5 peer-focus:-top-3.5 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-[14px]'
                    }`}>
                      Soyad
                    </label>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}
                      className="w-full border-b border-gray-300 py-1.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#d32f2f] transition-colors peer bg-transparent"
                      placeholder=" "
                    />
                    <label className={`absolute left-0 text-[12px] transition-all duration-200 pointer-events-none ${
                      phone1 ? 'text-[#d32f2f] -top-3.5' : 'text-gray-400 -top-3.5 peer-focus:-top-3.5 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-[14px]'
                    }`}>
                      Telefon Numarası
                    </label>
                  </div>
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                      className="w-full border-b border-gray-300 py-1.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#d32f2f] transition-colors peer bg-transparent"
                      placeholder=" "
                    />
                    <label className={`absolute left-0 text-[12px] transition-all duration-200 pointer-events-none ${
                      phone2 ? 'text-[#d32f2f] -top-3.5' : 'text-gray-400 -top-3.5 peer-focus:-top-3.5 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-[14px]'
                    }`}>
                      Telefon Numarası 2
                    </label>
                  </div>
                </div>

                <div className="w-full relative group">
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="w-full border-b border-gray-300 py-1.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#d32f2f] transition-colors peer bg-transparent"
                    placeholder=" "
                  />
                  <label className={`absolute left-0 text-[12px] transition-all duration-200 pointer-events-none ${
                    balance !== "" ? 'text-[#d32f2f] -top-3.5' : 'text-gray-400 -top-3.5 peer-focus:-top-3.5 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-[14px]'
                  }`}>
                    Açılış Bakiyesi
                  </label>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#d32f2f] rounded-full w-4 h-4 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold font-serif">i</span>
                    </div>
                    <span className="text-[14px] text-gray-800 font-medium">Tanımlı adres bulunamadı. Yeni adres ekleyebilirsiniz</span>
                  </div>
                  
                  <button type="button" className="flex items-center gap-1.5 text-gray-800 hover:text-black font-medium text-[14px] w-fit cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Yeni Adres Ekle
                  </button>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 flex justify-end gap-3 bg-white">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#d32f2f] hover:text-[#b71c1c] px-4 py-2 font-medium text-[14px] transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-8 py-2 rounded font-medium text-[14px] shadow-sm transition-colors cursor-pointer"
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
