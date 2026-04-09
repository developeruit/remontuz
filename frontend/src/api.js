import { supabase } from "./supabase";

function throwIf(error) {
  if (error) throw new Error(error.message || "Xatolik");
}

async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

async function currentProfile() {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
  return data;
}

export const api = {
  // ============ AUTH ============
  async register({ full_name, email, password, phone, role = "client", city = "Toshkent" }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone, role, city },
      },
    });
    throwIf(error);
    // profile trigger tomonidan yaratiladi
    const profile = data.user
      ? { id: data.user.id, full_name, email, phone, role, city, created_at: new Date().toISOString() }
      : null;
    return { access_token: data.session?.access_token || "", user: profile };
  },

  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    throwIf(error);
    const profile = await currentProfile();
    return { access_token: data.session?.access_token || "", user: profile };
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async me() {
    const p = await currentProfile();
    if (!p) throw new Error("Not authenticated");
    return p;
  },

  async updateProfile(updates) {
    const uid = await currentUserId();
    if (!uid) throw new Error("Not authenticated");
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", uid)
      .select()
      .single();
    throwIf(error);
    return data;
  },

  async updateMasterProfile(updates) {
    const uid = await currentUserId();
    if (!uid) throw new Error("Not authenticated");
    const { data, error } = await supabase
      .from("master_profiles")
      .update(updates)
      .eq("user_id", uid)
      .select()
      .single();
    throwIf(error);
    return data;
  },

  async getMyMasterProfile() {
    const uid = await currentUserId();
    if (!uid) return null;
    const { data } = await supabase.from("master_profiles").select("*").eq("user_id", uid).single();
    return data;
  },

  async forgotPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    });
    throwIf(error);
    return { ok: true };
  },

  // ============ SERVICES ============
  async services() {
    const { data, error } = await supabase.from("services").select("*").order("id");
    throwIf(error);
    return data || [];
  },

  // ============ MASTERS ============
  async masters() {
    const { data, error } = await supabase
      .from("master_profiles")
      .select("*, profiles:user_id (full_name, avatar_url, email)")
      .order("rating", { ascending: false });
    throwIf(error);
    return (data || []).map((m) => ({
      id: m.id,
      user_id: m.user_id,
      full_name: m.profiles?.full_name,
      avatar_url: m.profiles?.avatar_url,
      specializations: m.specializations,
      experience_years: m.experience_years,
      bio: m.bio,
      rating: m.rating,
      total_reviews: m.total_reviews,
      is_verified: m.is_verified,
      hourly_rate: m.hourly_rate,
      city: m.city,
    }));
  },

  async master(user_id) {
    const { data, error } = await supabase
      .from("master_profiles")
      .select("*, profiles:user_id (full_name, avatar_url, email)")
      .eq("user_id", user_id)
      .single();
    throwIf(error);
    return {
      id: data.id,
      user_id: data.user_id,
      full_name: data.profiles?.full_name,
      avatar_url: data.profiles?.avatar_url,
      specializations: data.specializations,
      experience_years: data.experience_years,
      bio: data.bio,
      rating: data.rating,
      total_reviews: data.total_reviews,
      is_verified: data.is_verified,
      hourly_rate: data.hourly_rate,
      city: data.city,
    };
  },

  async masterReviews(master_id) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("master_id", master_id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    throwIf(error);
    return data || [];
  },

  // ============ ORDERS ============
  async createOrder(payload) {
    const uid = await currentUserId();
    if (!uid) throw new Error("Avval tizimga kiring");
    const { data, error } = await supabase
      .from("orders")
      .insert({ ...payload, client_id: uid })
      .select()
      .single();
    throwIf(error);
    return data;
  },

  async orders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    throwIf(error);
    return data || [];
  },

  async assignOrder(id) {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("orders")
      .update({ master_id: uid, status: "in_progress" })
      .eq("id", id)
      .select()
      .single();
    throwIf(error);
    return data;
  },

  async updateOrderStatus(id, status) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    throwIf(error);
    return data;
  },

  // ============ PORTFOLIO ============
  async portfolio(master_id) {
    let q = supabase.from("portfolio_items").select("*").order("created_at", { ascending: false });
    if (master_id) q = q.eq("master_id", master_id);
    const { data, error } = await q;
    throwIf(error);
    return data || [];
  },

  async addPortfolio(payload) {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert({ ...payload, master_id: uid })
      .select()
      .single();
    throwIf(error);
    return data;
  },

  async uploadPortfolioImage(file) {
    const uid = await currentUserId();
    if (!uid) throw new Error("Avval tizimga kiring");
    if (!file) throw new Error("Fayl tanlanmadi");
    const ext = file.name.split(".").pop();
    const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("portfolio")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) throw new Error(upErr.message);
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return data.publicUrl;
  },

  async uploadOrderFile(file) {
    const uid = await currentUserId();
    if (!uid) throw new Error("Avval tizimga kiring");
    if (!file) throw new Error("Fayl tanlanmadi");
    const ext = file.name.split(".").pop();
    // Path must start with user's UID (RLS policy requirement)
    const path = `${uid}/orders/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("portfolio")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) throw new Error(upErr.message);
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return data.publicUrl;
  },

  async deletePortfolio(id) {
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    throwIf(error);
    return { ok: true };
  },

  // ============ MATERIALS ============
  async materials() {
    const { data, error } = await supabase.from("materials").select("*").order("id");
    throwIf(error);
    return data || [];
  },

  // ============ MATERIAL ORDERS (cart) ============
  async createMaterialOrder(payload) {
    const uid = await currentUserId();
    if (!uid) throw new Error("Avval tizimga kiring");
    const { data, error } = await supabase
      .from("material_orders")
      .insert({ ...payload, client_id: uid })
      .select()
      .single();
    throwIf(error);
    return data;
  },

  async myMaterialOrders() {
    const uid = await currentUserId();
    if (!uid) return [];
    const { data, error } = await supabase
      .from("material_orders")
      .select("*")
      .eq("client_id", uid)
      .order("created_at", { ascending: false });
    throwIf(error);
    return data || [];
  },

  async cancelMaterialOrder(id) {
    const { error } = await supabase
      .from("material_orders")
      .update({ status: "cancelled" })
      .eq("id", id);
    throwIf(error);
    return { ok: true };
  },

  // ============ REVIEWS ============
  async getOrderReview(order_id) {
    const { data } = await supabase.from("reviews").select("*").eq("order_id", order_id).maybeSingle();
    return data;
  },
  async addReview(payload) {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("reviews")
      .insert({ ...payload, client_id: uid, is_approved: true })
      .select()
      .single();
    throwIf(error);
    return data;
  },

  // ============ ADMIN ============
  async adminStats() {
    const [users, masters, clients, orders] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "master"),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
      supabase.from("orders").select("id", { count: "exact", head: true }),
    ]);
    return {
      users: users.count || 0,
      masters: masters.count || 0,
      clients: clients.count || 0,
      orders: orders.count || 0,
      services: 4,
      materials: 8,
    };
  },

  async adminUsers() {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    throwIf(error);
    return data || [];
  },

  async verifyMaster(user_id) {
    const { error } = await supabase
      .from("master_profiles")
      .update({ is_verified: true })
      .eq("user_id", user_id);
    throwIf(error);
    return { ok: true };
  },
};
