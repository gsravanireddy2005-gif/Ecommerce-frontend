/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, localCart, localWishlist } from "../services/api";

const CATEGORY_ICONS = {
  Electronics: "⚡", Footwear: "👟", Clothing: "👕",
  Accessories: "💎", Bags: "👜", Sports: "🏋️",
  Kitchen: "☕", Home: "🏠", All: "🛍️"
};

const CATEGORY_COLORS = {
  Electronics: "#1a1a2e", Footwear: "#16213e", Clothing: "#0f3460",
  Accessories: "#533483", Bags: "#2b4162", Sports: "#1b4332",
  Kitchen: "#7b2d00", Home: "#3d2b1f"
};

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [toast, setToast] = useState("");
  const [view, setView] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/products").then(data => {
      if (Array.isArray(data)) {
        setProducts(data);
        setFiltered(data);
      }
    });
  }, []);

  useEffect(() => {
    let result = [...products];
    if (category !== "All") {
      result = result.filter(p => p.category === category);
    }
    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, category, products]);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const addToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    localCart.add({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      stock: product.stock,
    }, 1);
    setToast(`${product.name} added to cart! 🛍️`);
    setTimeout(() => setToast(""), 2500);
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setView("products");
    setSearch("");
  };

  const getCategoryCount = (cat) => products.filter(p => p.category === cat).length;

  return (
    <div style={S.page}>
      {toast && <div style={S.toast}>{toast}</div>}

      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroLeft}>
          <p style={S.heroTag}>◉ PUREKART — FREE DELIVERY OVER $50</p>
          <h1 style={S.heroTitle}>Simple. Clean.<br />Premium.</h1>
          <p style={S.heroSub}>Everything you need, nothing you don't</p>
          <div style={S.searchBar}>
            <span>🔍</span>
            <input
              style={S.searchInput}
              placeholder="Search products, categories..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (e.target.value) setView("products");
              }}
            />
            {search && (
              <button style={S.clearSearch} onClick={() => { setSearch(""); setView("home"); }}>✕</button>
            )}
          </div>
        </div>
        <div style={S.heroStats}>
          {[["30+", "Products"], ["8", "Categories"], ["4.8★", "Rating"], ["Free", "Returns"]].map(([num, label]) => (
            <div key={label} style={S.stat}>
              <div style={S.statNum}>{num}</div>
              <div style={S.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Home View */}
      {view === "home" && !search && (
        <>
          {/* Categories */}
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <h2 style={S.sectionTitle}>Shop by Category</h2>
              <button style={S.viewAllBtn} onClick={() => handleCategoryClick("All")}>View All →</button>
            </div>
            <div style={S.catGrid}>
              {categories.filter(c => c !== "All").map(cat => (
                <div key={cat}
                  style={{ ...S.catCard, background: CATEGORY_COLORS[cat] || "#1a1a2e" }}
                  onClick={() => handleCategoryClick(cat)}>
                  <span style={S.catIcon}>{CATEGORY_ICONS[cat] || "🛍️"}</span>
                  <div style={S.catName}>{cat}</div>
                  <div style={S.catCount}>{getCategoryCount(cat)} items</div>
                  <div style={S.catArrow}>→</div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <h2 style={S.sectionTitle}>Featured Products</h2>
              <button style={S.viewAllBtn} onClick={() => { setCategory("All"); setView("products"); }}>
                View All →
              </button>
            </div>
            <div style={S.grid}>
              {products.slice(0, 8).map((p, i) => (
                <ProductCard key={p.id} p={p} i={i} addToCart={addToCart} navigate={navigate} />
              ))}
            </div>
          </div>

          {/* Banner */}
          <div style={S.banner}>
            <p style={S.bannerTag}>LIMITED TIME OFFER</p>
            <h2 style={S.bannerTitle}>Free Shipping on Orders Over $50</h2>
            <p style={S.bannerSub}>Use code PURE50 at checkout</p>
            <button style={S.bannerBtn} onClick={() => setView("products")}>Shop Now →</button>
          </div>
        </>
      )}

      {/* Products View */}
      {(view === "products" || search) && (
        <div style={S.section}>
          <div style={S.filterBar}>
            <h2 style={S.filterTitle}>
              {category === "All" ? "All Products" : category}
              <span style={S.filterCount}> ({filtered.length})</span>
            </h2>
            <div style={S.catTabs}>
              {categories.map(cat => (
                <button key={cat}
                  style={{ ...S.catTab, ...(category === cat ? S.catTabActive : {}) }}
                  onClick={() => setCategory(cat)}>
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>
          </div>
          <button style={S.backBtn} onClick={() => { setView("home"); setCategory("All"); setSearch(""); }}>
            ← Back to Home
          </button>
          {filtered.length === 0 ? (
            <div style={S.empty}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px" }}>No products found</h3>
              <button style={S.resetBtn} onClick={() => { setSearch(""); setCategory("All"); }}>Reset filters</button>
            </div>
          ) : (
            <div style={S.grid}>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} i={i} addToCart={addToCart} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

  function ProductCard({ p, i, addToCart, navigate }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(localWishlist.has(p.id));
  }, [p.id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      localWishlist.remove(p.id);
      setWishlisted(false);
    } else {
      localWishlist.add(p);
      setWishlisted(true);
    }
  };

  return (
    <div
      style={{
        ...C.card,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.07)",
        animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/product/${p.id}`)}
    >
      <div style={C.imgWrapper}>
        <img src={p.imageUrl} alt={p.name} style={C.img} />
        <span style={C.badge}>{p.category}</span>
        {p.stock < 10 && <span style={C.lowStock}>Only {p.stock} left!</span>}
        <button
          style={{
            ...C.wishlistBtn,
            background: wishlisted ? "#e74c3c" : "white",
            color: wishlisted ? "white" : "#888",
          }}
          onClick={toggleWishlist}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
        <div style={{ ...C.overlay, opacity: hovered ? 1 : 0 }}>
          <span style={C.quickView}>View Details</span>
        </div>
      </div>
      <div style={C.body}>
        <p style={C.cat}>{p.category}</p>
        <h3 style={C.name}>{p.name}</h3>
        <p style={C.desc}>{p.description}</p>
        <div style={C.footer}>
          <span style={C.price}>${Number(p.price).toFixed(2)}</span>
          <button style={C.addBtn} onClick={(e) => addToCart(e, p)}>+ Cart</button>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: "100vh", background: "#f8f5f0" },
  toast: {
    position: "fixed", top: "80px", right: "24px", zIndex: 9999,
    background: "#0a0a0a", color: "white", padding: "14px 24px",
    borderRadius: "8px", fontSize: "14px", borderLeft: "4px solid #c8a96e",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)", animation: "slideInRight 0.3s ease",
  },
  hero: {
    background: "linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 100%)",
    padding: "50px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "40px",
  },
  heroLeft: { flex: 1, maxWidth: "600px" },
  heroTag: { color: "#c8a96e", fontSize: "12px", letterSpacing: "3px", fontWeight: "600", marginBottom: "16px" },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "48px", color: "white", fontWeight: "900", marginBottom: "12px", lineHeight: "1.1",
  },
  heroSub: { color: "#888", fontSize: "15px", marginBottom: "28px" },
  searchBar: {
    display: "flex", alignItems: "center", background: "white",
    borderRadius: "10px", padding: "0 16px", gap: "10px", height: "52px",
  },
  searchInput: {
    flex: 1, border: "none", outline: "none",
    fontSize: "15px", fontFamily: "'DM Sans', sans-serif", background: "transparent",
  },
  clearSearch: { background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: "16px" },
  heroStats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  stat: {
    background: "rgba(255,255,255,0.05)", borderRadius: "12px",
    padding: "16px 20px", textAlign: "center", border: "1px solid rgba(200,169,110,0.2)",
  },
  statNum: { fontSize: "24px", fontWeight: "700", color: "#c8a96e" },
  statLabel: { fontSize: "12px", color: "#888", marginTop: "4px" },
  section: { padding: "40px 48px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", color: "#0a0a0a" },
  viewAllBtn: { background: "none", border: "none", color: "#c8a96e", cursor: "pointer", fontWeight: "600", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" },
  catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" },
  catCard: {
    borderRadius: "16px", padding: "24px 20px", cursor: "pointer",
    transition: "all 0.3s ease", position: "relative", overflow: "hidden",
    minHeight: "140px", display: "flex", flexDirection: "column", justifyContent: "space-between",
  },
  catIcon: { fontSize: "32px", marginBottom: "8px", display: "block" },
  catName: { color: "white", fontSize: "15px", fontWeight: "700", marginBottom: "4px" },
  catCount: { color: "rgba(255,255,255,0.6)", fontSize: "12px" },
  catArrow: { position: "absolute", bottom: "16px", right: "16px", color: "rgba(255,255,255,0.4)", fontSize: "18px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" },
  banner: {
    background: "linear-gradient(135deg, #c8a96e 0%, #a8893e 100%)",
    padding: "50px 48px", margin: "0 0 40px",
  },
  bannerTag: { fontSize: "12px", letterSpacing: "3px", color: "rgba(255,255,255,0.8)", marginBottom: "12px", fontWeight: "600" },
  bannerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "white", fontWeight: "900", marginBottom: "8px" },
  bannerSub: { color: "rgba(255,255,255,0.8)", fontSize: "15px", marginBottom: "24px" },
  bannerBtn: {
    background: "white", color: "#0a0a0a", border: "none", padding: "14px 32px",
    borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
  },
  filterBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "16px" },
  filterTitle: { fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", color: "#0a0a0a" },
  filterCount: { color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: "20px" },
  catTabs: { display: "flex", gap: "8px", flexWrap: "wrap" },
  catTab: {
    padding: "8px 16px", border: "2px solid #e8e8e8", borderRadius: "50px",
    background: "white", cursor: "pointer", fontSize: "13px", fontWeight: "500",
    transition: "all 0.2s", color: "#666", fontFamily: "'DM Sans', sans-serif",
  },
  catTabActive: { background: "#0a0a0a", color: "white", border: "2px solid #0a0a0a" },
  backBtn: {
    background: "none", border: "none", color: "#888",
    cursor: "pointer", fontSize: "14px", marginBottom: "20px",
    fontFamily: "'DM Sans', sans-serif", padding: 0,
  },
  empty: { textAlign: "center", padding: "80px 20px" },
  resetBtn: {
    background: "#0a0a0a", color: "white", border: "none",
    padding: "12px 24px", borderRadius: "8px", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", marginTop: "16px",
  },
};

const C = {
  card: {
    background: "white", borderRadius: "16px", overflow: "hidden",
    cursor: "pointer", transition: "all 0.3s ease",
  },
  imgWrapper: { position: "relative", height: "210px", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" },
  badge: {
    position: "absolute", top: "10px", left: "10px",
    background: "rgba(10,10,10,0.75)", color: "#c8a96e",
    padding: "3px 10px", borderRadius: "4px",
    fontSize: "10px", letterSpacing: "1px", fontWeight: "700",
  },
  lowStock: {
    position: "absolute", top: "44px", right: "10px",
    background: "#e74c3c", color: "white",
    padding: "3px 8px", borderRadius: "4px",
    fontSize: "10px", fontWeight: "700",
  },
  wishlistBtn: {
    position: "absolute", top: "10px", right: "10px",
    width: "32px", height: "32px", borderRadius: "50%",
    border: "none", cursor: "pointer", fontSize: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transition: "all 0.2s ease", zIndex: 2,
  },
  overlay: {
    position: "absolute", inset: 0,
    background: "rgba(10,10,10,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "opacity 0.3s",
  },
  quickView: {
    color: "white", fontSize: "13px", fontWeight: "700",
    letterSpacing: "2px", border: "2px solid white",
    padding: "8px 20px", borderRadius: "4px",
  },
  body: { padding: "16px" },
  cat: { fontSize: "10px", color: "#c8a96e", letterSpacing: "2px", fontWeight: "700", marginBottom: "4px" },
  name: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "16px", fontWeight: "700", color: "#0a0a0a", marginBottom: "6px",
  },
  desc: {
    fontSize: "12px", color: "#888", marginBottom: "14px", lineHeight: "1.5",
    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: "20px", fontWeight: "700", color: "#0a0a0a" },
  addBtn: {
    background: "#0a0a0a", color: "white", border: "none",
    padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
    fontSize: "12px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif",
  },
};