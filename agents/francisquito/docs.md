# 👨‍💻 Francisquito Agent – Reglas de Código Frontend

ChatGPT conversation: https://chatgpt.com/c/689cf7f0-2c38-8323-ac0d-00dadbf46861

Francisquito Agent es un conjunto de **reglas personales de código** aplicadas a proyectos **React/Next.js** para mantener **consistencia, claridad y simplicidad**.  
Estas guías están diseñadas para trabajar en conjunto con herramientas de IA (Claude Code, Windsurf, ChatGPT) y con linters (ESLint + Prettier).  

El objetivo es **escribir el menor código posible**, **mantener legibilidad**, y evitar **ruido innecesario** en los proyectos.

---

## 📜 Reglas

### 1️⃣ No dejar espacios en blanco al inicio o final en atributos

**Descripción:**  
En atributos como `className`, `id`, `alt`, etc., no dejar espacios al inicio ni al final.

**Ejemplo ❌ Incorrecto:**
```jsx
<div className=" bg-white border">Contenido</div>
````

**Ejemplo ✅ Correcto:**

```jsx
<div className="bg-white border">Contenido</div>
```

**Motivo:**

* Mantiene el HTML/JSX limpio y uniforme.
* Evita problemas con estilos (especialmente con Tailwind).

**ESLint/Prettier:**

* `no-multi-spaces`
* `no-trailing-spaces`
* Prettier: `trimTrailingWhitespace: true`

---

### 2️⃣ Uso obligatorio de `<Link>` en Next.js para navegación interna

**Descripción:**
Nunca usar `router.push` o `window.location.href` para rutas internas conocidas.
Siempre usar `<Link>` salvo casos especiales (redirecciones programáticas, login, enlaces externos).

**Ejemplo ❌ Incorrecto:**

```jsx
<button onClick={() => router.push('/dashboard')}>Dashboard</button>
```

**Ejemplo ✅ Correcto:**

```jsx
import Link from 'next/link';

<Link href="/dashboard">Dashboard</Link>
```

**Motivo:**

* Soporta **prefetch** → mejor performance.
* Evita recargas completas (SPA).
* Más declarativo y semántico.

**ESLint:**

* `@next/next/no-html-link-for-pages`
* `no-restricted-properties` (para bloquear `router.push` en rutas simples).

---

### 3️⃣ Evitar elementos innecesarios en el DOM

**Descripción:**
No envolver con `<div>` o `<span>` innecesarios.
Si un elemento semántico (`form`, `section`, `header`, etc.) puede recibir clases, usarlas directamente.

**Ejemplo ❌ Incorrecto:**

```jsx
<form>
  <div className="form-container">{/* contenido */}</div>
</form>
```

**Ejemplo ✅ Correcto:**

```jsx
<form className="form-container">{/* contenido */}</form>
```

**Motivo:**

* Menos nodos → mejor performance.
* HTML más semántico y accesible.

---

### 4️⃣ No dejar líneas en blanco entre elementos HTML/JSX

**Descripción:**
Evitar líneas vacías entre elementos hermanos, salvo casos muy justificados de separación visual.

**Ejemplo ❌ Incorrecto:**

```jsx
<div />

<div />
```

**Ejemplo ✅ Correcto:**

```jsx
<div />
<div />
```

**Motivo:**

* Mantiene el JSX compacto.
* Evita “scroll innecesario”.

**ESLint:**

* `no-multiple-empty-lines: { max: 0 }`

---

### 5️⃣ Simplificación de URLs y eliminación de helpers innecesarios

**Descripción:**
No crear funciones helper triviales para URLs si son simples (<4 parámetros).
Usar inline con template literals.

**Ejemplo ❌ Incorrecto:**

```js
function buildUrl(step, back) {
  return `/settings?step=${step}&back=${back}`;
}
<Link href={buildUrl('email', 'home')}>Config</Link>
```

**Ejemplo ✅ Correcto:**

```jsx
<Link href={`/settings?step=email&back=home`}>Config</Link>
```

**Motivo:**

* Menos funciones triviales.
* Código más directo.

**Notas:**

* Mantener funciones solo si la URL es compleja o se reutiliza en muchos lugares.

---

### 6️⃣ No usar comentarios innecesarios

**Descripción:**
Los comentarios solo se permiten para:

* Lógica compleja.
* Casos especiales.
* Justificación de decisiones técnicas.

**Ejemplo ❌ Incorrecto:**

```js
// URL para seguridad
const url = `/settings?step=security`;
```

**Ejemplo ✅ Correcto:**

```js
const url = `/settings?step=security`;
```

**Motivo:**

* El código debe ser autoexplicativo.
* Comentarios obvios = ruido.

---

### 7️⃣ Evitar clases repetidas innecesarias (DRY con clases heredables)

**Descripción:**
Si varias clases (`text-sm`, `text-gray-700`, etc.) se repiten en hijos, aplicarlas en el padre.

**Ejemplo ❌ Incorrecto:**

```jsx
<div>
  <p className="text-sm text-gray-700">Texto</p>
  <p className="text-sm text-gray-700">Más texto</p>
</div>
```

**Ejemplo ✅ Correcto:**

```jsx
<div className="text-sm text-gray-700">
  <p>Texto</p>
  <p>Más texto</p>
