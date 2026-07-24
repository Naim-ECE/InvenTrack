# InvenTrack — Technical Specification

## Dependencies

### Core
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.0 | UI framework |
| react-dom | ^18.3.0 | DOM renderer |
| react-router-dom | ^6.26.0 | Client-side routing with role-based route guards |
| @reduxjs/toolkit | ^2.2.0 | State management, authentication, cart, theme, UI |
| react-redux | ^9.1.0 | React bindings for Redux |
| axios | ^1.7.0 | HTTP client with JWT interceptor |

### UI & Styling
| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | ^3.4.0 | Utility-first CSS |
| @tailwindcss/forms | ^0.5.0 | Form element normalization |
| clsx | ^2.1.0 | Conditional class composition |
| tailwind-merge | ^2.5.0 | Tailwind class deduplication |

### Animation
| Package | Version | Purpose |
|---------|---------|---------|
| framer-motion | ^11.0.0 | Page transitions, card hovers, floating cards, counters, sidebar, modals, dropdowns, toasts, skeletons |

### Charts
| Package | Version | Purpose |
|---------|---------|---------|
| chart.js | ^4.4.0 | Chart rendering engine |
| react-chartjs-2 | ^5.2.0 | React Chart.js wrapper |

### Forms
| Package | Version | Purpose |
|---------|---------|---------|
| react-hook-form | ^7.53.0 | Form state management |
| @hookform/resolvers | ^3.9.0 | Yup resolver integration |
| yup | ^1.4.0 | Schema validation |

### Icons
| Package | Version | Purpose |
|---------|---------|---------|
| lucide-react | ^0.400.0 | Icon library (Lucide) |

### Dev
| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^5.4.0 | Build tool |
| @vitejs/plugin-react | ^4.3.0 | React Vite plugin |
| autoprefixer | ^10.4.0 | CSS vendor prefixes |
| postcss | ^8.4.0 | CSS processing |
| typescript | ^5.5.0 | Type safety |
| @types/react | ^18.3.0 | React type definitions |
| @types/react-dom | ^18.3.0 | ReactDOM type definitions |

---

## Component Inventory

### Layout Components (shared across all dashboard roles)

| Component | Source | Reuse |
|-----------|--------|-------|
| DashboardLayout | Custom | All 3 dashboard roles (Vendor, Inventory, Admin) — wraps sidebar + topbar + content |
| Sidebar | Custom | All 3 dashboard roles — receives nav items via prop based on role |
| TopBar | Custom | All 3 dashboard roles — search, notifications, theme toggle, avatar dropdown |
| MarketplaceLayout | Custom | All customer-facing pages — wraps navbar + footer |

### Page Sections (Landing)

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Full-viewport with 5 floating product cards, gradient overlay |
| TrustStatistics | Custom | 4 animated counters, IntersectionObserver triggered |
| FeaturedCategories | Custom | Bento grid (masonry layout with CSS Grid) |
| TopProductsSection | Custom | 4-col product grid |
| WhyChooseUs | Custom | 3-col feature cards with icon circles |
| BecomeVendorSection | Custom | 2-col split with floating dashboard mockup elements |
| NewsletterFooter | Custom | Newsletter bar + 4-col footer |

### Dashboard Pages (reusable patterns)

