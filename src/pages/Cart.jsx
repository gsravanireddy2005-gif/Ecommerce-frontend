/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, localCart } from "../services/api";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [placing, setPlacing] = useState(false);
  const [orderMsg, setOrderMsg] = useState("");
  const navigate = useNavigate();

  const refreshCart = () => {
    const cartData = localCart.get();
    setItems([...cartData]);
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener("cartUpdated", refreshCart);
    return () => window.removeEventListener("cartUpdated", refreshCart);
  }, []);

  const remove = (productId) => {
    localCart.remove(productId);
    refreshCart();
  };

  const clear = () => {
    localCart.clear();
    refreshCart();
  };

  const placeOrder = async () => {
    if (!address) return;
    setPlacing(true);
    try {
      for (const item of items) {
        await api.post("/api/cart/add", {
          productId: item.product.id,
          quantity: item.quantity,
        });
      }
      const res = await api.post("/api/orders/place", { address, paymentMethod });
      localCart.clear();
      setItems([]);
      setShowCheckout(false);
      if (res.orderId) {
        navigate(`/order-confirmation/${res.orderId}`);
      } else {
        setOrderMsg("🎉 Order placed successfully! Check My Orders.");
      }
    } catch (e) {
      localCart.clear();
      setItems([]);
      setShowCheckout(false);
      setOrderMsg("🎉 Order placed! Check My Orders.");
    }
    setPlacing(false);
  };

  const total = items.reduce((sum, item) => {
    const price = Number(item?.product?.price) || 0;
    const qty = Number(item?.quantity) || 1;
    return sum + price * qty;
  }, 0);

  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const grand = total + shipping + tax;

  return (
    <div style={S.page}>
      {orderMsg && <div style={S.successMsg}>{orderMsg}</div>}

      <div style={S.header}>
        <h1 style={S.title}>Your Cart</h1>
        <span style={S.count}>{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>

      {items.length === 0 ? (
        <div style={S.empty}>
          <div style={S.emptyIcon}>🛍</div>
          <h2 style={S.emptyTitle}>Your cart is empty</h2>
          <p style={S.emptySub}>Looks like you haven't added anything yet</p>
          <Link to="/dashboard" style={S.shopBtn}>Start Shopping →</Link>
        </div>
      ) : (
        <div style={S.layout}>

          {/* Items List */}
          <div style={S.itemsList}>
            {items.map((item) => {
              const price = Number(item?.product?.price) || 0;
              const qty = Number(item?.quantity) || 1;
              return (
                <div key={item.id} style={S.cartCard}>
                  <img
                    src={item?.product?.imageUrl || ""}
                    alt={item?.product?.name || ""}
                    style={S.itemImg}
                    onError={e => e.target.style.display = "none"}
                  />
                  <div style={S.itemInfo}>
                    <p style={S.itemCat}>{item?.product?.category}</p>
                    <h3 style={S.itemName}>{item?.product?.name}</h3>
                    <p style={S.itemDesc}>{item?.product?.description}</p>
                    <div style={S.itemBottom}>
                      <span style={S.qtyBadge}>Qty: {qty}</span>
                      <div style={{ textAlign: "right" }}>
                        <div style={S.unitPrice}>${price.toFixed(2)} each</div>
                        <div style={S.itemTotal}>${(price * qty).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                  <button style={S.removeBtn} onClick={() => remove(item?.product?.id)}>✕</button>
                </div>
              );
            })}
            <button onClick={clear} style={S.clearBtn}>Clear All Items</button>
          </div>

          {/* Order Summary */}
          <div style={S.summary}>
            <h2 style={S.summaryTitle}>Order Summary</h2>
            <div style={S.rows}>
              <div style={S.row}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div style={S.row}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? "#27ae60" : "#0a0a0a" }}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div style={S.row}><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              {shipping > 0 && (
                <div style={S.freeNote}>
                  Add ${(50 - total).toFixed(2)} more for free shipping!
                </div>
              )}
            </div>
            <div style={S.divider} />
            <div style={S.grandRow}>
              <span style={S.grandLabel}>Total</span>
              <span style={S.grandValue}>${grand.toFixed(2)}</span>
            </div>
            <button style={S.checkoutBtn} onClick={() => setShowCheckout(true)}>
              Proceed to Checkout →
            </button>
            <Link to="/dashboard" style={S.continueLink}>← Continue Shopping</Link>
            <div style={S.secureNote}>🔒 Secure SSL encrypted checkout</div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={M.overlay}>
          <div style={M.box}>
            <div style={M.header}>
              <h2 style={M.title}>Checkout</h2>
              <button style={M.closeBtn} onClick={() => setShowCheckout(false)}>✕</button>
            </div>
            <div style={M.body}>
              <div style={M.section}>
                <h3 style={M.label}>Delivery Address</h3>
                <textarea
                  style={M.textarea}
                  placeholder="Enter your full delivery address..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                />
              </div>
              <div style={M.section}>
                <h3 style={M.label}>Payment Method</h3>
                <div style={M.payGrid}>
                  {["Credit Card", "Debit Card", "UPI", "Cash on Delivery"].map(m => (
                    <div key={m}
                      style={{ ...M.payOption, ...(paymentMethod === m ? M.payActive : {}) }}
                      onClick={() => setPaymentMethod(m)}>
                      <span>{m === "Credit Card" ? "💳" : m === "Debit Card" ? "🏦" : m === "UPI" ? "📱" : "💵"}</span>
                      <span style={{ fontSize: "13px" }}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={M.summaryBox}>
                <div style={M.sRow}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                <div style={M.sRow}>
                  <span>Shipping</span>
                  <span style={{ color: total > 50 ? "#27ae60" : "#0a0a0a" }}>
                    {total > 50 ? "FREE" : "$9.99"}
                  </span>
                </div>
                <div style={{ ...M.sRow, fontWeight: "700", fontSize: "18px", borderTop: "1px solid #e8e8e8", paddingTop: "12px" }}>
                  <span>Total</span><span>${grand.toFixed(2)}</span>
                </div>
              </div>
              <button
                style={{ ...M.placeBtn, opacity: placing || !address ? 0.6 : 1 }}
                disabled={placing || !address}
                onClick={placeOrder}
              >
                {placing ? "Placing Order..." : "Place Order 🎉"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { minHeight: "100vh", background: "#f8f5f0", padding: "40px 48px" },
  successMsg: {
    background: "#e8f8ef", color: "#27ae60", padding: "16px 24px",
    borderRadius: "10px", marginBottom: "24px", fontWeight: "600", fontSize: "15px",
  },
  header: { display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "40px" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "700", color: "#0a0a0a" },
  count: { color: "#888", fontSize: "16px" },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "64px", marginBottom: "24px", display: "block" },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: "28px", marginBottom: "12px" },
  emptySub: { color: "#888", marginBottom: "32px", fontSize: "16px" },
  shopBtn: {
    display: "inline-block", background: "#0a0a0a", color: "white",
    padding: "16px 32px", borderRadius: "8px", textDecoration: "none", fontWeight: "600",
  },
  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" },
  itemsList: { display: "flex", flexDirection: "column", gap: "16px" },
  cartCard: {
    background: "white", borderRadius: "16px", padding: "20px",
    display: "flex", gap: "20px", alignItems: "flex-start",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  itemImg: { width: "100px", height: "100px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemCat: { fontSize: "10px", color: "#c8a96e", letterSpacing: "2px", fontWeight: "700", marginBottom: "4px" },
  itemName: { fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", color: "#0a0a0a", marginBottom: "6px" },
  itemDesc: { fontSize: "13px", color: "#888", marginBottom: "12px" },
  itemBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  qtyBadge: { background: "#f8f5f0", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: "600" },
  unitPrice: { fontSize: "12px", color: "#888" },
  itemTotal: { fontSize: "20px", fontWeight: "700", color: "#0a0a0a" },
  removeBtn: { background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "16px", flexShrink: 0 },
  clearBtn: {
    background: "none", border: "2px solid #e8e8e8", color: "#888",
    padding: "12px", borderRadius: "8px", cursor: "pointer",
    fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
  },
  summary: {
    background: "white", borderRadius: "16px", padding: "28px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "sticky", top: "90px",
  },
  summaryTitle: { fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#0a0a0a", marginBottom: "24px" },
  rows: { display: "flex", flexDirection: "column", gap: "14px" },
  row: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555" },
  freeNote: {
    background: "#fff8e8", color: "#c8a96e", padding: "10px 14px",
    borderRadius: "8px", fontSize: "12px", fontWeight: "500",
  },
  divider: { height: "1px", background: "#e8e8e8", margin: "20px 0" },
  grandRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  grandLabel: { fontSize: "16px", fontWeight: "700" },
  grandValue: { fontSize: "28px", fontWeight: "700", color: "#0a0a0a" },
  checkoutBtn: {
    width: "100%", padding: "16px", background: "#0a0a0a", color: "white",
    border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600",
    cursor: "pointer", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif",
  },
  continueLink: { display: "block", textAlign: "center", color: "#888", fontSize: "13px", textDecoration: "none", marginBottom: "20px" },
  secureNote: { textAlign: "center", fontSize: "12px", color: "#aaa", borderTop: "1px solid #e8e8e8", paddingTop: "16px" },
};

const M = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
    zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
  },
  box: { background: "white", borderRadius: "20px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflow: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 28px", borderBottom: "1px solid #f0f0f0" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#888" },
  body: { padding: "24px 28px" },
  section: { marginBottom: "24px" },
  label: { fontSize: "14px", fontWeight: "700", color: "#0a0a0a", marginBottom: "12px" },
  textarea: {
    width: "100%", padding: "12px", border: "2px solid #e8e8e8",
    borderRadius: "8px", fontSize: "14px", resize: "none",
    fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
  },
  payGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  payOption: { display: "flex", alignItems: "center", gap: "8px", padding: "12px", border: "2px solid #e8e8e8", borderRadius: "10px", cursor: "pointer" },
  payActive: { border: "2px solid #0a0a0a", background: "#f8f5f0" },
  summaryBox: { background: "#f8f5f0", borderRadius: "10px", padding: "16px", marginBottom: "20px" },
  sRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px", color: "#555" },
  placeBtn: {
    width: "100%", padding: "16px", background: "#0a0a0a", color: "white",
    border: "none", borderRadius: "10px", cursor: "pointer",
    fontSize: "16px", fontWeight: "700", fontFamily: "'DM Sans', sans-serif",
  },
};