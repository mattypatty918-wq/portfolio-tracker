import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

export const description = "Portfolio CRUD — stores holdings, transactions, and watchlist as JSON files";

const DATA_DIR = join(process.env.VELLUM_WORKSPACE_DIR!, "data", "portfolio");

function ensureDir() {
  mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  const path = join(DATA_DIR, file);
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown): void {
  ensureDir();
  writeFileSync(join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// --- Holdings ---
export function GET(request: Request): Response {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource") ?? "holdings";

  if (resource === "holdings") {
    return Response.json(readJson("holdings.json", []));
  }
  if (resource === "transactions") {
    return Response.json(readJson("transactions.json", []));
  }
  if (resource === "watchlist") {
    return Response.json(readJson("watchlist.json", []));
  }
  if (resource === "snapshots") {
    return Response.json(readJson("snapshots.json", []));
  }
  return Response.json({ error: "Unknown resource" }, { status: 400 });
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource") ?? "holdings";
  const body = await request.json();

  if (resource === "holdings") {
    const holdings = readJson<any[]>("holdings.json", []);
    const existing = holdings.findIndex((h: any) => h.symbol === body.symbol && h.assetType === body.assetType);
    if (existing >= 0) {
      holdings[existing] = { ...holdings[existing], ...body, updatedAt: new Date().toISOString() };
    } else {
      holdings.push({ id: crypto.randomUUID(), ...body, createdAt: new Date().toISOString() });
    }
    writeJson("holdings.json", holdings);
    return Response.json(holdings, { status: 201 });
  }

  if (resource === "transactions") {
    const transactions = readJson<any[]>("transactions.json", []);
    const tx = { id: crypto.randomUUID(), ...body, createdAt: new Date().toISOString() };
    transactions.push(tx);
    writeJson("transactions.json", transactions);
    return Response.json(tx, { status: 201 });
  }

  if (resource === "watchlist") {
    const watchlist = readJson<any[]>("watchlist.json", []);
    if (!watchlist.find((w: any) => w.symbol === body.symbol)) {
      watchlist.push({ id: crypto.randomUUID(), ...body, addedAt: new Date().toISOString() });
    }
    writeJson("watchlist.json", watchlist);
    return Response.json(watchlist, { status: 201 });
  }

  if (resource === "snapshots") {
    const snapshots = readJson<any[]>("snapshots.json", []);
    const snap = { id: crypto.randomUUID(), ...body, recordedAt: new Date().toISOString() };
    snapshots.push(snap);
    // Keep last 365 snapshots
    if (snapshots.length > 365) snapshots.splice(0, snapshots.length - 365);
    writeJson("snapshots.json", snapshots);
    return Response.json(snap, { status: 201 });
  }

  return Response.json({ error: "Unknown resource" }, { status: 400 });
}

export async function PUT(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource") ?? "holdings";
  const id = url.searchParams.get("id");
  const body = await request.json();

  if (resource === "holdings") {
    const holdings = readJson<any[]>("holdings.json", []);
    const idx = holdings.findIndex((h: any) => h.id === id);
    if (idx < 0) return Response.json({ error: "Not found" }, { status: 404 });
    holdings[idx] = { ...holdings[idx], ...body, updatedAt: new Date().toISOString() };
    writeJson("holdings.json", holdings);
    return Response.json(holdings[idx]);
  }

  return Response.json({ error: "Unknown resource" }, { status: 400 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource") ?? "holdings";
  const id = url.searchParams.get("id");

  if (resource === "holdings") {
    const holdings = readJson<any[]>("holdings.json", []);
    const filtered = holdings.filter((h: any) => h.id !== id);
    writeJson("holdings.json", filtered);
    return Response.json({ ok: true });
  }

  if (resource === "watchlist") {
    const watchlist = readJson<any[]>("watchlist.json", []);
    const filtered = watchlist.filter((w: any) => w.id !== id);
    writeJson("watchlist.json", filtered);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Unknown resource" }, { status: 400 });
}