| Component | Source | Used By |
|-----------|--------|---------|
| DashboardHome | Custom | Vendor, Inventory, Admin — KPI cards + charts + recent activity, configurable via props |
| ProductsPage | Custom | Vendor — table/grid toggle, status badges |
| ProductFormPage | Custom | Vendor — multi-section form (7 sections) |
| OrdersPage | Custom | Vendor, Admin — filter tabs, status management |
| InventoryPage | Custom | Vendor, Inventory Manager, Admin — stock table with filters |
| AnalyticsPage | Custom | Vendor, Admin — 2x3 chart grid with period selector |
| SettingsPage | Custom | Vendor, Inventory Manager, Admin — tabbed settings panels |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|-------|
| ProductCard | Custom | Shop, TopProducts, Wishlist, RelatedProducts — image, name, price, rating, wishlist btn, hover zoom+lift |
| DashboardCard | Custom | All dashboard home pages — icon circle + label + metric + change indicator |
| DataTable | Custom | All list pages — sortable headers, checkboxes, bulk actions, empty state |
| Modal | Custom | Global — overlay + content container with animation |
| Toast | Custom + Framer Motion | Global — notification system |
| ToastContainer | Custom | Global — top-right stacking container |
| SearchBar | Custom | TopBar, Shop sidebar — rounded input with icon |
| Badge | Custom | Global — status badges with color variants |
| Button | Custom | Global — primary/secondary/accent/danger/ghost variants |
| Input | Custom | Global — text input with validation states |
| Select | Custom | Global — dropdown select |
| Textarea | Custom | Global — multi-line input |
| Avatar | Custom | Global — image fallback with initials, online indicator |
| Pagination | Custom | Shop, list pages |
| DropdownMenu | Custom | TopBar avatar, action menus |
| LoadingSkeleton | Custom | Global — shimmer animation placeholder |
| Spinner | Custom | Global — full-page and inline loading |
| EmptyState | Custom | All list pages — icon + message + CTA |
| ImageUpload | Custom | ProductForm — drag-drop zone + thumbnail grid + reorder |
| QuantitySelector | Custom | ProductDetail, Cart — +/- buttons with input |
| StarRating | Custom | ProductDetail, Reviews — filled/empty star display + input |
| ProgressBar | Custom | Warehouse cards, supplier metrics |
| Tabs | Custom | ProductDetail, Settings — underline indicator tabs |
| Breadcrumb | Custom | Shop, ProductDetail — navigation trail |
| OrderCard | Custom | Customer Orders page — order summary card |
| TrackingTimeline | Custom | Order Tracking — vertical step timeline |
| NotificationCenter | Custom | TopBar — dropdown panel with notification list |
| InventoryForecastWidget | Custom | Inventory Dashboard, ProductDetail — stock projection card |
| LowStockAlertCard | Custom | Low Stock Alerts page, Inventory Dashboard |
| SupplierCard | Custom | Suppliers page — performance metrics card |
| WarehouseCard | Custom | Warehouses page — capacity + stats card |
| PurchaseOrderCard | Custom | Purchase Records — PO status card |
| CouponInput | Custom | Cart — apply/remove coupon code |
| PriceBreakdown | Custom | Cart, Checkout — subtotal/discount/shipping/tax/total |
| CheckoutProgress | Custom | Checkout — 4-step indicator with connecting lines |
| FloatingProductCard | Custom | HeroSection only — glassmorphism mini card |
| FeatureCard | Custom | WhyChooseUs — icon circle + title + description |
| CategoryCard | Custom | FeaturedCategories — image card with overlay |
| StatCounter | Custom | TrustStatistics — animated number counter |

### Chart Components

| Component | Source | Notes |
|-----------|--------|-------|
| LineChart | react-chartjs-2 | Sales trend, revenue trend — primary color fill, secondary dashed |
| BarChart | react-chartjs-2 | Stock levels, top products, category performance |
| DoughnutChart | react-chartjs-2 | Revenue breakdown, orders by status — 70% cutout with center text |
| AreaChart | react-chartjs-2 | Platform revenue — smooth curves with fill |
| Sparkline | react-chartjs-2 | Inventory forecast mini chart |
| ChartContainer | Custom | Wrapper: title + period selector + chart + consistent card styling |

### Hooks

