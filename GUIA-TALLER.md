# Taller BarberFlow — Computación en la Nube (3 horas)

Guía para la sesión que impartes tú (Alejo) al grupo de verano (~40 alumnos, mezcla de IoT/Tecnologías Emergentes/DevOps, equipos de 3-4 personas, un AWS por equipo). Diseñada para que **no dependa de que tú resuelvas errores en vivo para 10-13 equipos a la vez** — ya nos topamos hoy con varios de estos problemas reales y aquí quedan resueltos de antemano.

---

## ⚠️ Antes que nada: qué SÍ se puede preparar tú (aunque los alumnos no)

Aunque los alumnos no preparan nada antes, **tú sí puedes y debes** hacer esto con anticipación — no cuenta como "trabajo de los alumnos", es infraestructura de la clase:

- [ ] Crear un **grupo en GitLab** para el curso (ej. `verano-nube-2026`) con el proyecto BarberFlow ya importado como *template* que cada equipo clona/hace fork.
- [ ] Confirmar que cada equipo tenga acceso a AWS (Academy Learner Lab, Educate, o la cuenta que estén usando) **funcionando antes de que empiece la clase** — la verificación de cuentas nuevas de AWS puede tardar horas o días, eso NO se puede resolver en el salón.
- [ ] Decidir: ¿cada equipo lanza su propia instancia EC2 el día de la clase, o ya están lanzadas de antemano? **Recomendación fuerte: lánzalas tú antes**, con Docker ya instalado (ver script de abajo). Lanzar+configurar 10-13 instancias EC2 en vivo desde cero es el paso que más tiempo real se come.
- [ ] Prueba TÚ el flujo completo una vez, de punta a punta, al menos un día antes. Si algo falla, mejor que te pase a ti primero y no en vivo frente al grupo.

### Script de bootstrap para las instancias EC2 (correr una vez, antes de clase)

Usa una AMI de **Ubuntu Server 24.04 LTS** (elegible para free tier, `t2.micro` o `t3.micro`), y en **User data** al lanzar la instancia pega esto:

```bash
#!/bin/bash
apt-get update -y
apt-get install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker
usermod -aG docker ubuntu
```

Así cada equipo recibe una IP y una llave `.pem` ya lista, sin tener que instalar nada — solo llegan y despliegan.

**Importante:** con Ubuntu, el usuario SSH por defecto es `ubuntu` (no `ec2-user` como en Amazon Linux) — el `.gitlab-ci.yml` del proyecto ya está ajustado para usar `ubuntu@$EC2_IP`. Si algún equipo termina usando Amazon Linux en vez de Ubuntu, tendría que cambiar ese usuario manualmente en su copia del pipeline.

**Security Group necesario:** abrir puertos `22` (SSH, tu IP o `0.0.0.0/0` para el taller), `8080` (la app, vía el Nginx del `docker-compose.production.yml`).

---

## Cambios ya aplicados al proyecto para la clase

Estos son ajustes que ya quedaron resueltos en el zip, producto de los problemas que tuvimos armando esto:

1. **`backend/prisma/migrations/`** — la migración inicial ya está generada a mano y commiteada. Los equipos **no necesitan correr `prisma migrate dev`** (eso requiere permisos de "shadow database" que casi nunca tienen los usuarios de MySQL en RDS/instancias compartidas). Solo corre `prisma migrate deploy`, que aplica lo que ya existe.
2. **`backend/Dockerfile`** — ya incluye `apk add openssl`, que arregla un error real de Prisma en imágenes Alpine (`Could not parse schema engine response`).
3. **`.gitlab-ci.yml`** — versión de 11 etapas (se quitó únicamente la fase de "staging" del diseño original de 12; todo lo demás — lint, tests, integración con MySQL real, cobertura, build, docker build, push, aprobación manual, smoke test — sigue igual). Cada equipo despliega directo a su única instancia EC2. Esto conserva el rigor completo del pipeline real, solo colapsando "staging" y "producción" en un mismo ambiente porque cada equipo solo tiene una máquina.
4. **`docker-compose.production.yml`** — un solo `docker compose up` levanta MySQL + backend + frontend + Nginx en una sola instancia EC2. No necesitan RDS aparte ni múltiples instancias.

---

## Agenda sugerida (180 minutos)

