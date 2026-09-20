"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import '../../globals.css';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <span className={`material-icons ${styles.logoIcon}`}>restaurant_menu</span>
          Adisyo
        </div>
        <div className={styles.subtitle}>Restoran Yönetim Sistemi</div>
        
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label>E-posta</label>
            <input type="email" className="input-field" placeholder="E-posta adresiniz" defaultValue="softdeap@gmail.com" required />
          </div>
          
          <div className={styles.formGroup}>
            <label>Şifre</label>
            <input type="password" className="input-field" placeholder="Şifreniz" defaultValue="Depsoft@12345" required />
          </div>
          
          <button type="submit" className={styles.loginBtn}>Giriş Yap</button>
        </form>
        
        <a href="#" className={styles.forgotPassword}>Şifremi Unuttum</a>
      </div>
    </div>
  );
}
