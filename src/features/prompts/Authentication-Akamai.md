# Guía Técnica y Prompt de Arquitectura: Autenticación Perimetral Akamai y CORS en WebdriverIO

## Contexto y Problema Resuelto
En los entornos protegidos (`INT` y `PRE`) de Iberia (`*.iberia.com`), el perímetro de **Akamai** exige autenticación mediante la cabecera HTTP personalizada **`Authorization2`**. 

Durante la navegación en la SPA (Angular/React), la aplicación realiza llamadas XHR *cross-origin* hacia subdominios de API (`int-ibisauth.iberia.com`, `int-ibisservices.iberia.com`). Por estándar web, el navegador envía previamente una petición **CORS Preflight (`OPTIONS`)** sin cabeceras de autenticación. Si se utiliza `Network.setExtraHTTPHeaders` de CDP, Chrome no adjunta la cabecera en los *preflights* ni en nuevas pestañas, provocando que Akamai responda con `401 Unauthorized` (`WWW-Authenticate: Basic realm="secure"`) o `403 Forbidden`, bloqueando las peticiones reales (`net::ERR_FAILED`).

---

## Arquitectura de la Solución Implementada
Para resolverlo de forma permanente sin afectar el rendimiento ni requerir inyecciones periódicas:
1. **Intercepción a nivel de red con CDP `Fetch`:** Se utiliza `Fetch.enable` con `requestStage: 'Request'` sobre el patrón `*://*.iberia.com/*` en lugar de `Network.setExtraHTTPHeaders`. Esto permite interceptar y modificar **todas** las peticiones salientes, incluyendo documentos, XHR y peticiones `OPTIONS` (*preflight*).
2. **Gestión multi-pestaña (`WeakSet` + `targetcreated`):** Se adjunta una sesión CDP (`CDPSession`) a todas las pestañas abiertas y se escucha el evento `targetcreated` en Puppeteer para cubrir automáticamente pop-ups o enlaces con `target="_blank"`.
3. **Desactivación de caché en CDP:** Se habilita `Network.setCacheDisabled` para evitar que Chrome reutilice respuestas `401/403` cacheadas por Akamai (`Cache-Control: max-age=420`).

---

## Prompt Reutilizable para Futuras Implementaciones o Depuración

Copia y utiliza este prompt cuando necesites replicar esta solución en otro proyecto WebdriverIO o pedirle a un asistente de IA que genere/ajuste el gestor de cabeceras:

> **Prompt:**
> "Estoy trabajando en un framework de automatización con **WebdriverIO v8 + TypeScript + Cucumber** (`puppeteer-core` disponible) que prueba una aplicación web alojada en `*.iberia.com` (entornos `INT` y `PRE`).
> 
> El entorno está protegido por **Akamai** mediante una cabecera HTTP personalizada llamada **`Authorization2`** (ej. `Authorization2: Basic <token>`). Al navegar por la aplicación, se lanzan peticiones XHR *cross-origin* hacia subdominios (`int-ibisauth.iberia.com`, `int-ibisservices.iberia.com`) que disparan peticiones **CORS Preflight (`OPTIONS`)**.
> 
> Implementa o ajusta la clase `HeaderManager` siguiendo estas reglas estrictas:
> 1. **No uses `Network.setExtraHTTPHeaders`**, ya que no inyecta cabeceras en peticiones `OPTIONS` (*preflight*). Usa el dominio **`Fetch` de Chrome DevTools Protocol (CDP)** (`Fetch.enable` y el evento `Fetch.requestPaused`) filtrando por `*://*.iberia.com/*`.
> 2. **Respeta el nombre exacto de la cabecera (`Authorization2`)** definida en la configuración del entorno (`INT_ENV` / `PRE_ENV`), sin reemplazarla por `Authorization` estándar.
> 3. **Soporte multi-pestaña:** Obtén la instancia de Puppeteer mediante `browser.getPuppeteer()`, registra el interceptor en todas las `pages()` actuales usando un `WeakSet<Page>` para evitar duplicados, y suscríbete a `puppeteerBrowser.on('targetcreated')` para cubrir nuevas pestañas.
> 4. **Caché:** Ejecuta `Network.setCacheDisabled({ cacheDisabled: true })` en cada sesión CDP para evitar falsos `401/403` cacheados por Akamai.
> 5. **Resiliencia:** Envuelve `Fetch.continueRequest` en un bloque `try/catch` silencioso para evitar excepciones si el navegador aborta una petición durante una redirección."

---

## Checklist de Verificación Rápida (Troubleshooting)
Si en el futuro vuelve a aparecer un error `401` o `403` de Akamai:
* [ ] **Variable de entorno:** Verificar que `ENV=INT` o `ENV=PRE` se está pasando correctamente en el script de ejecución (`cross-env ENV=INT ...`).
* [ ] **Token vigente:** Comprobar en `config/env/int.env.ts` que el valor de `Authorization2` no haya rotado.
* [ ] **Patrón de URL:** Confirmar que los nuevos microservicios o subdominios pertenecen a `*.iberia.com`; si usan otro dominio (ej. `*.iberiaexpress.com`), añadir el patrón en `Fetch.enable`.
* [ ] **Hooks de WDIO:** Asegurar que `HeaderManager.injectAuthHeaderIfNeeded()` se invoca en `beforeScenario` (y si se usa `browser.reloadSession()`, limpiar el estado de las páginas registradas).
