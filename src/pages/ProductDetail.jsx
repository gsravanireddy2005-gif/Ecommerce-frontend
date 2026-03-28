/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, localCart } from "../services/api";

const CATEGORY_ICONS = {
  Electronics: "⚡", Footwear: "👟", Clothing: "👕",
  Accessories: "💎", Bags: "👜", Sports: "🏋️",
  Kitchen: "☕", Home: "🏠"
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [toast, setToast] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/products/${id}`).then(data => {
      setProduct(data);
      api.get("/api/products").then(all => {
        setRelated(all.filter(p => p.category === data.category && p.id !== data.id).slice(0, 4));
      });
    });
    window.scrollTo(0, 0);
  }, [id]);

  const addToCart = async () => {
  localCart.add(product, qty);
  setToast(`${qty} item${qty > 1 ? "s" : ""} added to cart!`);
  setTimeout(() => setToast(""), 2500);
};

const buyNow = () => {
  localCart.add(product, qty);
  navigate("/cart");
};

  if (!product) return (
    <div style={styles.loadingPage}>
      <p style={styles.loadingText}>Loading product...</p>
    </div>
  );

  const stars = 4.5;
  const reviewCount = Math.floor(product.id * 37 + 120);

  return (
    <div style={styles.page}>
      {toast && <div style={styles.toast}>✓ {toast}</div>}

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span style={styles.breadLink} onClick={() => navigate("/dashboard")}>Home</span>
        <span style={styles.breadSep}> / </span>
        <span style={styles.breadLink} onClick={() => navigate("/dashboard")}>{product.category}</span>
        <span style={styles.breadSep}> / </span>
        <span style={styles.breadCurrent}>{product.name}</span>
      </div>

      {/* Main Section */}
      <div style={styles.mainSection}>
        {/* Images */}
        <div style={styles.imageSection}>
          <div style={styles.mainImgWrapper}>
            <img src={product.imageUrl} alt={product.name} style={styles.mainImg} />
            <span style={styles.categoryBadge}>
              {CATEGORY_ICONS[product.category]} {product.category}
            </span>
            {product.stock < 10 && (
              <span style={styles.urgencyBadge}>⚡ Only {product.stock} left!</span>
            )}
          </div>
          <div style={styles.thumbRow}>
            {[0, 1, 2, 3].map(i => (
              <div key={i}
                style={{ ...styles.thumb, border: activeImg === i ? "2px solid #0a0a0a" : "2px solid #e8e8e8" }}
                onClick={() => setActiveImg(i)}>
                <img src={product.imageUrl} alt="" style={styles.thumbImg} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={styles.infoSection}>
          <div style={styles.categoryTag}>
            {CATEGORY_ICONS[product.category]} {product.category}
          </div>
          <h1 style={styles.productName}>{product.name}</h1>

          {/* Rating */}
          <div style={styles.ratingRow}>
            <div style={styles.stars}>
              {"★★★★★".split("").map((s, i) => (
                <span key={i} style={{ color: i < Math.floor(stars) ? "#f39c12" : "#ddd" }}>{s}</span>
              ))}
            </div>
            <span style={styles.ratingNum}>{stars}</span>
            <span style={styles.reviewCount}>({reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div style={styles.priceSection}>
            <span style={styles.price}>${product.price.toFixed(2)}</span>
            <span style={styles.originalPrice}>${(product.price * 1.2).toFixed(2)}</span>
            <span style={styles.discount}>20% OFF</span>
          </div>

          <p style={styles.description}>{product.description}</p>

          {/* Features */}
          <div style={styles.features}>
            {["✓ Premium quality guaranteed", "✓ Free returns within 30 days",
              "✓ Authentic product", "✓ Fast delivery 2-3 days"].map((f, i) => (
              <div key={i} style={styles.feature}>{f}</div>
            ))}
          </div>

          <div style={styles.divider} />

          {/* Stock */}
          <div style={styles.stockRow}>
            <div style={{
              ...styles.stockBadge,
              background: product.stock > 10 ? "#e8f8ef" : "#fff3e0",
              color: product.stock > 10 ? "#27ae60" : "#f39c12"
            }}>
              {product.stock > 10 ? `✓ In Stock (${product.stock} available)` : `⚡ Only ${product.stock} left!`}
            </div>
          </div>

          {/* Quantity */}
          <div style={styles.qtyRow}>
            <span style={styles.qtyLabel}>Quantity:</span>
            <div style={styles.qtyControls}>
              <button style={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span style={styles.qtyNum}>{qty}</span>
              <button style={styles.qtyBtn} onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionBtns}>
            <button onClick={addToCart} style={styles.addCartBtn}>🛍️ Add to Cart</button>
            <button onClick={buyNow} style={styles.buyNowBtn}>Buy Now →</button>
          </div>

          {/* Delivery Info */}
          <div style={styles.deliveryInfo}>
            {[
              { icon: "🚚", title: "Free Delivery", text: "On orders above $50" },
              { icon: "↩️", title: "Easy Returns", text: "30-day return policy" },
              { icon: "🔒", title: "Secure Payment", text: "SSL encrypted checkout" },
            ].map((item, i) => (
              <div key={i} style={styles.deliveryItem}>
                <span style={styles.deliveryIcon}>{item.icon}</span>
                <div>
                  <div style={styles.deliveryTitle}>{item.title}</div>
                  <div style={styles.deliveryText}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={styles.relatedSection}>
          <h2 style={styles.relatedTitle}>More from {product.category}</h2>
          <div style={styles.relatedGrid}>
            {related.map(p => (
              <div key={p.id} style={styles.relatedCard}
                onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}>
                <img src={p.imageUrl} alt={p.name} style={styles.relatedImg} />
                <div style={styles.relatedInfo}>
                  <p style={styles.relatedName}>{p.name}</p>
                  <p style={styles.relatedPrice}>${p.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f5f0" },
  loadingPage: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
  loadingText: { color: "#888", fontSize: "16px" },
  toast: {
    position: "fixed", top: "80px", right: "24px", zIndex: 9999,
    background: "#0a0a0a", color: "white", padding: "14px 24px",
    borderRadius: "8px", fontSize: "14px", borderLeft: "4px solid #c8a96e",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  breadcrumb: {
    padding: "16px 48px", background: "white",
    borderBottom: "1px solid #f0f0f0", fontSize: "13px",
  },
  breadLink: { color: "#c8a96e", cursor: "pointer", fontWeight: "500" },
  breadSep: { color: "#ccc", margin: "0 8px" },
  breadCurrent: { color: "#888" },
  mainSection: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "48px", padding: "40px 48px",
    maxWidth: "1200px", margin: "0 auto",
  },
  imageSection: {},
  mainImgWrapper: {
    position: "relative", borderRadius: "20px",
    overflow: "hidden", height: "420px", background: "white",
    boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
  },
  mainImg: { width: "100%", height: "100%", objectFit: "cover" },
  categoryBadge: {
    position: "absolute", top: "16px", left: "16px",
    background: "rgba(10,10,10,0.8)", color: "#c8a96e",
    padding: "6px 14px", borderRadius: "6px",
    fontSize: "12px", fontWeight: "700", letterSpacing: "1px",
  },
  urgencyBadge: {
    position: "absolute", top: "16px", right: "16px",
    background: "#e74c3c", color: "white",
    padding: "6px 12px", borderRadius: "6px",
    fontSize: "12px", fontWeight: "700",
  },
  thumbRow: { display: "flex", gap: "10px", marginTop: "12px" },
  thumb: { width: "70px", height: "70px", borderRadius: "10px", overflow: "hidden", cursor: "pointer" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  infoSection: {},
  categoryTag: { color: "#c8a96e", fontSize: "12px", letterSpacing: "2px", fontWeight: "700", marginBottom: "12px" },
  productName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "32px", fontWeight: "900",
    color: "#0a0a0a", marginBottom: "16px", lineHeight: "1.2",
  },
  ratingRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" },
  stars: { fontSize: "18px", letterSpacing: "2px" },
  ratingNum: { fontSize: "15px", fontWeight: "700", color: "#0a0a0a" },
  reviewCount: { fontSize: "13px", color: "#888" },
  priceSection: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  price: { fontSize: "36px", fontWeight: "900", color: "#0a0a0a" },
  originalPrice: { fontSize: "18px", color: "#bbb", textDecoration: "line-through" },
  discount: {
    background: "#e8f8ef", color: "#27ae60",
    padding: "4px 10px", borderRadius: "6px",
    fontSize: "13px", fontWeight: "700",
  },
  description: { color: "#555", fontSize: "15px", lineHeight: "1.8", marginBottom: "20px" },
  features: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" },
  feature: { fontSize: "13px", color: "#555", fontWeight: "500" },
  divider: { height: "1px", background: "#e8e8e8", margin: "20px 0" },
  stockRow: { marginBottom: "20px" },
  stockBadge: {
    display: "inline-block", padding: "8px 16px",
    borderRadius: "8px", fontSize: "13px", fontWeight: "600",
  },
  qtyRow: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  qtyLabel: { fontSize: "14px", fontWeight: "600", color: "#0a0a0a" },
  qtyControls: {
    display: "flex", alignItems: "center",
    border: "2px solid #e8e8e8", borderRadius: "10px", overflow: "hidden",
  },
  qtyBtn: {
    background: "#f8f5f0", border: "none", width: "40px", height: "40px",
    cursor: "pointer", fontSize: "18px", fontWeight: "500",
  },
  qtyNum: { width: "50px", textAlign: "center", fontSize: "16px", fontWeight: "700" },
  actionBtns: { display: "flex", gap: "12px", marginBottom: "28px" },
  addCartBtn: {
    flex: 1, padding: "16px", background: "white", color: "#0a0a0a",
    border: "2px solid #0a0a0a", borderRadius: "10px",
    cursor: "pointer", fontSize: "15px", fontWeight: "700",
    fontFamily: "'DM Sans', sans-serif",
  },
  buyNowBtn: {
    flex: 1, padding: "16px", background: "#0a0a0a", color: "white",
    border: "2px solid #0a0a0a", borderRadius: "10px",
    cursor: "pointer", fontSize: "15px", fontWeight: "700",
    fontFamily: "'DM Sans', sans-serif",
  },
  deliveryInfo: {
    display: "flex", flexDirection: "column", gap: "12px",
    background: "white", borderRadius: "12px", padding: "20px",
    border: "1px solid #f0f0f0",
  },
  deliveryItem: { display: "flex", alignItems: "center", gap: "12px" },
  deliveryIcon: { fontSize: "20px" },
  deliveryTitle: { fontSize: "13px", fontWeight: "700", color: "#0a0a0a" },
  deliveryText: { fontSize: "12px", color: "#888" },
  relatedSection: { padding: "40px 48px", borderTop: "1px solid #e8e8e8" },
  relatedTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "24px", fontWeight: "700", marginBottom: "24px", color: "#0a0a0a",
  },
  relatedGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px",
  },
  relatedCard: {
    background: "white", borderRadius: "12px", overflow: "hidden",
    cursor: "pointer", transition: "all 0.2s",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  relatedImg: { width: "100%", height: "150px", objectFit: "cover" },
  relatedInfo: { padding: "12px" },
  relatedName: { fontSize: "13px", fontWeight: "600", color: "#0a0a0a", marginBottom: "4px" },
  relatedPrice: { fontSize: "15px", fontWeight: "700", color: "#c8a96e" },
};