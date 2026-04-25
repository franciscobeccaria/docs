# Documentación Completa del Proyecto Vation Automation

## Índice

1. [Introducción](#1-introducción)
2. [Cypress y BDD: Conceptos Básicos](#2-cypress-y-bdd-conceptos-básicos)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Patrón Page Object Model (POM)](#4-patrón-page-object-model-pom)
5. [Estructura BDD en el Proyecto](#5-estructura-bdd-en-el-proyecto)
6. [Comandos Personalizados](#6-comandos-personalizados)
7. [Funcionalidades Automatizadas](#7-funcionalidades-automatizadas)
8. [Configuración y Ejecución de Pruebas](#8-configuración-y-ejecución-de-pruebas)
9. [Guía para Frontend Developers](#9-guía-para-frontend-developers)
10. [Sobre el Proyecto Vation](#10-sobre-el-proyecto-vation)

## 1. Introducción

Este proyecto de automatización está diseñado para probar la plataforma Vation Innovation, que permite a empresas investigar, conectar y colaborar en el ecosistema tecnológico. El proyecto utiliza Cypress junto con el enfoque de Behavior-Driven Development (BDD) para asegurar que todas las funcionalidades críticas de la plataforma funcionen correctamente.

## 2. Cypress y BDD: Conceptos Básicos

### ¿Qué es Cypress?

Cypress es un framework de testing moderno para aplicaciones web que permite escribir pruebas end-to-end, de integración y unitarias. A diferencia de otras herramientas como Selenium, Cypress se ejecuta directamente en el navegador, lo que proporciona una experiencia de testing más rápida y confiable.

Características principales de Cypress:
- **Ejecución en tiempo real**: Las pruebas se ejecutan dentro del navegador
- **Capturas de pantalla y videos**: Generación automática de evidencias
- **Esperas automáticas**: No necesita `sleep` o `wait` explícitos
- **Depuración sencilla**: Acceso completo a la aplicación durante las pruebas
- **Interfaz gráfica**: Visualización de pruebas en ejecución

### ¿Qué es BDD (Behavior-Driven Development)?

BDD es una metodología de desarrollo que enfoca las pruebas en el comportamiento esperado del software desde la perspectiva del usuario. En Cypress, se implementa usando el formato Gherkin con la sintaxis Given-When-Then:

- **Given**: Establece el contexto inicial (precondiciones)
- **When**: Describe la acción que se realiza
- **Then**: Especifica el resultado esperado

Ejemplo básico:
```gherkin
Feature: Login functionality

    Scenario: Login correctly
        Given I open vation website
        When I login to the application with valid credentials
        Then I should successfully be redirected to the dashboard screen
```

## 3. Estructura del Proyecto

### Estructura de Carpetas

```
vation_automation/
├── cypress/
│   ├── fixtures/         # Datos de prueba
│   ├── integration/      # Archivos de prueba
│   │   ├── BDD/          # Archivos feature y sus implementaciones
│   │   └── pageObjects/  # Objetos de página (POM)
│   ├── screenshots/      # Capturas de pantalla de fallos
│   └── support/          # Utilidades y comandos personalizados
├── cypress.config.js     # Configuración de Cypress
├── cypress.env.json      # Variables de entorno (credenciales)
├── package.json          # Dependencias del proyecto
└── README.md             # Documentación
```

### Archivos de Configuración

#### cypress.config.js
Define la configuración principal de Cypress:
- Tiempo de espera predeterminado: 10000ms
- ID del proyecto: "r5dczu"
- Desactivación de videos
- Patrón de especificaciones: "cypress/integration/BDD/*.feature"
- URL base: "https://staging-api.vationventures.com"
- Configuración del preprocesador de Cucumber

```javascript
module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  projectId: "r5dczu",
  video: false,
  screenshotOnRunFailure: false,
  retries: {
    runMode: 1, //One more run for the failed tests.
  },

  e2e: {
    setupNodeEvents,
    specPattern: "cypress/integration/BDD/*.feature",
    testIsolation: false,
    viewportWidth: 1200,
    viewportHeight: 720,
    baseUrl: "https://staging-api.vationventures.com",
    experimentalStudio: true,
  },
  downloadsFolder: "cypress/downloads",
});
```

#### cypress.env.json
Contiene variables de entorno como:
- Credenciales de usuario
- URLs de entorno (staging, beta)
- Configuración de API

## 4. Patrón Page Object Model (POM)

El proyecto utiliza el patrón Page Object Model (POM), que encapsula la interacción con elementos de la página en clases separadas. Esto mejora:

- **Mantenibilidad**: Cambios en la UI solo requieren modificaciones en un lugar
- **Reutilización**: Los métodos pueden ser usados en múltiples pruebas
- **Legibilidad**: Las pruebas son más claras y enfocadas en el comportamiento

Ejemplo de Page Object (LoginPage.js):
```javascript
class LoginPage {
  getEmailField() {
    return cy.get("input#username");
  }

  getSubmitButton() {
    return cy.get('button[name = "action"]');
  }

  getPasswordField() {
    return cy.get("input#password");
  }
}

export default LoginPage;
```

Cada página o componente de la aplicación tiene su propio archivo Page Object que contiene los selectores y métodos para interactuar con esa página específica. Algunos ejemplos en el proyecto son:

- `LoginPage.js`: Maneja la funcionalidad de inicio de sesión
- `AdminPanel.js`: Interactúa con el panel de administración
- `AssetTable.js`: Gestiona las tablas de activos
- `MyListPage.js`, `MyMatrixPage.js`, etc.: Manejan diferentes tipos de activos

## 5. Estructura BDD en el Proyecto

### Archivos Feature

Los archivos `.feature` describen el comportamiento esperado en lenguaje natural usando Gherkin:

```gherkin
Feature: Login functionality

    Scenario: Login correctly
        Given I open vation website
        When I login to the application with valid credentials
        Then I should successfully be redirected to the dashbaord screen
```

El proyecto contiene múltiples archivos feature que cubren diferentes funcionalidades:
- `Login.feature`: Pruebas de inicio de sesión
- `AdminPanel.feature`: Pruebas del panel de administración
- `MyLists.feature`, `MyMatrices.feature`, etc.: Pruebas de diferentes tipos de activos
- `Explore.feature`: Pruebas de funcionalidad de exploración
- `VationResearch.feature`: Pruebas de investigación

### Implementación de Steps

Los archivos `.js` correspondientes implementan los pasos definidos en los archivos feature:

```javascript
import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../pageObjects/LoginPage";

const loginpage = new LoginPage();
const env = Cypress.env("environment");

Given("I open vation website", function () {
  cy.visit(Cypress.env(env).url);
});

When("I login to the application with valid credentials", function () {
  loginpage.getEmailField().type(Cypress.env(env).username);
  loginpage.getSubmitButton().click();
  loginpage.getPasswordField().type(Cypress.env(env).password);
  loginpage.getSubmitButton().click();
});

Then(
  "I should successfully be redirected to the dashbaord screen",
  function () {
    cy.url().should("contain", "home");
  },
);
```

Cada paso definido en el archivo feature tiene su correspondiente implementación en JavaScript que utiliza los Page Objects para interactuar con la aplicación.

## 6. Comandos Personalizados

El proyecto define varios comandos personalizados en `cypress/support/commands.js` para facilitar tareas comunes:

### Comandos de Autenticación

- **bypassLogin**: Inicia sesión y mantiene la sesión entre pruebas
```javascript
Cypress.Commands.add(
  "bypassLogin",
  (
    name = Cypress.env(env).username,
    password = Cypress.env(env).password,
    testData = "pass",
  ) => {
    cy.session(
      [name, password],
      () => {
        cy.visit(Cypress.env(env).url);
        // Código de inicio de sesión
        cy.url().should("contain", "home");
      },
      {
        cacheAcrossSpecs: true,
      },
    );
  },
);
```

- **bypassAdminLogin**: Inicia sesión en el panel de administración

### Comandos de Selección

- **selectRandomElement**: Selecciona un elemento aleatorio de una lista
```javascript
Cypress.Commands.add(
  "selectRandomElement",
  (toBeSelectedListLocator, toBeValidatedTitleLocator) => {
    // Selecciona un elemento aleatorio y valida su título
  },
);
```

- **selectRandomIndex**: Selecciona un elemento por índice aleatorio
- **selectOpenOptions**: Selecciona opciones de un menú desplegable

### Comandos de Creación de Activos

- **createNewAsset**: Crea un nuevo activo (lista, mapa, etc.)
```javascript
Cypress.Commands.add(
  "createNewAsset",
  (assetName, note, assetType = "pass") => {
    // Crea un nuevo activo con nombre y notas
  },
);
```

- **createMultipleAssets**: Crea múltiples activos en bucle

### Comandos de API

- **selectCompany**: Selecciona una empresa mediante API
- **selectTaxonomy**: Selecciona una taxonomía mediante API
- **clearSelections**: Limpia las selecciones actuales
- **getList**, **getMatrix**, **getMarketMap**: Obtienen datos de activos mediante API

Estos comandos se pueden usar en cualquier prueba con la sintaxis `cy.nombreComando()`.

## 7. Funcionalidades Automatizadas

El proyecto automatiza las siguientes funcionalidades de la plataforma Vation:

### Autenticación
- **Login/Logout**: Autenticación de usuarios en la plataforma principal y panel de administración

### Gestión de Activos
- **Listas**: Creación, eliminación, duplicación y edición de listas
- **Reportes**: Gestión de reportes y sus contenidos
- **Matrices**: Creación y manipulación de matrices
- **Mapas de mercado**: Visualización y edición de mapas
- **Etiquetas**: Organización mediante etiquetas

### Funcionalidades de Búsqueda y Exploración
- **Menú de Selecciones**: Gestión de selecciones de empresas y taxonomías
- **Vation Research**: Búsqueda y exploración de datos
- **Búsqueda Simple**: Funcionalidad de búsqueda básica

### Administración
- **Panel de Administración**: Acceso y gestión de tablas administrativas

## 8. Configuración y Ejecución de Pruebas

### Instalación y Configuración

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Renombrar `cypress_example.env.json` a `cypress.env.json`
4. Añadir credenciales en `cypress.env.json`

### Comandos de Ejecución

- **Ejecutar todas las pruebas**: `npx cypress run --env tags="not @omit"`
- **Abrir Cypress en modo interactivo**: `node_modules/.bin/cypress open`
- **Ejecutar Cypress en modo headless**: `npm run cypress:run`

### Configuración de Entorno

El proyecto permite cambiar entre entornos modificando el archivo `cypress.env.json`:
- Para la aplicación: `staging` o `beta`
- Para el panel de administración: `staging_admin` o `beta_admin`

### Reportes de Pruebas

Después de ejecutar las pruebas, se genera un reporte detallado llamado `cucumber-report.html` que muestra:
- Resumen de pruebas ejecutadas
- Pruebas pasadas/fallidas
- Capturas de pantalla de fallos
- Tiempo de ejecución

## 9. Guía para Frontend Developers

Si eres un frontend developer con poca experiencia en testing, aquí tienes algunos consejos para trabajar con este proyecto:

### Primeros Pasos

1. **Familiarízate con Cypress**: Revisa la [documentación oficial](https://docs.cypress.io/) para entender los conceptos básicos.

2. **Entiende la estructura BDD**: Examina la relación entre los archivos `.feature` y sus implementaciones `.js`.

3. **Estudia los Page Objects**: Son la clave para entender cómo interactúa el framework con la aplicación.

### Consejos Prácticos

4. **Usa los comandos personalizados**: Evita duplicar código utilizando los comandos ya definidos en `commands.js`.

5. **Ejecuta las pruebas en modo interactivo**: Usa `cypress open` para ver las pruebas ejecutándose en tiempo real.

6. **Aprende a depurar**: Utiliza `cy.log()` para mostrar información durante la ejecución y `cy.debug()` para pausar la ejecución y depurar.

7. **Modifica pruebas existentes**: Comienza modificando pruebas existentes antes de crear nuevas para familiarizarte con el patrón.

### Errores Comunes

8. **Selectores frágiles**: Evita selectores CSS que dependan de la estructura exacta del DOM, prefiere atributos de datos o IDs.

9. **No manejar esperas**: Aunque Cypress tiene esperas automáticas, a veces necesitarás `cy.wait()` para operaciones asíncronas.

10. **Pruebas acopladas**: Cada prueba debe ser independiente y no depender del estado de otras pruebas.

## 10. Sobre el Proyecto Vation

Vation Innovation Platform es una plataforma que permite a empresas investigar, conectar y colaborar en el ecosistema tecnológico. Sus principales características incluyen:

- **Gestión de activos**: Listas, reportes, matrices y mapas para organizar información
- **Investigación y exploración**: Herramientas para descubrir y analizar tecnologías
- **Colaboración**: Funcionalidades para compartir y trabajar en equipo
- **Administración**: Panel para gestionar usuarios y contenido

El proyecto de automatización asegura que todas estas funcionalidades críticas funcionen correctamente a través de pruebas automatizadas, lo que es fundamental para garantizar la calidad y estabilidad de la plataforma a medida que evoluciona.

---

## Recursos Adicionales

- [Documentación de Cypress](https://docs.cypress.io/)
- [Cucumber y Gherkin](https://cucumber.io/docs/gherkin/)
- [Page Object Model](https://www.selenium.dev/documentation/test_design/page_object_models/)
- [BDD Testing](https://cucumber.io/docs/bdd/)
