# 📸 Panduan Mengganti Gambar di Website KebabNation

## Cara Cepat (3 Langkah)

### 1️⃣ Siapkan Gambar Baru
- Letakkan file gambar di folder: `public/images/`
- Nama file harus jelas, contoh: `classic-chicken-kebab.jpg`

### 2️⃣ Update File Konfigurasi
- Buka file: `lib/images.ts`
- Cari gambar yang ingin diganti
- Update path-nya

**Contoh:**
\`\`\`typescript
// SEBELUM:
classic_chicken_kebab: "/images/menu/classic-chicken-kebab.jpg",

// SESUDAH (ganti dengan gambar baru):
classic_chicken_kebab: "/images/menu/ayam-panggang-baru.jpg",
\`\`\`

### 3️⃣ Simpan & Lihat Hasilnya
- Simpan file `lib/images.ts`
- Refresh browser - gambar akan berubah otomatis! ✨

---

## Struktur Folder Gambar

\`\`\`
public/
├── images/
│   ├── menu/
│   │   ├── classic-chicken-kebab.jpg
│   │   ├── lamb-kofta-kebab.jpg
│   │   ├── falafel-wrap.jpg
│   │   └── ... (gambar menu lainnya)
│   ├── kebab-bg.jpg
│   ├── delicious-kebab-food-restaurant.jpg
│   ├── delicious-grilled-kebab-food-restaurant-appetizing.jpg
│   └── empty-cart.jpg
├── placeholder-logo.svg
├── placeholder-user.jpg
└── placeholder.svg
\`\`\`

---

## Daftar Semua Gambar yang Bisa Diganti

### 🍖 Gambar Menu (Makanan)
| ID | Nama | Lokasi di Website |
|---|---|---|
| `1` | Classic Chicken Kebab | Menu Grid, Keranjang |
| `2` | Lamb Kofta Kebab | Menu Grid, Keranjang |
| `3` | Falafel Wrap | Menu Grid, Keranjang |
| `4` | Mixed Grill Platter | Menu Grid, Keranjang |
| `5` | Halloumi Kebab | Menu Grid, Keranjang |
| `6` | Kebab Bowl | Menu Grid, Keranjang |

### 🥤 Gambar Menu (Minuman)
| ID | Nama | Lokasi di Website |
|---|---|---|
| `d1` | Ayran | Menu Grid, Keranjang |
| `d2` | Turkish Tea | Menu Grid, Keranjang |
| `d3` | Pomegranate Juice | Menu Grid, Keranjang |
| `d4` | Mint Lemonade | Menu Grid, Keranjang |
| `d5` | Sparkling Water | Menu Grid, Keranjang |
| `d6` | Bottled Water | Menu Grid, Keranjang |

### 🖼️ Gambar Background & Dekoratif
| Nama | Lokasi di Website | File |
|---|---|---|
| Kebab Background | Bagian "About" | `kebab-bg.jpg` |
| Delicious Kebab | Bagian "Testimonials" (background) | `delicious-kebab-food-restaurant.jpg` |
| Grilled Kebab | Bagian "Testimonials" (kanan) | `delicious-grilled-kebab-food-restaurant-appetizing.jpg` |

### 🛒 Gambar Lainnya
| Nama | Lokasi di Website | File |
|---|---|---|
| Empty Cart | Keranjang kosong | `empty-cart.jpg` |
| Logo | Navigation Bar | `placeholder-logo.svg` |
| User Avatar | Profile, Navigation | `placeholder-user.jpg` |

---

## Contoh Kasus Penggunaan

### Kasus 1: Ganti Gambar Classic Chicken Kebab
\`\`\`typescript
// File: lib/images.ts
// Cari baris ini:
classic_chicken_kebab: "/images/menu/classic-chicken-kebab.jpg",

// Ganti dengan:
classic_chicken_kebab: "/images/menu/ayam-panggang-premium.jpg",
\`\`\`

### Kasus 2: Ganti Background About Section
\`\`\`typescript
// File: lib/images.ts
// Cari baris ini:
kebab_bg: "/images/kebab-bg.jpg",

// Ganti dengan:
kebab_bg: "/images/background-baru.jpg",
\`\`\`

### Kasus 3: Ganti Semua Gambar Menu Sekaligus
Jika ingin mengganti semua gambar menu dengan set baru:
1. Letakkan semua gambar baru di `public/images/menu/`
2. Buka `lib/images.ts`
3. Update semua path di bagian `MENU_IMAGES`
4. Simpan - selesai!

---

## Tips & Trik

### ✅ Format Gambar yang Direkomendasikan
- **Format**: JPG (untuk foto), PNG (untuk logo/icon), SVG (untuk logo)
- **Ukuran**: Jangan lebih dari 500KB per gambar
- **Resolusi**: Minimal 600x400px untuk gambar menu

### ✅ Naming Convention (Penamaan)
Gunakan nama yang deskriptif dan konsisten:
- ✅ `classic-chicken-kebab.jpg`
- ✅ `lamb-kofta-kebab.jpg`
- ❌ `img1.jpg`
- ❌ `photo.jpg`

### ✅ Jika Gambar Tidak Muncul
1. Pastikan file ada di folder `public/images/`
2. Pastikan path di `lib/images.ts` benar
3. Refresh browser (Ctrl+Shift+R untuk hard refresh)
4. Cek console browser untuk error

---

## Struktur File `lib/images.ts`

File ini dibagi menjadi 4 bagian utama:

\`\`\`typescript
// 1. MENU_IMAGES - Gambar makanan & minuman
export const MENU_IMAGES = { ... }

// 2. BACKGROUND_IMAGES - Gambar background & dekoratif
export const BACKGROUND_IMAGES = { ... }

// 3. PLACEHOLDER_IMAGES - Gambar placeholder
export const PLACEHOLDER_IMAGES = { ... }

// 4. CUSTOMER_IMAGES - Gambar profil pelanggan
export const CUSTOMER_IMAGES = { ... }
\`\`\`

Setiap bagian mudah ditemukan dan diupdate!

---

## Pertanyaan Umum (FAQ)

**Q: Berapa lama gambar baru muncul setelah saya update?**
A: Biasanya langsung! Jika tidak, coba refresh browser dengan Ctrl+Shift+R.

**Q: Bisa ganti gambar tanpa edit kode?**
A: Tidak, tapi prosesnya sangat mudah - hanya perlu update 1 baris di `lib/images.ts`.

**Q: Apa yang terjadi jika path gambar salah?**
A: Website akan menampilkan placeholder/gambar default sebagai fallback.

**Q: Bisa ganti gambar dari admin panel?**
A: Saat ini tidak, tapi bisa ditambahkan di masa depan jika diperlukan.

---

## Butuh Bantuan?

Jika ada pertanyaan atau masalah, cek:
1. File `lib/images.ts` - pastikan path benar
2. Folder `public/images/` - pastikan file ada
3. Browser console - cek ada error atau tidak
