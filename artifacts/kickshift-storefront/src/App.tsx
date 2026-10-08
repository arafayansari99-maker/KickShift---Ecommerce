import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, FormEvent, KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { Link, Route, Router as WouterRouter, Switch, useLocation, useParams } from "wouter";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { HomeMotion } from "./HomeMotion";
import { CustomizableShoePhoto, KsRoundLogo, ShoePhoto } from "./ShoeBranding";

type Category = "Running" | "Court" | "Everyday";
type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  colorway: string;
  tags: string[];
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
  tone: string;
};
type CartItem = { id: string; productId: string; size: string; quantity: number; custom?: CustomConfig };
type CustomConfig = { upper: string; sole: string; lace: string; accent: string; initials: string };

const HERO_IMAGE = "/kickshift-hero.png";
const productImageSets: Record<string, string[]> = {
  "velocity-01": ["/kickshift-hero.png", "/angles/kickshift-hero-side-profile-cutout.png"],
  "courtline-01": ["/kickshift-courtline.png", "/angles/kickshift-courtline-side-profile-cutout.png"],
  "afterdark-01": ["/kickshift-afterdark.png", "/angles/kickshift-afterdark-side-profile-cutout.png"],
  "flux-03": ["/kickshift-flux.png", "/angles/kickshift-flux-side-profile-cutout.png"],
  "monolith-01": ["/kickshift-monolith-01.png", "/angles/kickshift-monolith-01-side-profile-cutout.png"],
  "vector-01": ["/kickshift-vector-01.png", "/angles/kickshift-vector-01-side-profile-cutout.png"],
  "solaris-01": ["/kickshift-solaris-01.png", "/angles/kickshift-solaris-01-side-profile-cutout.png"],
  "frost-100": ["/kickshift-frost-100.png"],
  "ivy-70": ["/kickshift-ivy-70.png"],
};
const productImages: Record<string, string> = Object.fromEntries(
  Object.entries(productImageSets).map(([key, value]) => [key, value[0]])
);
const sizes = ["6", "7", "8", "9", "10", "11", "12"];
const products: Product[] = [
  { id: "velocity-01", name: "Velocity 01", price: 185, category: "Running", colorway: "Chrome / Cobalt / Signal", tags: ["launch", "performance"], description: "An energy-returning runner engineered for the long way home. Chrome mesh, a cobalt airframe, and a stride that refuses to stay still.", rating: 4.9, reviews: 128, badge: "Chromed performance", tone: "rgba(36,89,255,.75)" },
  { id: "frost-100", name: "Frost 100", price: 184, category: "Running", colorway: "White / Glacier Blue", tags: ["glacier", "cushion"], description: "A bright daily runner in crisp white and glacier blue. Breathable mesh and a cushioned, stable sole keep the ride light from early miles through everyday movement.", rating: 4.8, reviews: 36, badge: "Glacier runner", tone: "rgba(77,145,255,.68)" },
  { id: "courtline-01", name: "Courtline 01", price: 178, category: "Court", colorway: "Bone / Cobalt / Chrome", tags: ["court", "heritage"], description: "A court silhouette rewritten in technical layers. The cleanest line in the collection, with enough edge to leave a mark.", rating: 4.7, reviews: 91, badge: "Architectural court", tone: "rgba(177,201,255,.58)" },
  { id: "afterdark-01", name: "Afterdark 01", price: 198, category: "Everyday", colorway: "Ink / Reflective / Orange", tags: ["night", "reflective"], description: "The city after the lights go down. Reflective panels, a sculpted night sole, and a flash of orange when you pick up speed.", rating: 4.9, reviews: 46, badge: "Night runner", tone: "rgba(255,99,52,.48)" },
  { id: "flux-03", name: "Flux 03", price: 172, category: "Running", colorway: "Cobalt / Lime / Chrome", tags: ["tempo", "flex"], description: "Fast feels different in Flux. A flexible chassis and tuned cushioning for the days that begin before your alarm.", rating: 4.6, reviews: 63, badge: "Reactive surge", tone: "rgba(99,211,255,.65)" },
  { id: "monolith-01", name: "Monolith 01", price: 190, category: "Court", colorway: "Graphite / Electric Blue", tags: ["statement", "court"], description: "A heavier visual, a featherweight feel. Monolith brings architectural proportions to the everyday rotation.", rating: 4.8, reviews: 38, badge: "Structural form", tone: "rgba(71,115,255,.62)" },
  { id: "vector-01", name: "Vector 4.0", price: 168, category: "Running", colorway: "Graphite / Electric Teal / Chrome", tags: ["direction", "speed"], description: "Directional geometry and electric-teal accents turn every stride into forward momentum. A responsive runner built to cut a clean line through the city.", rating: 4.7, reviews: 54, badge: "Directional speed", tone: "rgba(24,210,202,.62)" },
  { id: "solaris-01", name: "Solaris 60", price: 188, category: "Everyday", colorway: "Solar Gold / Amber / Graphite", tags: ["sunrise", "radiant"], description: "A radiant color story with a sculpted, all-day stride. Solaris 60 brings sunlit warmth and confident cushioning to your daily rotation.", rating: 4.8, reviews: 41, badge: "Solar-lit motion", tone: "rgba(246,184,62,.62)" },
  { id: "ivy-70", name: "Ivy 70", price: 174, category: "Everyday", colorway: "Ivy Green / Cool Grey / White", tags: ["heritage", "daily"], description: "A low-profile everyday sneaker blending ivy-green panels, cool grey mesh, and clean white layers. Its easy shape and cushioned sole make it a natural fit for the daily rotation.", rating: 4.7, reviews: 29, badge: "Everyday classic", tone: "rgba(111,155,119,.62)" },
];
const productStories: Record<string, { title: string; copy: string; feel: string }> = {
  "velocity-01": {
    title: "Made for the long way home",
    copy: "Chrome mesh and a cobalt airframe give Velocity 01 its crisp, technical profile. It is an energy-returning running silhouette built around forward motion, with a signal-bright finish that looks as ready to go as it feels.",
    feel: "Lively, driven, and hard to keep still.",
  },
  "courtline-01": {
    title: "A court classic, drawn sharper",
    copy: "Courtline 01 reworks a familiar court silhouette in clean technical layers. Bone, cobalt, and chrome keep the design composed, while its architectural line brings a little edge to every off-court step.",
    feel: "Clean and composed, with a confident edge.",
  },
  "afterdark-01": {
    title: "For the city after hours",
    copy: "Reflective panels cut through an ink-dark upper, while the sculpted night sole and a flash of orange bring the Afterdark 01 color story to life. It is made for city movement when the lights go down.",
    feel: "Low-key by day; vivid when you pick up speed.",
  },
  "flux-03": {
    title: "A faster feeling for early starts",
    copy: "Flux 03 pairs a flexible chassis with tuned cushioning in a vivid cobalt, lime, and chrome palette. The design is made for tempo days and the kind of run that starts before the alarm.",
    feel: "Flexible, reactive, and ready to find a rhythm.",
  },
  "monolith-01": {
    title: "Architectural form, easy movement",
    copy: "Monolith 01 uses bold proportions and a graphite-and-electric-blue palette to make a statement without feeling overbuilt. Its heavier visual is balanced by a featherweight feel, bringing a structural point of view to the everyday rotation.",
    feel: "Grounded in look; light in spirit.",
  },
  "vector-01": {
    title: "A clean line through the city",
    copy: "Directional geometry leads the eye forward, with electric-teal accents breaking through graphite and chrome. Vector 4.0 is a responsive running silhouette designed to turn each city stride into forward momentum.",
    feel: "Focused, quick, and always moving ahead.",
  },
  "solaris-01": {
    title: "Carry a little daylight",
    copy: "Solar gold and amber bring a radiant warmth to Solaris 60, balanced by a sculpted shape and graphite contrast. The all-day stride and confident cushioning make it a natural fit for the daily rotation.",
    feel: "Warm, assured, and comfortably in motion.",
  },
  "frost-100": {
    title: "A cool edge for daily miles",
    copy: "Crisp white mesh and glacier-blue structure give Frost 100 a bright, clean runner profile. The cushioned shape is made for easy miles and the movement that fills the rest of the day.",
    feel: "Light, crisp, and ready to move.",
  },
  "ivy-70": {
    title: "A quieter kind of statement",
    copy: "Ivy 70 pairs deep green panels with cool grey mesh and white layers for a grounded everyday look. Its low-profile shape keeps the color story simple and easy to wear across the daily rotation.",
    feel: "Relaxed, balanced, and quietly distinctive.",
  },
};

