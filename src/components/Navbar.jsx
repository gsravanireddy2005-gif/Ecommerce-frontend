import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { api, localCart, localWishlist } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userName, setUserName] = useState("");
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const isAuth = !location.pathname.includes("login") && !location.pathname.includes("register");

useEffect(() => {
  if (!isAuth) return;
  setCartCount(localCart.count());
  setWishlistCount(localWishlist.count());
  api.get("/api/notifications/unread-count").then(res => { if (res.count !== undefined) setNotifCount(res.count); }).catch(() => {});
  api.get("/api/user/profile").then(res => { if (res.name) setUserName(res.name); }).catch(() => {});
}, [location]);

  const loadNotifications = () => {
    api.get("/api/notifications").then(res => {
      if (Array.isArray(res)) setNotifications(res);
    });
    api.post("/api/notifications/mark-read", {});
    setNotifCount(0);
  };

  const logout = async () => {
  await api.post("/api/auth/logout", {});
  localStorage.removeItem("user"); // ← add this line
  navigate("/login");
};

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        <span style={styles.brandIcon}>◉</span>
        <span style={styles.brandText}>PURE<span style={styles.brandAccent}>KART</span></span>
      </Link>

      {isAuth && (
        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>Shop</Link>
          <Link to="/wishlist" style={styles.iconLink}>
            <span>♡</span>
            {wishlistCount > 0 && <span style={styles.badge}>{wishlistCount}</span>}
          </Link>
          <Link to="/cart" style={styles.iconLink}>
            <span>🛍</span>
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>

          {/* Notifications */}
          <div style={styles.iconWrapper} ref={notifRef}>
            <button style={styles.iconBtn} onClick={() => { setShowNotif(!showNotif); if (!showNotif) loadNotifications(); }}>
              <span>🔔</span>
              {notifCount > 0 && <span style={styles.badge}>{notifCount}</span>}
            </button>
            {showNotif && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>Notifications</div>
                {notifications.length === 0 ? (
                  <div style={styles.dropdownEmpty}>No notifications yet</div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div key={n.id} style={{ ...styles.notifItem, background: n.read ? "white" : "#f8f5f0" }}>
                      <div style={styles.notifIcon}>
                        {n.type === "ORDER" ? "📦" : n.type === "PROMO" ? "🎁" : "💡"}
                      </div>
                      <div>
                        <div style={styles.notifTitle}>{n.title}</div>
                        <div style={styles.notifMsg}>{n.message}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div style={styles.iconWrapper} ref={profileRef}>
            <button style={styles.profileBtn} onClick={() => setShowProfile(!showProfile)}>
              <div style={styles.avatar}>{userName.charAt(0).toUpperCase() || "U"}</div>
            </button>
            {showProfile && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>Hi, {userName}! 👋</div>
                <Link to="/profile" style={styles.dropdownItem} onClick={() => setShowProfile(false)}>
                  👤 My Profile
                </Link>
                <Link to="/orders" style={styles.dropdownItem} onClick={() => setShowProfile(false)}>
                  📦 My Orders
                </Link>
                <Link to="/wishlist" style={styles.dropdownItem} onClick={() => setShowProfile(false)}>
                  ♡ Wishlist
                </Link>
                <div style={styles.dropdownDivider} />
                <button style={styles.dropdownLogout} onClick={logout}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky", top: 0, zIndex: 1000,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0 48px", height: "70px",
    background: "#0a0a0a",
    boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" },
  brandIcon: { fontSize: "20px", color: "#c8a96e" },
  brandText: { fontSize: "18px", fontWeight: "600", letterSpacing: "3px", color: "white", fontFamily: "'DM Sans', sans-serif" },
  brandAccent: { color: "#c8a96e" },
  links: { display: "flex", alignItems: "center", gap: "24px" },
  link: { color: "#ccc", textDecoration: "none", fontSize: "14px", letterSpacing: "1px", fontWeight: "500" },
  iconLink: { color: "white", textDecoration: "none", fontSize: "20px", position: "relative", display: "flex", alignItems: "center" },
  iconWrapper: { position: "relative" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "20px", position: "relative", color: "white", padding: "4px" },
  badge: {
    position: "absolute", top: "-6px", right: "-8px",
    background: "#c8a96e", color: "#0a0a0a",
    borderRadius: "50%", width: "16px", height: "16px",
    fontSize: "10px", fontWeight: "700",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  profileBtn: { background: "none", border: "none", cursor: "pointer", padding: "0" },
  avatar: {
    width: "34px", height: "34px", borderRadius: "50%",
    background: "#c8a96e", color: "#0a0a0a",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", fontWeight: "700",
  },
  dropdown: {
    position: "absolute", top: "calc(100% + 12px)", right: 0,
    background: "white", borderRadius: "12px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
    minWidth: "280px", overflow: "hidden",
    border: "1px solid #f0f0f0", zIndex: 1001,
  },
  dropdownHeader: {
    padding: "16px 20px", fontWeight: "700", fontSize: "14px",
    borderBottom: "1px solid #f0f0f0", color: "#0a0a0a",
  },
  dropdownItem: {
    display: "block", padding: "12px 20px",
    color: "#333", textDecoration: "none", fontSize: "14px",
    transition: "background 0.2s",
  },
  dropdownDivider: { height: "1px", background: "#f0f0f0", margin: "4px 0" },
  dropdownLogout: {
    display: "block", width: "100%", padding: "12px 20px",
    color: "#e74c3c", background: "none", border: "none",
    textAlign: "left", cursor: "pointer", fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
  },
  dropdownEmpty: { padding: "20px", color: "#888", fontSize: "13px", textAlign: "center" },
  notifItem: {
    display: "flex", gap: "12px", padding: "12px 20px",
    borderBottom: "1px solid #f5f5f5", alignItems: "flex-start",
  },
  notifIcon: { fontSize: "20px", flexShrink: 0 },
  notifTitle: { fontSize: "13px", fontWeight: "600", color: "#0a0a0a", marginBottom: "2px" },
  notifMsg: { fontSize: "12px", color: "#888", lineHeight: "1.4" },
};