const BASE_URL = "http://localhost:8080";

export const api = {
  get: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json()),

  post: (path, data) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  put: (path, data) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json()),
};

export const localCart = {
  get: () => {
    try {
      const data = localStorage.getItem("cart");
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  add: (product, quantity = 1) => {
    try {
      const cart = localCart.get();
      const existingIndex = cart.findIndex(i => i.product.id === product.id);
      if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          id: product.id + "_" + Date.now(),
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
          },
          quantity: quantity,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      return cart;
    } catch {
      return [];
    }
  },

  remove: (productId) => {
    try {
      const cart = localCart.get().filter(i => i.product.id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      return cart;
    } catch {
      return [];
    }
  },

  clear: () => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    return [];
  },

  count: () => {
    return localCart.get().length;
  },
};

export const localWishlist = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch {
      return [];
    }
  },

  add: (product) => {
    try {
      const list = localWishlist.get();
      const exists = list.find(i => i.product.id === product.id);
      if (!exists) {
        list.push({
          id: product.id + "_w",
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
          }
        });
        localStorage.setItem("wishlist", JSON.stringify(list));
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
      return list;
    } catch {
      return [];
    }
  },

  remove: (productId) => {
    try {
      const list = localWishlist.get().filter(i => i.product.id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlistUpdated"));
      return list;
    } catch {
      return [];
    }
  },

  has: (productId) => {
    return localWishlist.get().some(i => i.product.id === productId);
  },

  count: () => localWishlist.get().length,
};

export const getLocalUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};