/**
 * PANDUAN MENGGANTI GAMBAR:
 *
 * 1. Letakkan gambar baru di folder: public/images/
 * 2. Update path di file ini sesuai nama gambar baru
 * 3. Simpan file - semua gambar di website akan otomatis terupdate!
 *
 * Contoh:
 * - Ganti "kebab-bg.jpg" dengan "kebab-baru.jpg"
 * - Update: BACKGROUND_IMAGES.kebab_bg = "/images/kebab-baru.jpg"
 * - Selesai! Gambar di About section akan berubah otomatis
 */

// ============================================
// GAMBAR MENU (Makanan & Minuman)
// ============================================
export const MENU_IMAGES = {
  classic_chicken_kebab: "/images/menu/classic-chicken-kebab.jpg",
  lamb_kofta_kebab: "/images/menu/lamb-kofta-kebab.jpg",
  falafel_wrap: "/images/menu/falafel-wrap.jpg",
  mixed_grill_platter: "/images/menu/mixed-grill-platter.jpg",
  halloumi_kebab: "/images/menu/halloumi-kebab.jpg",
  kebab_bowl: "/images/menu/kebab-bowl.jpg",
  ayran: "/images/menu/ayran.jpg",
  turkish_tea: "/images/menu/turkish-tea.jpg",
  pomegranate_juice: "/images/menu/pomegranate-juice.jpg",
  mint_lemonade: "/images/menu/mint-lemonade.jpg",
  sparkling_water: "/images/menu/sparkling-water.jpg",
  bottled_water: "/images/menu/bottled-water.jpg",
} as const

// ============================================
// GAMBAR BACKGROUND & DEKORATIF
// ============================================
export const BACKGROUND_IMAGES = {
  about_section_bg: "/images/kebab-bg.jpg",
  kebab_bg: "/images/kebab-bg.jpg",
  delicious_kebab_food_restaurant: "/images/delicious-kebab-food-restaurant.jpg",
  delicious_grilled_kebab_food_restaurant_appetizing: "/images/delicious-grilled-kebab-food-restaurant-appetizing.jpg",
} as const

// ============================================
// GAMBAR PLACEHOLDER & ICON
// ============================================
export const PLACEHOLDER_IMAGES = {
  empty_cart: "/images/empty-cart.jpg",
  logo: "/placeholder-logo.svg",
  user: "/placeholder-user.jpg",
  generic: "/placeholder.svg",
} as const

// ============================================
// GAMBAR PROFIL PELANGGAN
// ============================================
export const CUSTOMER_IMAGES = {
  customer_portrait: "/customer-portrait.jpg",
} as const

// ============================================
// HELPER FUNCTION - Dapatkan gambar dengan fallback
// ============================================
export function getImageUrl(imageKey: string, fallback: string = PLACEHOLDER_IMAGES.generic): string {
  const allImages = {
    ...MENU_IMAGES,
    ...BACKGROUND_IMAGES,
    ...PLACEHOLDER_IMAGES,
    ...CUSTOMER_IMAGES,
  }
  return (allImages as Record<string, string>)[imageKey] || fallback
}

// ============================================
// EXPORT UNTUK KOMPATIBILITAS DENGAN KODE LAMA
// ============================================
export const MENU_IMAGE_MAP: Record<string, string> = {
  "1": MENU_IMAGES.classic_chicken_kebab,
  "2": MENU_IMAGES.lamb_kofta_kebab,
  "3": MENU_IMAGES.falafel_wrap,
  "4": MENU_IMAGES.mixed_grill_platter,
  "5": MENU_IMAGES.halloumi_kebab,
  "6": MENU_IMAGES.kebab_bowl,
  d1: MENU_IMAGES.ayran,
  d2: MENU_IMAGES.turkish_tea,
  d3: MENU_IMAGES.pomegranate_juice,
  d4: MENU_IMAGES.mint_lemonade,
  d5: MENU_IMAGES.sparkling_water,
  d6: MENU_IMAGES.bottled_water,
}
