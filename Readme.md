# Sistema Web de Gestión — Proyecto Final

Aplicación tipo **SPA (Single Page Application) sin framework**, construida únicamente con **HTML5, CSS3 y JavaScript puro**, que administra usuarios, clientes, productos, ventas y proveedores mediante `localStorage`.

## 3er Avance — Semana 15 (80%)

### Estado de observaciones del 2do avance

| Ítem | Estado |
|---|---|
| Formularios | ✅ 100% |
| Aplicación de CSS | ✅ 80% |
| Aplicación de JavaScript | ✅ 50% (validaciones, manejo del DOM, CRUD básico) |
| Estructura SPA sin framework | ✅ Implementada |
| Organización de carpetas | ✅ Según diagrama del proyecto |

### CRUD básico implementado por integrante

| Integrante | Módulo | Operaciones |
|---|---|---|
| 1 | Usuarios | Registrar + Listar/Editar/Eliminar |
| 2 | Clientes | Registrar + Listar/Editar/Eliminar (+ Buscar, Contacto) |
| 3 | Productos | Registrar + Listar/Eliminar (+ Stock, Buscar) |
| 4 | Ventas | Registrar + Listar/Eliminar (+ Comprobante, Pago, Devolución, Cotización) |
| 5 | Proveedores | Registrar + Listar/Eliminar (+ Buscar, Actualizar) |

## Estructura del proyecto

```
nombre_proyecto/
│
├── styles/            Carpeta para archivos CSS (style.css)
├── scripts/           Carpeta para archivos JavaScript (util.js)
├── assets/            Carpeta para imágenes, fuentes u otros recursos
│
├── src/               Carpeta de los formularios
│   ├── modulo_usuarios/      Carpeta de los formularios del módulo Usuarios
│   ├── modulo_clientes/      Carpeta de los formularios del módulo Clientes
│   ├── modulo_productos/     Carpeta de los formularios del módulo Productos
│   ├── modulo_ventas/        Carpeta de los formularios del módulo Ventas
│   ├── modulo_proveedores/   Carpeta de los formularios del módulo Proveedores
│   ├── nav.html              Referencia del menú principal
│   ├── footer.html           Referencia del pie de página
│   └── app.html              Panel principal / bienvenida (dashboard)
│
├── index.html         Archivo HTML principal (redirige a login o al panel)
├── login.html          Acceso al sistema
├── recuperar.html       Recuperar contraseña
├── cambiar_clave.html   Cambiar contraseña
└── Readme.md            Este archivo
```

## Navegación dentro de cada módulo

Cada módulo (Usuarios, Clientes, Productos, Ventas, Proveedores) es **una sola página** con pestañas internas (`subnav`). Al ingresar a un módulo solo se muestra el formulario correspondiente; los resultados (tablas) aparecen en su propia pestaña, igual que en Usuarios. Después de cada registro hay un botón **"Ver tabla de..."** que lleva directo al listado correspondiente.

## Cambios de este avance

- Se unificó toda la navegación de formularios sueltos hacia una estructura de pestañas por módulo (igual al patrón ya usado en Usuarios).
- Se agregó el botón "Ver tabla de —" después de cada registro, edición o eliminación, en los 5 módulos.
- Se rediseñó **Productos**, **Ventas** y **Proveedores** para que compartan la misma paleta, tipografía y estilo de tarjetas/botones, manteniendo un color de acento distinto por módulo.
- En **Proveedores** se eliminó toda referencia a "Gas Natural"; el campo "Tipo de suministro" pasó a llamarse **"Categoría de Productos"** con opciones acordes al rubro del sistema (Materiales, Equipos, Tecnología, Insumos de Oficina, Otros).
- Se reorganizaron las carpetas del proyecto siguiendo el diagrama: `styles/`, `scripts/`, `assets/`, `src/` con sub-carpetas por módulo.

## Próximos pasos (4to avance — 100%)

- Validación de código con herramientas externas (W3C HTML/CSS Validator, ESLint).
- Aplicación de CSS al 100%.
- Aplicación de JavaScript al 100% (validaciones avanzadas, manejo de errores).
- Informe final en PDF.
