
# Airline Automation Framework (WDIO + Cucumber + TypeScript)

Framework de automatización de pruebas BDD para el portal web de la aerolínea, diseñado bajo patrones de arquitectura de software escalables (Page Object Model, Strategy, Chain of Responsibility, Factory, Facade, Singleton) con resolución reflexiva de elementos en el DOM.

## 🚀 Características Principales

* **Resolución de Elementos por Reflexividad:** Permite interactuar con elementos UI enviando su texto o alias literal desde Gherkin. Si el motor reflexivo no lo ubica dinámicamente en el DOM, se activa la cadena de responsabilidad delegando la búsqueda a los localizadores explícitos del Page Object.
* **Pasos Gherkin Finitos y Reutilizables:** Lenguaje ubicuo compacto que evita el crecimiento descontrolado de Step Definitions.
* **Soporte Multientorno (INT, PRE, PRO):** Inyección automática del encabezado de autenticación `Authorization2` requerida para entornos restringidos (`INT` y `PRE`).
* **Estrategia de Formulario Dinámica:** Delegación de interacciones por pantalla mediante `FormStrategyFactory`.
* **Reportes Visuales:** Integración nativa con Allure Reports.

---

## 🛠️ Requisitos Previos

* Node.js v18.x o superior
* npm v9.x o superior
* Google Chrome instalado (compatible con ChromeDriver)

---

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/airline-automation-framework.git](https://github.com/tu-usuario/airline-automation-framework.git)
   cd airline-automation-framework
   
