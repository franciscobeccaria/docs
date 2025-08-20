# 🧠 Planner Workflow – Resolución Técnica Paso a Paso con IA

Este documento define una metodología clara y secuencial para trabajar en tareas técnicas con ayuda de una inteligencia artificial (como Claude Code o ChatGPT), sin necesidad de agentes personalizados.

---

## 🔰 OBJETIVO DEL MÉTODO

- Organizar el proceso de resolución de tareas complejas
- Aprovechar la IA como par técnico que analiza y planifica
- Avanzar paso por paso, validando cada etapa
- Documentar el razonamiento técnico de forma reutilizable

---

## 🔹 PASO 1 — CONTEXTO Y ANÁLISIS INICIAL

📌 Usá esta plantilla para iniciar la conversación con IA:

```markdown
Estoy trabajando en una tarea técnica y quiero que me ayudes de forma estructurada.

## Contexto
[Describí el problema, error o funcionalidad]

## Qué investigué hasta ahora
[Contá qué probaste, errores encontrados, logs, etc.]

## Mi hipótesis actual
[Tu sospecha o teoría de por qué pasa]

## Objetivo final
[Qué querés lograr al resolver esto]

🎯 Quiero que actúes como un ingeniero de software senior que me ayuda a planificar. ¿Qué necesitás que aclare?
````

✅ Una vez que la IA analiza tu contexto, revisá si el análisis tiene sentido y pasá al siguiente paso.

---

## 🔹 PASO 2 — PLANIFICACIÓN DETALLADA

📌 Una vez validado el contexto, pedile a la IA:

```markdown
Gracias por el análisis anterior. Ahora necesito que actúes como **planificador**.

📌 Generá un plan detallado para abordar esta tarea:
- Paso a paso
- Dividido en partes si es complejo
- Notas sobre decisiones técnicas
- Qué no puede resolverse sin más info

🎯 No escribas código todavía. Solo quiero validar el enfoque general.
```

✅ Cuando el plan te convenza, pasá al paso siguiente. Si no, pedile ajustes o volvé al paso anterior.

---

## 🔹 PASO 3 — DIVIDIR EN TAREAS EJECUTABLES

📌 Una vez aprobado el plan, pedile a la IA:

```markdown
Dividí el plan en tareas pequeñas, claras y ejecutables.

Formato:
- [ ] Tarea 1: ...
- [ ] Tarea 2: ...
- [ ] Tarea 3: ...

Podés agruparlas por fases si es necesario.
```

✅ Elegí el orden en que vas a ejecutar las tareas.

---

## 🔹 PASO 4 — RESOLVER TODAS LAS TAREAS (una por una)

📌 Para cada tarea, usá este prompt:

```markdown
Vamos a resolver esta tarea del plan:

## Tarea
[Pegá aquí la descripción exacta de la tarea]

¿Podés escribirme el código necesario, explicarlo y ayudarme a implementarlo paso a paso si hace falta?
```

✅ Revisá el código y su explicación. Aplicalo, ajustalo o pedí mejoras.

📌 Una vez finalizada una tarea, pasá a la siguiente del plan.

🔁 Repetí este proceso hasta que **todas las tareas estén completadas**.

---

## 🔹 PASO 5 — DOCUMENTAR PATRONES / SNIPPETS (opcional)

📌 Si durante la resolución encontrás una buena práctica, patrón o regla útil, pedile a la IA:

```markdown
Detectamos una regla o patrón útil.

Quiero documentarlo como snippet técnico reutilizable.

Estructuralo así:
- 📌 Nombre del patrón o regla
- 🕒 Cuándo aplicarlo
- 🛠 Cómo se implementa
- 💻 Código de ejemplo (si aplica)
```

📥 Guardá esto en tu base de conocimientos o snippets personales.

---

## 🔁 OPCIONAL — MENÚ INTERACTIVO MANUAL

Podés usar esta estructura al final de cada paso para mantener el control del flujo:

```markdown
¿Qué querés hacer ahora?
(1) Revisar este paso
(2) Avanzar al siguiente paso
(3) Volver al paso anterior
(4) Terminar sesión
```

---

## ✅ RESUMEN DEL FLUJO COMPLETO

1. **Reunir el contexto técnico**
2. **Analizar el problema con la IA**
3. **Planificar paso a paso sin código**
4. **Dividir en tareas y resolverlas una por una**
5. **(Opcional) Documentar aprendizajes o patrones**

---

💡 *Consejo final:*
Este workflow te permite trabajar con mayor claridad, evitar improvisaciones y dejar un historial técnico valioso que podés reutilizar en el futuro o compartir con tu equipo.
