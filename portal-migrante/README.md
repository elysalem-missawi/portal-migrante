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

El acceso a `/office/*` usa el usuario actual guardado por `users.service.ts`.

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
npm --prefix frontend run build
```

## Render

Para el frontend desplegado, configurar:

```env
VITE_API_URL=https://portal-migrante.onrender.com
```

El frontend anade internamente `/api` cuando llama al backend.