| Hook | Purpose |
|------|---------|
| useAuth | Authentication state, login/logout, token management |
| useTheme | Dark/light mode toggle, persistence |
| useToast | Toast notification dispatch |
| useModal | Modal open/close management |
| useCart | Cart CRUD operations, total calculation |
| useWishlist | Wishlist add/remove/check |
| useIntersectionObserver | Scroll-triggered animations, counter activation |
| useMediaQuery | Responsive breakpoint detection |
| useDebounce | Search input debouncing |
| useLocalStorage | Guest cart, theme preference persistence |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Page transitions (dashboard) | Framer Motion | `AnimatePresence` wrapping route outlet, opacity 0→1 + translateY(8px→0), 0.3s ease-out | Low |
| Page transitions (marketplace) | Framer Motion | `AnimatePresence`, translateX(20px→0) + opacity fade, 0.3s ease-out | Low |
| Floating product cards (hero) | Framer Motion | `animate` prop with `y: [0,-12,0]`, `rotate: [-2,2,-2]`, infinite repeat, staggered durations 3-5s per card | Medium |
| Sidebar collapse/expand | Framer Motion | `animate={{ width }}` 260px↔72px, label opacity fade, 0.3s ease | Medium |
| Mobile sidebar drawer | Framer Motion | `animate={{ x }}` slide from left, overlay backdrop opacity, 0.3s ease | Low |
| Dropdown menus | Framer Motion | `animate={{ opacity: 1, y: 0 }}` from `opacity: 0, y: -8`, 0.2s ease-out | Low |
| Modal open/close | Framer Motion | Overlay fade 0.2s, content scale(0.95→1) + fade, spring transition | Low |
| Toast notifications | Framer Motion | `animate={{ x: 0 }}` from `x: "100%"`, auto-dismiss with exit animation, staggered stack | Medium |
| Product card hover | Framer Motion | `whileHover={{ y: -4 }}` + CSS `group-hover:scale-105` on image, shadow transition | Low |
| Dashboard card hover | Framer Motion | `whileHover={{ y: -2 }}` + border-color transition | Low |
| Feature card hover | Framer Motion | `whileHover={{ y: -4 }}` + border-color shift to primary | Low |
| Category card hover | Framer Motion | `whileHover={{ y: -4 }}` + "Shop Now" link opacity + translateX reveal | Low |
| Animated counters | Framer Motion | `useMotionValue` + `useTransform` + `animate`, triggered by IntersectionObserver, 1.5s ease-out | Medium |
| Scroll-triggered reveals | Framer Motion | `whileInView={{ opacity: 1, y: 0 }}` with staggered `transition.delay` per child, 0.6s cubic-bezier(0.16,1,0.3,1) | Low |
| Loading skeleton shimmer | CSS | `@keyframes shimmer` background-position animation, 1.5s infinite linear | Low |
| Checkout confirmation checkmark | Framer Motion | `scale: [0,1.2,1]` with spring bounce, triggered on mount | Low |
| Tracking timeline pulse | CSS + Framer Motion | Current step circle `animate={{ scale: [1,1.1,1] }}` infinite, connecting lines animate width | Low |
| Sticky mobile add-to-cart | Framer Motion | `animate={{ y: 0 }}` from `y: 100`, triggered by scroll position via IntersectionObserver | Medium |
| Login card shake (error) | Framer Motion | `animate={{ x: [-10,10,-10,10,0] }}` 0.4s on error state change | Low |
| Hero scroll indicator | CSS | `@keyframes` pulse opacity + translateY, gentle bounce | Low |
| Image zoom on hover (product) | CSS | `transform: scale(1.05)` on hover with `overflow: hidden` container, 0.3s transition | Low |
| Button active state | CSS | `active:scale-[0.98]` transition | Low |
| Theme toggle transition | CSS | `transition: color 0.3s, background-color 0.3s` on all themed elements | Low |

---

## State & Logic Plan

### Redux Store Architecture

```
slices/
├── authSlice.ts          — user data, token, isAuthenticated, role
├── themeSlice.ts         — mode: 'dark' | 'light'
├── uiSlice.ts            — sidebarCollapsed, modal state, toasts array
├── cartSlice.ts          — items, total, itemCount (syncs to localStorage for guests)
├── wishlistSlice.ts      — items, isLoading
├── notificationSlice.ts  — notifications array, unread count
└── [role-specific]/
    ├── vendorSlice.ts    — products, orders, earnings, analytics data
    ├── inventorySlice.ts — stock items, warehouses, suppliers, POs, alerts
    └── adminSlice.ts     — users, vendors, products, orders, platform analytics
```

