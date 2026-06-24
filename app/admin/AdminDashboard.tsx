"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users, ShoppingBag, MessageSquare, Settings, LogOut,
  RefreshCw, AlertCircle, ChevronDown, ChevronUp, Download,
  UserCircle, Search,
} from "lucide-react";

type Lead = { id: number; name: string; contact: string; interest: string; language: string | null; status: string; source: string; createdAt: string };
type Order = { id: number; orderRef: string; name: string; contact: string; product: string; address: string; paymentMethod: string; status: string; createdAt: string };
type Conversation = { id: string; channel: string; messagesJson: string; needsHuman: boolean; createdAt: string; updatedAt: string };
type Profile = { id: string; userId: string; name: string | null; skinType: string | null; hairType: string | null; concerns: string | null; language: string | null; notes: string | null; updatedAt: string };
type Config = { name: string; description: string; servicesJson: string; hoursJson: string; location: string; languages: string; faqJson: string; handoffEmail: string } | null;

type Tab = "leads" | "orders" | "conversations" | "profiles" | "config";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const LEAD_STATUSES  = ["new", "contacted", "qualified", "converted", "lost"] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "#FEF3C7", confirmed: "#DBEAFE", processing: "#EDE9FE",
  shipped: "#FEF9C3", delivered: "#DCFCE7", cancelled: "#FEE2E2",
  new: "#FEF3C7", contacted: "#DBEAFE", qualified: "#EDE9FE",
  converted: "#DCFCE7", lost: "#FEE2E2",
};

// ── CSV export helper ─────────────────────────────────────────────────────────

