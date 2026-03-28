/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

const STATUS_COLORS = {
  CONFIRMED: { bg: "#e8f8ef", color: "#27ae60" },
  PENDING:   { bg: "#fff3e0", color: "#f39c12" },
  SHIPPED:   { bg: "#e8f0fe", color: "#1a73e8" },
  DELIVERED: { bg: "#f3e8ff", color: "#7b1fa2" },
};

const STATUS_ICONS = {
  CONFIRMED: "✓",
  PENDING: "⏳",
  SHIPPED: "🚚",
  DELIVERED: "📦"
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/orders").then(res => {
      if (Array.isArray(res)) {
        setOrders(res);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Orders</h1>
        <span style={styles.count}>{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📦</div>
          <h2 style={styles.emptyTitle}>No orders yet</h2>
          <p style={styles.emptySub}>Your order history will appear here</p>
          <Link to="/dashboard" style={styles.shopBtn}>Start Shopping →</Link>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order, i) => (
            <div key={order.id} style={{
              ...styles.orderCard,
              animation: `fadeInUp 0.4s ease ${i * 0.08}s both`
            }}>
              {/* Order Header */}
              <div style={styles.orderHeader}>
                <div style={styles.orderLeft}>
                  <span style={styles.orderId}>Order #{order.id}</span>
                  <span style={styles.orderDate}>{formatDate(order.createdAt)}</span>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  background: STATUS_COLORS[order.status]?.bg || "#f5f5f5",
                  color: STATUS_COLORS[order.status]?.color || "#555",
                }}>
                  {STATUS_ICONS[order.status]} {order.status}
                </span>
              </div>

              {/* Order Info */}
              <div style={styles.orderInfo}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>PAYMENT</span>
                  <span style={styles.infoValue}>{order.paymentMethod}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>TOTAL</span>
                  <span style={{ ...styles.infoValue, fontWeight: "700", color: "#0a0a0a" }}>
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>ADDRESS</span>
                  <span style={styles.infoValue}>{order.address}</span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div style={styles.timeline}>
                {["Order Placed", "Processing", "Shipped", "Delivered"].map((step, idx) => {
                  const statusOrder = ["CONFIRMED", "CONFIRMED", "SHIPPED", "DELIVERED"];
                  const currentIdx = ["CONFIRMED", "CONFIRMED", "SHIPPED", "DELIVERED"]
                    .indexOf(order.status);
                  const isDone = idx <= currentIdx;
                  return (
                    <div key={step} style={styles.timelineStep}>
                      <div style={{
                        ...styles.timelineDot,
                        background: isDone ? "#27ae60" : "#e8e8e8",
                        color: isDone ? "white" : "#bbb",
                      }}>
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <span style={{
                        ...styles.timelineLabel,
                        color: isDone ? "#0a0a0a" : "#bbb",
                        fontWeight: isDone ? "600" : "400",
                      }}>
                        {step}
                      </span>
                      {idx < 3 && (
                        <div style={{
                          ...styles.timelineLine,
                          background: isDone && idx < currentIdx ? "#27ae60" : "#e8e8e8"
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={styles.orderFooter}>
                <Link to={`/order-confirmation/${order.id}`} style={styles.viewBtn}>
                  View Details →
                </Link>
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
  header: { display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px" },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "36px", fontWeight: "700", color: "#0a0a0a",
  },
  count: { color: "#888", fontSize: "16px" },
  loading: { textAlign: "center", padding: "60px", color: "#888", fontSize: "16px" },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "64px", marginBottom: "16px" },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px", marginBottom: "8px", color: "#0a0a0a",
  },
  emptySub: { color: "#888", marginBottom: "24px", fontSize: "15px" },
  shopBtn: {
    display: "inline-block", background: "#0a0a0a", color: "white",
    padding: "14px 28px", borderRadius: "8px",
    textDecoration: "none", fontWeight: "600",
  },
  ordersList: {
    display: "flex", flexDirection: "column",
    gap: "20px", maxWidth: "900px",
  },
  orderCard: {
    background: "white", borderRadius: "16px",
    padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  orderHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "20px",
  },
  orderLeft: { display: "flex", flexDirection: "column", gap: "4px" },
  orderId: { fontWeight: "700", fontSize: "16px", color: "#0a0a0a" },
  orderDate: { fontSize: "13px", color: "#888" },
  statusBadge: {
    padding: "6px 14px", borderRadius: "20px",
    fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px",
  },
  orderInfo: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px", marginBottom: "20px",
    background: "#f8f5f0", borderRadius: "10px", padding: "16px",
  },
  infoItem: { display: "flex", flexDirection: "column", gap: "4px" },
  infoLabel: { fontSize: "10px", color: "#888", letterSpacing: "1.5px", fontWeight: "700" },
  infoValue: { fontSize: "13px", color: "#555" },
  timeline: {
    display: "flex", alignItems: "center",
    marginBottom: "20px", flexWrap: "wrap", gap: "4px",
  },
  timelineStep: { display: "flex", alignItems: "center", gap: "6px" },
  timelineDot: {
    width: "28px", height: "28px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: "700", flexShrink: 0,
  },
  timelineLabel: { fontSize: "12px", whiteSpace: "nowrap" },
  timelineLine: { width: "32px", height: "2px", flexShrink: 0 },
  orderFooter: { display: "flex", justifyContent: "flex-end" },
  viewBtn: {
    color: "#c8a96e", textDecoration: "none",
    fontSize: "14px", fontWeight: "600",
  },
};
