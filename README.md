# Veterinaria San Marcos – Tienda online (React)

Tienda online y panel de administración de la **Veterinaria San Marcos** (Rancagua), desarrollada para la
asignatura **Desarrollo FullStack II (DSY1104)** de Duoc UC – Evaluación Parcial 3.

Desde la Evaluación 3 el frontend se comunica por **API REST** con dos backend Spring Boot:

| Repositorio | Responsabilidad | Puerto |
| --- | --- | --- |
| Este repositorio (React) | Interfaz, sesión y rutas por rol | 5173 |
| `veterinaria-auth` | Usuarios, login, JWT y renovación de token | 8081 |
| `veterinaria-tienda` | Categorías, productos y boletas | 8082 |

```
React ──POST /api/v1/auth/login──▶ Auth (firma el JWT)  ──▶ MySQL veterinaria_auth
  │
  └──GET/POST/PUT/DELETE /api/v1/... + "Authorization: Bearer <jwt>" ──▶ Tienda (valida el JWT) ──▶ MySQL veterinaria_tienda
```

La versión de la Evaluación 1 (HTML, CSS y JavaScript) se conserva en el repositorio
[VeterinariaGrupo5](https://github.com/Pablo-Soto-Guajardo/VeterinariaGrupo5).

## Integrantes – Grupo 5

- Pablo Esteban Soto Guajardo
- Maximiliano Andrés Mondaca Grandón
- Pascal Ignacio Pacheco Bravo

## Tecnologías

| Herramienta | Uso |
| --- | --- |
| React 19 + Vite | Framework de interfaz y empaquetador |
| React Router | Navegación SPA, rutas dinámicas y rutas protegidas |
| React Bootstrap + Bootstrap 5 | Componentes y grilla responsiva |
| Bootstrap Icons | Íconos |
| Vitest + jsdom + React Testing Library + user-event | Pruebas unitarias y de componentes |
| @vitest/coverage-v8 | Informe de cobertura |
| fetch + Spring Boot | Comunicación REST con los backend (`src/services/`) |
| Nginx sobre AWS EC2 | Publicación del build de producción y proxy hacia los backend |

> **Sobre Jasmine y Karma:** la pauta menciona Jasmine y Karma. Según la Guía 13 del curso, la institución
> autorizó reemplazarlos por Vitest y React Testing Library, que se integran con Vite. Vitest usa la misma
> sintaxis (`describe`, `it`, `expect`) y agrega `vi.fn`, `vi.spyOn` y `vi.mock` para simular dependencias.

## Cómo ejecutar

Requiere **Node.js 18 o superior** (probado en Node 18, 20 y 22). Las versiones de Vite, Vitest y jsdom se
eligieron para que el proyecto funcione también en los computadores del laboratorio, que no siempre tienen
la última versión de Node.

1. Inicia los dos backend (`veterinaria-auth` y `veterinaria-tienda`) siguiendo sus README.
2. Revisa `.env.development` (copia de `.env.example`): contiene las URL de las dos API.
3. En este proyecto:

```bash
npm install
npm run dev          # servidor de desarrollo (http://localhost:5173)
npm run build        # build de producción en dist/
npm run preview      # revisa el build localmente
npm run lint         # análisis estático con oxlint
npm test             # pruebas en modo observación
npm run test:run     # ejecuta las pruebas una vez
npm run coverage     # pruebas + informe de cobertura (coverage/index.html)
```

### Cuentas y datos de demostración

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | admin@duoc.cl | admin123 |
| Vendedor | vendedor@duoc.cl | vende123 |
| Cliente | cliente@gmail.com | cliente1 |

Las cuentas las crea el backend Auth al iniciar. Tarjetas de prueba en el checkout:
**4111 1111 1111 1111** (aprobada) y **4000 0000 0000 0002** (rechazada).

## Sesión y seguridad en el frontend

- `services/http.js` agrega `Authorization: Bearer <jwt>` a cada solicitud privada.
- El login guarda **token, refresh token y usuario en `sessionStorage`** (`utils/sesion.js`): la sesión
  sobrevive a la recarga de la página (F5) y se borra al cerrar la pestaña.
- Al recargar, `App` confirma la sesión con `GET /usuarios/me`. Si el JWT (15 min) venció, `http.js` lo
  **renueva** con `POST /auth/refresh` y repite la solicitud; si no se puede renovar, cierra la sesión.
- Cerrar sesión revoca el refresh token en el backend (`POST /auth/logout`).
- `utils/roles.js` define los **permisos por rol** y `components/layout/RutaProtegida.jsx` protege grupos de
  rutas (patrón `Navigate`/`Outlet` de la Guía 17). El menú del panel solo muestra lo que el rol puede usar.
- El frontend solo mejora la navegación: **el backend vuelve a validar el rol en cada solicitud**.

| Rol | Qué ve |
| --- | --- |
| Administrador | Tienda y panel completo: dashboard, órdenes (y cambio de estado), productos, categorías, usuarios, reportes y perfil |
| Vendedor | Solo **Productos** (lista y detalle) y **Órdenes** (lista y detalle), sin botones de crear, editar ni eliminar |
| Cliente | Solo la tienda: comprar y **Mis compras** |

## Mapa de rutas

### Tienda (públicas)

| URL | Vista |
| --- | --- |
| `/` | Home: carrusel, categorías, ofertas y destacados |
| `/productos` | Catálogo con búsqueda, filtro por categoría, solo con stock y orden |
| `/productos/:codigo` | Detalle de producto y productos relacionados |
| `/categorias` y `/categorias/:id` | Categorías y productos de una categoría |
| `/ofertas` | Productos con precio rebajado |
| `/nosotros` | Historia, misión, visión y equipo |
| `/blogs` y `/blogs/:id` | Noticias y detalle de cada artículo |
| `/contacto` | Formulario de contacto validado |
| `/registro` y `/login` | Registro de usuario e inicio de sesión |
| `/carrito` | Carrito con cantidades, total y productos sugeridos |
| `/checkout` | Datos del cliente, dirección de entrega y pago simulado |
| `/compra/exitosa/:numero` | Compra realizada y boleta (requiere sesión) |
| `/compra/error/:numero` | Pago rechazado con opción de reintentar (requiere sesión) |
| `/mis-compras` | Historial de boletas del cliente (requiere sesión) |
| `*` | Página 404 |

### Panel (Administrador; el Vendedor solo entra a productos y órdenes)

| URL | Vista |
| --- | --- |
| `/admin` | Dashboard con métricas y accesos |
| `/admin/ordenes` y `/admin/ordenes/:numero` | Órdenes y boleta |
| `/admin/productos` | Listado con búsqueda, ver, editar y eliminar |
| `/admin/productos/nuevo` | Nuevo producto |
| `/admin/productos/:codigo` y `/admin/productos/:codigo/editar` | Mostrar y editar producto |
| `/admin/productos/criticos` | Productos con stock crítico o agotado |
| `/admin/productos/reportes` | Inventario por categoría |
| `/admin/categorias`, `/nueva`, `/:id/editar` | Categorías |
| `/admin/usuarios`, `/nuevo`, `/:run`, `/:run/editar`, `/:run/compras` | Usuarios e historial de compras |
| `/admin/reportes` | Ventas totales, por categoría y productos más vendidos |
| `/admin/perfil` | Perfil del administrador |

## Estructura del proyecto

```
src/
├── App.jsx                 Estado global (carrito y sesión) y mapa de rutas
├── main.jsx                Monta App dentro de BrowserRouter
├── components/             Componentes reutilizables
│   ├── admin/              Formularios y piezas del panel
│   ├── compra/             Tabla de ítems y datos de la orden
│   ├── formularios/        FormularioUsuario y SelectorRegionComuna
│   ├── layout/             Encabezado, pie, layouts y RutaProtegida
│   └── productos/          TarjetaProducto, GrillaProductos, precio y stock
├── data/datosIniciales.js  Contenido fijo (blog, regiones, imágenes)
├── hooks/useCarga.js       Carga datos de la API con estados cargando/error
├── pages/
│   ├── tienda/             Vistas públicas
│   └── admin/              Vistas de administración
├── services/               Comunicación REST (fetch) con los backend
│   ├── http.js             Bearer, renovación del JWT y manejo de errores
│   ├── authService.js      Login, registro y cierre de sesión (Auth)
│   ├── usuarioService.js   CRUD de usuarios y perfil (Auth)
│   ├── categoriaService.js productoService.js boletaService.js  (Tienda)
├── utils/                  Sesión, roles, validaciones, carrito, precios, filtros y reportes
├── styles/tema.css         Identidad visual sobre Bootstrap
└── test/                   Configuración y ayudas de pruebas
```

Cada componente tiene una sola responsabilidad. Los datos llegan desde la API con `useEffect` (hook
`useCarga`), los formularios son **controlados** con `useState` y el estado compartido vive en `App`:
el carrito en `localStorage` y la sesión en `sessionStorage`.

Las reglas de negocio (stock, precios, códigos únicos, categorías en uso, etc.) ahora las aplica el
**backend**; el frontend muestra el mensaje que devuelve la API (por ejemplo, un `409`).

## Diseño responsivo

Se usa la grilla de React Bootstrap (`Container`, `Row`, `Col`). El catálogo muestra 1 columna en móvil, 2 desde
576 px, 3 desde 992 px y 4 desde 1200 px. El menú se contrae en un botón "Menú" bajo 992 px y el panel de
administración pasa de barra lateral a menú superior.

Revisión realizada en 375, 768, 1024 y 1440 px sobre las 37 rutas: sin desplazamiento horizontal, una sola
`h1` por página, foco visible, todas las imágenes con `alt` y todos los campos con su etiqueta.

## Pruebas y cobertura

**146 pruebas** en 27 archivos `.spec.js` / `.spec.jsx`, todas aprobadas.

| Métrica | Cobertura |
| --- | --- |
| Statements | 93,2 % |
| Branches | 88,4 % |
| Functions | 90,5 % |
| Lines | 94,0 % |

Las pruebas no necesitan los backend encendidos: `src/test/apiFalsa.js` reemplaza `fetch` (mock) por una API
en memoria que imita los dos servicios, con JWT, refresh token y permisos por rol. Se prueban, entre otros:
el envío del header Bearer, la renovación automática del token (401 → refresh → reintento), la sesión que se
mantiene al recargar, el cierre de sesión al no poder renovar, el menú del Vendedor y los accesos restringidos.
`Checkout.spec.jsx` usa además `vi.mock` sobre `boletaService`.

## Despliegue en AWS EC2 (Guía 18)

| Componente | Puerto | Acceso |
| --- | --- | --- |
| Nginx + React | 80 | Público |
| Auth | 8081 | Solo 127.0.0.1 |
| Tienda | 8082 | Solo 127.0.0.1 |
| MariaDB | 3306 | Solo local |

En el grupo de seguridad abre solo **22** (tu IP) y **80**. Los archivos de apoyo están en `deploy/`:
`veterinaria-san-marcos.nginx.conf`, `veterinaria-auth.service`, `veterinaria-tienda.service` y los
ejemplos `auth.env.example` / `tienda.env.example`.

1. **EC2**: `sudo apt update && sudo apt install -y mariadb-server openjdk-21-jre-headless nginx`
2. **Bases** (en `sudo mariadb`): crear `veterinaria_auth` y `veterinaria_tienda` con los usuarios
   `auth_app` y `tienda_app`, cada uno con permisos solo sobre su base.
3. **JAR**: en cada backend `.\mvnw.cmd clean package` y copiar con `scp` a `/tmp/veterinaria-auth.jar` y
   `/tmp/veterinaria-tienda.jar`; moverlos a `/opt/veterinaria-auth/app.jar` y `/opt/veterinaria-tienda/app.jar`.
4. **Variables**: crear `/etc/veterinaria/auth.env` y `/etc/veterinaria/tienda.env` desde los ejemplos
   (mismo `JWT_SECRET` en ambos), `sudo chmod 600 /etc/veterinaria/*.env`.
5. **systemd**: copiar los `.service` a `/etc/systemd/system/` y ejecutar
   `sudo systemctl daemon-reload && sudo systemctl enable --now veterinaria-auth veterinaria-tienda`.
6. **React**: `npm run build` (usa `.env.production`: `/api/auth-service/v1` y `/api/store-service/v1`),
   copiar `dist/` a `/var/www/veterinaria-san-marcos`.
7. **Nginx**: copiar `deploy/veterinaria-san-marcos.nginx.conf` a `/etc/nginx/sites-available/`, enlazarlo
   en `sites-enabled`, `sudo nginx -t && sudo systemctl reload nginx`.
8. **Swagger sin abrir puertos**: `ssh -i CLAVE.pem -L 18081:127.0.0.1:8081 -L 18082:127.0.0.1:8082 ubuntu@IP`
   y abrir `http://localhost:18081/swagger-ui/index.html` y `http://localhost:18082/swagger-ui/index.html`.

La regla `try_files $uri $uri/ /index.html` permite recargar rutas internas como `/productos/ME005`.

## Créditos de imágenes

Fotografías de [Unsplash](https://unsplash.com), las mismas usadas en la Evaluación 1. Si una imagen externa no
carga, se muestra la imagen local `public/img/sin-imagen.svg`.