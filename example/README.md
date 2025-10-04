# Ejemplo de Uso - System Capabilities

Este ejemplo demuestra cómo usar `system-capabilities` en una aplicación real para validar requisitos mínimos del sistema.

## Características

- ✅ Validación automática al cargar la página
- ✅ Modal de advertencia si no se cumplen los requisitos
- ✅ Feedback visual del estado de validación
- ✅ Configuración de requisitos mediante archivo YAML

## Archivos

- **app.html**: Aplicación de ejemplo que valida requisitos al cargar
- **index.html**: Demo interactiva para explorar capacidades
- **requirements.yaml**: Configuración de requisitos mínimos
- **package.json**: Instalación del paquete system-capabilities

## Instalación

```bash
npm install
```

## Uso

```bash
npm start
```

Esto abrirá automáticamente:
- **http://localhost:8080/app.html** - Ejemplo real con validación automática
- **http://localhost:8080** - Demo interactiva para explorar capacidades

## Cómo funciona

1. Al cargar `app.html`, automáticamente se ejecuta la validación
2. Lee los requisitos desde `requirements.yaml`
3. Si NO se cumplen, muestra un modal con los fallos detectados
4. Si SÍ se cumplen, muestra mensaje de éxito

## Personalización

Edita `requirements.yaml` para ajustar los requisitos según tu aplicación:

```yaml
device:
  minMemory: 4  # GB mínimos de RAM
  minCores: 2   # Núcleos de CPU mínimos

screen:
  minWidth: 1280
  minHeight: 720

features:
  webGL: true
  localStorage: true
```

## Notas

- El ejemplo actual tiene requisitos **intencionadamente altos** (16GB RAM) para demostrar el modal de advertencia
- El `navigator.deviceMemory` tiene un máximo de 8GB por privacidad, por lo que el requisito de 16GB siempre fallará
- Ajusta los requisitos en `requirements.yaml` según las necesidades reales de tu aplicación
