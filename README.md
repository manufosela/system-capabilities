# System Capabilities

Paquete npm para detectar las capacidades del sistema del navegador y validar requisitos mínimos.

## Instalación

```bash
npm install system-capabilities
```

## Uso

```javascript
import SystemCapabilities from 'system-capabilities';

// Detectar capacidades
const capabilities = new SystemCapabilities();
const info = capabilities.getCapabilities();

// Validar requisitos mínimos desde YAML
await capabilities.checkRequirements('requirements.yaml');
```

## API

- `getCapabilities()`: Devuelve objeto con todas las capacidades detectadas
- `checkRequirements(yamlPath)`: Valida requisitos mínimos y muestra modal si no se cumplen
