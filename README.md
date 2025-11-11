# System Capabilities Monorepo

Monorepo para detección de capacidades del sistema del navegador y componentes UI para validación de requisitos.

## Paquetes

Este monorepo contiene tres paquetes:

### 📦 [system-capabilities](./packages/core)

[![npm version](https://img.shields.io/npm/v/system-capabilities.svg)](https://www.npmjs.com/package/system-capabilities)

Librería core para detección de capacidades del navegador y validación de requisitos. Compatible con SSR/SSG (Astro, Next.js, Nuxt, SvelteKit).

```bash
npm install system-capabilities
```

[Ver documentación completa →](./packages/core/README.md)

### 🎨 [@system-capabilities/lit](./packages/lit)

Componentes Web Components (Lit) para mostrar el estado de compatibilidad del sistema.

```bash
npm install @system-capabilities/lit
```

**Componentes:**
- `<system-status>` - Círculo de estado con colores
- `<system-checker>` - Modal completo con detalles

[Ver documentación completa →](./packages/lit/README.md)

### ⚛️ [@system-capabilities/react](./packages/react)

Componentes React y hooks para detección y validación.

```bash
npm install @system-capabilities/react
```

**Componentes y Hooks:**
- `<SystemStatus />` - Círculo de estado
- `<SystemChecker />` - Modal completo
- `useSystemCapabilities()` - Hook para detección

[Ver documentación completa →](./packages/react/README.md)

## Inicio Rápido

### Usando la librería core

```javascript
import SystemCapabilities from 'system-capabilities';

const caps = new SystemCapabilities();
const info = caps.getCapabilities();

// Validar requisitos
const requirements = {
  features: { webGL: true },
  device: { minMemory: 4 }
};

const result = await caps.checkRequirements(requirements);
console.log(result.passed);  // true/false
```

### Usando componentes Lit

```html
<script type="module">
  import '@system-capabilities/lit';
</script>

<system-status
  size="medium"
  autoCheck
></system-status>

<system-checker
  autoCheck
  showOnFail
></system-checker>
```

### Usando componentes React

```tsx
import { SystemStatus, SystemChecker, useSystemCapabilities } from '@system-capabilities/react';

function App() {
  return (
    <>
      <SystemStatus
        requirements={{ features: { webGL: true } }}
        autoCheck
      />

      <SystemChecker
        requirements={{ features: { webGL: true } }}
        autoCheck
        showOnFail
      />
    </>
  );
}
```

## Características

✅ **SSR/SSG Safe** - Compatible con generadores de sitios estáticos
✅ **Framework Agnostic** - Core funciona en cualquier entorno
✅ **Web Components** - Componentes Lit reutilizables en cualquier framework
✅ **React Support** - Componentes y hooks nativos de React
✅ **TypeScript** - Tipado completo incluido
✅ **Múltiples formatos** - ESM, CommonJS, UMD
✅ **Tree-shakeable** - Solo importa lo que necesitas

## Detecciones disponibles

- 🌐 **Navegador**: UserAgent, idioma, plataforma, cookies, online
- 📱 **Dispositivo**: Memoria, CPU cores, táctil, móvil/escritorio
- 💻 **Hardware**: Núcleos CPU, RAM, batería
- 🌐 **Red**: Tipo de conexión, velocidad, latencia
- 🖥️ **Pantalla**: Resolución, viewport, pixel ratio, orientación
- 🔌 **Features**: WebGL, WebRTC, Service Workers, IndexedDB, etc.
- 💾 **Almacenamiento**: localStorage, sessionStorage, cuota
- 🎬 **Media**: Codecs audio/video, MediaDevices, WebRTC
- 📊 **Performance**: Timing, memoria JS
- 🎯 **Sensores**: Acelerómetro, giroscopio, magnetómetro

## Uso en diferentes frameworks

### Astro

```astro
---
// Frontmatter (server)
---

<script>
  // Client-side
  import '@system-capabilities/lit';
</script>

<system-checker autoCheck showOnFail />
```

### Next.js

```tsx
'use client';

import { SystemChecker } from '@system-capabilities/react';

export default function Home() {
  return <SystemChecker autoCheck showOnFail />;
}
```

### Vue/Nuxt

```vue
<template>
  <system-status autoCheck />
</template>

<script setup>
import '@system-capabilities/lit';
</script>
```

### SvelteKit

```svelte
<script>
  import '@system-capabilities/lit';
</script>

<system-status autoCheck />
```

## Desarrollo

### Setup

```bash
# Instalar dependencias
npm install

# Build todos los paquetes
npm run build

# Build paquete específico
npm run build:core
npm run build:lit
npm run build:react
```

### Estructura del proyecto

```
system-capabilities/
├── packages/
│   ├── core/              # system-capabilities
│   │   ├── src/
│   │   ├── dist/
│   │   └── package.json
│   ├── lit/               # @system-capabilities/lit
│   │   ├── src/
│   │   ├── dist/
│   │   └── package.json
│   └── react/             # @system-capabilities/react
│       ├── src/
│       ├── dist/
│       └── package.json
├── package.json           # Root workspace
└── README.md
```

## Publicación

Cada paquete se publica independientemente:

```bash
# Publicar core
cd packages/core && npm publish

# Publicar Lit
cd packages/lit && npm publish --access public

# Publicar React
cd packages/react && npm publish --access public
```

## Ejemplos

Ver el directorio `example/` para ejemplos completos de uso con diferentes frameworks.

## Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones modernas)
- ✅ Navegadores móviles (iOS Safari, Chrome Mobile)
- ✅ SSR/SSG (Next.js, Astro, Nuxt, SvelteKit, etc)
- ✅ ES Modules y CommonJS
- ✅ TypeScript

## Licencia

MIT © manufosela

## Enlaces

- [GitHub Repository](https://github.com/manufosela/system-capabilities)
- [npm - system-capabilities](https://www.npmjs.com/package/system-capabilities)
- [npm - @system-capabilities/lit](https://www.npmjs.com/package/@system-capabilities/lit)
- [npm - @system-capabilities/react](https://www.npmjs.com/package/@system-capabilities/react)

## Contribuir

Las contribuciones son bienvenidas. Por favor abre un issue o PR en GitHub.