const customDefaults: CustomConfig = { upper: "cobalt", sole: "lime", lace: "orange", accent: "chrome", initials: "" };
const INK_COLOR = "#4338b8";
const customColors: Record<keyof Omit<CustomConfig, "initials">, { key: string; label: string; value: string; price?: number }[]> = {
  upper: [
    { key: "chrome", label: "Chrome", value: "#cbd4e4" },
    { key: "ink", label: "Ink", value: INK_COLOR },
    { key: "cobalt", label: "Cobalt", value: "#2459ff", price: 12 },
    { key: "bone", label: "Bone", value: "#d9d1c2" },
  ],
  sole: [
    { key: "cobalt", label: "Cobalt", value: "#2459ff" },
    { key: "orange", label: "Signal", value: "#ff6334" },
    { key: "ink", label: "Ink", value: INK_COLOR },
    { key: "lime", label: "Acid", value: "#bbf36a", price: 8 },
  ],
  lace: [
    { key: "ink", label: "Ink", value: INK_COLOR },
    { key: "chrome", label: "Chrome", value: "#cbd4e4" },
    { key: "orange", label: "Signal", value: "#ff6334" },
    { key: "lime", label: "Acid", value: "#bbf36a" },
  ],
  accent: [
    { key: "orange", label: "Signal", value: "#ff6334" },
    { key: "cobalt", label: "Cobalt", value: "#2459ff" },
    { key: "lime", label: "Acid", value: "#bbf36a" },
    { key: "chrome", label: "Chrome", value: "#cbd4e4" },
  ],
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function useStore() {
  const [cart, setCart] = useState<CartItem[]>(() => readStorage("kickshift-cart", []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage("kickshift-wishlist", []));
  useEffect(() => window.localStorage.setItem("kickshift-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => window.localStorage.setItem("kickshift-wishlist", JSON.stringify(wishlist)), [wishlist]);
  const addToCart = (productId: string, size: string, custom?: CustomConfig) => {
    setCart((items) => {
      const existing = items.find((item) => item.productId === productId && item.size === size && JSON.stringify(item.custom) === JSON.stringify(custom));
      if (existing) return items.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { id: `${productId}-${size}-${Date.now()}`, productId, size, quantity: 1, custom }];
    });
  };
  const updateQuantity = (id: string, delta: number) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity));
  const removeItem = (id: string) => setCart((items) => items.filter((item) => item.id !== id));
  const toggleWishlist = (id: string) => setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return { cart, wishlist, addToCart, updateQuantity, removeItem, toggleWishlist };
}

function money(value: number) { return `$${value.toFixed(2)}`; }
function pageVariants() { return { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }; }

function Header({ cartCount, wishlistCount }: { cartCount: number; wishlistCount: number }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const nav = [
    { href: "/shop", label: "Shop" },
    { href: "/customize", label: "Customize" },
    { href: "/wishlist", label: "Wishlist" },
  ];
  return (
    <header className="ks-header">
      <nav className="ks-nav" aria-label="Main navigation">
        <Link href="/" className="ks-logo" data-testid="link-home">
          <span className="ks-logo-mark-wrap"><KsRoundLogo className="ks-logo-mark" /></span>
          <span className="ks-logo-text">KICK<span>SHIFT</span></span>
        </Link>
        <div className={`ks-navlinks ${open ? "open" : ""}`}>
          {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`ks-navlink ${location === item.href ? "active" : ""}`} data-testid={`link-${item.label.toLowerCase()}`}>{item.label}</Link>)}
        </div>
        <div className="ks-nav-actions">
          <Link href="/shop" className="ks-icon-btn" aria-label="Search products" data-testid="link-search"><Search size={17} /></Link>
          <Link href="/wishlist" className="ks-icon-btn" aria-label="Wishlist" data-testid="link-wishlist">
            <Heart size={17} className={wishlistCount ? "text-orange" : ""} />
            {wishlistCount > 0 && <span className="ks-bubble">{wishlistCount}</span>}
          </Link>
          <Link href="/cart" className="ks-icon-btn" aria-label="Shopping bag" data-testid="link-cart">
            <ShoppingBag size={17} />{cartCount > 0 && <span className="ks-bubble">{cartCount}</span>}
          </Link>
        </div>
        <button className="ks-menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu" data-testid="button-menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
      </nav>
    </header>
  );
}

