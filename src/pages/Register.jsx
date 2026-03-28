import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await api.post("/api/auth/register", form);
    setLoading(false);
    if (res.error) setError(res.error);
    else navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.tagline}>◉ PUREKART</div>
          <h1 style={styles.heroText}>Join the<br/>Pure<br/>Experience.</h1>
          <p style={styles.heroSub}>Create your account and shop thousands of clean, premium products.</p>
          <div style={styles.perks}>
            {["Free shipping on orders over $50", "Exclusive member deals", "Easy 30-day returns"].map((p, i) => (
              <div key={i} style={styles.perk}>
                <span style={styles.perkIcon}>✦</span>
                <span style={styles.perkText}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formBox}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create account</h2>
            <p style={styles.formSub}>Start your luxury journey today</p>
          </div>

          {error && (
            <div style={styles.errorBox}>⚠ {error}</div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} type="text" placeholder="John Doe"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input style={styles.input} type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="Min. 8 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit"
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", animation: "fadeIn 0.5s ease" },
  leftPanel: {
    flex: 1, background: "#0a0a0a",
    display: "flex", flexDirection: "column",
    justifyContent: "center", padding: "60px",
    position: "relative", overflow: "hidden",
  },
  leftContent: { position: "relative", zIndex: 2 },
  tagline: { color: "#c8a96e", fontSize: "13px", letterSpacing: "4px", fontWeight: "600", marginBottom: "32px" },
  heroText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "60px", fontWeight: "900",
    color: "white", lineHeight: "1.1", marginBottom: "24px",
  },
  heroSub: { color: "#888", fontSize: "16px", lineHeight: "1.7", maxWidth: "300px", marginBottom: "40px" },
  perks: { display: "flex", flexDirection: "column", gap: "16px" },
  perk: { display: "flex", alignItems: "center", gap: "12px" },
  perkIcon: { color: "#c8a96e", fontSize: "12px" },
  perkText: { color: "#aaa", fontSize: "14px" },
  rightPanel: {
    width: "480px", background: "#f8f5f0",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px",
  },
  formBox: { width: "100%", maxWidth: "380px" },
  formHeader: { marginBottom: "40px" },
  formTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "36px", fontWeight: "700", color: "#0a0a0a", marginBottom: "8px",
  },
  formSub: { color: "#888", fontSize: "15px" },
  errorBox: {
    background: "#fdf0f0", border: "1px solid #e74c3c",
    color: "#e74c3c", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#0a0a0a", letterSpacing: "0.5px" },
  input: {
    padding: "14px 16px", border: "2px solid #e8e8e8",
    borderRadius: "8px", fontSize: "15px", background: "white",
    outline: "none", fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    padding: "16px", background: "#0a0a0a", color: "white",
    border: "none", borderRadius: "8px", fontSize: "15px",
    fontWeight: "600", cursor: "pointer", letterSpacing: "1px",
    marginTop: "8px", fontFamily: "'DM Sans', sans-serif",
  },
  switchText: { textAlign: "center", marginTop: "24px", color: "#888", fontSize: "14px" },
  switchLink: { color: "#c8a96e", fontWeight: "600", textDecoration: "none" },
};