### Authentication Flow

1. **Login** → POST /api/auth/login (email, password, role) → receive { token, user }
2. **Token storage** → localStorage `accessToken`, Redux auth slice updated
3. **Axios interceptor** → attaches `Authorization: Bearer <token>` to all requests
4. **Route guards** → `ProtectedRoute` component checks `isAuthenticated` + `role` match
5. **Token refresh** → 401 response triggers refresh endpoint, failed refresh → logout → redirect login
6. **Logout** → clear localStorage, dispatch logout action, reset all slices, redirect to landing
7. **Guest cart** → cart stored in localStorage, merged into user cart on login

### Theme System

- Dashboards default to dark; marketplace defaults to light
- Toggle in topbar user dropdown
- `theme` class on root `<div>`; Tailwind `dark:` variants handle styling
- Persisted to localStorage; read on app mount

### Role-Based Routing

- Public routes: `/`, `/shop`, `/product/:id`, `/cart`, `/login`, `/register`, `/forgot-password`
- Customer routes (auth): `/checkout`, `/orders`, `/orders/:id/track`, `/wishlist`, `/profile`
- Vendor routes (auth + role): `/vendor/*`
- Inventory routes (auth + role): `/inventory/*`
- Admin routes (auth + role): `/admin/*`
- `ProtectedRoute` wrapper: checks auth → checks role → renders or redirects
- Sidebar navigation items passed as config array based on current role

### Toast System

- Global `ToastContainer` mounted in App
- `addToast({ type, message })` dispatch adds to `ui.toasts` array
- Max 5 visible; auto-dismiss after 4s
- Framer Motion `AnimatePresence` handles enter/exit animations

### Modal System

- `ui.modal` holds `{ isOpen, type, data }`
- `openModal(type, data)` / `closeModal()` actions
- Modal content rendered conditionally by `type`
- Framer Motion handles overlay + content animations

---

## Project File Structure

