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
- **Prioriza funcionalidad del usuario** sobre detalles técnicos
- Describe QUÉ hace el cambio, no CÓMO

**Ejemplos buenos:**
- `create security settings flows`
- `add back button to paperless settings`
- `fix typo in terms modal text`

**Ejemplos malos:**
- `Added a back button` (tiempo pasado)
- `Fix bug` (muy vago)
- `Update page.js` (no dice qué cambió)
- `implement Cancel/Update buttons and email validation` (muy técnico)

#### 3. **Body** (opcional pero recomendado)
- Separado por línea vacía del subject
- Máximo 72 caracteres por línea
- Explica el QUÉ y POR QUÉ, no el cómo
- Usa bullets (`-`) para listar cambios múltiples
- **Máximo 100 caracteres por bullet point**
- **Sé conciso**: evita detalles técnicos que se sobre-entienden

#### 4. **Footer** (opcional)
- Referencias a issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

## Principios de escritura de commits

### 🎯 **Enfoque funcional primero**
- Prioriza el impacto en la funcionalidad del usuario
- Los detalles técnicos son secundarios pero relevantes
- Pregúntate: "¿Qué puede hacer el usuario ahora que no podía antes?"

### ⚖️ **Balance técnico-funcional**
- **User-facing changes**: Enfócate en funcionalidad
- **Technical fixes**: Incluye detalles técnicos necesarios
- **Refactors**: Explica el beneficio (mantenibilidad, performance, etc.)

### 🎯 **Concisión inteligente**
- Evita sobre-explicar lo obvio
- "handle success banner" vs "implement InfoBanner success notifications"
- "create email update flow" vs "create email update page with validation and buttons"

## Formato para cambios múltiples

### Agrupación por impacto/propósito:

```
file-name.js:
- functional change description (max 100 chars)
- another functional change (max 100 chars)

technical-file.js:
- technical fix description (max 100 chars)
```

### Criterios de agrupación:
1. **Por funcionalidad**: Cambios que trabajan juntos para una feature
2. **Por tipo**: Agrupar fixes técnicos separados de features
3. **Por componente**: Cuando los cambios afectan un área específica

## Ejemplos de commits bien estructurados

### Ejemplo 1: Commit simple
```
fix: correct typo in user welcome message
```

### Ejemplo 2: Feature funcional (estilo preferido)
```
feat: create security settings flows

sprite.svg:
- fix viewBox for warning icon

security-settings/page.js:
- handle success info banner
- handle and show data provided by finished flows using url params and states

security-settings/security-email/page.js:
- create security email update flow (based on signup/update-security-settings.js)
- implement Cancel/Update buttons

security-settings/default-phone/steps/VerifyCode.js:
- refactor to support reusable props for different flows
- maintain backward compatibility with existing default-phone flow
```

### Ejemplo 3: Refactor técnico
```
refactor: consolidate duplicate verification logic

security-settings/default-phone/steps/VerifyCode.js:
- make component reusable with phoneNumber and onConfirm props
- add dynamic InfoBanner text based on call/text method

security-settings/add-phone/page.js:
- replace inline SecurityCode component with shared VerifyCode
- fix SwitchButton prop compatibility

Reduces code duplication and improves maintainability
```

### Ejemplo 4: Mixed changes
```
feat: enhance payment methods with better UX

components/LinkList.js:
- add 'minimal' variant for simple lists without background/shadow
- support both outline and solid chevron icons based on variant

payment-methods/page.js:
- replace manual menu with LinkList component
- fix navigation flow after payment completion

Improves consistency and user experience across payment flows
```

## Reglas importantes

### ✅ Hacer
- Usar tiempo presente imperativo ("add", "fix", "refactor")
- **Priorizar funcionalidad del usuario** en el título
- Ser específico sobre QUÉ cambió (funcionalmente)
- Agrupar cambios relacionados en un solo commit
- Ser conciso: evitar detalles técnicos obvios
- Explicar el POR QUÉ en el body cuando sea necesario
- Mantener líneas cortas (50 chars título, 72 chars body)
- Un commit por "feature" o "fix" lógico

### ❌ Evitar
- Commits muy grandes con cambios no relacionados
- Mensajes vagos ("fix bug", "update code")
- Tiempo pasado ("added", "fixed")
- **Sobre-explicación técnica** en títulos ("implement validation and form handling")
- Descripciones que explican el CÓMO en lugar del QUÉ
- Commits con typos o formateo inconsistente
- Mezclar features, fixes y refactors sin agrupación lógica

### 🎯 **Enfoque funcional vs. técnico**

#### Funcional (preferido para títulos):
- `create security settings flows`
- `add payment method selection`
- `fix user registration flow`

#### Técnico (usar solo cuando es el cambio principal):
- `refactor duplicate validation logic`
- `fix viewBox dimensions in warning icon`
- `update component props for compatibility`

#### Cuándo ser conciso vs. detallado:
- **Conciso**: Cambios auto-explicativos o estándar
- **Detallado**: Refactors complejos, fixes no obvios, breaking changes

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
   - Título orientado a funcionalidad
   - Body conciso con agrupación lógica
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
feat: create security settings flows

security-settings/page.js:
- handle success info banner
- handle and show data provided by finished flows
EOF
)"
```

---

*Última actualización: Incorpora principios de enfoque funcional y concisión basados en mejores prácticas del equipo.*
