const TO_EMAIL = "mandar.vyas20@gmail.com";
// Resend only delivers from onboarding@resend.dev to the Resend account owner's
// address. Sending from anything else requires a domain verified in Resend.
const FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;
const MAX_MESSAGE_LENGTH = 5000;

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid request." });
  }

  // Hidden field that only bots fill in; pretend success so they don't retry.
  if (body.website) return res.status(200).json({ ok: true });

  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }
  if (!PHONE_RE.test(phone)) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return res
      .status(400)
      .json({ error: `Please enter a message (up to ${MAX_MESSAGE_LENGTH} characters).` });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service is not configured." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Portfolio contact from ${email}`,
        text: `Email: ${email}\nPhone: ${phone}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error("Resend error", response.status, await response.text());
      return res.status(502).json({ error: "Could not send your message. Please try again." });
    }
  } catch (err) {
    console.error("Resend request failed", err);
    return res.status(502).json({ error: "Could not send your message. Please try again." });
  }

  return res.status(200).json({ ok: true });
};