function downloadCSV(filename: string, rows: string[][], headers: string[]) {
  const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function Badge({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize"
      style={{ backgroundColor: STATUS_COLORS[value] ?? "#F4EFE6", color: "#1B1714" }}>
      {value.replace(/_/g, " ")}
    </span>
  );
}

// ── Status selector ───────────────────────────────────────────────────────────

function StatusSelect<T extends string>({
  value, options, onChange,
}: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-lg border px-2 py-1 text-xs capitalize focus:outline-none focus:ring-1 focus:ring-[#E5501E]"
      style={{ borderColor: "#D6CFC5", color: "#1B1714", backgroundColor: STATUS_COLORS[value] ?? "#F4EFE6" }}
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ backgroundColor: STATUS_COLORS[o] ?? "#fff" }}>{o.replace(/_/g, " ")}</option>
      ))}
    </select>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads]             = useState<Lead[]>([]);
  const [orders, setOrders]           = useState<Order[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [profiles, setProfiles]       = useState<Profile[]>([]);
  const [config, setConfig]           = useState<Config>(null);
  const [loading, setLoading]         = useState(true);
  const [expandedConv, setExpandedConv] = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [configForm, setConfigForm]   = useState({ name: "", description: "", location: "", handoffEmail: "", servicesJson: "", hoursJson: "", languages: "", faqJson: "" });
  const [saving, setSaving]           = useState(false);
  const [saveMsg, setSaveMsg]         = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/data");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setLeads(data.leads ?? []);
    setOrders(data.orders ?? []);
    setConversations(data.conversations ?? []);
    setProfiles(data.profiles ?? []);
    if (data.config) { setConfig(data.config); setConfigForm(data.config); }
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Status update helpers ────────────────────────────────────────────────────

  async function updateOrderStatus(id: number, status: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  async function updateLeadStatus(id: number, status: string) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function saveConfig(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaveMsg("");
    const res = await fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(configForm),
    });
    setSaving(false);
    setSaveMsg(res.ok ? "Saved!" : "Error — check JSON fields.");
    setTimeout(() => setSaveMsg(""), 3000);
  }

  // ── Filtered data ────────────────────────────────────────────────────────────

  const q = search.toLowerCase();
  const filteredLeads  = leads.filter((l)  => !q || l.name.toLowerCase().includes(q) || l.contact.includes(q) || l.interest.toLowerCase().includes(q));
  const filteredOrders = orders.filter((o) => !q || o.name.toLowerCase().includes(q) || o.orderRef.includes(q) || o.product.toLowerCase().includes(q));

  // ── Tab config ────────────────────────────────────────────────────────────────

  const TABS: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "leads",         label: "Leads",         icon: <Users className="h-4 w-4" />,         count: leads.length },
    { id: "orders",        label: "Orders",        icon: <ShoppingBag className="h-4 w-4" />,   count: orders.length },
    { id: "conversations", label: "Chats",         icon: <MessageSquare className="h-4 w-4" />, count: conversations.filter((c) => c.needsHuman).length || undefined },
    { id: "profiles",      label: "Customers",     icon: <UserCircle className="h-4 w-4" />,    count: profiles.length },
    { id: "config",        label: "Store Config",  icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4EFE6" }}>

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 shadow-sm" style={{ backgroundColor: "#FBF8F2" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold" style={{ color: "#1B1714" }}>Zina <em className="not-italic" style={{ color: "#E5501E" }}>Beauty</em></span>
          <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: "#E5501E15", color: "#E5501E" }}>Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-black/5" style={{ color: "#1B1714" }}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-black/5" style={{ color: "#1B1714" }}>
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Leads",   value: leads.length,                                           color: "#E5501E" },
            { label: "Total Orders",  value: orders.length,                                          color: "#B5431A" },
            { label: "Conversations", value: conversations.length,                                   color: "#D89B3F" },
            { label: "Needs Human",   value: conversations.filter((c) => c.needsHuman).length,       color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4" style={{ backgroundColor: "#FBF8F2" }}>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#1B171460" }}>{s.label}</p>
              <p className="mt-1 text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl p-1" style={{ backgroundColor: "#EDE8DF" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all"
              style={tab === t.id
                ? { backgroundColor: "#FBF8F2", color: "#E5501E", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                : { color: "#1B171480" }}>
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="rounded-full px-1.5 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: t.id === "conversations" ? "#dc2626" : "#E5501E", minWidth: "1.25rem", textAlign: "center" }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-6 w-6 animate-spin" style={{ color: "#E5501E" }} />
          </div>
        ) : (
          <>
            {/* ── LEADS ─────────────────────────────────────────────────────── */}
            {tab === "leads" && (
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FBF8F2" }}>
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b" style={{ borderColor: "#E8E2D9" }}>
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#1B171440" }} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search leads…" className="w-full rounded-lg border pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#E5501E]"
                      style={{ borderColor: "#D6CFC5", color: "#1B1714" }} />
                  </div>
                  <button onClick={() => downloadCSV("leads.csv",
                    filteredLeads.map((l) => [String(l.id), l.name, l.contact, l.interest, l.language ?? "", l.status, l.source, l.createdAt]),
                    ["ID", "Name", "Contact", "Interest", "Language", "Status", "Source", "Date"])}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-black/5"
                    style={{ color: "#1B1714" }}>
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </button>
                </div>
                {filteredLeads.length === 0 ? (
                  <p className="p-8 text-center text-sm" style={{ color: "#1B171460" }}>No leads found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr style={{ borderBottom: "1px solid #E8E2D9" }}>
                        {["Name", "Contact", "Interest", "Language", "Status", "Date"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#1B171460" }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {filteredLeads.map((l) => (
                          <tr key={l.id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: "1px solid #F4EFE6" }}>
                            <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "#1B1714" }}>{l.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#1B171480" }}>{l.contact}</td>
                            <td className="px-4 py-3 max-w-xs truncate" style={{ color: "#1B1714" }}>{l.interest}</td>
                            <td className="px-4 py-3">{l.language ? <Badge value={l.language} /> : "—"}</td>
                            <td className="px-4 py-3">
                              <StatusSelect value={l.status as typeof LEAD_STATUSES[number]} options={LEAD_STATUSES} onChange={(v) => updateLeadStatus(l.id, v)} />
                            </td>
                            <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#1B171460" }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── ORDERS ────────────────────────────────────────────────────── */}
            {tab === "orders" && (
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FBF8F2" }}>
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b" style={{ borderColor: "#E8E2D9" }}>
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#1B171440" }} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search orders…" className="w-full rounded-lg border pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#E5501E]"
                      style={{ borderColor: "#D6CFC5", color: "#1B1714" }} />
                  </div>
                  <button onClick={() => downloadCSV("orders.csv",
                    filteredOrders.map((o) => [o.orderRef, o.name, o.contact, o.product, o.address, o.paymentMethod, o.status, o.createdAt]),
                    ["Ref", "Name", "Contact", "Product", "Address", "Payment", "Status", "Date"])}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-black/5"
                    style={{ color: "#1B1714" }}>
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </button>
                </div>
                {filteredOrders.length === 0 ? (
                  <p className="p-8 text-center text-sm" style={{ color: "#1B171460" }}>No orders found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr style={{ borderBottom: "1px solid #E8E2D9" }}>
                        {["Ref", "Customer", "Product", "Address", "Payment", "Status", "Date"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#1B171460" }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {filteredOrders.map((o) => (
                          <tr key={o.id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: "1px solid #F4EFE6" }}>
                            <td className="px-4 py-3 font-mono text-xs font-bold whitespace-nowrap" style={{ color: "#E5501E" }}>#{o.orderRef}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p className="font-medium" style={{ color: "#1B1714" }}>{o.name}</p>
                              <p className="text-xs" style={{ color: "#1B171480" }}>{o.contact}</p>
                            </td>
                            <td className="px-4 py-3 max-w-[160px] truncate" style={{ color: "#1B1714" }}>{o.product}</td>
                            <td className="px-4 py-3 max-w-[140px] truncate" style={{ color: "#1B171480" }}>{o.address}</td>
                            <td className="px-4 py-3 whitespace-nowrap"><Badge value={o.paymentMethod.replace(/_/g, " ")} /></td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <StatusSelect value={o.status as typeof ORDER_STATUSES[number]} options={ORDER_STATUSES} onChange={(v) => updateOrderStatus(o.id, v)} />
                            </td>
                            <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#1B171460" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── CONVERSATIONS ─────────────────────────────────────────────── */}
            {tab === "conversations" && (
              <div className="flex flex-col gap-3">
                {conversations.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center text-sm" style={{ backgroundColor: "#FBF8F2", color: "#1B171460" }}>No conversations yet.</div>
                ) : conversations.map((conv) => {
                  const messages = (JSON.parse(conv.messagesJson) as { role: string; content: unknown }[]).filter((m) => m.role === "user" || m.role === "assistant");
                  const expanded = expandedConv === conv.id;
                  const channelColor = conv.channel === "whatsapp" ? "#25D366" : "#E5501E";
                  return (
                    <div key={conv.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FBF8F2" }}>
                      <button onClick={() => setExpandedConv(expanded ? null : conv.id)} className="flex w-full items-center justify-between px-5 py-4 text-left">
                        <div className="flex items-center gap-3">
                          {conv.needsHuman && <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium" style={{ color: "#1B1714" }}>{conv.id.slice(0, 12)}…</p>
                              <span className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: channelColor }}>{conv.channel}</span>
                            </div>
                            <p className="text-xs" style={{ color: "#1B171460" }}>{messages.length} messages · {new Date(conv.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {conv.needsHuman && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">Needs Human</span>}
                          {expanded ? <ChevronUp className="h-4 w-4" style={{ color: "#1B171480" }} /> : <ChevronDown className="h-4 w-4" style={{ color: "#1B171480" }} />}
                        </div>
                      </button>
                      {expanded && (
                        <div className="border-t px-5 py-4 space-y-2 max-h-96 overflow-y-auto" style={{ borderColor: "#E8E2D9" }}>
                          {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                              <div className="max-w-lg rounded-xl px-3 py-2 text-sm whitespace-pre-wrap"
                                style={m.role === "user" ? { backgroundColor: "#E5501E", color: "#fff" } : { backgroundColor: "#EDE8DF", color: "#1B1714" }}>
                                {typeof m.content === "string" ? m.content : JSON.stringify(m.content)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── CUSTOMER PROFILES ─────────────────────────────────────────── */}
            {tab === "profiles" && (
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FBF8F2" }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: "#E8E2D9" }}>
                  <p className="text-sm" style={{ color: "#1B171460" }}>
                    These profiles are built automatically — the AI saves what it learns about each customer during conversations.
                  </p>
                </div>
                {profiles.length === 0 ? (
                  <p className="p-8 text-center text-sm" style={{ color: "#1B171460" }}>No customer profiles yet. They appear after customers chat with the assistant.</p>
                ) : (
                  <div className="grid gap-px" style={{ backgroundColor: "#E8E2D9" }}>
                    {profiles.map((p) => (
                      <div key={p.id} className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-3 lg:grid-cols-6" style={{ backgroundColor: "#FBF8F2" }}>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1B171440" }}>Name</p>
                          <p className="text-sm font-medium" style={{ color: "#1B1714" }}>{p.name ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1B171440" }}>Skin type</p>
                          <p className="text-sm" style={{ color: "#1B1714" }}>{p.skinType ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1B171440" }}>Hair type</p>
                          <p className="text-sm" style={{ color: "#1B1714" }}>{p.hairType ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1B171440" }}>Concerns</p>
                          <p className="text-sm" style={{ color: "#1B1714" }}>{p.concerns ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1B171440" }}>Language</p>
                          <p className="text-sm" style={{ color: "#1B1714" }}>{p.language ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1B171440" }}>Last seen</p>
                          <p className="text-xs" style={{ color: "#1B171460" }}>{new Date(p.updatedAt).toLocaleDateString()}</p>
                        </div>
                        {p.notes && (
                          <div className="col-span-full mt-1">
                            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1B171440" }}>Notes</p>
                            <p className="text-sm" style={{ color: "#1B171480" }}>{p.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── STORE CONFIG ──────────────────────────────────────────────── */}
            {tab === "config" && (
              <form onSubmit={saveConfig} className="rounded-2xl p-6 space-y-5" style={{ backgroundColor: "#FBF8F2" }}>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#1B1714" }}>Store Configuration</h2>
                  <p className="text-sm mt-1" style={{ color: "#1B171460" }}>Changes here update what the assistant knows about your store instantly — no redeploy needed.</p>
                </div>

                {([
                  { key: "name",         label: "Store Name",              multiline: false },
                  { key: "description",  label: "Store Description",       multiline: true  },
                  { key: "location",     label: "Location / Address",      multiline: false },
                  { key: "handoffEmail", label: "Handoff Email",           multiline: false },
                  { key: "languages",    label: "Languages (JSON array)",  multiline: false, placeholder: '["Darija","French","English"]' },
                  { key: "servicesJson", label: "Products (JSON array)",   multiline: true,  placeholder: '[{"name":"...","description":"...","price":"..."}]' },
                  { key: "hoursJson",    label: "Opening Hours (JSON object)", multiline: false, placeholder: '{"Monday":"9:00-18:00","Sunday":"Closed"}' },
                  { key: "faqJson",      label: "FAQ (JSON array)",        multiline: true,  placeholder: '[{"q":"...","a":"..."}]' },
                ] as { key: keyof typeof configForm; label: string; multiline: boolean; placeholder?: string }[]).map(({ key, label, multiline, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1B171480" }}>{label}</label>
                    {multiline ? (
                      <textarea value={configForm[key]} onChange={(e) => setConfigForm((f) => ({ ...f, [key]: e.target.value }))}
                        rows={5} placeholder={placeholder}
                        className="w-full rounded-xl border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E5501E]/40 resize-y"
                        style={{ borderColor: "#D6CFC5", color: "#1B1714" }} />
                    ) : (
                      <input type="text" value={configForm[key]} onChange={(e) => setConfigForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5501E]/40"
                        style={{ borderColor: "#D6CFC5", color: "#1B1714" }} />
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={saving}
                    className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
                    style={{ backgroundColor: "#E5501E" }}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  {saveMsg && (
                    <span className="text-sm font-medium" style={{ color: saveMsg.includes("Error") ? "#dc2626" : "#16a34a" }}>{saveMsg}</span>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
