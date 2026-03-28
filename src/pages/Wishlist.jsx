/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { localWishlist, localCart } from "../services/api";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const refresh = () => setItems([...localWishlist.get()]);

  useEffect(() => {
    refresh();
    window.addEventListener("wishlistUpdated", refresh);
    return () => window.removeEventListener("wishlistUpdated", refresh);
  }, []);

  const remove = (productId) => {
    localWishlist.remove(productId);
    refresh();
    setToast("Removed from wishlist");
    setTimeout(() => setToast(""), 2000);
  };

  const moveToCart = (productId) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      localCart.add(item.product, 1);
      localWishlist.remove(productId);
      refresh();
      setToast("Moved to cart! 🛍️");
      setTimeout(() => setToast(""), 2000);
    }
  };

  return (
    <div style={styles.page}>
      {toast && <div style={styles.toast}>✓ {toast}</div>}

      <div style={styles.header}>
        <h1 style={styles.title}>My Wishlist</h1>
        <span style={styles.count}>{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>

      {items.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>♡</div>
          <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
          <p style={styles.emptySub}>Save items you love for later</p>
          <Link to="/dashboard" style={styles.shopBtn}>Start Shopping →</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((item, i) => (
            <div key={item.id} style={{
              ...styles.card,
              animation: `fadeInUp 0.4s ease ${i * 0.08}s both`
            }}>
              <div style={styles.imgWrapper}>
                <img
                  src={item.product?.imageUrl || ""}
                  alt={item.product?.name || ""}
                  style={styles.img}
                />
                <button
                  style={styles.removeBtn}
                  onClick={() => remove(item.product.id)}
                  title="Remove"
                >✕</button>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.category}>{item.product?.category}</p>
                <h3 style={styles.name}>{item.product?.name}</h3>
                <p style={styles.desc}>{item.product?.description}</p>
                <p style={styles.price}>${Number(item.product?.price || 0).toFixed(2)}</p>
                <div style={styles.actions}>
                  <button
                    style={styles.cartBtn}
                    onClick={() => moveToCart(item.product.id)}
                  >
                    🛍️ Move to Cart
                  </button>
                  <Link
                    to={`/product/${item.product.id}`}
                    style={styles.viewBtn}
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f5f0", padding: "40px 48px" },
  toast: {
    position: "fixed", top: "80px", right: "24px", zIndex: 9999,
    background: "#0a0a0a", color: "white", padding: "14px 24px",
    borderRadius: "8px", fontSize: "14px", borderLeft: "4px solid #c8a96e",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  header: { display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "700", color: "#0a0a0a" },
  count: { color: "#888", fontSize: "16px" },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "64px", color: "#ddd", marginBottom: "16px" },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: "28px", marginBottom: "8px" },
  emptySub: { color: "#888", marginBottom: "24px", fontSize: "15px" },
  shopBtn: {
    display: "inline-block", background: "#0a0a0a", color: "white",
    padding: "14px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "white", borderRadius: "16px", overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)", transition: "transform 0.3s ease",
  },
  imgWrapper: { position: "relative", height: "200px" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  removeBtn: {
    position: "absolute", top: "10px", right: "10px",
    background: "white", border: "none", borderRadius: "50%",
    width: "28px", height: "28px", cursor: "pointer",
    fontSize: "12px", display: "flex", alignItems: "center",
    justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    color: "#888",
  },
  cardBody: { padding: "16px" },
  category: { fontSize: "10px", color: "#c8a96e", letterSpacing: "2px", fontWeight: "700", marginBottom: "4px" },
  name: { fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: "700", marginBottom: "6px", color: "#0a0a0a" },
  desc: {
    fontSize: "12px", color: "#888", marginBottom: "12px", lineHeight: "1.4",
    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  price: { fontSize: "20px", fontWeight: "700", color: "#0a0a0a", marginBottom: "14px" },
  actions: { display: "flex", gap: "8px" },
  cartBtn: {
    flex: 1, padding: "10px", background: "#0a0a0a", color: "white",
    border: "none", borderRadius: "8px", cursor: "pointer",
    fontSize: "12px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif",
  },
  viewBtn: {
    padding: "10px 16px", background: "white", color: "#0a0a0a",
    border: "2px solid #e8e8e8", borderRadius: "8px",
    textDecoration: "none", textAlign: "center",
    fontSize: "12px", fontWeight: "600",
  },
};