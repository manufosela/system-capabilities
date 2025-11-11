# System Capabilities

Paquete npm para detectar las capacidades del sistema del navegador y validar requisitos mínimos. **Compatible con SSR/SSG** (Astro, Next.js, Nuxt, SvelteKit, etc).

## Características

- ✅ **SSR/SSG Safe**: Compatible con generadores de sitios estáticos y SSR
- 🌐 Detección de capacidades del navegador
- 📱 Información de dispositivo móvil/escritorio
- 💾 Capacidades de hardware y almacenamiento
- 🎨 Información de pantalla y viewport
- 🔌 Detección de APIs disponibles
- ⚡ Validación de requisitos mínimos
- 🎯 Modal automático para avisar de requisitos no cumplidos

## Instalación

```bash
npm install system-capabilities
```

## Uso Básico

### En el navegador (client-side)

```javascript
import SystemCapabilities from 'system-capabilities';

// Detectar capacidades
const capabilities = new SystemCapabilities();
const info = capabilities.getCapabilities();

console.log(info);
```

### Validar requisitos

```javascript
// Opción 1: Desde archivo YAML (solo client-side)
await capabilities.checkRequirements('/requirements.yaml');

// Opción 2: Pasar objeto directamente (funciona en SSR)
const requirements = {
  features: {
    webGL: true,
    localStorage: true
  },
  device: {
    minMemory: 4,
    minCores: 2
  }
};

const result = await capabilities.checkRequirements(requirements, false);
if (!result.passed) {
  console.log('Requisitos no cumplidos:', result.failures);
}
```

## Uso en SSG/SSR (Astro, Next.js, etc)

### Astro

```astro
---
// Este código se ejecuta en el servidor (SSR)
// El paquete no fallará durante el build
---

<script>
  // Este código se ejecuta en el cliente
  import SystemCapabilities from 'system-capabilities';

  const caps = new SystemCapabilities();
  const info = caps.getCapabilities();

  // Validar requisitos
  const requirements = {
    features: {
      webGL: true,
      localStorage: true
    }
  };

  const result = await caps.checkRequirements(requirements);
  if (!result.passed) {
    console.warn('Navegador no cumple requisitos', result.failures);
  }
</script>
```

### Next.js (App Router)

```tsx
'use client'; // Importante: debe ejecutarse en el cliente

import { useEffect, useState } from 'react';
import SystemCapabilities from 'system-capabilities';

export default function CapabilitiesChecker() {
  const [caps, setCaps] = useState(null);

  useEffect(() => {
    const detector = new SystemCapabilities();
    const capabilities = detector.getCapabilities();
    setCaps(capabilities);

    // Validar requisitos
    const requirements = {
      features: {
        webGL: true
      }
    };

    detector.checkRequirements(requirements).then(result => {
      if (!result.passed) {
        console.warn('Requisitos no cumplidos');
      }
    });
  }, []);

  if (!caps) return <div>Detectando capacidades...</div>;

  return (
    <div>
      <h2>Navegador: {caps.browser.userAgent}</h2>
      <p>Memoria: {caps.device.deviceMemory}GB</p>
    </div>
  );
}
```

### SvelteKit

```svelte
<script>
  import { onMount } from 'svelte';
  import SystemCapabilities from 'system-capabilities';

  let capabilities = null;

  onMount(() => {
    // Se ejecuta solo en el cliente
    const detector = new SystemCapabilities();
    capabilities = detector.getCapabilities();
  });
</script>

{#if capabilities}
  <div>
    <p>WebGL: {capabilities.features.webGL ? '✓' : '✗'}</p>
    <p>Memoria: {capabilities.device.deviceMemory}GB</p>
  </div>
{/if}
```

### Nuxt 3

```vue
<template>
  <div v-if="capabilities">
    <p>WebGL: {{ capabilities.features.webGL ? '✓' : '✗' }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SystemCapabilities from 'system-capabilities';

const capabilities = ref(null);

onMounted(() => {
  // Se ejecuta solo en el cliente
  const detector = new SystemCapabilities();
  capabilities.value = detector.getCapabilities();
});
</script>
```

## API

### Constructor

```javascript
const capabilities = new SystemCapabilities();
```

### Métodos principales

#### `getCapabilities()`

Retorna un objeto con todas las capacidades detectadas del sistema:

```javascript
const info = capabilities.getCapabilities();

// Estructura:
{
  browser: { userAgent, language, platform, ... },
  device: { mobile, deviceMemory, hardwareConcurrency, ... },
  hardware: { cores, memory, ... },
  network: { effectiveType, downlink, rtt, ... },
  screen: { width, height, devicePixelRatio, ... },
  features: { webGL, localStorage, serviceWorker, ... },
  storage: { localStorage, sessionStorage, indexedDB, ... },
  performance: { timing, memory, ... },
  sensors: { accelerometer, gyroscope, ... },
  media: { audioCodecs, videoCodecs, ... }
}
```

**Nota SSR**: En entornos SSR, retorna un objeto con `isSSR: true` en cada categoría.

#### `checkRequirements(yamlPathOrObject, showModal = true)`

Valida los requisitos mínimos del sistema:

```javascript
// Con objeto (recomendado para SSG/SSR)
const requirements = {
  features: {
    webGL: true,
    localStorage: true
  },
  device: {
    minMemory: 4,
    minCores: 2
  }
};

const result = await capabilities.checkRequirements(requirements, false);

// result:
{
  passed: false,
  failures: [
    {
      category: 'device',
      property: 'deviceMemory',
      required: 4,
      actual: 2,
      message: 'Se requieren al menos 4GB de memoria...'
    }
  ]
}
```

**Parámetros:**
- `yamlPathOrObject`: String (ruta a YAML) u Object (requisitos)
- `showModal`: Boolean - Si mostrar modal automático en caso de fallo (solo en navegador)

**Nota**: En SSR, solo puedes usar objetos. No se puede cargar desde archivo YAML.

#### `getSummary()`

Obtiene un resumen de las capacidades más importantes:

```javascript
const summary = capabilities.getSummary();

// Retorna:
{
  browser: { userAgent, platform, language, online },
  device: { mobile, memory, cores, touch },
  screen: { resolution, viewport, pixelRatio },
  network: { type, downlink, rtt }
}
```

#### `getCategory(category)`

Obtiene información de una categoría específica:

```javascript
const browserInfo = capabilities.getCategory('browser');
const screenInfo = capabilities.getCategory('screen');
```

Categorías disponibles: `browser`, `device`, `hardware`, `network`, `screen`, `features`, `storage`, `performance`, `sensors`, `media`

#### `hasFeature(feature)`

Verifica si una característica específica está soportada:

```javascript
if (capabilities.hasFeature('webGL')) {
  // WebGL está disponible
}

if (capabilities.hasFeature('serviceWorker')) {
  // Service Workers disponibles
}
```

#### `showModal(failures)`

Muestra manualmente el modal con fallos específicos:

```javascript
capabilities.showModal([
  {
    category: 'features',
    property: 'webGL',
    required: true,
    actual: false,
    message: 'WebGL no está disponible'
  }
]);
```

**Nota**: Solo funciona en navegador, no en SSR.

#### `closeModal()`

Cierra el modal de requisitos:

```javascript
capabilities.closeModal();
```

## Formato de requisitos YAML

```yaml
# requirements.yaml
features:
  webGL: true
  localStorage: true
  serviceWorker: true

device:
  minMemory: 4      # GB
  minCores: 2       # Núcleos CPU
  mobile: false     # true/false

screen:
  minWidth: 1024    # pixels
  minHeight: 768
  minDevicePixelRatio: 1

network:
  minDownlink: 1.5  # Mbps
  maxRTT: 300       # ms
```

## Formatos de distribución

El paquete se distribuye en múltiples formatos:

- **ESM** (`dist/system-capabilities.mjs`): Para bundlers modernos (Vite, Webpack 5+, etc)
- **CommonJS** (`dist/system-capabilities.cjs`): Para Node.js y compatibilidad
- **UMD** (`dist/system-capabilities.umd.js`): Para uso directo en `<script>` tags

Los bundlers modernos seleccionarán automáticamente el formato correcto gracias al campo `exports` en `package.json`.

## Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones modernas)
- ✅ Navegadores móviles (iOS Safari, Chrome Mobile)
- ✅ SSR/SSG (Next.js, Astro, Nuxt, SvelteKit, etc)
- ✅ ES Modules y CommonJS
- ✅ TypeScript (tipos incluidos en próximas versiones)

## Licencia

MIT
