# @system-capabilities/react

Componentes React y hooks para detección y validación de capacidades del sistema.

## Instalación

```bash
npm install @system-capabilities/react
```

## Componentes

### SystemStatus

Círculo de estado que muestra el nivel de compatibilidad del sistema mediante colores:
- 🟢 Verde: Sistema compatible
- 🟡 Amarillo: Advertencias
- 🔴 Rojo: Problemas críticos

```tsx
import { SystemStatus } from '@system-capabilities/react';

function App() {
  return (
    <SystemStatus
      requirements={{
        features: { webGL: true, localStorage: true },
        device: { minMemory: 4, minCores: 2 }
      }}
      size="medium"
      autoCheck
      onClick={(data) => {
        console.log('Status:', data.status);
        console.log('Capabilities:', data.capabilities);
      }}
    />
  );
}
```

#### Props

- `requirements` (Object): Requisitos del sistema a validar
- `size` ('small' | 'medium' | 'large'): Tamaño del círculo
- `autoCheck` (boolean): Verificar automáticamente al cargar
- `showTooltip` (boolean): Mostrar tooltip con información
- `onClick` (function): Callback al hacer click
- `style` (CSSProperties): Estilos personalizados
- `className` (string): Clase CSS adicional

### SystemChecker

Componente completo con modal para verificar requisitos y mostrar detalles.

```tsx
import { SystemChecker } from '@system-capabilities/react';

function App() {
  return (
    <SystemChecker
      requirements={{
        features: { webGL: true },
        device: { minMemory: 4 }
      }}
      autoCheck
      showOnFail
      onCheckComplete={(result) => {
        console.log('Passed:', result.passed);
        console.log('Failures:', result.failures);
      }}
    />
  );
}
```

#### Props

- `requirements` (Object): Requisitos del sistema a validar
- `autoCheck` (boolean): Verificar automáticamente al cargar
- `showOnFail` (boolean): Mostrar modal si hay fallos
- `open` (boolean): Control externo del estado del modal
- `onCheckComplete` (function): Callback cuando completa la verificación
- `onModalOpen` (function): Callback cuando se abre el modal
- `onModalClose` (function): Callback cuando se cierra el modal

## Hook: useSystemCapabilities

Hook para detectar capacidades y validar requisitos.

```tsx
import { useSystemCapabilities } from '@system-capabilities/react';

function MyComponent() {
  const { status, passed, failures, capabilities, checkSystem, isChecking } = useSystemCapabilities({
    requirements: {
      features: { webGL: true }
    },
    autoCheck: true
  });

  return (
    <div>
      <p>Status: {status}</p>
      <p>Passed: {passed ? 'Yes' : 'No'}</p>
      <button onClick={checkSystem} disabled={isChecking}>
        Check Again
      </button>

      {failures.length > 0 && (
        <ul>
          {failures.map((f, i) => (
            <li key={i}>{f.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Valores de retorno

- `status`: 'success' | 'warning' | 'error' | 'checking'
- `passed`: boolean - Si pasó la validación
- `failures`: array - Lista de fallos detectados
- `capabilities`: object - Todas las capacidades detectadas
- `checkSystem`: function - Función para verificar manualmente
- `isChecking`: boolean - Si está verificando actualmente

## Formato de requisitos

```typescript
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

## Uso con Next.js

### App Router

```tsx
'use client'; // Importante para Next.js App Router

import { SystemChecker } from '@system-capabilities/react';

export default function Home() {
  return (
    <main>
      <SystemChecker
        requirements={{ features: { webGL: true } }}
        autoCheck
        showOnFail
      />
    </main>
  );
}
```

### Pages Router

```tsx
import { useEffect, useState } from 'react';
import { SystemStatus } from '@system-capabilities/react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SystemStatus
      requirements={{ features: { webGL: true } }}
      autoCheck
    />
  );
}
```

## TypeScript

El paquete incluye definiciones de tipos completas:

```typescript
import type {
  SystemRequirements,
  StatusLevel,
  Size,
  ValidationFailure,
  ValidationResult
} from '@system-capabilities/react';

const requirements: SystemRequirements = {
  features: { webGL: true }
};
```

## Ejemplo completo

```tsx
import { useState } from 'react';
import {
  SystemStatus,
  SystemChecker,
  useSystemCapabilities
} from '@system-capabilities/react';

function App() {
  const [showModal, setShowModal] = useState(false);

  const { status, passed, failures } = useSystemCapabilities({
    requirements: {
      features: { webGL: true, localStorage: true },
      device: { minMemory: 4 }
    },
    autoCheck: true
  });

  return (
    <div>
      <h1>System Capabilities Demo</h1>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <SystemStatus
          requirements={{
            features: { webGL: true, localStorage: true },
            device: { minMemory: 4 }
          }}
          size="large"
          autoCheck
          onClick={() => setShowModal(true)}
        />

        <div>
          <p>Status: {status}</p>
          <p>Compatible: {passed ? '✓' : '✗'}</p>
          {failures.length > 0 && (
            <p>{failures.length} issue(s) found</p>
          )}
        </div>
      </div>

      {showModal && (
        <SystemChecker
          requirements={{
            features: { webGL: true, localStorage: true },
            device: { minMemory: 4 }
          }}
          open={showModal}
          onModalClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;
```

## Licencia

MIT
