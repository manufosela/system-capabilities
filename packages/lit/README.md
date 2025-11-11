# @system-capabilities/lit

Componentes Lit (Web Components) para detección y validación de capacidades del sistema.

## Instalación

```bash
npm install @system-capabilities/lit
```

## Componentes

### SystemStatus

Círculo de estado que muestra el nivel de compatibilidad del sistema mediante colores:
- 🟢 Verde: Sistema compatible
- 🟡 Amarillo: Advertencias
- 🔴 Rojo: Problemas críticos

```html
<script type="module">
  import '@system-capabilities/lit';
</script>

<system-status
  .requirements=${{
    features: { webGL: true, localStorage: true },
    device: { minMemory: 4, minCores: 2 }
  }}
  size="medium"
  autoCheck
  showTooltip
></system-status>
```

#### Propiedades

- `requirements` (Object): Requisitos del sistema a validar
- `size` ('small' | 'medium' | 'large'): Tamaño del círculo
- `autoCheck` (boolean): Verificar automáticamente al cargar
- `showTooltip` (boolean): Mostrar tooltip con información

#### Eventos

- `status-change`: Se dispara cuando cambia el estado
- `click`: Se dispara al hacer click en el círculo

```javascript
const status = document.querySelector('system-status');

status.addEventListener('status-change', (e) => {
  console.log('Estado:', e.detail.status);
  console.log('Fallos:', e.detail.failures);
});

status.addEventListener('click', (e) => {
  console.log('Capacidades:', e.detail.capabilities);
});
```

### SystemChecker

Componente completo con modal para verificar requisitos y mostrar detalles.

```html
<system-checker
  .requirements=${{
    features: { webGL: true },
    device: { minMemory: 4 }
  }}
  autoCheck
  showOnFail
></system-checker>
```

#### Propiedades

- `requirements` (Object): Requisitos del sistema a validar
- `autoCheck` (boolean): Verificar automáticamente al cargar
- `showOnFail` (boolean): Mostrar modal si hay fallos
- `open` (boolean): Si el modal debe estar abierto

#### Eventos

- `check-complete`: Se dispara cuando completa la verificación
- `modal-open`: Se dispara cuando se abre el modal
- `modal-close`: Se dispara cuando se cierra el modal

```javascript
const checker = document.querySelector('system-checker');

checker.addEventListener('check-complete', (e) => {
  console.log('Pasó:', e.detail.passed);
  console.log('Fallos:', e.detail.failures);
});
```

#### Métodos

```javascript
// Verificar el sistema manualmente
checker.checkSystem();

// Abrir el modal manualmente
checker.openModal();

// Cerrar el modal
checker.closeModal();
```

## Formato de requisitos

```javascript
const requirements = {
  features: {
    webGL: true,
    localStorage: true,
    serviceWorker: true
  },
  device: {
    minMemory: 4,      // GB
    minCores: 2,       // Núcleos CPU
    mobile: false      // true/false
  },
  screen: {
    minWidth: 1024,    // pixels
    minHeight: 768
  },
  network: {
    minDownlink: 1.5,  // Mbps
    maxRTT: 300        // ms
  }
};
```

## Uso en frameworks

### Vanilla JS

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@system-capabilities/lit';

    const requirements = {
      features: { webGL: true }
    };

    const status = document.querySelector('system-status');
    status.requirements = requirements;
  </script>
</head>
<body>
  <system-status size="large" autoCheck></system-status>
</body>
</html>
```

### React

```jsx
import '@system-capabilities/lit';

function App() {
  const requirements = {
    features: { webGL: true }
  };

  return (
    <system-checker
      requirements={requirements}
      autoCheck={true}
      showOnFail={true}
    />
  );
}
```

### Vue

```vue
<template>
  <system-status
    :requirements="requirements"
    size="medium"
    autoCheck
  />
</template>

<script setup>
import '@system-capabilities/lit';
import { ref } from 'vue';

const requirements = ref({
  features: { webGL: true }
});
</script>
```

### Astro

```astro
---
// Este import puede estar en el servidor
---

<script>
  // Este código se ejecuta en el cliente
  import '@system-capabilities/lit';
</script>

<system-checker
  autoCheck
  showOnFail
  client:load
/>
```

## Estilos personalizados

Los componentes usan Shadow DOM, pero exponen CSS custom properties:

```css
system-status {
  --status-success-color: #43a047;
  --status-warning-color: #fb8c00;
  --status-error-color: #e53935;
}
```

## Licencia

MIT