function Footer() {
  return <footer className="ks-footer"><div><strong>KICKSHIFT</strong><div style={{ marginTop: 8 }}>Footwear as a personal interface.</div></div><div className="ks-footer-links"><Link href="/shop">Shop all</Link><Link href="/customize">Build yours</Link><Link href="/wishlist">Wishlist</Link></div><div>© 2025 KICKSHIFT LABS</div></footer>;
}

function Layout({ children, store }: { children: ReactNode; store: ReturnType<typeof useStore> }) {
  const [location] = useLocation();
  return <div className={location === "/" ? "ks-motion" : ""}><div className="ks-shell ks-grain"><Header cartCount={store.cart.reduce((total, item) => total + item.quantity, 0)} wishlistCount={store.wishlist.length} /><main className="ks-main">{children}</main><Footer /></div></div>;
}

function ProductCard({ product, store }: { product: Product; store: ReturnType<typeof useStore> }) {
  const liked = store.wishlist.includes(product.id);
  const image = productImages[product.id] ?? HERO_IMAGE;
  const [, navigate] = useLocation();
  const goToProduct = () => navigate(`/product/${product.id}`);

  return <motion.article
    className="ks-product-card ksm-product-card"
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: .5 }}
    onClick={goToProduct}
    onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goToProduct();
      }
    }}
    role="link"
    tabIndex={0}
    aria-label={`View ${product.name} product page`}
  >
    <div
      className={`ks-product-visual ks-product-visual--${product.id}`}
      style={{
        "--glow": product.tone,
      } as CSSProperties}
      data-variant={product.id}
    >
      <button
        className={`ks-heart ${liked ? "active" : ""}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          store.toggleWishlist(product.id);
        }}
        aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        data-testid={`button-wishlist-${product.id}`}
      >
        <Heart size={17} fill={liked ? "currentColor" : "none"} />
      </button>
      <div className="ks-product-image-link" aria-label={`View ${product.name}`} data-testid={`link-product-${product.id}`}>
        <ShoePhoto src={image} alt={product.name} productId={product.id} />
      </div>
    </div>
    <div className="ks-product-meta" data-testid={`card-product-${product.id}`}>
      <div>
        <div className="ks-product-name">{product.name}</div>
        <div className="ks-product-sub">{product.colorway}</div>
      </div>
      <div className="ks-price">{money(product.price)}</div>
    </div>
  </motion.article>;
}

function ProductCarousel({ store, items, ariaLabel, testId }: { store: ReturnType<typeof useStore>; items: Product[]; ariaLabel: string; testId: string }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ pointerId: -1, startX: 0, startY: 0, startScroll: 0, moved: false });
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (hoverRef.current || focusRef.current || dragRef.current.moved) return;
      const nearEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 8;
      carousel.scrollTo({ left: nearEnd ? 0 : carousel.scrollLeft + carousel.clientWidth * .82, behavior: "smooth" });
    }, 4200);
    return () => window.clearInterval(timer);
  }, [items.length]);
  const scrollByPage = (direction: number) => {
    const carousel = carouselRef.current;
    if (carousel) carousel.scrollBy({ left: direction * carousel.clientWidth * .82, behavior: "smooth" });
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByPage(event.key === "ArrowRight" ? 1 : -1);
    }
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel || event.button !== 0 || !event.isPrimary) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScroll: carousel.scrollLeft,
      moved: false,
    };
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const drag = dragRef.current;
    if (!carousel || drag.pointerId !== event.pointerId) return;
    const distanceX = event.clientX - drag.startX;
    const distanceY = event.clientY - drag.startY;
    if (!drag.moved) {
      if (Math.abs(distanceX) <= 6 || Math.abs(distanceX) <= Math.abs(distanceY)) return;
      drag.moved = true;
      carousel.setPointerCapture(event.pointerId);
    }
    carousel.scrollLeft = drag.startScroll - distanceX;
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (carousel && dragRef.current.pointerId === event.pointerId && carousel.hasPointerCapture(event.pointerId)) carousel.releasePointerCapture(event.pointerId);
    dragRef.current.pointerId = -1;
    window.setTimeout(() => { dragRef.current.moved = false; }, 0);
  };
  return <div className="ksm-rail">
    <div className="ksm-rail-controls">
      <span>Drag or scroll to explore</span>
      <div>
        <button type="button" aria-label="Previous footwear" onClick={() => scrollByPage(-1)}><ChevronLeft size={17} /></button>
        <button type="button" aria-label="Next footwear" onClick={() => scrollByPage(1)}><ChevronRight size={17} /></button>
      </div>
    </div>
    <div className="ks-carousel-shell">
      <div
        className="ks-product-carousel ksm-product-rail"
        ref={carouselRef}
        tabIndex={0}
        role="group"
        aria-label={ariaLabel}
        data-testid={testId}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={() => { hoverRef.current = true; }}
        onPointerLeave={() => { hoverRef.current = false; }}
        onFocusCapture={() => { focusRef.current = true; }}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focusRef.current = false; }}
        onClickCapture={(event) => { if (dragRef.current.moved) { event.preventDefault(); event.stopPropagation(); } }}
      >
        {items.map((product) => <ProductCard key={product.id} product={product} store={store} />)}
      </div>
    </div>
  </div>;
}

function HomePage({ store }: { store: ReturnType<typeof useStore> }) {
  return <HomeMotion
    products={products}
    imageForProduct={(product) => productImages[product.id] ?? HERO_IMAGE}
    renderRail={(items, ariaLabel, testId) => <ProductCarousel store={store} items={items} ariaLabel={ariaLabel} testId={testId} />}
  />;
}

function ShopPage({ store }: { store: ReturnType<typeof useStore> }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const filtered = useMemo(() => products.filter((product) => (category === "All" || product.category === category) && `${product.name} ${product.colorway} ${product.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "Price low" ? a.price - b.price : sort === "Price high" ? b.price - a.price : b.rating - a.rating), [category, query, sort]);
  return <motion.div className="ks-page" variants={pageVariants()} initial="initial" animate="animate" exit="exit"><div className="ks-shop-head"><div><div className="ks-kicker">KICKSHIFT / Shop</div><h1 className="ks-display ks-shop-title">The roster.</h1></div><p className="ks-hero-desc" style={{ margin: 0 }}>{products.length} silhouettes. One point of view.<br />Find the one that moves like you.</p></div><div className="ks-controls"><label className="ks-search"><Search size={16} color="var(--muted)" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the roster" aria-label="Search products" data-testid="input-search-products" /></label><select className="ks-select" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category" data-testid="select-category"><option>All</option><option>Running</option><option>Court</option><option>Everyday</option></select><select className="ks-select" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products" data-testid="select-sort"><option>Featured</option><option>Price low</option><option>Price high</option></select><span className="ks-count">{filtered.length} / {products.length} silhouettes</span></div><div className="ks-product-grid">{filtered.length ? filtered.map((product) => <ProductCard key={product.id} product={product} store={store} />) : <div className="ks-empty" style={{ gridColumn: "1 / -1" }}><Search size={26} /><h2>No product found</h2><p>Try another name, color, or category.</p></div>}</div></motion.div>;
}

