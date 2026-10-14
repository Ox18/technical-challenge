"use client";

import { useEffect, useState } from "react";
import { getTenants, Tenant } from "../services/clock-in.service";

export function ClockInPhoto() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantsError, setTenantsError] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    getTenants()
      .then((data) => {
        setTenants(data);
        if (data.length) setTenantId(data[0].id);
      })
      .catch((error: Error) => setTenantsError(error.message));
  }, []);

  useEffect(() => {
    if (!photo) return setPreview(null);
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  return (
    <div className="card">
      <label htmlFor="tenant">
        Company
        <select id="tenant" value={tenantId} onChange={(e) => setTenantId(e.target.value)} disabled={!tenants.length}>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      {tenantsError && <p className="result bad">{tenantsError}. Is ms-voycelink-core running?</p>}

      <label htmlFor="photo">
        Photo
        <input id="photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
      </label>
      {preview && <img className="preview" src={preview} alt="Clock-in photo" />}

      <button type="button" disabled={!photo || !tenantId}>
        Validate photo
      </button>
    </div>
  );
}
