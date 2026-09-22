import React from "react";

interface AdisyoLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AdisyoLogo({ className = "", size = "md" }: AdisyoLogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Adisyo Chef Hat Icon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-[#c0463c]">
          {/* Chef Hat Contour */}
          <path
            d="M32 6C24.5 6 18.2 11.2 16.8 18.2C13.5 19.4 11 22.8 11 27C11 31.8 14.3 35.8 19 36.8V48C19 50.2 20.8 52 23 52H41C43.2 52 45 50.2 45 48V36.8C49.7 35.8 53 31.8 53 27C53 22.8 50.5 19.4 47.2 18.2C45.8 11.2 39.5 6 32 6Z"
            fill="#b5473f"
          />
          {/* Fork & Knife cutout in chef hat */}
          <path
            d="M26 26V38H28V33H30V38H32V26H30V30H28V26H26Z"
            fill="white"
          />
          <path
            d="M36 26C34.5 26 34 27.5 34 29V38H36V26Z"
            fill="white"
          />
        </svg>
      </div>
      {/* Adisyo Wordmark */}
      <span className={`font-bold tracking-tight text-[#b5473f] ${textSizes[size]}`}>
        adisyo
      </span>
    </div>
  );
}
