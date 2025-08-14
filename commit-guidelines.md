# Prompt para generación de mensajes de commit

## Objetivo
Generar mensajes de commit claros, estructurados y orientados a la funcionalidad del usuario, siguiendo **Conventional Commits** y las reglas de escritura definidas. El formato debe incluir explicación funcional, resumen técnico y referencias claras a los archivos modificados.

---

## Prompt

**Contexto y objetivo**  
Quiero generar un **mensaje de commit** (o una propuesta de varios commits atómicos) a partir de un `git diff`. No traduzcas el código a texto: **explicá los cambios como si fueran features para un usuario común**, agrupando por **secciones/implementaciones**. Además, incluí **referencias claras a los archivos afectados** y (si aplica) funciones/componentes creados o modificados. El resultado debe cumplir **Conventional Commits** y mis reglas de longitud.

**Entrada**  
- `DIFF`: salida de `git diff` o `git diff --staged`.  
- (Opcional) `TICKET`, `BRANCH`, `SCOPE`.  

**Instrucciones**  
1) **Agrupá el DIFF** en 3–6 “Secciones/Implementaciones” coherentes (por feature/UX, o por propósito).  
2) Para cada sección, producí:
   - **Para usuarios**: qué mejora/soluciona (en lenguaje simple, sin jerga).  
   - **Nota técnica** (1 línea): qué se tocó a alto nivel (sin listar líneas).  
   - **Archivos**: lista de `ruta/archivo` con una frase de relevancia (y funciones/componentes tocados).  
3) **No describas línea por línea ni pegues código**; enfocate en impacto e intención.  
4) Entregá un **mensaje de commit “squash”** en formato **Conventional Commits** y además una **lista de commits atómicos** (uno por sección), también en formato Conventional.  
5) Señalá **riesgos**, **breaking changes**, **tests** (qué cubren) y **antes/después** de la UI (si aplica).  
6) Mantené los límites: título ≤ **50** chars (imperativo, minúscula, sin punto), body ≤ **72** chars por línea, bullets ≤ **100** chars.  
7) Priorizá **funcionalidad de usuario** en títulos; lo técnico va en body/notas.  
8) Marcá **cambios colaterales** (refactors menores, formateo) al final.  
9) **Nunca** incluyas metadatos de IA (no “Co-authored-by” de herramientas, etc.).  
10) Idioma: **español**. Si falta `DIFF`, pedímelo.

---

## Criterios de agrupación (orden de preferencia)

1. **Funcionalidad/UX** (qué percibe el usuario).  
2. **Propósito** (fix vs feature vs refactor).  
3. **Componente/pantalla** (cuando tiene sentido de revisión por archivo).

---

## Plantilla de salida

```plaintext
<type>(<scope>): <título breve y orientado a usuarios>

Secciones / Implementaciones
1) <Nombre de la sección>
   • Para usuarios: <qué mejora/impacto visible>
   • Nota técnica (1 línea): <cambio a alto nivel>
   • Archivos:
     - <ruta/archivo>: <breve relevancia; funciones/componentes tocados>
     - <ruta/archivo>: <...>

2) <Nombre de la sección>
   • Para usuarios: <...>
   • Nota técnica (1 línea): <...>
   • Archivos:
     - <ruta/archivo>: <...>

Antes / Después (si aplica)
• Antes: <1–2 bullets>
• Después: <1–2 bullets>

Riesgos y consideraciones
• <riesgos/casos borde o “N/A”>

Breaking changes
• <detalle o “N/A”>

Tests
• <qué cubren o “N/A”>

Refs
• Ticket: <TICKET o “N/A”>
• Rama: <BRANCH o “N/A”>

-- Alternativa: commits atómicos sugeridos --
1) <type>(<scope>): <título sección 1>
   - Cuerpo: <2–3 bullets orientados a usuario + 1 línea técnica>
2) <type>(<scope>): <título sección 2>
   - Cuerpo: <...>

Cambios colaterales / housekeeping
• <refactors menores/format; “N/A” si no>
````

---

## Reglas y convenciones

### Types (Conventional Commits)

* `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `perf`, `build`, `ci`.

### Título (subject)

* ≤ **50** chars, **imperativo**, **minúscula**, **sin punto**.
* Enfocado al usuario: qué puede hacer o qué mejoró.

  * ✅ `mejora gestión de presupuestos con guardado en servidor`
  * ❌ `Added API integration for budgets.`

### Body

* Líneas ≤ **72** chars; bullets con `-`, cada bullet ≤ **100** chars.
* Explicá **QUÉ y POR QUÉ**, no el **CÓMO**.
* Cuando haya múltiples cambios, **agrupar por archivo**:

  ```plaintext
  src/components/LoginButton.tsx:
  - agrega avatar y menú de usuario (perfil, ajustes, salir)
  - mejora feedback de carga en botón
  ```

### Footer

* Issues: `Closes #123`
* Breaking changes: `BREAKING CHANGE: descripción`.

### Estilo

* Imperativo: `agrega`, `corrige`, `refactoriza`.
* No mezclar features, fixes y refactors sin relación.
* Si un “squash” es inevitable, incluir **secciones claras** + **commits atómicos sugeridos**.

### Claude Code / IA

* **No** incluir líneas automáticas ni co-authoring de herramientas.
* El mensaje debe representar el cambio, no la herramienta.

---

## Checklist antes de commitear

* [ ] Título ≤ 50 chars, imperativo, orientado a usuario.
* [ ] Secciones con “Para usuarios”, “Nota técnica” y “Archivos”.
* [ ] Body: líneas ≤ 72 chars; bullets ≤ 100 chars.
* [ ] Riesgos, breaking, tests, refs (si aplica).
* [ ] Commits atómicos sugeridos listos.
* [ ] Sin metadatos de IA.