function Stars({ product }: { product: Product }) {
  return <div className="ks-stars" aria-label={`${product.rating} out of 5 stars`}>{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={13} fill={star < Math.round(product.rating) ? "currentColor" : "none"} />)}<span>{product.rating} · {product.reviews} reviews</span></div>;
}

type CustomerReview = { name: string; rating: number; comment: string; createdAt: string };

function ProductPage({ store }: { store: ReturnType<typeof useStore> }) {
  const { id } = useParams<{ id: string }>();
  const product = products.find((item) => item.id === id);
  const [size, setSize] = useState("9");
  const [added, setAdded] = useState(false);
  const [angle, setAngle] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewNotice, setReviewNotice] = useState("");
  const [userReviews, setUserReviews] = useState<CustomerReview[]>(() => readStorage(`kickshift-reviews-${id}`, []));

  useEffect(() => {
    setAngle(0);
    setUserReviews(readStorage(`kickshift-reviews-${id}`, []));
    setReviewNotice("");
  }, [id]);

  if (!product) {
    return <NotFound />;
  }

  const gallery = productImageSets[product.id] ?? [productImages[product.id] ?? HERO_IMAGE];
  const activeAngle = angle % gallery.length;
  const liked = store.wishlist.includes(product.id);
  const add = () => { store.addToCart(product.id, size); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };
  const changeAngle = (direction: number) => setAngle((current) => (current + direction + gallery.length) % gallery.length);
  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entry = { name: reviewName.trim(), rating: reviewRating, comment: reviewComment.trim(), createdAt: new Date().toISOString() };
    if (!entry.name || !entry.comment) return;
    const next = [entry, ...userReviews];
    setUserReviews(next);
    window.localStorage.setItem(`kickshift-reviews-${product.id}`, JSON.stringify(next));
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    setReviewNotice("Your review is saved on this device.");
  };
  return <motion.div className="ks-page" variants={pageVariants()} initial="initial" animate="animate" exit="exit">
    <div className="ks-breadcrumb"><Link href="/shop">Shop</Link><ChevronLeft size={12} style={{ verticalAlign: "middle" }} />{product.name}</div>
    <div className="ks-detail">
      <div className="ks-detail-gallery">
        <div className={`ks-detail-visual ks-detail-visual--${product.id}`} onKeyDown={(event) => { if (event.key === "ArrowRight") changeAngle(1); if (event.key === "ArrowLeft") changeAngle(-1); }} tabIndex={0} aria-label={gallery.length > 1 ? `${product.name} image gallery. Use arrow keys to change angle.` : `${product.name} product image`}>
          <ShoePhoto
            key={gallery[activeAngle]}
            src={gallery[activeAngle]}
            alt={`${product.name}, ${activeAngle === 0 ? "three-quarter view" : "side profile"} in ${product.colorway}`}
            productId={product.id}
            view={activeAngle === 0 ? "front" : "side"}
          />
          {gallery.length > 1 && <div className="ks-gallery-controls">
            <button type="button" onClick={() => changeAngle(-1)} aria-label="Previous shoe angle"><ChevronLeft size={18} /></button>
            <span>{String(activeAngle + 1).padStart(2, "0")} <i>/ {String(gallery.length).padStart(2, "0")}</i></span>
            <button type="button" onClick={() => changeAngle(1)} aria-label="Next shoe angle"><ChevronRight size={18} /></button>
          </div>}
        </div>
        {gallery.length > 1 && <div className="ks-angle-thumbnails" role="group" aria-label="Choose shoe angle">
          {gallery.map((src, index) => <button type="button" key={src} className={activeAngle === index ? "selected" : ""} onClick={() => setAngle(index)} aria-label={`Show ${index === 0 ? "three-quarter view" : "side profile"}`} aria-pressed={activeAngle === index}><ShoePhoto src={src} alt="" productId={product.id} view={index === 0 ? "front" : "side"} /></button>)}
        </div>}
      </div>
      <div className="ks-detail-info"><div className="ks-kicker">{product.category} / {product.tags[0]}</div><h1 className="ks-display">{product.name}</h1><Stars product={product} /><div className="ks-detail-price">{money(product.price)}</div><p>{product.description}</p><div className="ks-choice-label"><span>Size</span><span style={{ color: "var(--orange)" }}>Fits true to size</span></div><div className="ks-size-row">{sizes.map((item) => <button key={item} className={`ks-size ${size === item ? "selected" : ""}`} onClick={() => setSize(item)} data-testid={`button-size-${item}`}>{item}</button>)}</div><button className="ks-btn ks-btn-primary ks-full-btn" onClick={add} data-testid="button-add-to-cart">{added ? <><Check size={17} /> Added to bag</> : <><ShoppingBag size={17} /> Add to bag — {money(product.price)}</>}</button><button className={`ks-btn ks-btn-ghost ks-full-btn ${liked ? "active" : ""}`} onClick={() => store.toggleWishlist(product.id)} data-testid="button-detail-wishlist"><Heart size={16} fill={liked ? "currentColor" : "none"} /> {liked ? "Saved to wishlist" : "Save to wishlist"}</button></div>
    </div>
    <section className={`ks-product-about ks-product-about--${product.id}`} aria-labelledby="about-product-title">
      <div className="ks-product-about-index"><span>01 / THE MODEL</span><span>{product.category} · {product.colorway}</span></div>
      <div className="ks-product-about-copy">
        <div className="ks-kicker">About this product</div>
        <h2 id="about-product-title" className="ks-display">{productStories[product.id]?.title ?? `Meet ${product.name}`}</h2>
        <p>{productStories[product.id]?.copy ?? product.description}</p>
      </div>
      <aside className="ks-product-about-feel">
        <span>THE FEEL</span>
        <p>{productStories[product.id]?.feel ?? product.description}</p>
      </aside>
    </section>
    <section className="ks-reviews" aria-labelledby="reviews-title">
      <div className="ks-review-heading"><div><div className="ks-kicker">Field notes</div><h2 id="reviews-title" className="ks-display">Reviews &amp; comments</h2></div><div className="ks-review-summary"><strong>{product.rating}</strong><Stars product={product} /></div></div>
      <div className="ks-review-layout"><div className="ks-review-list">{userReviews.length ? userReviews.map((review, index) => <article className="ks-review" key={`${review.createdAt}-${index}`}><div className="ks-review-byline"><strong>{review.name}</strong><span>{new Date(review.createdAt).toLocaleDateString()}</span></div><div className="ks-review-stars" aria-label={`${review.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} fill={star <= review.rating ? "currentColor" : "none"} />)}</div><p>{review.comment}</p></article>) : <div className="ks-review-empty"><span>01 / OPEN FLOOR</span><p>No customer notes yet. Be the first to leave one.</p></div>}</div>
        <form className="ks-review-form" onSubmit={submitReview}><h3>Leave a review</h3><label>Your name<input required value={reviewName} onChange={(event) => setReviewName(event.target.value)} maxLength={60} /></label><fieldset><legend>Your rating</legend><div className="ks-rating-picker">{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating} onClick={() => setReviewRating(rating)} aria-label={`${rating} star${rating === 1 ? "" : "s"}`} aria-pressed={reviewRating === rating} className={rating <= reviewRating ? "selected" : ""}><Star size={19} fill={rating <= reviewRating ? "currentColor" : "none"} /></button>)}</div></fieldset><label>Your comments<textarea required value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} rows={4} maxLength={1200} placeholder="How does it move?" /></label><button className="ks-btn ks-btn-primary" type="submit">Post review <ArrowRight size={15} /></button>{reviewNotice && <p className="ks-review-notice" role="status">{reviewNotice}</p>}</form>
      </div>
    </section>
  </motion.div>;
}

function CustomizerPage({ store }: { store: ReturnType<typeof useStore> }) {
  const [config, setConfig] = useState<CustomConfig>(customDefaults);
  const [size, setSize] = useState("9");
  const [added, setAdded] = useState(false);
  const price = 210 + (config.upper === "cobalt" ? 12 : 0) + (config.sole === "lime" ? 8 : 0);
  const setChoice = (group: keyof Omit<CustomConfig, "initials">, value: string) => setConfig((current) => ({ ...current, [group]: value }));
  const colorValue = (group: keyof typeof customColors) => customColors[group].find((item) => item.key === config[group])?.value ?? customColors[group][0].value;
  const colorLabel = (group: keyof typeof customColors) => customColors[group].find((item) => item.key === config[group])?.label ?? customColors[group][0].label;
  const previewColors = {
    upper: colorValue("upper"),
    sole: colorValue("sole"),
    lace: colorValue("lace"),
    accent: colorValue("accent"),
  };
  const add = () => { store.addToCart("velocity-01", size, config); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };
  return (
    <motion.div variants={pageVariants()} initial="initial" animate="animate" exit="exit">
      <div className="ks-page" style={{ paddingBottom: 0 }}>
        <div className="ks-kicker">KICKSHIFT / Studio</div>
        <div className="ks-breadcrumb" style={{ marginTop: 12 }}>Build a Velocity 01 that only belongs to you.</div>
      </div>
      <div className="ks-customizer">
        <div className="ks-custom-stage" style={{ "--accent-color": previewColors.accent } as CSSProperties}>
          <CustomizableShoePhoto
            src={HERO_IMAGE}
            alt={`Live preview of Velocity 01 with ${colorLabel("upper")} upper, ${colorLabel("sole")} sole, ${colorLabel("lace")} laces, and ${colorLabel("accent")} accents`}
            productId="velocity-01"
            className="ks-custom-shoe"
            colors={previewColors}
          />
          <div className="ks-custom-monogram">MONOGRAM / {config.initials || "—"}</div>
        </div>
        <div className="ks-custom-controls">
          <div className="ks-kicker">Customizer 01</div>
          <h1 className="ks-display">Make it<br /><span style={{ color: "var(--orange)" }}>yours.</span></h1>
          <p>Change the signal. Keep the system. Every choice is saved locally in this browser.</p>
          {(["upper", "sole", "lace", "accent"] as const).map((group) => (
            <div className="ks-option" key={group}>
              <div className="ks-choice-label" style={{ marginTop: 0 }}>
                <span>{group}</span>
                <span>{colorLabel(group)}</span>
              </div>
              <div className="ks-swatches">
                {customColors[group].map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    className={`ks-swatch ${item.key === "ink" ? "ks-swatch--ink" : ""} ${config[group] === item.key ? "selected" : ""}`}
                    style={{ background: item.value }}
                    title={item.label}
                    aria-label={`${group}: ${item.label}`}
                    aria-pressed={config[group] === item.key}
                    onClick={() => setChoice(group, item.key)}
                    data-testid={`button-${group}-${item.key}`}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="ks-option">
            <div className="ks-choice-label" style={{ marginTop: 0 }}>
              <span>Size</span><span>{size}</span>
            </div>
            <div className="ks-size-row">
              {sizes.map((item) => (
                <button key={item} className={`ks-size ${size === item ? "selected" : ""}`} onClick={() => setSize(item)} data-testid={`button-custom-size-${item}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="ks-option">
            <label className="ks-choice-label" htmlFor="initials">
              <span>Monogram</span><span>{config.initials.length}/3</span>
            </label>
            <input
              id="initials"
              className="ks-custom-input"
              maxLength={3}
              value={config.initials}
              onChange={(event) => setConfig((current) => ({ ...current, initials: event.target.value.toUpperCase() }))}
              placeholder="ADD INITIALS"
              data-testid="input-initials"
            />
          </div>
          <div className="ks-custom-price"><small>YOUR CONFIGURATION</small>{money(price)}</div>
          <button className="ks-btn ks-btn-primary ks-full-btn" onClick={add} data-testid="button-add-custom">
            <ShoppingBag size={16} />{added ? "Added to bag" : "Add your pair"}
          </button>
          <button className="ks-btn ks-btn-ghost ks-full-btn" onClick={() => { setConfig(customDefaults); setSize("9"); }} data-testid="button-reset-custom">
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function WishlistPage({ store }: { store: ReturnType<typeof useStore> }) {
  const saved = products.filter((product) => store.wishlist.includes(product.id));
  return <motion.div className="ks-page" variants={pageVariants()} initial="initial" animate="animate" exit="exit"><div className="ks-kicker">Your saved signal</div><h1 className="ks-display ks-shop-title" style={{ marginBottom: 45 }}>Wishlist.</h1>{saved.length ? <div className="ks-product-grid">{saved.map((product) => <ProductCard key={product.id} product={product} store={store} />)}</div> : <div className="ks-empty"><Heart size={28} /><h2>Nothing saved yet.</h2><p>When a silhouette catches your eye, keep it here.</p><Link href="/shop" className="ks-btn ks-btn-primary" style={{ marginTop: 15 }} data-testid="button-wishlist-shop">Explore the roster <ArrowRight size={15} /></Link></div>}</motion.div>;
}

function CartPage({ store }: { store: ReturnType<typeof useStore> }) {
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const items = store.cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) ?? products[0] }));
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity + (item.custom ? 25 * item.quantity : 0), 0);
  const discount = promoApplied ? subtotal * .1 : 0;
  const total = subtotal - discount + (subtotal > 180 ? 0 : 12);
  return <motion.div className="ks-page" variants={pageVariants()} initial="initial" animate="animate" exit="exit"><div className="ks-cart-head"><div><div className="ks-kicker">The good stuff</div><h1 className="ks-display">Your bag.</h1></div><span className="ks-count">{items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>{items.length ? <div className="ks-cart-layout"><div>{items.map((item) => <div className="ks-cart-item" key={item.id}><div className="ks-cart-thumb"><ShoePhoto src={productImages[item.product.id] ?? HERO_IMAGE} alt={item.product.name} productId={item.product.id} /></div><div><Link href={`/product/${item.product.id}`} className="ks-cart-name">{item.product.name}</Link><div className="ks-cart-details">Size {item.size}{item.custom ? ` · Custom / ${item.custom.initials || "No monogram"}` : ""}</div><div className="ks-qty"><button onClick={() => store.updateQuantity(item.id, -1)} aria-label="Decrease quantity" data-testid={`button-decrease-${item.id}`}><Minus size={13} /></button><span data-testid={`text-quantity-${item.id}`}>{item.quantity}</span><button onClick={() => store.updateQuantity(item.id, 1)} aria-label="Increase quantity" data-testid={`button-increase-${item.id}`}><Plus size={13} /></button></div></div><div style={{ textAlign: "right" }}><div className="ks-price">{money((item.product.price + (item.custom ? 25 : 0)) * item.quantity)}</div><button className="ks-remove" onClick={() => store.removeItem(item.id)} data-testid={`button-remove-${item.id}`}>Remove</button></div></div>)}</div><aside className="ks-summary"><h2>Order summary</h2><div className="ks-summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>{promoApplied && <div className="ks-summary-row" style={{ color: "var(--lime)" }}><span>SHIFT10</span><span>−{money(discount)}</span></div>}<div className="ks-summary-row"><span>Shipping</span><span>{subtotal > 180 ? "Free" : money(12)}</span></div><div className="ks-summary-row total"><span>Total</span><span>{money(total)}</span></div><div className="ks-promo"><input value={promo} onChange={(event) => setPromo(event.target.value.toUpperCase())} placeholder="PROMO CODE" aria-label="Promo code" data-testid="input-promo" /><button className="ks-btn ks-btn-ghost" onClick={() => { if (promo === "SHIFT10") setPromoApplied(true); }} data-testid="button-apply-promo">Apply</button></div><Link href="/checkout" className="ks-btn ks-btn-primary ks-full-btn" style={{ marginTop: 13 }} data-testid="button-checkout">Checkout <ArrowRight size={16} /></Link><Link href="/shop" className="ks-btn ks-btn-ghost ks-full-btn" style={{ marginTop: 9 }} data-testid="button-continue-shopping">Continue shopping</Link></aside></div> : <div className="ks-empty"><ShoppingBag size={29} /><h2>Your bag is in standby.</h2><p>There is nothing here yet. The roster is waiting.</p><Link href="/shop" className="ks-btn ks-btn-primary" style={{ marginTop: 15 }} data-testid="button-empty-cart-shop">Shop the roster <ArrowRight size={15} /></Link></div>}</motion.div>;
}

function CheckoutPage({ store }: { store: ReturnType<typeof useStore> }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ email: "", first: "", last: "", address: "", city: "", zip: "", card: "" });
  const update = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: event.target.value });
  const items = store.cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) ?? products[0] }));
  const total = items.reduce((sum, item) => sum + (item.product.price + (item.custom ? 25 : 0)) * item.quantity, 0);
  if (submitted) return <motion.div className="ks-success" variants={pageVariants()} initial="initial" animate="animate"><div><div className="ks-success-mark"><Check size={40} /></div><div className="ks-kicker">Order confirmed / KS-{Math.floor(1000 + Math.random() * 8999)}</div><h1 className="ks-display">Good<br /><span style={{ color: "var(--orange)" }}>choice.</span></h1><p>Your KICKSHIFT pair is now in motion. We sent the details to {form.email || "your inbox"}.</p><Link href="/shop" className="ks-btn ks-btn-primary" data-testid="button-order-shop">Back to the roster <ArrowRight size={15} /></Link></div></motion.div>;
  return <motion.div className="ks-page ks-form-page" variants={pageVariants()} initial="initial" animate="animate" exit="exit"><div className="ks-breadcrumb"><Link href="/cart">Bag</Link><ChevronLeft size={12} style={{ verticalAlign: "middle" }} /> Checkout</div><div className="ks-cart-head"><div><div className="ks-kicker">Almost in motion</div><h1 className="ks-display">Checkout.</h1></div><div className="ks-price">{money(total)}</div></div>{items.length ? <div className="ks-form-grid"><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); store.cart.forEach((item) => store.removeItem(item.id)); }}><section className="ks-form-section"><h2>01 / Contact</h2><div className="ks-form"><label className="full">Email<input required type="email" value={form.email} onChange={update("email")} placeholder="you@domain.com" data-testid="input-email" /></label></div></section><section className="ks-form-section"><h2>02 / Shipping</h2><div className="ks-form"><label>First name<input required value={form.first} onChange={update("first")} data-testid="input-first-name" /></label><label>Last name<input required value={form.last} onChange={update("last")} data-testid="input-last-name" /></label><label className="full">Address<input required value={form.address} onChange={update("address")} data-testid="input-address" /></label><label>City<input required value={form.city} onChange={update("city")} data-testid="input-city" /></label><label>Postcode<input required value={form.zip} onChange={update("zip")} data-testid="input-zip" /></label></div></section><section className="ks-form-section"><h2>03 / Payment</h2><div className="ks-form"><label className="full">Card number<input required minLength={12} value={form.card} onChange={update("card")} placeholder="4242 4242 4242 4242" data-testid="input-card" /></label></div></section><button className="ks-btn ks-btn-primary ks-full-btn" type="submit" data-testid="button-place-order">Place order — {money(total)} <ArrowRight size={16} /></button></form><aside className="ks-summary"><h2>In your bag</h2>{items.map((item) => <div className="ks-checkout-item" key={item.id}><div className="ks-checkout-thumb"><ShoePhoto src={productImages[item.product.id] ?? HERO_IMAGE} alt={item.product.name} productId={item.product.id} /></div><div className="ks-checkout-meta"><span>{item.product.name} × {item.quantity}</span><small>Size {item.size}</small></div><strong>{money(item.product.price * item.quantity)}</strong></div>)}<div className="ks-summary-row total"><span>Total</span><span>{money(total)}</span></div><p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: 12 }}>Free express shipping on orders over $180. Returns accepted within 30 days.</p></aside></div> : <div className="ks-empty"><ShoppingBag size={29} /><h2>Your bag is empty.</h2><Link href="/shop" className="ks-btn ks-btn-primary" style={{ marginTop: 15 }} data-testid="button-checkout-shop">Find your pair</Link></div>}</motion.div>;
}

function NotFound() { return <div className="ks-notfound"><div className="ks-kicker">404 / Signal lost</div><h1 className="ks-display" style={{ fontSize: "clamp(65px, 13vw, 170px)", margin: "18px 0" }}>Off<br /><span style={{ color: "var(--orange)" }}>grid.</span></h1><Link href="/" className="ks-btn ks-btn-primary" data-testid="button-404-home">Return home <ArrowRight size={15} /></Link></div>; }

function StoreRouter({ store }: { store: ReturnType<typeof useStore> }) {
  return <AnimatePresence mode="wait"><Switch><Route path="/"><HomePage store={store} /></Route><Route path="/shop"><ShopPage store={store} /></Route><Route path="/product/:id"><ProductPage store={store} /></Route><Route path="/customize"><CustomizerPage store={store} /></Route><Route path="/wishlist"><WishlistPage store={store} /></Route><Route path="/cart"><CartPage store={store} /></Route><Route path="/checkout"><CheckoutPage store={store} /></Route><Route><NotFound /></Route></Switch></AnimatePresence>;
}

function App() {
  const store = useStore();
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><Layout store={store}><StoreRouter store={store} /></Layout></WouterRouter>;
}

export default App;