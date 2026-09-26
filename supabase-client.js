const KEYFLAME_SUPABASE_URL = "https://zkztdjocfmigfcfmwgoe.supabase.co";
const KEYFLAME_SUPABASE_KEY = "sb_publishable_jUw2nAH5RnPsQz_S_NYdjw_EIck0e07";

const keyflameSupabase = window.supabase.createClient(
  KEYFLAME_SUPABASE_URL,
  KEYFLAME_SUPABASE_KEY
);

async function keyflameRequireAuth() {
  const { data, error } = await keyflameSupabase.auth.getSession();
  if (error || !data.session) {
    window.location.href = "login.html";
    return null;
  }

  const user = data.session.user;
  const { data: profile } = await keyflameSupabase
    .from("profiles")
    .select("username, display_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.username) {
    sessionStorage.setItem("keyflame_user", profile.username);
  }

  return { user, profile: profile || null, session: data.session };
}

async function keyflameSignOut() {
  await keyflameSupabase.auth.signOut();
  sessionStorage.removeItem("keyflame_user");
  sessionStorage.removeItem("keyflame_role");
  window.location.href = "login.html";
}

function keyflameProfileName(profile, username) {
  return profile?.display_name || profile?.username || username || "User";
}

function keyflameInitials(name) {
  return String(name || "K")
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "K";
}

async function keyflameUpdateSidebar() {
  const username = sessionStorage.getItem("keyflame_user") || "";
  const result = await keyflameRequireAuth();
  if (!result) return;

  const name = keyflameProfileName(result.profile, username);
  const nameEl = document.getElementById("sidebarName");
  const userEl = document.getElementById("sidebarUsername");
  const avatarEl = document.getElementById("sidebarAvatar");

  if (nameEl) nameEl.textContent = name;
  if (userEl) userEl.textContent = result.profile?.username || username;
  if (avatarEl) {
    if (result.profile?.avatar_url) {
      avatarEl.innerHTML = "";
      const img = document.createElement("img");
      img.src = result.profile.avatar_url;
      img.alt = "";
      avatarEl.appendChild(img);
    } else {
      avatarEl.textContent = keyflameInitials(name);
    }
  }

  sessionStorage.setItem("keyflame_role", result.profile?.role || "user");
  return result;
}