| Tiempo | Bloque | Qué pasa |
|---|---|---|
| 0:00 – 0:15 | **Intro** | Arquitectura de BarberFlow: por qué Docker, por qué CI/CD, qué automatiza el pipeline. Muestra el diagrama de las 12 etapas del pipeline completo (`.gitlab-ci.yml`) como "así se ve en la vida real", y explica que hoy usarán la versión de 3 etapas. |
| 0:15 – 0:30 | **Demo en vivo** (tú, no los equipos) | Corre tú tu propio equipo/pipeline una vez frente al grupo, de principio a fin, para que vean el resultado esperado antes de tocar nada. |
| 0:30 – 0:45 | **Setup de equipos** | Cada equipo: importa el proyecto a su GitLab, recibe su IP de EC2 y llave SSH (ya preparadas por ti). |
| 0:45 – 1:10 | **Configurar CI/CD Variables** | Cada equipo agrega en GitLab → Settings → CI/CD → Variables: `EC2_IP`, `EC2_SSH_PRIVATE_KEY`, `DB_ROOT_PASSWORD`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `SMTP_*` (ver checklist abajo). |
| 1:10 – 1:40 | **Primer push → primer pipeline** | Cada equipo hace un cambio trivial (ej. cambiar el nombre de la barbería en el seed, o un color) y hace push a `main`. Observan el pipeline correr en GitLab → CI/CD → Pipelines. |
| 1:40 – 2:00 | **☕ Buffer / troubleshooting** | Este bloque es intencional. Con 10-13 equipos en paralelo, algo va a fallar en al menos 2-3. Úsalo para apagar fuegos con la chuleta de abajo. |
| 2:00 – 2:30 | **Verificar el despliegue** | Cada equipo entra a `http://<su-ip>:8080`, prueba reservar una cita, revisa el panel admin. |
| 2:30 – 2:50 | **Explorar el pipeline** | Repasen juntos las 11 etapas del `.gitlab-ci.yml`: qué hace cada una, por qué existe la aprobación manual antes de tocar su servidor real, y qué cambiaría si en vez de una sola máquina tuvieran staging + producción separados (como en un proyecto real). |
| 2:50 – 3:00 | **Cierre y preguntas** | |

---

## Checklist de variables CI/CD que cada equipo debe configurar

En GitLab: **Settings → CI/CD → Variables** (marcar como *Protected* si su rama por defecto está protegida, y *Masked* para contraseñas):

| Variable | Ejemplo | Nota |
|---|---|---|
| `EC2_IP` | `54.23.111.98` | La IP pública de su instancia |
| `EC2_SSH_PRIVATE_KEY` | contenido completo del `.pem` | Pegar el archivo completo, incluyendo `-----BEGIN...-----` |
| `DB_ROOT_PASSWORD` | cualquier contraseña | Solo para el taller, no necesita ser robusta |
| `DB_USER` | `barberflow` | |
| `DB_PASSWORD` | cualquier contraseña | |
| `JWT_SECRET` | cualquier cadena larga | |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` | ver nota abajo | |
| `API_URL` | `http://<EC2_IP>:8080/api/v1` | Se usa tanto para construir el frontend como para el smoke test post-deploy |

### Sobre el correo (SMTP) para 10-13 equipos

**No repartas tu cuenta personal de Brevo.** Dos opciones razonables:
- **Simple:** que cada equipo cree su propia cuenta gratuita de Brevo (300 correos/día c/u, sin tarjeta) — toma ~3 minutos por equipo, cabe en el bloque de setup.
- **Más simple aún para el taller:** dejar `SMTP_USER`/`SMTP_PASSWORD` vacíos. El sistema sigue funcionando — las citas se crean igual, el envío de correo simplemente falla silenciosamente y queda registrado en `email_logs`. El correo no es el punto central de la clase; si el tiempo aprieta, sacrifícalo primero.

---

## 🔧 Chuleta de errores reales (ya nos pasaron todos hoy)

| Síntoma | Causa | Fix rápido |
|---|---|---|
| `Could not parse schema engine response` | Falta OpenSSL en Alpine | Ya está resuelto en el Dockerfile del proyecto que les compartas |
| `address already in use` en el puerto 3306 u 8080 | Algo más corriendo en ese puerto en el EC2 | `docker compose down` y revisar `docker ps` |
| `Authentication required` al mandar correo | Las variables SMTP están vacías o mal puestas en GitLab CI/CD Variables, no en un `.env` local | Recuerda: en producción/CI, las variables vienen de GitLab CI/CD Variables, no de ningún `.env` |
| `The table 'users' does not exist` | Faltó correr `prisma migrate deploy` o no existe la carpeta `prisma/migrations` | Ya viene resuelto — la migración está commiteada en el proyecto |
| `Could not create the shadow database` | Alguien corrió `prisma migrate dev` en vez de `migrate deploy` | Nunca usar `migrate dev` en el taller — solo `migrate deploy` |
| Pipeline se queda "pending" mucho tiempo | Cola de runners compartidos de GitLab.com con 10+ equipos corriendo a la vez | Ten un pipeline ya corrido con éxito tuyo como respaldo para mostrar si el tiempo aprieta |

---

## Plan B si el tiempo se acaba

Si a los 2:00 varios equipos siguen sin desplegar, no fuerces que todos lleguen a producción — cambia el objetivo a:
1. Todos ven el pipeline correr (aunque sea el tuyo, proyectado) y entienden las 3 etapas.
2. Los equipos que sí lograron desplegar hacen una demo rápida de 1 minuto cada uno.
3. Cierra con la comparación conceptual del pipeline de 3 etapas vs. el de 12 etapas — ese es el aprendizaje que más importa, más que el despliegue en sí mismo.
