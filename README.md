# Reto técnico · Validar la foto de marcación

| Carpeta | Stack | Puerto | En el reto |
|---|---|---|---|
| `fe-voycelink-app` | Next.js | 3001 | **Trabajas aquí** (conectar la pantalla) |
| `ms-voycelink-core` | NestJS | 3000 | **Trabajas aquí** (crear el endpoint) |
| `ms-voycelink-ia` | FastAPI (simulado) | 8000 | Caja negra, no se modifica |

```bash
docker compose up --build
```

Abre http://localhost:3001: la pantalla ya carga las empresas y la foto, pero el botón **Validate photo** todavía no hace nada.

> Sin Docker: `docker compose up ms-voycelink-ia`, luego
> `cd ms-voycelink-core && npm i && npm run start:dev` y `cd fe-voycelink-app && npm i && npm run dev`.

---

## Tu tarea

Cuando un empleado marca su entrada, se toma una foto que se valida contra las reglas de su empresa
(audífonos, fondo, vestimenta). Tienes que construir el flujo completo:

```
fe-voycelink-app ──POST /clock-in/photo──▶ ms-voycelink-core ──POST /validate──▶ ms-voycelink-ia
 (2. conectas el botón)                       (1. creas el endpoint)                  (ya existe)
```

### 1. Backend: `POST /clock-in/photo` en `ms-voycelink-core`

Hoy el endpoint existe pero responde `501`.

- Recibe la foto como `multipart/form-data` (campo `photo`) y la empresa en el header `x-tenant-id`.
- **Validación:** solo JPEG o PNG de hasta 2 MB. Si la foto no cumple, o falta o no existe la empresa,
  responde `400` con un `message` claro.
- Busca las reglas de la empresa con `TenantsRepository` y se las envía a `ms-voycelink-ia` junto con la imagen.
- Responde `200` o `201` con:
  ```json
  { "status": "approved", "violations": [] }
  { "status": "rejected", "violations": [{ "rule": "headset_required", "reason": "No headset detected" }] }
  ```
- **Fallback:** `ms-voycelink-ia` a veces tarda o falla. Si tarda más de 5 s o responde con error, el empleado
  no puede quedarse bloqueado: responde `{ "status": "pending_review", "violations": [] }` para que la
  marcación se revise a mano.

### 2. Frontend: conectar el botón en `fe-voycelink-app`

En `src/modules/clock-in/` el botón **Validate photo** todavía no llama a nada.

- Envía la foto y la empresa seleccionada a `POST /clock-in/photo`.
- Usa una librería de manejo de requests que tú elijas e instales, por ejemplo **TanStack Query**. Hoy el
  proyecto no trae ninguna: la lista de empresas se carga con `useEffect` y puedes migrarla también.
- Muestra cada estado: enviando, aprobado, rechazado (con las reglas que no cumple), en revisión
  (`pending_review`) y el error `400` con el mensaje del backend.

No hace falta terminar todo. Nos interesa cómo priorizas y explicas tus decisiones.

### Lo que ya existe

- Back: `src/contexts/tenants/` → `TenantsRepository.findComplianceRules(tenantId)` y `GET /tenants` (las reglas están en `tenants.data.ts`).
- Back: `src/contexts/compliance/infrastructure/ia.client.ts` → `IaClient.validate(imageBase64, rules)`.
- Back: `src/contexts/clock-in/` → módulo y controller vacíos. Estructura por capas: `domain/`, `application/`, `infrastructure/`.
- Front: `src/modules/clock-in/` → pantalla con selector de empresa y carga de foto; `services/clock-in.service.ts` con `getTenants()`.

### Contrato de `ms-voycelink-ia`

```
POST http://localhost:8000/validate
X-Internal-Key: ia-internal-key

{ "image": "<base64>", "rules": { "headset_required": true, "plain_background": true } }

200 → { "compliant": false, "violations": [{ "rule": "...", "reason": "..." }], "confidence": 0.82, "model": "...", "trace_id": "..." }
```

Responde valores al azar. Puede tardar o fallar, como un proveedor real.

### Empresas de prueba

| `x-tenant-id` | Reglas |
|---|---|
| `tenant-acme` | audífonos, fondo liso, vestimenta, rostro visible |
| `tenant-globex` | fondo liso, rostro visible |

### Probar el backend con curl

```bash
curl -i -X POST http://localhost:3000/clock-in/photo \
  -H "x-tenant-id: tenant-acme" \
  -F "photo=@./samples/selfie.jpg"
```

En `samples/` hay una foto válida (`selfie.jpg`), un PNG (`selfie.png`), un archivo grande (`too-big.jpg`, 3 MB)
y un PDF (`not-an-image.pdf`).

Para forzar fallas o demoras de la IA: `FAIL_RATE=1 docker compose up` o `SLOW_RATE=1 docker compose up`.
