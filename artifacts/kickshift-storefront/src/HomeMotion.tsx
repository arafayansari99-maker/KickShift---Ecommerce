import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Link } from "wouter";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import "./motion-home.css";
import { ShoePhoto } from "./ShoeBranding";

type MotionProduct = {
  id: string;
  name: string;
  price: number;
  category: "Running" | "Court" | "Everyday";
  colorway: string;
  description: string;
  badge?: string;
  tone: string;
};

type HomeMotionProps<T extends MotionProduct> = {
  products: T[];
  imageForProduct: (product: T) => string;
  renderRail: (items: T[], ariaLabel: string, testId: string) => ReactNode;
};

type StoryBeat<T extends MotionProduct> = {
  product: T;
  index: string;
  label: string;
  detail: string;
};

const benefits = [
  { label: "Lightweight comfort", detail: "Feel the freedom with every step." },
  { label: "All-day durability", detail: "Built to keep your rhythm." },
  { label: "Maximum grip", detail: "Stay grounded, stay moving." },
  { label: "Modern design", detail: "For those who move different." },
];

const homeVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function KineticBand({ reverse = false, tone = "orange" }: { reverse?: boolean; tone?: "orange" | "cool" }) {
  const phrase = "ENGINEERED FOR MOTION   / / /   PERSONAL BY DEFAULT   / / /   CHROME / COBALT / SIGNAL   / / /";
  const reducedMotion = useReducedMotion();
  return (
    <div className={`ksm-band ksm-band--${tone}`} aria-label="Engineered for motion. Personal by default.">
      <motion.div
        className="ksm-band-track"
        animate={reducedMotion ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={reducedMotion ? undefined : { duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[0, 1, 2, 3].map((copy) => (
          <span aria-hidden={copy > 0} key={copy}>
            {phrase.split("   / / /   ").map((part, index) => (
              <span key={`${copy}-${part}-${index}`}>{part}{index < 2 && <b>///</b>}</span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ScrollStory<T extends MotionProduct>({
  products,
  imageForProduct,
}: {
  products: T[];
  imageForProduct: (product: T) => string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeBeat, setActiveBeat] = useState(0);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -24]);
  const storyBeats: StoryBeat<T>[] = [
    { product: products[0]!, index: "01", label: "Find your pace", detail: "Reactive cushioning meets chrome mesh. Take the long way, then take it faster." },
    { product: products[1]!, index: "02", label: "Own the line", detail: "Technical layers and an architectural profile made to move from warm-up to last point." },
    { product: products[2]!, index: "03", label: "Keep the city", detail: "Reflective by night, at home all day. Make the in-between yours." },
  ];

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(2, Math.floor(latest * 3));
    setActiveBeat(next);
  });

  return (
    <section className="ksm-story" ref={sectionRef} aria-label="From run to court to city">
      <div className="ksm-story-pin">
        <div className="ksm-story-topline"><span>One rotation. Every direction.</span><span>Scroll to move through it</span></div>
        <div className="ksm-story-layout">
          <div className="ksm-story-copy">
            <div className="ks-kicker">Made for the in-between</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="ksm-story-beat"
                key={activeBeat}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: reducedMotion ? 0 : 0.34 }}
              >
                <span className="ksm-story-index">{storyBeats[activeBeat]!.index} <i>/ 03</i></span>
                <h2 className="ks-display">{storyBeats[activeBeat]!.label}</h2>
                <p>{storyBeats[activeBeat]!.detail}</p>
                <Link href={`/product/${storyBeats[activeBeat]!.product.id}`} className="ksm-story-link">
                  {storyBeats[activeBeat]!.product.name} <ArrowRight size={15} />
                </Link>
              </motion.div>
            </AnimatePresence>
            <div
              className="ksm-story-progress"
              role="progressbar"
              aria-label="Product story progress"
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={activeBeat + 1}
            >
              <motion.span style={{ width: progressWidth }} />
            </div>
            <div className="ksm-story-dots" role="group" aria-label="Choose story moment">
              {storyBeats.map((beat, index) => (
                <button
                  key={beat.index}
                  type="button"
                  aria-label={`Show ${beat.label}`}
                  aria-pressed={activeBeat === index}
                  onClick={() => {
                    setActiveBeat(index);
                    if (reducedMotion) return;
                    const section = sectionRef.current;
                    if (!section) return;
                    const start = section.getBoundingClientRect().top + window.scrollY;
                    const range = section.offsetHeight - window.innerHeight;
                    window.scrollTo({ top: start + range * (index / 2), behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          </div>
          <motion.div className="ksm-story-visual" style={{ y: stageY }}>
            <div className="ksm-story-orbit" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={storyBeats[activeBeat]!.product.id}
                className="ksm-story-shoe-motion"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, scale: 1.02, x: -16 }}
                transition={{ duration: reducedMotion ? 0 : 0.45 }}
              >
                <ShoePhoto
                  src={imageForProduct(storyBeats[activeBeat]!.product)}
                  alt={`${storyBeats[activeBeat]!.product.name} in ${storyBeats[activeBeat]!.product.colorway}`}
                  productId={storyBeats[activeBeat]!.product.id}
                />
              </motion.div>
            </AnimatePresence>
            <span className="ksm-story-side-label">RUN / COURT / CITY</span>
          </motion.div>
        </div>
        <a className="ksm-story-scroll" href="#featured"><ArrowDown size={14} /> The current drop</a>
      </div>
    </section>
  );
}

export function HomeMotion<T extends MotionProduct>({
  products,
  imageForProduct,
  renderRail,
}: HomeMotionProps<T>) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(heroProgress, [0, 1], [0, reducedMotion ? 0 : 92]);
  const heroImageScale = useTransform(heroProgress, [0, 1], [1, reducedMotion ? 1 : 0.84]);
  const heroCopyY = useTransform(heroProgress, [0, 1], [0, reducedMotion ? 0 : -48]);
  const heroFade = useTransform(heroProgress, [0, 0.82, 1], [1, reducedMotion ? 1 : 0.5, reducedMotion ? 1 : 0]);
  const heroProduct = products[heroIndex];

  useEffect(() => {
    if (reducedMotion || heroPaused || products.length < 2) return;
    const interval = window.setInterval(() => setHeroIndex((index) => (index + 1) % products.length), 6200);
    return () => window.clearInterval(interval);
  }, [heroPaused, products.length, reducedMotion]);

  if (!heroProduct) return null;

  return (
    <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
      <section
        className="ks-hero ksm-hero"
        id="home"
        ref={heroRef}
        onPointerLeave={() => setHeroPaused(false)}
        onMouseEnter={() => setHeroPaused(true)}
        onFocusCapture={() => setHeroPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroPaused(false);
        }}
      >
        <motion.div className="ksm-hero-copy-wrap" style={{ y: heroCopyY, opacity: heroFade }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="ks-hero-copy ksm-hero-copy"
              key={heroProduct.id}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reducedMotion ? 0 : 0.38 }}
            >
              <div className="ks-kicker">{heroProduct.category} / {heroProduct.badge}</div>
              <h1 className="ks-display ks-hero-title">{heroProduct.name}<br /><em>{heroProduct.category}</em></h1>
              <p className="ks-hero-desc">{heroProduct.description}</p>
              <div className="ks-hero-product-meta"><span>{heroProduct.colorway}</span><strong>{money(heroProduct.price)}</strong></div>
              <div className="ks-hero-actions">
                <Link href={`/product/${heroProduct.id}`} className="ks-btn ks-btn-primary" data-testid="button-shop-featured">{`Shop ${heroProduct.name}`} <ArrowRight size={16} /></Link>
                <Link href="/customize" className="ks-btn ks-btn-ghost" data-testid="button-build-custom">Build your pair</Link>
              </div>
              <div className="ks-hero-pagination" role="group" aria-label="Featured products">
                {products.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    className={`ks-hero-dot${index === heroIndex ? " active" : ""}`}
                    aria-label={`Show ${product.name}`}
                    aria-pressed={index === heroIndex}
                    data-testid={`button-hero-slide-${product.id}`}
                    onClick={() => setHeroIndex(index)}
                  />
                ))}
                <span className="ksm-slide-count">{String(heroIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <motion.div className="ks-hero-art ksm-hero-art" style={{ y: heroImageY, scale: heroImageScale }}>
          <div className="ks-hero-grid" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={heroProduct.id}
              className="ksm-hero-shoe-motion"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 1.025 }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            >
              <span className="ksm-hero-shoe-float">
                <ShoePhoto
                  src={imageForProduct(heroProduct)}
                  alt={`${heroProduct.name} sneaker in ${heroProduct.colorway}`}
                  productId={heroProduct.id}
                  imageClassName="ks-hero-img"
                  priority
                />
              </span>
            </motion.div>
          </AnimatePresence>
          <div className="ksm-hero-caption"><span>{String(heroIndex + 1).padStart(2, "0")} — {String(products.length).padStart(2, "0")}</span><span>Performance, with a point of view.</span></div>
        </motion.div>
        <a className="ksm-scroll-cue" href="#featured"><span>Scroll to shift</span><ArrowDown size={14} /></a>
      </section>

      <section className="ks-benefits ksm-benefits" aria-label="KICKSHIFT benefits">
        <div className="ks-benefits-track">
          {[0, 1].map((copy) => (
            <div className="ks-benefits-group" key={copy} aria-hidden={copy === 1}>
              {benefits.map((item, index) => (
                <div key={`${copy}-${item.label}`} className="ks-benefit">
                  <span className="ks-benefit-mark">{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{item.label}</strong><p>{item.detail}</p></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <KineticBand />

      <section id="featured" className="ks-section ks-depth-section ksm-section ksm-drop">
        <div className="ksm-section-index">01 / THE ROTATION</div>
        <div className="ks-section-head">
          <div><div className="ks-kicker">The current drop</div><h2 className="ks-display ks-section-title">Find your<br />signature.</h2></div>
          <Link href="/shop" className="ks-btn ks-btn-ghost" data-testid="button-shop-all">See all footwear <ArrowRight size={15} /></Link>
        </div>
        {renderRail(products.slice(0, 4), "The current KICKSHIFT drop", "carousel-current-drop")}
      </section>

      <ScrollStory products={products} imageForProduct={imageForProduct} />
      <KineticBand reverse tone="cool" />

      <section className="ks-feature ksm-feature">
        <div className="ks-feature-copy">
          <div className="ks-kicker" style={{ color: "var(--lime)" }}>01 / The launch silhouette</div>
          <h2 className="ks-display">Built for<br />the next move.</h2>
          <p>Chrome does not whisper. The Velocity 01 pairs a reactive cobalt chassis with a responsive mesh upper for a shoe that looks as fast as it feels.</p>
          <Link href="/product/velocity-01" className="ks-btn ks-btn-primary" style={{ width: "fit-content", marginTop: 20 }} data-testid="button-discover-velocity">Discover Velocity 01 <ArrowRight size={15} /></Link>
          <span className="ksm-feature-index">KICKSHIFT / 001</span>
        </div>
        <motion.div
          className="ks-feature-art"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={reducedMotion ? undefined : { y: -4 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reducedMotion ? 0 : 0.65, ease: "easeOut" }}
        >
          <motion.div
            className="ksm-feature-shoe-motion"
            initial={reducedMotion ? false : { y: 24, rotate: -5 }}
            whileInView={{ y: 0, rotate: -2 }}
            whileHover={reducedMotion ? undefined : { scale: 1.035, rotate: -1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reducedMotion ? 0 : 0.7 }}
          >
            <ShoePhoto
              src={imageForProduct(products[0]!)}
              alt="Velocity 01 in chrome and cobalt"
              productId={products[0]!.id}
            />
          </motion.div>
          <motion.span
            className="ksm-art-label"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              color: "var(--lime)",
              textShadow: "0 0 16px rgba(213, 255, 105, 0.5)",
            }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}
          >
            CHROME / COBALT / SIGNAL
          </motion.span>
        </motion.div>
      </section>

      <section className="ks-section ks-section-alt ksm-section ksm-arrivals">
        <div className="ksm-section-index">02 / JUST LANDED</div>
        <div className="ks-section-head">
          <div><div className="ks-kicker">Just landed</div><h2 className="ks-display ks-section-title">New<br />arrivals.</h2></div>
          <Link href="/shop" className="ks-btn ks-btn-ghost" data-testid="button-shop-new-arrivals">Shop new arrivals <ArrowRight size={15} /></Link>
        </div>
        <div id="new-arrivals">{renderRail(products.slice(1), "KICKSHIFT new arrivals", "carousel-new-arrivals")}</div>
      </section>

      <section className="ks-section ksm-interface" id="interface">
        <div className="ksm-interface-head">
          <div className="ks-kicker">The interface</div>
          <h2 className="ks-display ks-section-title">Not just a shoe.<br /><span>A system you can wear.</span></h2>
          <p>Start with the silhouette. Make the rest yours.</p>
          <Link href="/customize" className="ks-btn ks-btn-primary">Build your pair <ArrowRight size={15} /></Link>
        </div>
        <div className="ks-studio">
          <article className="ks-studio-panel">
            <Sparkles size={21} color="var(--orange)" />
            <span className="ksm-panel-index">01 / PERSONAL</span>
            <h3>Make the defaults yours.</h3>
            <p>Choose your materials, tune your color hits, add your mark. No two pairs need to speak the same language.</p>
            <div className="ks-mini-line"><span /><span /><span /></div>
            <Link href="/customize" aria-label="Customize your materials and color hits" className="ksm-panel-action"><ArrowRight size={16} /></Link>
          </article>
          <article className="ks-studio-panel">
            <span className="ksm-rotate-mark">K/S</span>
            <span className="ksm-panel-index">02 / PERFORMANCE</span>
            <h3>Built to move with you.</h3>
            <p>Responsive cushioning, breathable technical mesh, and a silhouette designed to stay in motion.</p>
            <div className="ks-mini-line"><span style={{ background: "var(--cobalt-hot)" }} /><span style={{ background: "var(--orange)" }} /><span style={{ background: "var(--lime)" }} /></div>
            <Link href="/shop" aria-label="Explore performance footwear" className="ksm-panel-action"><ArrowRight size={16} /></Link>
          </article>
        </div>
      </section>
    </motion.div>
  );
}