// Team Stores password rules (My Account → Change password).
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from account.js.

export function tsPasswordRules(pw, email) {
  const low = (pw || "").toLowerCase(); const e = (email || "").toLowerCase(); const local = e.split("@")[0];
  const common = ["password", "123456", "qwerty", "letmein", "teamstores", "welcome1"];
  return [
    { ok: pw.length >= 12 && pw.length <= 128, label: "At least 12 characters (any characters, spaces included)" },
    { ok: pw.length > 0 && !common.some((c) => low.includes(c)), label: "Not a common or previously breached password" },
    { ok: pw.length > 0 && !(e && low.includes(e)) && !(local && local.length > 2 && low.includes(local)), label: "Doesn't contain your email address" },
  ];
}
