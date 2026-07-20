
## Domain context
Portfolio Tracker permite registrar posiciones de inversión (activo, cantidad, precio de compra) y calcular ganancia/pérdida consultando precios actuales vía API externa (CoinGecko).

## API externa (CoinGecko)

- No requiere API key en el tier gratuito, pero tiene rate limits (~10-30 llamadas/min). Usar intervalos de polling de 30-60s.
- Los precios se consultan por el **ID de CoinGecko** del activo (ej. `bitcoin`, `ethereum`), no por el símbolo (`BTC`, `ETH`). Mapear esto al guardar/leer posiciones.
- Manejar errores de red y rate-limiting visiblemente en la UI, nunca en silencio.

## Convenciones específicas de este dominio

- Los servicios que llaman a APIs externas van en `core/services` (nunca fetch/HttpClient directo en componentes).
- Modelos de datos financieros (posición, activo, etc.) van tipados en `shared/models`, sin `any`.
- Cálculos de ganancia/pérdida deben vivir en un servicio o utilidad pura, no dentro del template ni del componente — facilita testear la lógica de negocio.
- Usar `signal()` y `computed()` para el estado del portafolio y los totales derivados (ganancia total, distribución %), consistente con el patrón ya usado en `App`.

## Commands

ng serve                          # Levanta el servidor de desarrollo (localhost:4200)
ng build                          # Compila la app para producción
ng test                           # Corre los tests unitarios (Karma/Jasmine)
ng generate component nombre      # Genera un componente standalone
ng generate service nombre        # Genera un servicio
ng lint                           # Corre el linter (si está configurado)



## Architecture

- **Standalone components, no NgModules**: `App` (`src/app/app.ts`) is a standalone component that directly declares its `imports` (e.g. `RouterOutlet`). New components should follow this same standalone style — do not introduce `NgModule`-based patterns.
- **Signals for state**: the root component already uses `signal()` (`@angular/core`) rather than plain class fields for reactive state. Prefer signals over RxJS subjects/BehaviorSubjects for local component state.
- **App bootstrap/config**: `src/main.ts` bootstraps `App` using `appConfig` from `src/app/app.config.ts`. Application-wide providers (router, HTTP client, error listeners, etc.) are registered in `appConfig.providers`, not in a module — add new global providers there.
- **Routing**: `src/app/app.routes.ts` exports the `routes: Routes` array, currently empty, wired up via `provideRouter(routes)` in `app.config.ts`.
- **Styling**: Tailwind CSS v4 is enabled globally via `@import 'tailwindcss';` in `src/styles.css`, processed through the `@tailwindcss/postcss` plugin (`.postcssrc.json`). Component-scoped styles live in per-component `.css` files referenced via `styleUrl`.
- **TypeScript strictness**: `tsconfig.json` enables `strict`, `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, and `noPropertyAccessFromIndexSignature`. Write new code compatible with these — e.g. avoid implicit `any`, always type template bindings correctly, and access index-signature properties with bracket notation.
- **Formatting**: Prettier is configured (`.prettierrc`) with `printWidth: 100`, single quotes, and the Angular parser for `.html` files. Run through your editor's Prettier integration or `npx prettier --write .` since there's no dedicated npm script for it.

## Roadmap

- [ ] MVP: agregar posición, listar posiciones, traer precio actual, calcular ganancia/pérdida
- [ ] Persistencia en localStorage
- [ ] Polling automático de precios
- [ ] Gráfico de distribución del portafolio
- [ ] Editar/eliminar posiciones
- [ ] Múltiples portafolios
- [ ] Exportar a CSV

## Cosas a evitar

- No usar `any` (ya reforzado por `tsconfig.json`, pero recordarlo).
- No mezclar lógica de negocio en componentes de presentación.
- No introducir NgModules ni RxJS Subjects donde un `signal()` es suficiente.


## Idioma
Responde siempre en español neutro. No uses voseo (evita "tenés", "hacés", etc.) 
ni modismos regionales argentinos. Usa "tú" o "usted" según corresponda.