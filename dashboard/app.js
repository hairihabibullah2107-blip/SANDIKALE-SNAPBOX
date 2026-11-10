(() => {
  const config = window.SNAPBOX_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const loginPanel = $("login-panel");
  const dashboardPanel = $("dashboard-panel");
  const message = $("login-message");
  const setMessage = (text, kind = "") => { message.textContent = text; message.className = "message " + kind; };
  const validConfig = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl || "") && (config.supabaseAnonKey || "").length > 20;
  let accessToken = sessionStorage.getItem("snapbox_access_token") || "";
  const showDashboard = (email) => {
    loginPanel.classList.add("hidden");
    dashboardPanel.classList.remove("hidden");
    $("account-label").textContent = email || "Akun terautentikasi";
    $("logout").classList.remove("hidden");
    $("connection-label").textContent = "AUTHENTICATED";
    $("today").textContent = new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date());
  };
  const showLogin = () => {
    loginPanel.classList.remove("hidden");
    dashboardPanel.classList.add("hidden");
    $("account-label").textContent = "Belum login";
    $("logout").classList.add("hidden");
    $("connection-label").textContent = "BELUM TERHUBUNG";
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
  $("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validConfig) {
      setMessage("Supabase belum dikonfigurasi. Isi dashboard/config.js dengan Project URL dan anon/publishable key.", "error");
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
      showDashboard(session.user?.email);
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
  if (!validConfig) setMessage("Dashboard belum terhubung ke Supabase. Konfigurasi URL dan anon key diperlukan.", "error");
  else if (accessToken) {
    request("/auth/v1/user", { headers: { Authorization: "Bearer " + accessToken } })
      .then((user) => showDashboard(user.email))
      .catch(() => { sessionStorage.removeItem("snapbox_access_token"); showLogin(); });
  }
  if (!validConfig || !accessToken) showLogin();
})();
