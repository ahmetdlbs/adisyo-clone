"use client";

import React from 'react';
import styles from './layout.module.css';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // A simple mapping for breadcrumbs based on pathname
  const getBreadcrumb = () => {
    if (pathname.includes('/dashboard')) return 'Ahmet';
    if (pathname.includes('/table-area-definition')) return 'Tanımlamalar / Masa ve Bölgeler';
    if (pathname.includes('/product-definition')) return 'Kategori ve Ürün Tanımlama / Şube Ürünleri';
    return 'Ahmet';
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.menuButton}>
          <span className="material-icons">menu</span>
        </button>
        <span className={styles.breadcrumb}>{getBreadcrumb()}</span>
      </div>
      
      <div className={styles.headerRight}>
        <button className={styles.headerIconBtn}>
          <span className="material-icons-outlined">card_giftcard</span>
        </button>
        
        <div className={styles.headerAction}>
          <span className="material-icons-outlined" style={{ fontSize: '18px' }}>group</span>
          Katıl
        </div>
        
        <button className={styles.headerIconBtn}>
          <span className="material-icons-outlined">refresh</span>
        </button>
        
        <button className={styles.headerIconBtn}>
          <span className="material-icons-outlined">more_vert</span>
        </button>

        <div className={styles.headerDivider}></div>

        <button className={styles.headerIconBtn}>
          <span className="material-icons-outlined">campaign</span>
        </button>

        <div className={styles.headerDivider}></div>
        
        <div className={`${styles.headerAction} ${styles.danger}`}>
          <span className="material-icons-outlined" style={{ fontSize: '18px' }}>headset_mic</span>
          Destek İste
        </div>
        
        <div className={`${styles.headerAction} ${styles.primary}`}>
          <span className="material-icons-outlined" style={{ fontSize: '18px' }}>person</span>
          84425 - Ahmet
        </div>
      </div>
    </header>
  );
}