```
├── public/
│   └── images/                    # Product images, category images, avatars, hero bg
├── src/
│   ├── main.tsx                   # Entry point, React root, StrictMode
│   ├── App.tsx                    # Router setup, route definitions, global layouts, ToastContainer
│   ├── index.css                  # Tailwind directives, global styles, CSS custom properties, font imports, shimmer keyframes
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── MarketplaceLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── ToastContainer.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── DropdownMenu.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── ChartContainer.tsx
│   │   │   ├── QuantitySelector.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── CouponInput.tsx
│   │   │   ├── PriceBreakdown.tsx
│   │   │   ├── CheckoutProgress.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   ├── TrackingTimeline.tsx
│   │   │   ├── NotificationCenter.tsx
│   │   │   ├── LowStockAlertCard.tsx
│   │   │   ├── InventoryForecastWidget.tsx
│   │   │   ├── SupplierCard.tsx
│   │   │   ├── WarehouseCard.tsx
│   │   │   ├── PurchaseOrderCard.tsx
│   │   │   ├── FloatingProductCard.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   └── StatCounter.tsx
│   │   └── charts/
│   │       ├── LineChart.tsx
│   │       ├── BarChart.tsx
│   │       ├── DoughnutChart.tsx
│   │       ├── AreaChart.tsx
│   │       └── Sparkline.tsx
│   │
│   ├── pages/
│   │   ├── landing/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TrustStatistics.tsx
│   │   │   ├── FeaturedCategories.tsx
│   │   │   ├── TopProductsSection.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── BecomeVendorSection.tsx
│   │   │   └── NewsletterFooter.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── customer/
│   │   │   ├── ShopPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── OrderTrackingPage.tsx
│   │   │   ├── WishlistPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── vendor/
│   │   │   ├── VendorDashboard.tsx
│   │   │   ├── VendorProducts.tsx
│   │   │   ├── VendorProductForm.tsx
│   │   │   ├── VendorOrders.tsx
│   │   │   ├── VendorInventory.tsx
│   │   │   ├── VendorEarnings.tsx
│   │   │   ├── VendorAnalytics.tsx
│   │   │   └── VendorSettings.tsx
│   │   ├── inventory/
│   │   │   ├── InventoryDashboard.tsx
│   │   │   ├── InventoryList.tsx
│   │   │   ├── Warehouses.tsx
│   │   │   ├── Suppliers.tsx
│   │   │   ├── PurchaseRecords.tsx
│   │   │   ├── LowStockAlerts.tsx
│   │   │   ├── InventoryReports.tsx
│   │   │   └── InventorySettings.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminUsers.tsx
│   │       ├── AdminVendors.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminOrders.tsx
│   │       ├── AdminInventory.tsx
│   │       ├── AdminAnalytics.tsx
│   │       ├── AdminReports.tsx
│   │       └── AdminSettings.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useToast.ts
│   │   ├── useModal.ts
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── store/
│   │   ├── index.ts              # Store configuration
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── themeSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   ├── cartSlice.ts
│   │   │   ├── wishlistSlice.ts
│   │   │   ├── notificationSlice.ts
│   │   │   ├── vendorSlice.ts
│   │   │   ├── inventorySlice.ts
│   │   │   └── adminSlice.ts
│   │   └── thunks/
│   │       ├── authThunks.ts
│   │       ├── vendorThunks.ts
│   │       ├── inventoryThunks.ts
│   │       └── adminThunks.ts
│   │
│   ├── data/
│   │   ├── mockData.ts           # Demo products, categories, orders, users, vendors, suppliers
│   │   ├── navigation.ts         # Sidebar nav configs per role
│   │   └── constants.ts          # Status definitions, chart colors, API endpoints
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── inventory.ts
│   │   ├── user.ts
│   │   ├── vendor.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── api.ts                # Axios instance with interceptors
│   │   ├── formatters.ts         # Currency, date, number formatting
│   │   └── validators.ts         # Yup schemas for forms
│   │
│   └── routes/
│       ├── AppRoutes.tsx         # All route definitions
│       ├── ProtectedRoute.tsx    # Auth + role guard wrapper
│       └── routeConfigs.ts       # Route metadata per role
```

---

## Key Technical Decisions

### Frontend-Only Architecture

This is a frontend-only React application. All data operations use mock data from `data/mockData.ts`. The architecture is structured with:
- Redux thunks that simulate async operations with `setTimeout` promises
- API integration structure in place (`utils/api.ts`) for future backend connection
- All CRUD operations update local state; no backend persistence

### Chart.js Registration

Chart.js v4 requires explicit component registration. Register all needed components (Category, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler) in a central `charts/register.ts` file imported once at app initialization.

### Image Strategy

- Product and category images: AI-generated and saved to `public/images/`
- User/vendor avatars: colored initial circles as fallback, generated images where needed
- Hero background: AI-generated product composition
- Dashboard mockup: CSS-styled component, not an image

### Responsive Strategy

- Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for all layouts
- Dashboard sidebar: always visible desktop (≥1024px), collapsed icon-only tablet (640-1024px), overlay drawer mobile (<640px)
- Data tables: horizontal scroll container on mobile; card-based row view as alternative
- Product grids: 4-col → 2-col → 1-col

### Performance Strategy

- Route-level code splitting with `React.lazy` + `Suspense` in `AppRoutes.tsx`
- Image lazy loading via `loading="lazy"` attribute
- Skeleton screens for all data-dependent components (using `LoadingSkeleton`)
- Debounced search inputs (300ms via `useDebounce`)
- `whileInView` (IntersectionObserver) for scroll-triggered animations — no scroll event listeners
- CSS transitions for simple hover states; Framer Motion reserved for complex sequences
