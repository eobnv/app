const KEYFLAME_ACCOUNT_SYNC_VERSION = 1;

async function keyflameGetAccount(usernameOverride) {
  const auth = await keyflameRequireAuth();
  if (!auth) return null;

  const username = (usernameOverride || auth.profile?.username || "").trim().toLowerCase();
  if (!username) return null;

  const { data: profile, error: profileError } = await keyflameSupabase
    .from("profiles")
    .select("id,username,display_name,role")
    .eq("username", username)
    .maybeSingle();

  if (profileError || !profile) return null;

  const [{ data: wallet }, { data: transactions }] = await Promise.all([
    keyflameSupabase.from("wallets").select("balance").eq("user_id", profile.id).maybeSingle(),
    keyflameSupabase.from("transactions").select("id,user_id,amount,balance_after,reason,game,created_at").eq("user_id", profile.id).order("created_at",{ascending:true})
  ]);

  return {
    profile,
    balance: Number(wallet?.balance || 0),
    transactions: (transactions || []).map(t => ({
      id: String(t.id),
      amount: Number(t.amount || 0),
      previousBalance: null,
      balanceAfter: Number(t.balance_after || 0),
      reason: t.reason || "",
      game: t.game || "",
      time: t.created_at ? new Date(t.created_at).toLocaleString() : "",
      timestamp: t.created_at || ""
    }))
  };
}

async function keyflameSyncAccountToLocalStorage(usernameOverride) {
  const account = await keyflameGetAccount(usernameOverride);
  if (!account) return null;

  const username = account.profile.username;
  localStorage.setItem("keyflame_account_" + username, JSON.stringify({
    balance: account.balance,
    transactions: account.transactions
  }));
  return account;
}

async function keyflameAdminAdjustBucks(targetUsername, delta, reason, game) {
  const admin = await keyflameRequireAuth();
  if (!admin || admin.profile?.role !== "admin") {
    throw new Error("Admin access required.");
  }

  const target = await keyflameGetAccount(targetUsername);
  if (!target) throw new Error("Target account not found.");

  const nextBalance = target.balance + Number(delta);
  if (nextBalance < 0) throw new Error("Balance cannot go below ¥0.");

  const { error: walletError } = await keyflameSupabase
    .from("wallets")
    .update({ balance: nextBalance, updated_at: new Date().toISOString() })
    .eq("user_id", target.profile.id);

  if (walletError) throw walletError;

  const { error: transactionError } = await keyflameSupabase
    .from("transactions")
    .insert({
      user_id: target.profile.id,
      amount: Number(delta),
      balance_after: nextBalance,
      reason: reason || "AB Bucks adjustment",
      game: game || null
    });

  if (transactionError) {
    await keyflameSupabase
      .from("wallets")
      .update({ balance: target.balance, updated_at: new Date().toISOString() })
      .eq("user_id", target.profile.id);
    throw transactionError;
  }

  await keyflameSyncAccountToLocalStorage(targetUsername);
  return { balance: nextBalance };
}
