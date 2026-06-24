import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO = process.env.HANDOFF_EMAIL ?? "hichamsabbar80@gmail.com";
const FROM = "Zina Beauty <notifications@zinabeauty.ma>";
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// Escape user-supplied strings before embedding in HTML emails
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

async function sendEmail(subject: string, html: string) {
  if (!resend) {
    console.log("[Email skipped — no RESEND_API_KEY]", subject);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to: TO, subject, html });
  } catch (err) {
    console.error("[Email error]", err);
  }
}

export async function notifyNewLead(data: {
  name: string;
  contact: string;
  interest: string;
  conversationId?: string;
}) {
  await sendEmail(
    `New Lead — ${esc(data.name)}`,
    `<h2 style="color:#E5501E">New Lead — Zina Beauty</h2>
     <p><strong>Name:</strong> ${esc(data.name)}</p>
     <p><strong>Contact:</strong> ${esc(data.contact)}</p>
     <p><strong>Interested in:</strong> ${esc(data.interest)}</p>
     ${data.conversationId ? `<p><strong>Conversation ID:</strong> ${esc(data.conversationId)}</p>` : ""}
     <hr/>
     <p><a href="${SITE_URL}/admin">View in Admin →</a></p>`
  );
}

export async function notifyNewOrder(data: {
  orderRef: string;
  name: string;
  contact: string;
  product: string;
  address: string;
}) {
  await sendEmail(
    `New Order #${esc(data.orderRef)} — ${esc(data.name)}`,
    `<h2 style="color:#E5501E">New Order — Zina Beauty</h2>
     <p><strong>Ref:</strong> #${esc(data.orderRef)}</p>
     <p><strong>Customer:</strong> ${esc(data.name)} (${esc(data.contact)})</p>
     <p><strong>Product:</strong> ${esc(data.product)}</p>
     <p><strong>Delivery to:</strong> ${esc(data.address)}</p>
     <hr/>
     <p><a href="${SITE_URL}/admin">View in Admin →</a></p>`
  );
}

export async function notifyHandoff(data: { reason: string; conversationId?: string }) {
  await sendEmail(
    `Handoff Requested — Customer needs help`,
    `<h2 style="color:#E5501E">A customer needs human support</h2>
     <p><strong>Reason:</strong> ${esc(data.reason)}</p>
     ${data.conversationId ? `<p><strong>Conversation ID:</strong> ${esc(data.conversationId)}</p>` : ""}
     <hr/>
     <p><a href="${SITE_URL}/admin">View conversation in Admin →</a></p>`
  );
}
