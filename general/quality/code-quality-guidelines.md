# 🛡️ Code Quality Guidelines

Este documento define las buenas prácticas que sigo para asegurar la calidad del código en todos mis proyectos, con foco en dos herramientas clave:

- ✅ Pre-commit Hooks
- 🔁 GitHub Actions (CI/CD)

---

## ✅ Pre-commit Hooks

### 📌 ¿Qué son?

Los pre-commit hooks son scripts que se ejecutan **antes de realizar un commit**, y permiten prevenir errores simples o convenciones rotas desde el entorno local del desarrollador.

---

### 🧠 ¿Por qué los uso siempre?

- Evitan subir código mal formateado o con errores triviales
- Aumentan la consistencia entre entornos
- Reducen errores en PRs o builds
- Forzan el respeto de convenciones desde el minuto 1

---

### 🚀 Setup básico

1. Instalar el CLI:

```bash
pip install pre-commit
````

2. Crear el archivo `.pre-commit-config.yaml` en la raíz del proyecto:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-added-large-files

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
```

3. Instalar los hooks en el repo:

```bash
pre-commit install
```

---

### 🧪 Comandos útiles

```bash
pre-commit run --all-files
pre-commit clean
```

---

### 📁 Ejemplo con script local

```yaml
repos:
  - repo: local
    hooks:
      - id: prettier
        name: Run Prettier
        entry: npm run format
        language: system
        types: [javascript, typescript]
```

---

## 🔁 GitHub Actions (CI/CD)

### 📌 ¿Qué son?

GitHub Actions permite correr procesos automatizados cuando ocurre un evento en el repo, como un `push` o un `pull_request`.

---

### 🧠 ¿Por qué los uso siempre?

* Asegura que el código nuevo no rompa nada
* Valida tests, builds, typechecks o linters automáticamente
* Permite bloquear merges si fallan validaciones
* Ejecuta flujos sin depender del entorno del dev

---

### 🗂️ Estructura

Todos los workflows viven en:

```
.github/workflows/
```

Cada archivo `.yml` define un flujo distinto: `ci.yml`, `deploy.yml`, etc.

---

### 🚀 Ejemplo básico de CI (`ci.yml`)

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

---

### ⚒️ Buenas prácticas

* Usar `actions/cache` para acelerar flujos
* Mantener los workflows rápidos y segmentados
* Validar los mismos scripts que los pre-commit (ej: lint, format, test)

---

### 🧩 Combinación recomendada

| Validación  | Pre-commit | GitHub Action |
| ----------- | ---------- | ------------- |
| `eslint`    | ✅          | ✅             |
| `prettier`  | ✅          | ✅ (opcional)  |
| `typecheck` | ❌          | ✅             |
| `tests`     | ❌          | ✅             |
| `build`     | ❌          | ✅             |

---

## 📚 Recursos útiles

* [https://pre-commit.com/](https://pre-commit.com/)
* [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
* [https://github.com/pre-commit/pre-commit-hooks](https://github.com/pre-commit/pre-commit-hooks)
* [https://github.com/actions](https://github.com/actions)
