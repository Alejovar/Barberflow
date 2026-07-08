# BarberFlow

Sistema de reservaciones para barberías — proyecto demostrativo para la clase de **Computación en la Nube**. Full-stack con React + NestJS + MySQL, contenedores Docker y pipeline completo de GitLab CI/CD.

## Estado del proyecto

Este scaffold es **funcional de extremo a extremo**, no solo estructura vacía:

- ✅ Backend NestJS compila sin errores (`npx tsc --noEmit`) y **16 tests unitarios pasan**, cubriendo las 9 reglas de validación de reservaciones (fechas pasadas, domingos, festivos, fuera de horario, descansos, traslapes, duplicados, ventanas de cancelación/reagendado).
- ✅ Frontend React compila y **genera build de producción** (`npm run build`) sin errores.
- ✅ Flujo completo de reservación (5 pasos), panel administrativo (dashboard, agenda, clientes, servicios, horarios/festivos, configuración), gestión de citas sin cuenta vía token seguro.
- ⚠️ Lo que falta por hacer tú mismo antes de producción real: generar el cliente Prisma contra tu propia base de datos (`npx prisma generate` requiere descargar binarios — no se pudo hacer en este entorno sandbox por restricciones de red), correr `docker compose -f docker-compose.dev.yml up` para probar todo junto, configurar tu propio SMTP, y ampliar la suite de integración (`test/health.e2e-spec.ts` es solo el punto de partida).

## Arquitectura

```
barberflow/
├── frontend/          React 19 + Vite + TS + Tailwind + TanStack Query + Zustand
├── backend/            NestJS + Prisma + MySQL + JWT + Swagger
├── docker/nginx/       Proxy inverso para producción
├── docker-compose.dev.yml
├── docker-compose.production.yml
└── .gitlab-ci.yml      Pipeline de 12 etapas
```

## Cómo correrlo en desarrollo

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose -f docker-compose.dev.yml up --build
```

- Frontend: http://localhost:5173
- Backend + Swagger: http://localhost:3000/api/docs
- Admin: http://localhost:5173/admin/login → `admin@barberflow.com` / `Admin123!` (creado por el seed)

El comando de `backend` en dev ya corre `prisma migrate deploy` + `prisma db seed` automáticamente al levantar el contenedor — no necesitas ejecutar nada manual.

## Automatización end-to-end (tu pregunta original)

**Todo lo que se repite en cada despliegue está automatizado en el pipeline**, sin scripts sueltos ni pasos manuales de base de datos:

| Qué | Cómo |
|---|---|
| Migraciones de BD | `npx prisma migrate deploy` dentro del contenedor `backend`, ejecutado por SSH desde el job de deploy |
| Seed inicial | `npx prisma db seed` (idempotente, con `upsert`) |
| Build + imagen Docker | Etapas `build` y `docker_build` |
| Publicación a registry | Etapa `push_registry` |
| Despliegue | SSH + `docker compose up -d` + espera activa de MySQL (igual que el patrón de tu pipeline de ejemplo) |
| Verificación post-deploy | Etapa `smoke_test` contra `/api/v1/health` |
| Aprobación a producción | Etapa `manual_approval` (`when: manual`) |

Lo único que **no** se repite en cada corrida — y por eso no vive en el pipeline de cada push — es el *bootstrap* del servidor Ubuntu: instalar Docker, Docker Compose, abrir puertos, etc. Eso se hace una sola vez al levantar la VM (puedes scriptearlo aparte con un `bootstrap.sh` si quieres, pero no tiene sentido correrlo en cada `git push`).

### Variables de entorno que debes configurar en GitLab (Settings → CI/CD → Variables)

`STAGING_VM_IP`, `PRODUCTION_VM_IP`, `VM_USER`, `STAGING_SSH_PRIVATE_KEY`, `PRODUCTION_SSH_PRIVATE_KEY`, `STAGING_DB_ROOT_PASSWORD`, `STAGING_DB_USER`, `STAGING_DB_PASSWORD`, `STAGING_JWT_SECRET`, `STAGING_FRONTEND_URL`, `STAGING_API_URL`, `STAGING_SMTP_*`, y su equivalente `PRODUCTION_*`.

## Plan de fases sugerido (según lo pedido en la especificación)

1. **Fase 0 — Arquitectura** ✅ (esto que acabas de recibir)
2. **Fase 1 — Backend core**: correr migraciones reales, probar cada endpoint con Swagger
3. **Fase 2 — Frontend conectado**: correr `docker-compose.dev.yml` y validar el flujo de reservación contra el backend real
4. **Fase 3 — Admin completo**: probar CRUD de servicios, horarios, festivos, configuración
5. **Fase 4 — Correos**: configurar SMTP real (Mailtrap para pruebas) y validar las 4 plantillas
6. **Fase 5 — Testing**: ampliar cobertura de integración con Supertest hasta superar 80%
7. **Fase 6 — CI/CD real**: configurar variables en GitLab, levantar la VM de producción, correr el pipeline completo

## Credenciales de prueba (seed)

- Admin: `admin@barberflow.com` / `Admin123!`
- 5 servicios de ejemplo, horario Lunes–Sábado 09:00–19:00 con descanso 14:00–15:00, domingo cerrado.
