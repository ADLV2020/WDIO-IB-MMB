# Framework de Automatización UI — Iberia MMB (WDIO + Cucumber + TypeScript)

Este repositorio contiene el framework de automatización de pruebas BDD para el portal web de la aerolínea, enfocado en el módulo de **Gestión de Reservas (Manage My Booking - MMB)**. 

El framework está diseñado con arquitectura empresarial escalable, desacoplada y mantenible, combinando un **motor de resolución reflexiva de elementos en el DOM** con los patrones de diseño: **Page Object Model (POM)**, **Screen Pattern**, **Strategy**, **Chain of Responsibility**, **Factory**, **Facade** y **Singleton**.

---

## 🚀 Características Principales

* **Motor de Reflexividad + Chain of Responsibility:** Permite interactuar con elementos UI desde los pasos en Gherkin usando su texto o alias literal. Si el motor reflexivo no ubica el elemento dinámicamente en el DOM, entra en acción la cadena de responsabilidad delegando la búsqueda a los localizadores explícitos del *Page Object*.
* **Pasos Gherkin Finitos y Reutilizables:** Definiciones de pasos genéricos que reducen la duplicación de código y simplifican la creación de nuevos escenarios.
* **Soporte Multientorno (INT, PRE, PRO):** Inyección automática de la cabecera HTTP de autenticación previa (`Authorization2`) mediante el protocolo CDP (Chrome DevTools Protocol) para entornos restringidos (`INT` y `PRE`).
* **Estrategia Dinámica de Formularios:** Mapeo de alias y manejo de interacciones delegadas por pantalla con `FormStrategyFactory`.
* **Reporte Visual con Allure:** Captura de pantalla automática ante fallos de ejecución e integración nativa con Allure Reports.

---

## 🏗️ Patrones de Diseño Aplicados

1. **Chain of Responsibility:** Maneja el flujo de resolución de elementos (`ReflexivityResolver` -> `PageObjectResolver`).
2. **Strategy & Factory:** `FormStrategyFactory` devuelve la implementación de interacción (`IFormStrategy`) apropiada para la pantalla en ejecución.
3. **Facade:** `AirlineNavigationFacade` expone métodos simplificados de alto nivel para consumo directo de las *Step Definitions*.
4. **Singleton:** `EnvironmentManager` centraliza la configuración de variables y credenciales por entorno.
5. **Page Object Model + Screen Pattern:** Separa los identificadores técnicos del DOM (`Page`) de la capa de variaciones de nombres y alias del negocio (`Screen`).

---

## 📂 Estructura del Proyecto

```text
WDIO-IB-MMB/
├── config/
│   ├── env/
│   │   ├── int.env.ts            # Configuración y secretos de INT (Excluido de Git)
│   │   ├── int.env.example.ts    # Plantilla de ejemplo para INT
│   │   ├── pre.env.ts            # Configuración de PRE (Excluido de Git)
│   │   └── pro.env.ts            # Configuración de PRO
│   └── wdio.conf.ts              # Configuración principal de WebdriverIO
├── src/
│   ├── core/
│   │   ├── chain/
│   │   │   └── ElementResolverChain.ts   # Chain of Responsibility (Reflexividad -> POM)
│   │   ├── http/
│   │   │   └── HeaderManager.ts          # Inyección de cabecera Authorization2 vía CDP
│   │   ├── reflexivity/
│   │   │   └── DOMReflexivityEngine.ts   # Buscador dinámico por texto/atributos en el DOM
│   │   └── singleton/
│   │       └── EnvironmentManager.ts     # Gestor de configuración por ambiente
│   ├── facade/
│   │   └── AirlineNavigationFacade.ts    # Orquestador principal para los Steps
│   ├── features/
│   │   └── booking/
│   │       └── gestion_reservas.feature # Escenarios Cucumber (Gherkin)
│   ├── page_objects/
│   │   ├── base/
│   │   │   ├── BasePage.ts
│   │   │   └── BaseScreen.ts
│   │   ├── home/
│   │   │   ├── HomePage.ts
│   │   │   └── HomeScreen.ts
│   │   ├── booking_management/
│   │   │   ├── BookingManagementPage.ts
│   │   │   └── BookingManagementScreen.ts
│   │   └── mmb/
│   │       ├── ManageMyBookingPage.ts
│   │       └── ManageMyBookingScreen.ts
│   ├── steps/
│   │   └── common/
│   │       └── generic.steps.ts         # Pasos Cucumber reutilizables
│   └── strategies/
│       ├── base/
│       │   ├── IFormStrategy.ts
│       │   └── DefaultFormStrategy.ts
│       └── factories/
│           └── FormStrategyFactory.ts
├── .gitignore
├── tsconfig.json
├── package.json
└── README.md
```
---

## 🛠️ Requisitos Previos

* **Node.js: v18.x o v20.x
* **npm: v9.x o v10.x
* **Google Chrome: Instalado en el sistema local

## 📦 Instalación

1. **Clona el repositorio:

```bash
git clone [https://github.com/tu-usuario/WDIO-IB-MMB.git](https://github.com/tu-usuario/WDIO-IB-MMB.git)
cd WDIO-IB-MMB
```

2. **Configura los archivos de entorno:

```text
Crea el archivo config/env/int.env.ts tomando como base config/env/int.env.example.ts e ingresa el token de autorización correspondiente.
```

3. **Instala las dependencias:

```bash
npm install
```

## 🧪 Ejecución de Pruebas

El proyecto utiliza cross-env para establecer el entorno objetivo en tiempo de ejecución:

```bash
# Ejecutar en ambiente INT (Integración)
npm run test:int

# Ejecutar en ambiente PRE (Pre-producción)
npm run test:pre

# Ejecutar en ambiente PRO (Producción)
npm run test:pro
```

---

## 📊 Reportes con Allure

Para generar y visualizar los reportes ejecutados con Allure Reports:

```bash
# Limpiar resultados y reportes anteriores
npm run report:clean

# Generar el reporte a partir de las evidencias acumuladas
npm run report:generate

# Abrir el servidor local de Allure para consultar el reporte
npm run report:open
```
---

## 📝 Ejemplo de Escenario BDD (Gherkin)

```gherkin
Feature: Gestion de Reservas general - MMB

  Scenario: Acceso a consulta de PNR en MMB sin disrupción
    Given un usuario con PNR "ABC12" y apellido "TEST"
    And se accede a "pantallaHome"
    And hace click en "Gestión de Reservas" de la pantalla "HOME"
    When ingresa "TEST" en el campo "Apellido" de la pantalla "GestionDeReservas"
    When ingresa "ABC12" en el campo "Ticket" de la pantalla "GestionDeReservas"
    When hace click en "Gestionar" de la pantalla "GestionDeReservas"
    Then se accede a la pantalla "ManageMyBooking"
    And valida el texto literal "Su Reserva para" en la pantalla "ManageMyBooking"
```

---

## 🔒 Seguridad y Buenas Prácticas

* **No Subir Secretos: Los archivos que contienen tokens de acceso (config/env/*.env.ts) están ignorados por .gitignore.

* **Seguimiento del Lockfile: El archivo package-lock.json debe ser enviado al repositorio para asegurar la reproducibilidad de versiones en pipelines de integración continua (CI/CD).

---