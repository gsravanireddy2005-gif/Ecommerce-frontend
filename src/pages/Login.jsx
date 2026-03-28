import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  const res = await api.post("/api/auth/login", form);
  setLoading(false);
  if (res.error) {
    setError(res.error);
  } else {
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify({
      id: res.id,
      name: res.name,
      email: res.email
    }));
    navigate("/dashboard");
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.tagline}>◉ PUREKART</div>
          <h1 style={styles.heroText}>Simple.<br/>Clean.<br/>Premium.</h1>
          <p style={styles.heroSub}>Everything you need, nothing you don't. Shop with clarity.</p>
          <div style={styles.dots}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ ...styles.dot, opacity: i === 0 ? 1 : 0.3 }} />
            ))}
          </div>
        </div>
        <div style={styles.floatingCard1}>
          <span style={styles.floatEmoji}>👟</span>
          <div>
            <div style={styles.floatTitle}>Running Shoes</div>
            <div style={styles.floatPrice}>$59.99</div>
          </div>
        </div>
        <div style={styles.floatingCard2}>
          <span style={styles.floatEmoji}>⌚</span>
          <div>
            <div style={styles.floatTitle}>Smart Watch</div>
            <div style={styles.floatPrice}>$129.99</div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formBox}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSub}>Sign in to your account</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.switchLink}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex", minHeight: "100vh",
    animation: "fadeIn 0.5s ease",
  },
  leftPanel: {
    flex: 1, background: "#0a0a0a",
    display: "flex", flexDirection: "column",
    justifyContent: "center", padding: "60px",
    position: "relative", overflow: "hidden",
  },
  leftContent: { position: "relative", zIndex: 2 },
  tagline: {
    color: "#c8a96e", fontSize: "13px", letterSpacing: "4px",
    fontWeight: "600", marginBottom: "32px",
  },
  heroText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "64px", fontWeight: "900",
    color: "white", lineHeight: "1.1", marginBottom: "24px",
  },
  heroSub: {
    color: "#888", fontSize: "16px", lineHeight: "1.7",
    maxWidth: "300px", marginBottom: "40px",
  },
  dots: { display: "flex", gap: "8px" },
  dot: {
    width: "8px", height: "8px", borderRadius: "50%",
    background: "#c8a96e",
  },
  floatingCard1: {
    position: "absolute", bottom: "120px", right: "40px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)", border: "1px solid rgba(200,169,110,0.3)",
    borderRadius: "12px", padding: "16px 20px",
    display: "flex", alignItems: "center", gap: "12px",
    animation: "fadeInUp 0.8s ease 0.3s both",
  },
  floatingCard2: {
    position: "absolute", bottom: "40px", right: "100px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)", border: "1px solid rgba(200,169,110,0.3)",
    borderRadius: "12px", padding: "16px 20px",
    display: "flex", alignItems: "center", gap: "12px",
    animation: "fadeInUp 0.8s ease 0.5s both",
  },
  floatEmoji: { fontSize: "28px" },
  floatTitle: { color: "white", fontSize: "13px", fontWeight: "500" },
  floatPrice: { color: "#c8a96e", fontSize: "15px", fontWeight: "700" },
  rightPanel: {
    width: "480px", background: "#f8f5f0",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px",
  },
  formBox: { width: "100%", maxWidth: "380px" },
  formHeader: { marginBottom: "40px" },
  formTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "36px", fontWeight: "700",
    color: "#0a0a0a", marginBottom: "8px",
  },
  formSub: { color: "#888", fontSize: "15px" },
  errorBox: {
    background: "#fdf0f0", border: "1px solid #e74c3c",
    color: "#e74c3c", padding: "12px 16px",
    borderRadius: "8px", fontSize: "14px", marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#0a0a0a", letterSpacing: "0.5px" },
  input: {
    padding: "14px 16px", border: "2px solid #e8e8e8",
    borderRadius: "8px", fontSize: "15px",
    background: "white", outline: "none",
    transition: "border-color 0.2s ease",
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    padding: "16px", background: "#0a0a0a", color: "white",
    border: "none", borderRadius: "8px", fontSize: "15px",
    fontWeight: "600", cursor: "pointer", letterSpacing: "1px",
    transition: "all 0.2s ease", marginTop: "8px",
    fontFamily: "'DM Sans', sans-serif",
  },
  switchText: { textAlign: "center", marginTop: "24px", color: "#888", fontSize: "14px" },
  switchLink: { color: "#c8a96e", fontWeight: "600", textDecoration: "none" },
};