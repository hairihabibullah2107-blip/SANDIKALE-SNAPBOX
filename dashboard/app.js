(() => {
  "use strict";
  const config = window.SNAPBOX_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const loginPanel = $("login-panel");
  const dashboardPanel = $("dashboard-panel");
  const message = $("login-message");
  const setMessage = (value, kind = "") => { if (message) { message.textContent = value; message.className = "message " + kind; } };
  const validConfig = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl || "") && (config.supabaseAnonKey || "").length > 20;
  let accessToken = sessionStorage.getItem("snapbox_access_token") || "";
  let demoMode = false;
  const showDashboard = (email, demo = false) => {
    demoMode = demo;
    loginPanel.classList.add("hidden");
    dashboardPanel.classList.remove("hidden");
    $("account-label").textContent = demo ? "Pratinjau Demo" : (email || "Akun terautentikasi");
    $("logout").classList.remove("hidden");
    $("logout").textContent = demo ? "Keluar Demo" : "Keluar";
    $("connection-label").textContent = demo ? "MODE DEMO — OFFLINE" : "AUTHENTICATED";
    $("today").textContent = new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date());
    const notice = dashboardPanel.querySelector(".notice");
    if (notice && demo) {
      notice.querySelector("b").textContent = "MODE DEMO";
      notice.querySelector("span").textContent = "Anda sedang melihat pratinjau antarmuka. Belum ada database, perangkat, sesi foto, atau pekerjaan cetak yang dijalankan.";
    }
  };
  const showLogin = () => {
    demoMode = false;
    loginPanel.classList.remove("hidden");
    dashboardPanel.classList.add("hidden");
    $("account-label").textContent = "Belum login";
    $("logout").classList.add("hidden");
    $("connection-label").textContent = validConfig ? "SIAP LOGIN" : "MODE PRATINJAU";
  };
  async function request(path, options = {}) {
    const response = await fetch(config.supabaseUrl + path, {
      ...options,
      headers: { apikey: config.supabaseAnonKey, "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.msg || data.message || data.error_description || "Permintaan gagal (" + response.status + ")");
    return data;
  }
  $("demo-access").addEventListener("click", () => {
    sessionStorage.removeItem("snapbox_access_token");
    accessToken = "";
    showDashboard("Pratinjau Demo", true);
  });
  $("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validConfig) {
      setMessage("Login akun belum diaktifkan. Gunakan tombol LIHAT SISTEM (MODE DEMO) untuk meninjau dashboard.", "error");
      return;
    }
    const button = event.currentTarget.querySelector("button");
    button.disabled = true; button.textContent = "MEMERIKSA...";
    setMessage("Memverifikasi akun...");
    try {
      const session = await request("/auth/v1/token?grant_type=password", {
        method: "POST",
        body: JSON.stringify({ email: $("email").value.trim(), password: $("password").value })
      });
      if (!session.access_token) throw new Error("Token login tidak diterima.");
      accessToken = session.access_token;
      sessionStorage.setItem("snapbox_access_token", accessToken);
      showDashboard(session.user?.email, false);
    } catch (error) {
      setMessage(error.message || "Login gagal.", "error");
    } finally {
      button.disabled = false; button.innerHTML = 'MASUK <span>↗</span>';
    }
  });
  $("logout").addEventListener("click", () => {
    sessionStorage.removeItem("snapbox_access_token");
    accessToken = "";
    showLogin();
  });
  if (validConfig && accessToken) {
    request("/auth/v1/user", { headers: { Authorization: "Bearer " + accessToken } })
      .then((user) => showDashboard(user.email, false))
      .catch(() => { sessionStorage.removeItem("snapbox_access_token"); showLogin(); });
  } else {
    showLogin();
    if (!validConfig) setMessage("Login akun belum diaktifkan. Masuk melalui mode demo untuk melihat sistem.", "error");
  }
})();