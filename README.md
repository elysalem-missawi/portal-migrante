# Portal Migrante Euskadi

Plataforma digital de Zubia Social Euskadi para facilitar informacion clara, acceso a servicios, comunidad y coordinacion interna de la asociacion.

## Areas principales

- Portal publico: servicios, ayuntamientos, asociaciones, cultura vasca, contacto y pagina del proyecto.
- Comunidad: foro migrante con registro, inicio de sesion y verificacion telefonica.
- Oficina interna: espacio protegido para organizar el trabajo de la asociacion.
- Futuro crecimiento: perfiles de usuarios, entidades colaboradoras, estadisticas y herramientas de gestion.

## Primera fase de Oficina Zubia

La ruta interna empieza en:

```txt
/office
```

Y redirige a:

```txt
/office/dashboard
```

Rutas creadas:

- `/login`
- `/unauthorized`
- `/office/dashboard`
- `/office/tasks`
- `/office/meetings`
- `/office/projects`
- `/office/funding`
- `/office/documents`
- `/office/members`
- `/office/volunteers`
- `/office/finance`
- `/office/contacts`
- `/office/activities`
- `/office/reports`
- `/office/settings`

## Proteccion y roles

La aplicacion valida cualquier sesion guardada contra `GET /api/auth/me` antes de habilitar rutas protegidas. Los datos de `localStorage` nunca se consideran una autorizacion suficiente.

- Sin usuario: redireccion a `/login`.
- Usuario sin permiso: redireccion a `/unauthorized`.
- `admin` y `super_admin`: acceso completo.
- `organization_manager`: acceso limitado como perfil colaborador.
- `community_user`: sin acceso a oficina interna.

La tabla de permisos esta en:

```txt
frontend/app/services/office.service.ts
```

## Datos iniciales

La primera version usa datos mock centralizados para:

- estadisticas del panel
- tareas
- reuniones
- proyectos
- solicitudes de financiacion
- documentos

Esto permite presentar el flujo de trabajo ahora y conectar luego cada modulo al backend sin redisenar la interfaz.

## Desarrollo local

Instalar dependencias:

```bash
npm install
```

Frontend:

```bash
npm --prefix frontend run dev
```

Backend:

```bash
npm --prefix backend run dev
```

Comprobaciones usadas:

```bash
npm --prefix frontend run typecheck
npm --prefix frontend run test:unit
npm --prefix frontend run build
npm --prefix frontend run test:smoke
```

## Render

Para el frontend desplegado, configurar:

```env
VITE_API_URL=https://portal-migrante.onrender.com
VITE_ENABLE_DEMO_FALLBACK=false
```

El frontend anade internamente `/api` cuando llama al backend.
Los datos de demostracion solo se muestran si `VITE_ENABLE_DEMO_FALLBACK=true`; debe permanecer en `false` durante staging y pruebas de integracion para que cualquier fallo del API sea visible.

## Municipal demo on Render

The municipality demo is isolated from the existing production services and uses:

- Blueprint path: `render.staging.yaml`
- Git branch: `database-redesign`
- Frontend: `https://zubia-social-euskadi-demo.onrender.com`
- API: `https://zubia-social-euskadi-demo-api.onrender.com/api`
- Separate MongoDB database: required through `MONGO_URI`
- Demo account password: required through `DEMO_PASSWORD` (minimum 12 characters)

The demo initializer is idempotent. It loads Euskadi municipalities, categories, one clearly labelled demo organization with two locations and one active head office, three verified services, two publications, and separate administrator/organization-manager accounts. It never logs the password.

V1 stores the contact phone during registration but does not send or require SMS verification.
