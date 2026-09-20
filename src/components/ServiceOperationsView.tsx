"use client";

import React, { useState } from "react";

export default function ServiceOperationsView() {
  const [useDefinitions, setUseDefinitions] = useState(true);

  // Kuver State
  const [kuverAutoAdd, setKuverAutoAdd] = useState(false);
  const [kuverName, setKuverName] = useState("");
  const [kuverType, setKuverType] = useState("Tutar");
  const [kuverAmount, setKuverAmount] = useState("");

  // Garsoniye State
  const [garsoniyeAutoAdd, setGarsoniyeAutoAdd] = useState(false);
  const [garsoniyeName, setGarsoniyeName] = useState("");
  const [garsoniyeType, setGarsoniyeType] = useState("");
  const [garsoniyeAmount, setGarsoniyeAmount] = useState("");

  return (
    <div className="flex flex-col min-h-full w-full bg-[#f4f6f8] p-6 select-none relative">
      {/* Top Toggle Bar */}
      <div className="w-full bg-[#f4f6f8] border border-gray-300 rounded-lg p-4 flex items-center justify-between mb-6 shadow-sm">
        <span className="text-[14px] font-medium text-gray-800">
          Kuver/Garsoniye tanımlamaları kullanılsın.
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={useDefinitions}
            onChange={(e) => setUseDefinitions(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d32f2f]"></div>
        </label>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Kuver Settings Card */}
        <div className="flex-1 bg-[#f4f6f8] border border-gray-300 rounded-lg p-6 shadow-sm flex flex-col relative h-[500px]">
          <h3 className="text-[18px] font-medium text-center text-gray-800 mb-8">Kuver Ayarları</h3>
          
          <div className="flex items-center justify-between border border-gray-200 rounded p-4 mb-8 bg-[#f4f6f8]">
            <span className="text-[14px] font-medium text-gray-800">Kuver ücreti siparişe otomatik eklensin</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={kuverAutoAdd}
                onChange={(e) => setKuverAutoAdd(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d32f2f]"></div>
            </label>
          </div>

          <div className="mb-4 text-[14px] text-gray-700 font-medium">Tanımlamalar</div>

          <div className="flex flex-col gap-6">
            <div className="w-full border border-gray-300 rounded relative group bg-[#f4f6f8]">
              <input
                type="text"
                value={kuverName}
                onChange={(e) => setKuverName(e.target.value)}
                className="w-full py-3 px-3 text-[14px] text-gray-900 focus:outline-none bg-transparent peer"
                placeholder=" "
              />
              <label className={`absolute left-3 text-[12px] transition-all duration-200 pointer-events-none ${
                kuverName ? 'text-[#d32f2f] -top-2 bg-[#f4f6f8] px-1' : 'text-gray-500 top-3 peer-focus:-top-2 peer-focus:text-[#d32f2f] peer-focus:bg-[#f4f6f8] peer-focus:px-1'
              }`}>
                Kuver Adı*
              </label>
            </div>

            <div className="w-full border border-gray-300 rounded relative group bg-[#f4f6f8]">
              <select
                value={kuverType}
                onChange={(e) => setKuverType(e.target.value)}
                className="w-full py-3 px-3 text-[14px] text-gray-500 focus:outline-none bg-transparent appearance-none cursor-pointer"
              >
                <option value="Tutar">Tutar</option>
                <option value="Yüzde">Yüzde</option>
              </select>
              <label className="absolute left-3 -top-2 bg-[#f4f6f8] px-1 text-[12px] text-[#d32f2f] transition-all duration-200 pointer-events-none">
                Kuver Tipi*
              </label>
              <div className="absolute right-3 top-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div className="w-full border border-gray-300 rounded relative group bg-[#f4f6f8]">
              <input
                type="text"
                value={kuverAmount}
                onChange={(e) => setKuverAmount(e.target.value)}
                className="w-full py-3 px-3 text-[14px] text-gray-900 focus:outline-none bg-transparent peer"
                placeholder=" "
              />
              <label className={`absolute left-3 text-[12px] transition-all duration-200 pointer-events-none ${
                kuverAmount ? 'text-[#d32f2f] -top-2 bg-[#f4f6f8] px-1' : 'text-gray-500 top-3 peer-focus:-top-2 peer-focus:text-[#d32f2f] peer-focus:bg-[#f4f6f8] peer-focus:px-1'
              }`}>
                Kuver Tutarı*
              </label>
            </div>
          </div>

          <div className="absolute bottom-6 right-6">
            <button className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-6 py-2 rounded font-medium text-[14px] transition-colors shadow-sm">
              Kaydet
            </button>
          </div>
        </div>

        {/* Garsoniye Settings Card */}
        <div className="flex-1 bg-[#f4f6f8] border border-gray-300 rounded-lg p-6 shadow-sm flex flex-col relative h-[500px]">
          <h3 className="text-[18px] font-medium text-center text-gray-800 mb-8">Garsoniye Ayarları</h3>
          
          <div className="flex items-center justify-between border border-gray-200 rounded p-4 mb-8 bg-[#f4f6f8]">
            <span className="text-[14px] font-medium text-gray-800">Garsoniye ücreti siparişe otomatik eklensin</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={garsoniyeAutoAdd}
                onChange={(e) => setGarsoniyeAutoAdd(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d32f2f]"></div>
            </label>
          </div>

          <div className="mb-4 text-[14px] text-gray-700 font-medium">Tanımlamalar</div>

          <div className="flex flex-col gap-6">
            <div className="w-full border border-gray-300 rounded relative group bg-[#f4f6f8]">
              <input
                type="text"
                value={garsoniyeName}
                onChange={(e) => setGarsoniyeName(e.target.value)}
                className="w-full py-3 px-3 text-[14px] text-gray-900 focus:outline-none bg-transparent peer"
                placeholder=" "
              />
              <label className={`absolute left-3 text-[12px] transition-all duration-200 pointer-events-none ${
                garsoniyeName ? 'text-[#d32f2f] -top-2 bg-[#f4f6f8] px-1' : 'text-gray-500 top-3 peer-focus:-top-2 peer-focus:text-[#d32f2f] peer-focus:bg-[#f4f6f8] peer-focus:px-1'
              }`}>
                Garsoniye Adı*
              </label>
            </div>

            <div className="w-full border border-gray-300 rounded relative group bg-[#f4f6f8]">
              <select
                value={garsoniyeType}
                onChange={(e) => setGarsoniyeType(e.target.value)}
                className={`w-full py-3 px-3 text-[14px] focus:outline-none bg-transparent appearance-none cursor-pointer ${garsoniyeType ? 'text-gray-900' : 'text-gray-500'}`}
              >
                <option value="" disabled hidden></option>
                <option value="Tutar">Tutar</option>
                <option value="Yüzde">Yüzde</option>
              </select>
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                garsoniyeType ? '-top-2 bg-[#f4f6f8] px-1 text-[12px] text-[#d32f2f]' : 'text-[14px] text-gray-500 top-3 peer-focus:-top-2 peer-focus:text-[#d32f2f] peer-focus:bg-[#f4f6f8] peer-focus:px-1 peer-focus:text-[12px]'
              }`}>
                Garsoniye Tipi*
              </label>
              <div className="absolute right-3 top-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div className="w-full border border-gray-300 rounded relative group bg-[#f4f6f8]">
              <input
                type="text"
                value={garsoniyeAmount}
                onChange={(e) => setGarsoniyeAmount(e.target.value)}
                className="w-full py-3 px-3 text-[14px] text-gray-900 focus:outline-none bg-transparent peer"
                placeholder=" "
              />
              <label className={`absolute left-3 text-[12px] transition-all duration-200 pointer-events-none ${
                garsoniyeAmount ? 'text-[#d32f2f] -top-2 bg-[#f4f6f8] px-1' : 'text-gray-500 top-3 peer-focus:-top-2 peer-focus:text-[#d32f2f] peer-focus:bg-[#f4f6f8] peer-focus:px-1'
              }`}>
                Garsoniye Tutarı*
              </label>
            </div>
          </div>

          <div className="absolute bottom-6 right-6">
            <button className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-6 py-2 rounded font-medium text-[14px] transition-colors shadow-sm">
              Kaydet
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
