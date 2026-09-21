"use client";

import React, { useState } from "react";
import AuthTemplate from "@/components/auth/AuthTemplate";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <AuthTemplate>
      <div className="flex flex-col">
        <h1 className="mb-2 text-[26px] font-semibold text-gray-900">
          Şifremi Unuttum
        </h1>
        <p className="mb-8 text-[14px] text-gray-500">
          Lütfen kayıtlı e-posta adresinizi girin. Şifrenizi sıfırlamanız için size bir bağlantı göndereceğiz.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              required
              className="mb-[20px] block w-full rounded-[8px] border border-gray-300 bg-white px-4 py-[15px] text-left text-[14px] text-gray-900 outline-none transition-all duration-300 ease-[ease] placeholder:text-gray-400 focus:border-fire-red-1 focus:ring-1 focus:ring-fire-red-1"
            />
            
            <button
              type="submit"
              className="inline-block w-full cursor-pointer rounded-[8px] bg-[#d82c2c] hover:bg-[#c22828] px-[22px] py-[15px] text-center text-[16px] font-bold text-white transition-colors duration-200"
            >
              Şifre Sıfırlama Bağlantısı Gönder
            </button>
          </form>
        ) : (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 mb-6">
            <strong>E-posta gönderildi!</strong> Lütfen gelen kutunuzu kontrol edin ve e-postadaki bağlantıya tıklayarak şifrenizi sıfırlayın.
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-fire-red-1 transition-colors"
          >
            <ArrowLeft size={16} />
            Giriş ekranına dön
          </Link>
        </div>
      </div>
    </AuthTemplate>
  );
}
