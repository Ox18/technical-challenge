# ms-voycelink-ia (simulado)

Compliance API simulada. **No se modifica durante el reto.**

`POST /validate` con el header `X-Internal-Key` y el body `{ "image": "<base64>", "rules": { "headset_required": true } }`.
Responde valores al azar. Con las probabilidades por defecto, 20 % de las veces tarda 8 s y 20 % devuelve 500.

| Variable | Default | Qué hace |
|---|---|---|
| `INTERNAL_API_KEY` | `ia-internal-key` | Key que exige el header `X-Internal-Key` |
| `FAIL_RATE` | `0.2` | Probabilidad de responder 500 |
| `SLOW_RATE` | `0.2` | Probabilidad de tardar `SLOW_SECONDS` |
| `SLOW_SECONDS` | `8` | Segundos de demora |
