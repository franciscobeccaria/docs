# Git Commit Guidelines

## Estructura del mensaje de commit

```
<type>: <description>

<body>

<footer>
```

### Componentes del mensaje

#### 1. **Type** (obligatorio)
Define el tipo de cambio realizado:

- `feat`: Nueva funcionalidad para el usuario
- `fix`: Corrección de bug
- `refactor`: Cambio de código que no agrega funcionalidad ni corrige bugs
- `style`: Cambios de formato (espacios, comas, etc. No afecta la lógica)
- `docs`: Cambios solo en documentación
- `test`: Agregar o modificar tests
- `chore`: Cambios en build, herramientas auxiliares, etc.

#### 2. **Description** (obligatorio)
- Máximo 50 caracteres
- Inicia con minúscula
- No termina con punto
- Describe QUÉ hace el cambio, no CÓMO

**Ejemplos buenos:**
- `add back button to paperless settings`
- `fix typo in terms modal text`
- `refactor statements list with LinkList component`

**Ejemplos malos:**
- `Added a back button` (tiempo pasado)
- `Fix bug` (muy vago)
- `Update page.js` (no dice qué cambió)

#### 3. **Body** (opcional pero recomendado)
- Separado por línea vacía del subject
- Máximo 72 caracteres por línea
- Explica el QUÉ y POR QUÉ, no el cómo
- Usa bullets (`-`) para listar cambios múltiples
- **Máximo 100 caracteres por bullet point**

#### 4. **Footer** (opcional)
- Referencias a issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

## Formato para cambios múltiples

Cuando hay cambios en varios archivos, estructura el body así:

```
file-name.js:
- change description (max 100 chars)
- another change description (max 100 chars)

another-file.js:
- change description (max 100 chars)
```

## Ejemplos de commits bien estructurados

### Ejemplo 1: Commit simple
```
fix: correct typo in user welcome message
```

### Ejemplo 2: Commit con múltiples cambios
```
feat: enhance LinkList component with variants and custom styling

components/LinkList.js:
- add 'minimal' variant for simple lists without background/shadow
- add containerClassName prop to customize container styles
- support both outline and solid chevron icons based on variant

paperless-settings/account/terms-modal.js:
- refactor: replace manual menu with LinkList component (minimal variant)
- fix typo: 'Plase' → 'Please' in review text

components/page.js:
- update LinkList documentation with new props and variants
```

### Ejemplo 3: Commit de refactor
```
refactor: consolidate duplicate button logic into reusable component

src/components/ActionButton.js:
- create reusable ActionButton component with variant support
- support primary, secondary, and danger variants

src/pages/settings/page.js:
- replace duplicate button implementations with ActionButton
- maintain existing styling and behavior

Reduces code duplication and improves maintainability
```

## Reglas importantes

### ✅ Hacer
- Usar tiempo presente imperativo ("add", "fix", "refactor")
- Ser específico sobre QUÉ cambió
- Agrupar cambios relacionados en un solo commit
- Explicar el POR QUÉ en el body cuando sea necesario
- Mantener líneas cortas (50 chars título, 72 chars body)
- Un commit por "feature" o "fix" lógico

### ❌ Evitar
- Commits muy grandes con cambios no relacionados
- Mensajes vagos ("fix bug", "update code")
- Tiempo pasado ("added", "fixed")
- Descripciones que explican el CÓMO en lugar del QUÉ
- Commits con typos o formateo inconsistente
- Mezclar features, fixes y refactors en un solo commit

## Reglas específicas para Claude Code

### ❌ NO incluir en commits cuando uses Claude Code:
- **Líneas de generación automática**: `🤖 Generated with [Claude Code](https://claude.ai/code)`
- **Co-autor automático**: `Co-Authored-By: Claude <noreply@anthropic.com>`
- **Cualquier referencia automática** a herramientas de IA en el mensaje de commit

**Importante**: Los commits deben reflejar únicamente el cambio técnico realizado, sin metadatos sobre las herramientas utilizadas para generarlo. Claude Code es una herramienta de desarrollo, no parte del historial del proyecto.

## Flujo recomendado

1. **Hacer cambios relacionados**: Agrupa modificaciones que tienen sentido juntas
2. **Revisar cambios**: `git diff` antes de commitear
3. **Stagear archivos**: `git add` solo los archivos relacionados
4. **Escribir mensaje**: Seguir la estructura definida
5. **Review**: Verificar que el mensaje explica claramente el cambio
6. **Commit**: `git commit` con mensaje bien estructurado

## Comandos útiles

```bash
# Ver cambios antes de commit
git diff --cached

# Commit con mensaje multilínea
git commit -m "title" -m "body line 1" -m "body line 2"

# Usar heredoc para mensajes largos
git commit -m "$(cat <<'EOF'
feat: title here

body line 1
body line 2
EOF
)"
```

---

*Última actualización: Basado en convenciones de Conventional Commits y mejores prácticas del equipo.*
