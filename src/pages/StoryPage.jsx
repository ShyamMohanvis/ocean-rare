import { useLayoutEffect, useRef, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "../context/CartContext";
import { ShoppingBag } from "lucide-react";
import "./StoryPage.css";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { id: "ocean", title: "Born from the Blue", subtitle: "Pure waters. Exceptional seafood.", start: 0.0, end: 4.55 },
  { id: "catch", title: "Every Journey Begins", subtitle: "Responsibly sourced, carefully selected.", start: 4.55, end: 10.0 },
  { id: "journey", title: "From Catch to Facility", subtitle: "Cold-chain journey to our facility.", start: 10.0, end: 16.1 },
  { id: "processing", title: "Care in Every Step", subtitle: "Careful cleaning, strict quality checks.", start: 16.1, end: 20.9 },
  { id: "cuts", title: "Prepared for Your Table", subtitle: "Expertly cut for your every need.", start: 20.9, end: 22.4 },
];

const postShopChapter = { id: "delivery", title: "From Ocean to Table", subtitle: "Freshness delivered to your home.", start: 22.4, end: 30.0 };

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

const products = [
  { id: 1, name: "Premium Salmon Fillet", category: "fish", weight: "250g", price: "₹1,299", tag: "Bestseller", image: `${BASE}media/products/salmon.jpg` },
  { id: 2, name: "Whole Red Snapper", category: "fish", weight: "500g", price: "₹899", tag: "Fresh", image: `${BASE}media/products/snapper.jpg` },
  { id: 3, name: "Tiger Prawns", category: "prawns", weight: "300g", price: "₹749", tag: "Popular", image: `${BASE}media/products/prawns.jpg` },
  { id: 4, name: "Tuna Steak", category: "fish", weight: "200g", price: "₹1,499", tag: "Premium", image: `${BASE}media/products/tuna.jpg` },
  { id: 5, name: "Sea Bass Fillet", category: "fish", weight: "350g", price: "₹1,099", tag: "Chef's Pick", image: `${BASE}media/products/seabass.jpg` },
  { id: 6, name: "Jumbo Crab", category: "crabs", weight: "400g", price: "₹1,899", tag: "Limited", image: `${BASE}media/products/crab.jpg` },
];

