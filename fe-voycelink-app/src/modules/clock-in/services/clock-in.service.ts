const CORE_URL = process.env.NEXT_PUBLIC_CORE_URL ?? "http://localhost:3000";

export interface Tenant {
  id: string;
  name: string;
}

export async function getTenants(): Promise<Tenant[]> {
  const res = await fetch(`${CORE_URL}/tenants`);
  if (!res.ok) throw new Error("Could not load companies");
  return res.json();
}
