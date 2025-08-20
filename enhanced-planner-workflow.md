# 🧠 Enhanced Planner Workflow — Resolución Técnica con IA + Figma + Jira

Este workflow te guía paso a paso para resolver tareas de interfaz (UI) y frontend con la ayuda de IA, combinando herramientas como Jira, Figma, imágenes, CSS autogenerado, componentes ya existentes y procesos manuales complementarios.

---

## 🧩 PASO 1 — Revisión inicial desde Jira

### ✅ Objetivo:
Entender el alcance funcional y visual de la tarea.

### 🧪 Acción:
- Leé el **ticket de Jira** y copiá la descripción técnica/funcional.
- Si hay links a Figma, abrilos y mantenelos a mano.
- Si ya existen tareas relacionadas (históricas o similares), tomá nota.

---

## 🖼️ PASO 2 — Recolección de diseño (Figma)

### ✅ Objetivo:
Obtener los elementos visuales como input para la IA.

### 🧪 Acción:
- Descargá como imagen (PNG/JPG) **las pantallas o secciones relevantes**.
- Copiá el **CSS autogenerado** de Figma si está disponible.
- Identificá los componentes de diseño y registralos.

📌 **Tips útiles:**
- Podés usar la opción “Copy as PNG” directamente en Figma.
- Si hay muchas pantallas similares, seleccioná solo las variantes clave.

---

## 🧩 PASO 3 — Preparar contexto para la IA

📌 Usá este bloque como prompt inicial para Claude/ChatGPT:

```markdown
Estoy trabajando en una tarea de UI/Frontend.

### Contexto desde Jira
[Pegá la descripción funcional de Jira]

### Pantallas de Figma
[Subí las imágenes como adjuntos o explicá qué muestran]

### CSS autogenerado (si aplica)
[Pegá el CSS o clases relevantes]

### Componentes reutilizados
- El input que se ve en Figma se llama `DateSelector` en el proyecto.
- El botón principal es el mismo que `PrimaryButton`.
- [Agregá más si aplica]

### Similitudes
- Esta pantalla es casi igual a la de “Editar usuario”, cambia solo el header y un par de campos.

🎯 Quiero que me ayudes a estructurar un plan para crear esta vista o vistas, reutilizando componentes cuando sea posible.
Preguntame lo que necesites para entender bien la tarea antes de planificar.
````

---

## 🧱 PASO 4 — Generación del plan (IA)

### ✅ Objetivo:

Obtener un plan de implementación paso a paso sin código aún.

### 🧪 Prompt sugerido:

```markdown
Ahora generá un plan paso a paso para implementar esta tarea de UI.

- Indicá si se pueden reutilizar vistas o componentes.
- Dividilo por secciones si hay múltiples partes.
- No escribas código aún, solo organizá la implementación.

🎯 Una vez listo el plan, dividilo en tareas tipo checklist.
```

---

## 🧩 PASO 5 — Revisión y ajustes manuales

### ✅ Objetivo:

Resolver posibles bloqueos técnicos fuera del alcance de la IA.

### 📌 Acciones posibles:

* Descargar e instalar íconos manualmente (ej: desde Heroicons, Phosphor, etc.).
* Mapear manualmente componentes usados (si hay diferencias entre nombre visual y real).
* Ajustar el diseño si la implementación requiere cambios estructurales.

---

## 🧩 PASO 6 — Implementación con IA

### ✅ Objetivo:

Resolver todas las tareas una por una, hasta completar la vista.

📌 Prompt repetible por tarea:

```markdown
Vamos a resolver esta tarea del plan:

## Tarea
[Descripción exacta]

¿Podés escribirme el código necesario, explicarlo y ayudarme a implementarlo paso a paso?
```

🔁 Repetir hasta completar toda la lista de tareas.

---

## 🧩 PASO 7 — Documentar aprendizajes (opcional)

Si detectás patrones útiles o decisiones técnicas relevantes, documentalos:

```markdown
Quiero guardar este aprendizaje como snippet técnico:

- 📌 Nombre del patrón
- 🕒 Cuándo aplicarlo
- 🛠 Cómo se implementa
- 💻 Código de ejemplo (si aplica)
```

Guardalo en tu sistema de snippets o base de conocimientos.

---

## ✅ RESUMEN DEL FLUJO

1. 📋 Leer el ticket en Jira
2. 🎨 Obtener pantallas y CSS desde Figma
3. 🧠 Preparar el contexto para la IA
4. 🧱 Recibir un plan paso a paso
5. 🔧 Realizar acciones manuales necesarias
6. 💻 Implementar tarea por tarea con IA
7. 📘 Documentar patrones si aplica

---

💡 *Tip extra:* Este flujo puede complementarse con tu propio repositorio de snippets, decisiones técnicas y estándares visuales. Ideal para escalar diseño e implementación de forma consistente.

¿Querés que te lo genere como archivo `.md` para guardar o cargar directamente en Claude Code o tu editor de preferencia? Puedo preparártelo ahora.
```