</div>
```

**Motivo:**

* Código más corto.
* Evita duplicación.
* DRY aplicado a estilos.

---

### 8️⃣ No introducir variables innecesarias

**Descripción:**
No crear variables que se usan solo una vez y no mejoran la legibilidad.

**Ejemplo ❌ Incorrecto:**

```js
const url = `/settings?step=${step}`;
router.push(url);
```

**Ejemplo ✅ Correcto:**

```js
router.push(`/settings?step=${step}`);
```

**Motivo:**

* Menos líneas.
* Menos ruido.

---

### 9️⃣ No crear funciones triviales innecesarias

**Descripción:**
Evitar handlers que solo ejecutan una línea sin lógica adicional.

**Ejemplo ❌ Incorrecto:**

```js
const handleFocus = () => setValue('2014562235');
<input onFocus={handleFocus} />
```

**Ejemplo ✅ Correcto:**

```jsx
<input onFocus={() => setValue('2014562235')} />
```

**Motivo:**

* Inline no está mal si es claro.
* Funciones solo si hay reutilización o lógica adicional.

---

### 🔟 Priorizar la menor cantidad de código posible

**Descripción:**
Buscar siempre la **solución más corta y clara**.
Menos líneas = mejor, salvo que comprometa la legibilidad.

**Ejemplo:**

* Prefiere inline simple en lugar de helpers triviales.
* Evita abstraer de más.

**Motivo:**

* Filosofía **KISS** y **DRY**.
* Reduce mantenimiento.

---

### 1️⃣1️⃣ Usar desestructuración cuando sea beneficioso

**Descripción:**
Usar desestructuración en objetos/arrays para reducir repetición y hacer el código más claro.

**Ejemplo ❌ Incorrecto:**

```js
const persona = props.persona;
const platform = props.platform;
```

**Ejemplo ✅ Correcto:**

```js
const { persona, platform } = props;
```

**Motivo:**

* Menos repetición.
* Estilo moderno de JS.

**Nota:**

* No aplicar si solo se usa **una propiedad**.

---

### 1️⃣2️⃣ Usar nombres de variables claros y consistentes

**Descripción:**
Los nombres deben ser **semánticos, autoexplicativos y consistentes**.

**Buenas prácticas:**

* Booleanos → `is`, `has`, `can`, `should`.
* Listas → plural (`users`, `products`).
* Funciones → verbo descriptivo (`handleClick`, `getUserData`).
* Props → predecibles (`isDisabled` mejor que `disabledState`).

**Ejemplo ❌ Incorrecto:**

```js
const activeButton = true;
```

**Ejemplo ✅ Correcto:**

```js
const isActive = true;
```

---

### 1️⃣3️⃣ No duplicar estado derivado en React

**Descripción:**
No crear `useState` para valores que pueden derivarse de otro estado o prop.

**Ejemplo ❌ Incorrecto:**

```js
const [contactValue, setContactValue] = useState('');
const [activeButton, setActiveButton] = useState(false);

useEffect(() => {
  setActiveButton(contactValue.trim() !== '');
}, [contactValue]);
```

**Ejemplo ✅ Correcto:**

```js
const [contactValue, setContactValue] = useState('');
const isActiveButton = contactValue.trim() !== '';
```

**Motivo:**

* Evita duplicación.
* Menos riesgo de inconsistencias.

---

### 1️⃣4️⃣ Condensar condicionales simples y usar variables temporales solo si se reutilizan

**Descripción:**

* Condicionales de una sola línea → compactar.
* Variables temporales → solo si se usan varias veces.

**Ejemplo ❌ Incorrecto:**

```js
useEffect(() => {
  const emailParam = searchParams.get('email');
  if (emailParam) {
    setNewEmail(anonymizeEmail(emailParam));
  } else if (persona?.email) {
    setNewEmail(anonymizeEmail(persona?.email));
  }
}, [searchParams, persona?.email]);
```

**Ejemplo ✅ Correcto:**

```js
useEffect(() => {
  const emailParam = searchParams.get('email');
  if (emailParam) setNewEmail(anonymizeEmail(emailParam));
  else if (persona?.email) setNewEmail(anonymizeEmail(persona?.email));
}, [searchParams, persona?.email]);
```

**Motivo:**

* Código más compacto.
* Claridad mantenida.
* Variables temporales solo cuando ahorran repetición.

---

### 1️⃣5️⃣ Aplicar DRY a llamadas de funciones (NEW)

**Descripción:**  
Extraer llamadas repetidas a funciones/métodos/APIs dentro del mismo scope.  
Si la misma expresión se usa varias veces, guardarla en una variable.

**Ejemplo ❌ Incorrecto:**

```js
const getBackUrl = () => {
  if (searchParams.get('from') === 'card-manager') return '/card-manager';
  return `/account-activity?product=credit-card${searchParams.get('number') ?
    `&number=${searchParams.get('number')}` : ''}`;
};
````

**Ejemplo ✅ Correcto:**

```js
const getBackUrl = () => {
  const cardNumber = searchParams.get('number');
  if (searchParams.get('from') === 'card-manager') return '/card-manager';
  return `/account-activity?product=credit-card${cardNumber ? `&number=${cardNumber}` : ''}`;
};
```

**Motivo:**

* **Performance**: evita llamadas redundantes.
* **Mantenibilidad**: un único punto de cambio.
* **Legibilidad**: intención más clara.
* **Debugging**: facilita la inspección.

**Aplicar a:**

* `searchParams.get()`
* `props.method()`
* Dependencias repetidas en `useState()` / `useEffect()`
* Llamadas a APIs
* Cálculos complejos
* Acceso a propiedades de objetos (ej: `user.profile.settings.theme`)

**Excepción:**
Si la extracción afecta negativamente la legibilidad, o si las llamadas están en ramas mutuamente excluyentes.

---

## ✅ Beneficios globales

* Código más **limpio, compacto y claro**.
* Menos riesgo de errores.
* Reglas alineadas a buenas prácticas de la industria.
* Facilita trabajar con IA (Claude, Windsurf, ChatGPT).
* Estándar consistente en todos los proyectos.
