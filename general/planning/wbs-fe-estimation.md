# 📐 Enfoque de Estimaciones y WBS para Frontend

Este documento propone una metodología combinada para planificar y estimar proyectos Frontend, uniendo la visión funcional del PM con la perspectiva técnica del equipo de desarrollo.

---

## 🧩 1. Desglose Inicial por PM (Funcional)

- El Project Manager crea las tareas base del WBS, con foco en funcionalidades.
- Cada tarjeta debe incluir:
  - ✅ Nombre claro
  - 📄 Descripción funcional
  - 🏷️ Etiqueta CRUD (`CREATE`, `READ`, `UPDATE`, `DELETE`)
  - 📍 Asociación a una o más páginas o vistas

**Ejemplo:**
- Tarea: `Editar perfil de usuario`
- CRUD: `UPDATE`
- Página asociada: `Perfil`

---

## ⚙️ 2. Estimación Técnica por Frontend (UI/UX)

- El equipo de Frontend estima el esfuerzo **por página o vista**, agrupando tareas CRUD.
- Las tareas que comparten UI se consolidan para evitar duplicación de esfuerzo.
- Se pueden definir estimaciones por tipo de componente reutilizable (modales, formularios, tablas, etc.).

**Ejemplo:**
- Página: `Productos`
  - READ → listado de productos
  - CREATE → modal de alta
  - Estimación: `8 pts`

---

## 🔁 3. Features Compartidas (Componentes Globales)

Algunos componentes se usan en múltiples vistas. Se identifican, estiman y gestionan por separado:

### 🧱 Componentes Globales
- `Header` (logo + navegación)
- `Sidebar` de selección
- `Searcher`
- `Footer`
- `Layout base`
- `Modales genéricos`

**Ejemplo de estimación:**
- `Implementar Header responsive`: 3 pts
- `Sidebar con filtros dinámicos`: 5 pts

### 🔄 Relación con Páginas
Cada página debe aclarar si utiliza un componente global, para no duplicar esfuerzo.

| Página     | Header | Searcher | Sidebar |
|------------|--------|----------|---------|
| Home       | ✅     | ✅       | ❌      |
| Productos  | ✅     | ✅       | ✅      |
| Detalle    | ✅     | ❌       | ❌      |

---

## 🔍 4. Tareas que modifican componentes compartidos

Si una feature requiere actualizar un componente global (ej: agregar ítem al Header), se crea una **subtarea específica**, estimada aparte.

**Ejemplo:**
- Tarea: `Nuevo módulo X`
- Subtarea: `Update Header: agregar link a módulo X` → 1 pt

---

## 📊 5. Comparación de Estimaciones

Al finalizar:
- Se comparan estimaciones por **tarea funcional (PM)** vs. por **página completa (FE)**.
- Si hay desajustes relevantes, se revisan:
  - Ambigüedades en la definición de tareas
  - Reuso de componentes no contemplado
  - Falta de claridad en alcance UI

---

## ✅ Ventajas

- Enfoque dual PM/Dev que mejora precisión
- Aclara reutilización vs. desarrollo nuevo
- Fomenta planificación colaborativa y realista
- Facilita reporting y seguimiento por páginas y por tareas

---