function SiteNav({ progress, activeChapterLabel }) {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="nav-brand">Ocean Rare</div>
      <div className="nav-center">
        <div className="nav-progress-bar">
          <div
            className="nav-progress-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <span className="nav-chapter">{activeChapterLabel}</span>
      </div>
      <div className="nav-actions">
        <a href="#products" className="nav-shop-btn">Shop Seafood</a>
        <button 
          className="nav-cart-btn" 
          onClick={() => setIsCartOpen(true)}
          aria-label="Open cart"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();

  return (
    <div className="product-card" tabIndex={0} role="button" aria-label={`View ${product.name}`}>
      <div className="product-card-image-wrapper">
        <span className="product-tag">{product.tag}</span>
        {product.image && !imgError ? (
          <img 
            src={product.image} 
            alt={`Fresh ${product.name} ready for selection`}
            className="product-card-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-card-img-fallback">Image Unavailable</div>
        )}
      </div>
      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-meta">{product.weight} · Fresh</div>
        <div className="product-card-footer">
          <span className="product-card-price">{product.price}</span>
          <button 
            className="product-add-btn" 
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoryPage() {
  const root = useRef(null);
  const videoRef = useRef(null);
  const targetTime = useRef(0);
  const isSeeking = useRef(false);
  const [progress, setProgress] = useState(0);
  const [activeLabel, setActiveLabel] = useState("01 — Born from the Blue");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    if (activeFilter === "other") {
      return products.filter(p => !["fish", "prawns", "crabs"].includes(p.category));
    }
    return products.filter(p => p.category === activeFilter);
  }, [activeFilter]);
  
  // Single RAF loop for scrubbing video time
  useEffect(() => {
    let rafId;
    const loop = () => {
      const vid = videoRef.current;
      if (vid && !isSeeking.current && vid.readyState >= 1) {
        const diff = Math.abs(vid.currentTime - targetTime.current);
        if (diff > 0.05) {
          isSeeking.current = true;
          vid.currentTime = targetTime.current;
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleSeeked = () => {
    isSeeking.current = false;
  };

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      
      // Phase A (0s to 22.4s)
      ScrollTrigger.create({
        trigger: ".phase-a",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          targetTime.current = 22.4 * self.progress;
          setProgress(self.progress * (22.4 / 30.0));
        }
      });

      // Phase C (22.4s to 30.0s)
      ScrollTrigger.create({
        trigger: ".phase-c",
        start: "top bottom", 
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          targetTime.current = 22.4 + (7.6 * self.progress);
          setProgress((22.4 / 30.0) + (self.progress * (7.6 / 30.0)));
        }
      });
      
      // Chapter labels & text fade update
      const allPanels = gsap.utils.toArray(".chapter-panel");
      allPanels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
               if (i < 5) setActiveLabel(`0${i + 1} — ${chapters[i].title}`);
               else if (i === 5) setActiveLabel(`06 — ${postShopChapter.title}`);
            }
          }
        });
        
        const copy = panel.querySelector(".scene-copy");
        if (copy) {
          gsap.fromTo(copy,
            { y: 60, autoAlpha: 0 },
            { 
              y: 0, autoAlpha: 1, 
              scrollTrigger: {
                trigger: panel,
                start: "top 65%",
                end: "top 35%",
                scrub: true
              }
            }
          );
          gsap.to(copy, {
            y: -60, autoAlpha: 0,
            scrollTrigger: {
              trigger: panel,
              start: "bottom 65%",
              end: "bottom 35%",
              scrub: true
            }
          });
        }
      });

      // Shop interlude label
      ScrollTrigger.create({
        trigger: ".phase-b",
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveLabel("FIND YOUR CATCH");
          }
        }
      });

    }, element);

    const to = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(to);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <SiteNav progress={progress} activeChapterLabel={activeLabel} />
      <main ref={root} className="story-scroll-container">
        
        <div className="master-video-container">
          <video 
            ref={videoRef}
            src={`${BASE}media/ocean-rare-master-scroll.mp4`} 
            className="master-video"
            muted 
            playsInline 
            preload="auto"
            onSeeked={handleSeeked}
          />
          <div className="scene-overlay" />
        </div>

        <div className="dom-overlays">
          <div className="phase-a">
            {chapters.map((chap, i) => {
              const duration = chap.end - chap.start;
              const height = `${Math.max(duration * 60, 100)}vh`;
              return (
                <section className="chapter-panel" id={`chapter-${i}`} key={chap.id} style={{ height }}>
                  <div className="scene-copy">
                    <p className="scene-number">Ocean Rare / 0{i + 1}</p>
                    <h1>{chap.title}</h1>
                    <p className="scene-subtitle">{chap.subtitle}</p>
                  </div>
                  {i === 0 && (
                    <div className="scroll-indicator">
                      Scroll to explore
                      <div className="scroll-arrow">↓</div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <div className="phase-b shop-interlude" id="products">
            <div className="story-after-header">
              <h2>Find Your Catch</h2>
              <p>Premium cuts, sourced with care</p>
            </div>

            <div className="product-filters">
              {['all', 'fish', 'prawns', 'crabs', 'other'].map(filter => (
                <button 
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="phase-c">
            <section className="chapter-panel" id="chapter-5" style={{ height: `${7.6 * 60}vh` }}>
              <div className="scene-copy">
                <p className="scene-number">Ocean Rare / 06</p>
                <h1>{postShopChapter.title}</h1>
                <p className="scene-subtitle">{postShopChapter.subtitle}</p>
              </div>
            </section>
          </div>

          <section className="story-after">
            <div className="final-cta">
              <p className="final-cta-message">From the ocean. To your table.</p>
              <button className="cta-btn-primary">Shop Seafood</button>
              <button className="cta-btn-secondary">Explore Our Story</button>
            </div>
            <footer className="site-footer">
              © {new Date().getFullYear()} Ocean Rare. All rights reserved.
            </footer>
          </section>
        </div>
      </main>
    </>
  );
}
