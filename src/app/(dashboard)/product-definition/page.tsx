"use client";

import React, { useState } from 'react';
import styles from './product.module.css';

const categories = [
  { id: 1, name: 'Favori Ürünler', icon: 'sort' },
  { id: 2, name: 'İçecekler', icon: 'local_cafe' },
  { id: 3, name: 'Milkshake', icon: 'local_drink' },
  { id: 4, name: 'Tatlı ve Pastalar', icon: 'cake' },
  { id: 5, name: 'Yiyecekler', icon: 'restaurant' },
];

const products = [
  { id: 1, name: 'Çay', type: 'Tam', price: '₺52,00' },
  { id: 2, name: 'Salep', type: 'Tam', price: '₺140,00' },
  { id: 3, name: 'Bitki Çayı', type: 'Tam', price: '₺122,00' },
  { id: 4, name: 'Türk Kahvesi', type: 'Tam', price: '₺105,00' },
  { id: 5, name: 'Filtre Kahve', type: 'Tam', price: '₺105,00' },
  { id: 6, name: 'Su', type: 'Tam', price: '₺45,00' },
  { id: 7, name: 'Ayran', type: 'Tam', price: '₺70,00' },
  { id: 8, name: 'Coca Cola', type: 'Tam', price: '₺105,00' },
  { id: 9, name: 'Soda', type: 'Tam', price: '₺52,00' },
  { id: 10, name: 'Ice Tea', type: 'Tam', price: '₺87,00' },
  { id: 11, name: 'Mocha Frappe', type: 'Tam', price: '₺175,00' },
  { id: 12, name: 'Dondurmalı Frappe', type: 'Tam', price: '₺192,00' },
];

export default function ProductDefinitionPage() {
  const [activeCategory, setActiveCategory] = useState(2); // İçecekler active default

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <div className={styles.categorySidebar}>
        <div className={styles.addCategoryBtn}>
          <div className={styles.left}>
            <span className="material-icons-outlined">add_box</span>
            Kategori Ekle
          </div>
          <span className="material-icons">more_vert</span>
        </div>
        
        <div className={styles.categoryList}>
          {categories.map(category => (
            <div 
              key={category.id} 
              className={`${styles.categoryItem} ${activeCategory === category.id ? styles.active : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className={styles.left}>
                <span className="material-icons" style={{ color: '#757575', fontSize: '18px' }}>{category.icon}</span>
                {category.name}
              </div>
              <span className="material-icons" style={{ fontSize: '18px', color: '#9e9e9e' }}>more_vert</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
          <div className={styles.searchArea}>
            <div className={styles.selectBox}>
              Tüm Kategoriler
              <span className="material-icons">expand_more</span>
            </div>
            <div className={styles.searchBar}>
              <input type="text" placeholder="Arama..." />
              <span className="material-icons" style={{ color: '#9e9e9e' }}>search</span>
            </div>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.aiBtn}>
              <span className="material-icons" style={{ color: '#e53935' }}>auto_awesome</span>
              AI ile Menü Oluştur
            </button>
            <button className={styles.addBtn} disabled>
              <span className="material-icons">add_box</span>
              Yeni Ürün Ekle
            </button>
          </div>
        </div>

        <div className={styles.productsGrid}>
          {products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.cardActions}>
                <span className={`material-icons-outlined ${styles.cardAction}`} style={{ color: product.id === 1 ? '#bbdefb' : 'inherit' }}>
                  favorite_border
                </span>
                <span className={`material-icons-outlined ${styles.cardAction}`} style={{ color: product.id === 1 ? '#bbdefb' : 'inherit' }}>
                  palette
                </span>
                <span className={`material-icons-outlined ${styles.cardAction}`} style={{ color: product.id === 1 ? '#bbdefb' : 'inherit' }}>
                  content_copy
                </span>
              </div>
              <div className={styles.productInfo}>
                <div className={styles.productName}>{product.name}</div>
                <div className={styles.productType}>{product.type}</div>
              </div>
              <div className={styles.productPrice}>{product.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
