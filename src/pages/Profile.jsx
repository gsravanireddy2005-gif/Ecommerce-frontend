import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, getLocalUser } from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [passMsg, setPassMsg] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
  const localUser = getLocalUser();
  if (localUser) {
    setProfile({ name: localUser.name, email: localUser.email });
  }
  // Also fetch fresh from backend
  api.get("/api/user/profile").then(res => {
    if (res.name) setProfile({ name: res.name, email: res.email });
  });
}, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    const res = await api.post === undefined
      ? await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          credentials: "include", body: JSON.stringify(profile),
        }).then(r => r.json())
      : await api.put("/api/user/profile", profile);

    if (res.error) setProfileMsg({ text: res.error, type: "error" });
    else setProfileMsg({ text: "Profile updated successfully!", type: "success" });
    setTimeout(() => setProfileMsg({ text: "", type: "" }), 3000);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassMsg({ text: "New passwords don't match", type: "error" });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPassMsg({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/change-password`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
    }).then(r => r.json());

    if (res.error) setPassMsg({ text: res.error, type: "error" });
    else {
      setPassMsg({ text: "Password changed successfully!", type: "success" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    setTimeout(() => setPassMsg({ text: "", type: "" }), 3000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.avatarBox}>
            <div style={styles.bigAvatar}>{profile.name.charAt(0).toUpperCase() || "U"}</div>
            <div style={styles.avatarName}>{profile.name}</div>
            <div style={styles.avatarEmail}>{profile.email}</div>
          </div>
          <div style={styles.sideMenu}>
            {[
              { id: "profile", icon: "👤", label: "Edit Profile" },
              { id: "password", icon: "🔒", label: "Change Password" },
            ].map(item => (
              <button key={item.id}
                style={{ ...styles.sideItem, ...(activeTab === item.id ? styles.sideItemActive : {}) }}
                onClick={() => setActiveTab(item.id)}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <button style={styles.sideItem} onClick={() => navigate("/orders")}>
              <span>📦</span><span>My Orders</span>
            </button>
            <button style={styles.sideItem} onClick={() => navigate("/wishlist")}>
              <span>♡</span><span>Wishlist</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          {activeTab === "profile" && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Edit Profile</h2>
              {profileMsg.text && (
                <div style={{ ...styles.msg, background: profileMsg.type === "success" ? "#e8f8ef" : "#fdf0f0", color: profileMsg.type === "success" ? "#27ae60" : "#e74c3c" }}>
                  {profileMsg.type === "success" ? "✓" : "⚠"} {profileMsg.text}
                </div>
              )}
              <form onSubmit={updateProfile} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input style={styles.input} type="text" value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input style={styles.input} type="email" value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })} required />
                </div>
                <button type="submit" style={styles.btn}>Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Change Password</h2>
              {passMsg.text && (
                <div style={{ ...styles.msg, background: passMsg.type === "success" ? "#e8f8ef" : "#fdf0f0", color: passMsg.type === "success" ? "#27ae60" : "#e74c3c" }}>
                  {passMsg.type === "success" ? "✓" : "⚠"} {passMsg.text}
                </div>
              )}
              <form onSubmit={changePassword} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Current Password</label>
                  <input style={styles.input} type="password" placeholder="••••••••"
                    value={passwords.currentPassword}
                    onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>New Password</label>
                  <input style={styles.input} type="password" placeholder="Min 6 characters"
                    value={passwords.newPassword}
                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirm New Password</label>
                  <input style={styles.input} type="password" placeholder="Repeat new password"
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
                </div>
                <button type="submit" style={styles.btn}>Change Password</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f5f0", padding: "40px 48px" },
  container: { display: "flex", gap: "32px", maxWidth: "1000px", margin: "0 auto" },
  sidebar: { width: "260px", flexShrink: 0 },
  avatarBox: {
    background: "white", borderRadius: "16px", padding: "28px 20px",
    textAlign: "center", marginBottom: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  bigAvatar: {
    width: "72px", height: "72px", borderRadius: "50%",
    background: "#0a0a0a", color: "#c8a96e",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "28px", fontWeight: "700", margin: "0 auto 12px",
  },
  avatarName: { fontWeight: "700", fontSize: "16px", color: "#0a0a0a", marginBottom: "4px" },
  avatarEmail: { fontSize: "13px", color: "#888" },
  sideMenu: { background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  sideItem: {
    display: "flex", alignItems: "center", gap: "12px",
    width: "100%", padding: "14px 20px",
    background: "none", border: "none", cursor: "pointer",
    fontSize: "14px", color: "#555", fontFamily: "'DM Sans', sans-serif",
    borderBottom: "1px solid #f5f5f5", transition: "all 0.2s",
  },
  sideItemActive: { background: "#f8f5f0", color: "#0a0a0a", fontWeight: "600", borderLeft: "3px solid #c8a96e" },
  main: { flex: 1 },
  card: {
    background: "white", borderRadius: "16px", padding: "32px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "24px", fontWeight: "700", color: "#0a0a0a", marginBottom: "24px",
  },
  msg: { padding: "12px 16px", borderRadius: "8px", fontSize: "14px", marginBottom: "20px", fontWeight: "500" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#0a0a0a" },
  input: {
    padding: "12px 16px", border: "2px solid #e8e8e8",
    borderRadius: "8px", fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif", outline: "none",
  },
  btn: {
    padding: "14px", background: "#0a0a0a", color: "white",
    border: "none", borderRadius: "8px", cursor: "pointer",
    fontSize: "15px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif",
    alignSelf: "flex-start", minWidth: "160px",
  },
};