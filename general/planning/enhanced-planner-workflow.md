# 🧠 Enhanced Planner Workflow — Resolución técnica de UI con IA + Figma + Jira

Este flujo está diseñado para resolver tareas de UI/Frontend de forma ordenada, reutilizable y asistida por IA, basándose en contexto real de diseño (Figma), funcional (Jira) y técnico (componentes existentes).

⚠️ **Este workflow está optimizado para trabajar una pantalla por vez. No se recomienda usarlo para flujos completos o múltiples vistas en simultáneo, ya que los resultados suelen ser inconsistentes o de menor calidad.**

---

## 🔰 OBJETIVO

- Entender la tarea a fondo antes de tocar código.
- Integrar el contexto visual, técnico y funcional.
- Planificar primero, implementar después.
- Forzar validaciones paso a paso (IA no puede avanzar sin permiso).

---

## 🔹 PASO 1 — RECOLECCIÓN DE CONTEXTO (bloqueante)

🎯 Objetivo: reunir toda la información necesaria antes de planificar.

📌 **La IA debe hacer estas preguntas una por una**. No puede avanzar hasta completar todas:

1. **Contexto desde Jira**
   - ¿Podés pegar la descripción del ticket?
   - ¿Cuál es el objetivo funcional de la tarea?

2. **Pantallas de Figma**
   - ¿Tenés acceso a un link de Figma?
   - ¿Podés subir imágenes o describir las pantallas?

3. **CSS autogenerado de Figma (si aplica)**
   - ¿Tenés el CSS generado por Figma?
   - ¿Querés incluirlo para que lo tenga como referencia?

4. **Componentes reutilizados**
   - ¿Hay componentes ya creados que correspondan a elementos del diseño?
   - ¿Podés decirme cómo se llaman? (ej: "input ➝ DateSelector")

5. **Similitudes**
   - ¿Esta pantalla es parecida a alguna ya existente?
   - ¿Se puede aprovechar código anterior?

📦 Una vez completado, la IA debe mostrar algo así:

```markdown
## Contexto funcional (Jira)
...

## Visuales (Figma)
...

## CSS generado
...

## Componentes reutilizables
- Input de fecha ➝ `DateSelector`
- Botón primario ➝ `PrimaryButton`

## Similitudes
- Es casi igual a la pantalla de "Editar usuario"
````

✅ Preguntar al final:

> “¿Querés avanzar al paso de planificación técnica o querés editar el contexto?”

Opciones:

* (1) Continuar al Paso 2
* (2) Editar el contexto
* (3) Cancelar sesión

---

## 🔹 PASO 2 — PLANIFICACIÓN DE IMPLEMENTACIÓN

🎯 Objetivo: obtener un plan estructurado, paso a paso, **sin código todavía**.

📌 Output esperado:

* Lista progresiva de pasos
* Agrupado por secciones (si aplica)
* Notas sobre decisiones técnicas o supuestos

✅ Preguntar al final:

> “¿Querés que divida este plan en tareas ejecutables?”

Opciones:

* (1) Sí, continuar al Paso 3
* (2) Editar el plan
* (3) Volver al Paso 1
* (4) Cancelar sesión

---

## 🔹 PASO 3 — TAREAS MANUALES

🎯 Objetivo: listar todo lo que no se puede automatizar.

📋 Preguntar:

* ¿Hay íconos que hay que descargar?
* ¿Se deben instalar paquetes o fonts?
* ¿Hay pasos que no querés que la IA resuelva?

📌 Output esperado:

```markdown
### Manual Tasks
- [ ] Descargar íconos de calendario desde Heroicons
- [ ] Instalar `react-icons` vía npm
- [ ] Agregar fuente “Inter”
```

✅ Preguntar al final:

> “¿Querés que ahora lo divida todo en tareas concretas para implementación?”

Opciones:

* (1) Sí, seguir al Paso 4
* (2) Agregar más tareas manuales
* (3) Volver al paso anterior
* (4) Cancelar

---

## 🔹 PASO 4 — DIVIDIR EN TAREAS EJECUTABLES

🎯 Objetivo: convertir el plan en tareas claras para implementar.

📌 Output:

```markdown
- [ ] Crear layout base
- [ ] Agregar componente `DateSelector`
- [ ] Integrar botón `PrimaryButton`
- [ ] Aplicar estilos según Figma
```

✅ Preguntar:

> “¿Querés comenzar a resolver estas tareas una por una?”

Opciones:

* (1) Elegir tarea
* (2) Editar lista
* (3) Volver al paso anterior
* (4) Terminar sesión

---

## 🔹 PASO 5 — DOCUMENTAR PATRONES / LECCIONES (opcional)

🎯 Objetivo: guardar aprendizajes o patrones reutilizables.

📩 Preguntar:

* ¿Detectamos una buena práctica que valga la pena guardar?

🧪 Output:

```markdown
## Patrón: Mapeo visual ➝ componente real
- Cuándo: cuando el diseño no coincide con el nombre del componente
- Cómo: input en Figma ➝ `DateSelector`
- Ejemplo: se documentó en paso 1
```

✅ Preguntar:

> “¿Querés guardar esto como snippet o cerrar la sesión?”

Opciones:

* (1) Guardar
* (2) Finalizar
* (3) Volver a tareas

---

## ✅ RESUMEN DEL FLUJO

1. Recolectar todo el contexto en una sola pantalla
2. Crear un plan paso a paso sin código
3. Identificar tareas manuales
4. Dividir en tareas claras
5. Resolver una por una
6. Documentar aprendizajes si aplica

---

💡 *Recomendación importante:*
**No intentes aplicar este flujo a múltiples pantallas o flujos completos en simultáneo.** Funciona mejor cuando se aplica a una sola vista o sección por vez.
