const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body || {};
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body || "{}");
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }
  const email = String(body.email || "").trim().toLowerCase();
  const score = Number(body.score);

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!Number.isFinite(score)) {
    return res.status(400).json({ error: "Invalid score" });
  }

  const lead = {
    id: `lead_${Date.now()}`,
    email,
    score,
    createdAt: new Date().toISOString(),
    source: "portfolio_quiz",
  };

  // Serverless note: this is response-level only unless you wire persistence.
  return res.status(201).json({
    ok: true,
    lead,
  });
};
