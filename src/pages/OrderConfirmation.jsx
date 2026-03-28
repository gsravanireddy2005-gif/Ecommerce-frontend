import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/orders/${id}`).then(res => {
      if (res.error) navigate("/login");
      else setOrder(res);
    });
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  if (!order) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      {/* Success Header */}
      <div style={styles.successBanner}>
        <div style={styles.successIcon}>🎉</div>
        <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
        <p style={styles.successSub}>Thank you for shopping with PureKart. Your order is confirmed!</p>
        <div style={styles.orderIdBadge}>Order #{order.id}</div>
      </div>

      <div style={styles.content}>
        {/* Order Details Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Order Details</h2>
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Order ID</span>
              <span style={styles.detailValue}>#{order.id}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Order Date</span>
              <span style={styles.detailValue}>{formatDate(order.createdAt)}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Payment Method</span>
              <span style={styles.detailValue}>{order.paymentMethod}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Status</span>
              <span style={{ ...styles.detailValue, color: "#27ae60", fontWeight: "700" }}>✓ {order.status}</span>
            </div>
            <div style={{ ...styles.detailItem, gridColumn: "1 / -1" }}>
              <span style={styles.detailLabel}>Delivery Address</span>
              <span style={styles.detailValue}>{order.address}</span>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Delivery Timeline</h2>
          <div style={styles.timelineVertical}>
            {[
              { icon: "✓", title: "Order Confirmed", desc: "Your order has been received", done: true },
              { icon: "📦", title: "Processing", desc: "We're preparing your items", done: true },
              { icon: "🚚", title: "Shipped", desc: "Your order is on the way", done: false },
              { icon: "🏠", title: "Delivered", desc: "Package delivered to your address", done: false },
            ].map((step, i) => (
              <div key={i} style={styles.timelineItem}>
                <div style={{ ...styles.timelineIconBox, background: step.done ? "#27ae60" : "#e8e8e8" }}>
                  <span style={{ fontSize: "14px" }}>{step.done ? "✓" : step.icon}</span>
                </div>
                <div style={styles.timelineContent}>
                  <div style={{ ...styles.timelineTitle, color: step.done ? "#0a0a0a" : "#bbb" }}>{step.title}</div>
                  <div style={styles.timelineDesc}>{step.desc}</div>
                </div>
                {i < 3 && <div style={{ ...styles.timelineConnector, background: step.done ? "#27ae60" : "#e8e8e8" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Price Summary</h2>
          <div style={styles.priceRows}>
            <div style={styles.priceRow}>
              <span style={styles.priceLabel}>Subtotal</span>
              <span style={styles.priceValue}>${order.totalAmount?.toFixed(2)}</span>
            </div>
            <div style={styles.priceRow}>
              <span style={styles.priceLabel}>Shipping</span>
              <span style={{ ...styles.priceValue, color: "#27ae60" }}>
                {order.totalAmount > 50 ? "FREE" : "$9.99"}
              </span>
            </div>
            <div style={styles.priceRow}>
              <span style={styles.priceLabel}>Tax (8%)</span>
              <span style={styles.priceValue}>${(order.totalAmount * 0.08).toFixed(2)}</span>
            </div>
            <div style={{ ...styles.priceRow, ...styles.priceTotal }}>
              <span>Total Paid</span>
              <span>${(order.totalAmount + (order.totalAmount > 50 ? 0 : 9.99) + order.totalAmount * 0.08).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <Link to="/orders" style={styles.ordersBtn}>View All Orders</Link>
          <Link to="/dashboard" style={styles.shopBtn}>Continue Shopping →</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f5f0" },
  loading: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" },
  successBanner: {
    background: "linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 100%)",
    padding: "60px 48px", textAlign: "center",
  },
  successIcon: { fontSize: "56px", marginBottom: "16px" },
  successTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "40px", color: "white", fontWeight: "900", marginBottom: "12px",
  },
  successSub: { color: "#888", fontSize: "16px", marginBottom: "24px" },
  orderIdBadge: {
    display: "inline-block",
    background: "#c8a96e", color: "#0a0a0a",
    padding: "8px 24px", borderRadius: "20px",
    fontWeight: "700", fontSize: "15px",
  },
  content: { padding: "40px 48px", maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" },
  card: {
    background: "white", borderRadius: "16px", padding: "28px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "20px", fontWeight: "700", color: "#0a0a0a", marginBottom: "20px",
  },
  detailsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  detailItem: { display: "flex", flexDirection: "column", gap: "4px" },
  detailLabel: { fontSize: "11px", color: "#888", letterSpacing: "1px", fontWeight: "600" },
  detailValue: { fontSize: "14px", color: "#333" },
  timelineVertical: { position: "relative", display: "flex", flexDirection: "column", gap: "0" },
  timelineItem: { display: "flex", alignItems: "flex-start", gap: "16px", position: "relative", paddingBottom: "24px" },
  timelineIconBox: {
    width: "36px", height: "36px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, color: "white",
  },
  timelineContent: { flex: 1, paddingTop: "4px" },
  timelineTitle: { fontSize: "14px", fontWeight: "700", marginBottom: "2px" },
  timelineDesc: { fontSize: "13px", color: "#888" },
  timelineConnector: {
    position: "absolute", left: "17px", top: "40px",
    width: "2px", height: "calc(100% - 16px)",
  },
  priceRows: { display: "flex", flexDirection: "column", gap: "12px" },
  priceRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555" },
  priceLabel: {},
  priceValue: { fontWeight: "500" },
  priceTotal: {
    fontWeight: "700", fontSize: "18px", color: "#0a0a0a",
    borderTop: "2px solid #e8e8e8", paddingTop: "12px", marginTop: "4px",
  },
  actions: { display: "flex", gap: "16px" },
  ordersBtn: {
    flex: 1, padding: "14px", background: "white", color: "#0a0a0a",
    border: "2px solid #0a0a0a", borderRadius: "10px",
    textDecoration: "none", textAlign: "center", fontWeight: "600", fontSize: "14px",
  },
  shopBtn: {
    flex: 1, padding: "14px", background: "#0a0a0a", color: "white",
    border: "none", borderRadius: "10px",
    textDecoration: "none", textAlign: "center", fontWeight: "600", fontSize: "14px",
  },
};