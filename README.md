# BarberFlow

Sistema de reservaciones para barberías. Aplicación full-stack con arquitectura moderna, pensada para funcionar como un producto real: los clientes reservan citas en línea sin necesidad de crear una cuenta, y el negocio administra todo desde un panel propio.

## ¿Qué hace?

- **Clientes**: reservan una cita en 5 pasos (datos personales → servicio → fecha → horario → confirmación), sin registro. Reciben un correo con un enlace único para consultar, reagendar o cancelar su cita.
- **Administrador**: gestiona servicios, horarios laborales, días festivos, clientes y el estado de cada cita desde un panel con autenticación JWT.
- **Automático**: el sistema valida disponibilidad en tiempo real (respetando horario laboral, descansos, festivos, domingos y citas ya ocupadas), envía correos automáticos en cada evento (creación, confirmación, cancelación, reagendado), y aplica reglas de negocio como ventanas mínimas para cancelar (24h) o reagendar (2h).

## Stack tecnológico

**Frontend**
- React 19 + Vite + TypeScript
- Tailwind CSS
- TanStack Query (manejo de datos del servidor)
- Zustand (estado global)
- React Hook Form + Zod (formularios y validación)
- Framer Motion

**Backend**
- NestJS + TypeScript
- Prisma ORM + MySQL 8
- JWT (autenticación de administrador)
- class-validator (DTOs y validación)
- Swagger / OpenAPI
- Nodemailer (correos transaccionales con plantillas HTML)
- Jest (pruebas unitarias e integración)

**Infraestructura**
- Docker + Docker Compose
- Nginx (proxy inverso en producción)
- GitLab CI/CD

## Estructura del proyecto

```
barberflow/
├── frontend/              React + Vite + TypeScript + Tailwind
├── backend/               NestJS + Prisma + MySQL
├── docker/nginx/          Configuración del proxy inverso
├── docker-compose.dev.yml         Entorno de desarrollo local
├── docker-compose.production.yml  Entorno de producción
└── .gitlab-ci.yml         Pipeline de CI/CD (11 etapas)
```

## Cómo correrlo en desarrollo

Requiere Docker y Docker Compose instalados.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose -f docker-compose.dev.yml up --build
```

Esto levanta MySQL, aplica las migraciones, ejecuta el seed inicial, y arranca backend y frontend en modo desarrollo (con hot reload).

- **Frontend**: http://localhost:5173
- **Backend + Swagger**: http://localhost:3000/api/docs
- **Health check**: http://localhost:3000/api/v1/health

### Acceso al panel de administrador

```
http://localhost:5173/admin/login
```

Credenciales de prueba (creadas por el seed):
```
admin@barberflow.com
Admin123!
```

## Modelo de datos

Siete entidades principales, relacionadas entre sí vía Prisma:

- `User` — administrador con acceso al panel
- `Service` — servicios ofrecidos (nombre, duración, precio)
- `Appointment` — citas, con token único de gestión para el cliente
- `BusinessHours` — horario laboral por día de la semana, con descansos configurables
- `Holiday` — días festivos bloqueados
- `Settings` — configuración general del negocio (nombre, contacto, ventanas de cancelación/reagendado)
- `EmailLog` — registro de cada correo enviado, con su estado

## Reglas de validación de reservaciones

El backend valida, tanto en la creación como en el reagendado de una cita, que no se pueda:

- Reservar fechas pasadas
- Reservar fuera del horario laboral configurado
- Reservar en horarios ya ocupados por otra cita
- Reservar domingos
- Reservar en días festivos configurados
- Reservar durante un descanso configurado
- Crear una reservación duplicada
- Cancelar con menos de 24 horas de anticipación
- Reagendar con menos de 2 horas de anticipación

Estas reglas están cubiertas por pruebas unitarias en `backend/src/modules/appointments/appointments.service.spec.ts`.

## CI/CD

El pipeline de GitLab (`.gitlab-ci.yml`) automatiza todo el ciclo: instalación de dependencias, lint, pruebas unitarias, pruebas de integración (contra una base de datos MySQL real), cobertura, build, construcción de imágenes Docker, publicación al registry, un paso de aprobación manual, despliegue por SSH (incluyendo migraciones de base de datos vía `prisma migrate deploy`), y una verificación final de salud (`smoke test`) contra el endpoint `/health`.

## Despliegue en producción

```bash
docker compose -f docker-compose.production.yml up -d
```

Requiere las variables de entorno correspondientes (ver `backend/.env.example`): credenciales de base de datos, `JWT_SECRET`, configuración SMTP, y la URL pública del frontend.