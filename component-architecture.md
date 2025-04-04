# 🧱 React Component Architecture Guide

> Una guía para estructurar tus componentes de React de forma consistente, escalable y legible.

Esta convención propone un orden claro para escribir la lógica de tus componentes antes del `return`. Ideal para proyectos con múltiples hooks, queries, mutaciones, estados y efectos.

---

## 🔧 Estructura General

Cada bloque debe ir **en el siguiente orden**, separado con un **comentario** claro que sirva como delimitador y guía visual:

```tsx
// QueryClient
// Router
// Context
// Constants
// Refs
// States
// Effects
// Hooks
// Queries
// Mutations
// Derived States
// Functions
// Computed Variables
```

---

## 🧩 Secciones Detalladas

### 1. `// QueryClient`
Usá esta sección si usás `react-query` para acceder al `queryClient` global y manejar el cache de forma manual.

```tsx
// QueryClient
const queryClient = useQueryClient();
```

---

### 2. `// Router`
Incluí `useRouter` si necesitás acceder a rutas, parámetros, redireccionar, etc.

```tsx
// Router
const router = useRouter();
```

---

### 3. `// Context`
Aquí van los valores que obtenés desde `React.Context`.

```tsx
// Context
const { userDatabaseId } = useContext(UserContext);
```

---

### 4. `// Constants`
Variables que no cambian durante el ciclo de vida del componente.

```tsx
// Constants
const ITEMS_PER_PAGE = 10;
```

---

### 5. `// Refs`
Referencias persistentes que no causan re-render.

```tsx
// Refs
const inputRef = useRef();
```

---

### 6. `// States`
Estados locales con `useState`.

```tsx
// States
const [isOpen, setIsOpen] = useState(false);
```

---

### 7. `// Effects`
`useEffect` debe agruparse en esta sección. Ideal para lógica reactiva, sincronización o efectos secundarios.

```tsx
// Effects
useEffect(() => {
  if (!editMode) setSelected(null);
}, [editMode]);
```

---

### 8. `// Hooks`
Hooks personalizados o de librerías externas (ej. `useForm`, `useDebounce`, `useInfiniteScroll`, etc.).

```tsx
// Hooks
const form = useForm();
const [scrollRef] = useInfiniteScroll(...);
```

---

### 9. `// Queries`
Peticiones de datos con `useQuery`.

```tsx
// Queries
const { data, isLoading } = useQuery({
  queryKey: ['reports'],
  queryFn: fetchReports
});
```

---

### 10. `// Mutations`
Mutaciones con `useMutation`. Se recomienda agrupar por tipo de acción (`create`, `delete`, `update`, etc).

```tsx
// Mutations
const createReport = useMutation(...);
const deleteReport = useMutation(...);
```

---

### 11. `// Derived States`
Valores derivados de otros estados o props. Evita usar `useMemo` si no es necesario.

```tsx
// Derived States
const canEdit = visibility === 'shared' || userDatabaseId === creator.id;
```

---

### 12. `// Functions`
Handlers internos o helpers específicos del componente.

```tsx
// Functions
const handleClick = () => {
  updateTitle.mutate({ title });
};
```

---

### 13. `// Computed Variables`
Variables como `isPending`, resultado de combinar múltiples flags.

```tsx
// Computed Variables
const isPending =
  createReport.isPending ||
  deleteReport.isPending ||
  updateTitle.isPending;
```

---

## ✅ Beneficios

- 🔍 **Escaneabilidad**: encontrás rápido lo que buscás.
- 🧼 **Claridad mental**: cada bloque tiene su lugar.
- 📦 **Reutilización y mantenimiento** más fáciles.
- 🤝 **Colaboración fluida** en equipos.

---

## 🧠 Sugerencias Adicionales

- Podés incluir también:  
  - `// Memoized Values` → para `useMemo`  
  - `// Memoized Callbacks` → para `useCallback`

- Crear un snippet base o plantilla con esta estructura acelera tu flujo de trabajo.

---

## 🧪 Ejemplo Real Simplificado

```tsx
export default function MyComponent() {
  // QueryClient
  const queryClient = useQueryClient();

  // Context
  const { user } = useContext(UserContext);

  // States
  const [editMode, setEditMode] = useState(false);

  // Effects
  useEffect(() => {
    if (!editMode) console.log("Modo edición desactivado");
  }, [editMode]);

  // Queries
  const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData });

  // Mutations
  const updateItem = useMutation(...);

  // Functions
  const handleUpdate = () => {
    updateItem.mutate();
  };

  // Computed Variables
  const isPending = updateItem.isPending;

  return <div>{isPending ? "Saving..." : "Ready"}</div>;
}
```

---

## 🧪 Prompt para evaluar archivos

```
Quiero que analices un componente de React que voy a pegarte a continuación.

Tengo una convención muy clara sobre cómo debe organizarse el código antes del `return`. El orden de las secciones debe ser el siguiente, cada una separada con comentarios como `// Context`, `// Mutations`, etc.

Orden correcto:

1. // QueryClient
2. // Router
3. // Context
4. // Constants
5. // Refs
6. // States
7. // Effects
8. // Hooks
9. // Queries
10. // Mutations
11. // Derived States
12. // Functions
13. // Computed Variables

Tu tarea es:

- Verificar si este componente cumple ese orden.
- Detectar si hay secciones mezcladas o mal ubicadas.
- Sugerirme cambios puntuales para mejorarlo si es necesario.
- Opcional: sugerir cómo refactorizar si es demasiado largo o repetitivo.

Por favor, no resumas el componente, solo analizá la estructura.

A continuación te paso el archivo:
```
