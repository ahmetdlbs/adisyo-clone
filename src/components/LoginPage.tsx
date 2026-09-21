"use client";

import { useCallback, useState, type SubmitEvent } from "react";
import AuthTemplate from "@/components/auth/AuthTemplate";
import MaterialIcon from "@/components/ui/MaterialIcon";
import SnackBar from "@/components/ui/SnackBar";
import Link from "next/link";

const LOGIN_ERROR_MESSAGE = "Kullanıcı adı veya şifre hatalı.";
const USERNAME_REQUIRED_MESSAGE = "*Boş geçilemez";
const PASSWORD_REQUIRED_MESSAGE = "*Lütfen şifrenizi giriniz";

const INPUT_CLASS =
  "mb-[14px] block w-full rounded-[8px] border border-grey-3 bg-white px-4 py-[18px] text-left text-[14px] text-ink outline-none transition-all duration-300 ease-[ease] placeholder:text-grey-2 focus:shadow-[inset_0_-3px_0_0_#f1c40f]";
const ERROR_CLASS =
  "-mt-2 mb-[14px] ml-5 text-[12px] leading-[17.1429px] text-fire-red-1";

interface LoginPageProps {
  onLoginSuccess: (userEmail: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const closeSnackBar = useCallback(() => setErrorMessage(null), []);

  const showUsernameError = hasSubmitted && username === "";
  const showPasswordError = hasSubmitted && password === "";

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    if (username === "" || password === "" || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setErrorMessage(LOGIN_ERROR_MESSAGE);
        return;
      }
      onLoginSuccess(username);
    } catch (error) {
      console.error("[LoginPage] login request failed", error);
      setErrorMessage(LOGIN_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthTemplate>
      <div className="mb-[25px]">
        <h2 className="m-0 text-[21px] leading-[30px] text-ink">
          Adisyo&apos;ya hoş geldiniz
        </h2>
        <p className="mt-[10px] text-grey-2">
          Lütfen üyelik bilgileriniz ile giriş yapınız
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit}>
        <input
          type="text"
          data-test-id="login-username-input"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          required
          placeholder="E-Posta Adresi veya Telefon Numarası"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={INPUT_CLASS}
        />
        {showUsernameError && (
          <p data-test-id="login-username-error" className={ERROR_CLASS}>
            {USERNAME_REQUIRED_MESSAGE}
          </p>
        )}

        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            data-test-id="login-password-input"
            autoComplete="current-password"
            required
            placeholder="Şifre"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${INPUT_CLASS} pr-[35px]`}
          />
          <button
            type="button"
            data-test-id="login-password-toggle"
            tabIndex={-1}
            aria-label={isPasswordVisible ? "Şifreyi gizle" : "Şifreyi göster"}
            onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
            className="absolute top-1/2 right-[5px] flex -translate-y-1/2 cursor-pointer select-none p-[5px] text-left text-grey-2 opacity-80"
          >
            <MaterialIcon name={isPasswordVisible ? "visibility_off" : "visibility"} />
          </button>
        </div>
        {showPasswordError && (
          <p data-test-id="login-password-error" className={ERROR_CLASS}>
            {PASSWORD_REQUIRED_MESSAGE}
          </p>
        )}

        <div className="mt-[15px] flex items-center justify-end">
          <Link
            href="/forgot-password"
            data-test-id="login-forgot-password-link"
            className="block cursor-pointer text-left text-grey-1 capitalize hover:text-fire-red-1"
          >
            Şifremi unuttum
          </Link>
        </div>

        <button
          type="submit"
          data-test-id="login-submit-button"
          aria-busy={isSubmitting}
          className={`mt-[15px] inline-block w-full cursor-pointer rounded-[10px] bg-fire-red-1 px-[22px] py-[15px] text-center text-[16px] leading-[1.42857143] font-bold text-white transition-all duration-200 ease-[ease] hover:bg-[#cf5a55] ${
            isSubmitting ? "opacity-50" : ""
          }`}
        >
          Giriş Yap
        </button>
      </form>

      <Link
        href="/register"
        className="mt-[30px] inline-block h-[35px] w-full cursor-pointer rounded-[10px] px-[15px] py-px text-center leading-8 text-grey-1 [transition:box-shadow_.2s_cubic-bezier(.4,0,1,1),background-color_.2s_cubic-bezier(.4,0,.2,1)] hover:bg-black/5"
      >
        <span>
          Üye Değil Misiniz? <b className="font-bold text-fire-red-1">Şimdi Kaydolun</b>
        </span>
      </Link>

      <SnackBar message={errorMessage} onClose={closeSnackBar} />
    </AuthTemplate>
  );
}
