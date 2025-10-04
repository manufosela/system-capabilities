import yaml from 'js-yaml';

/**
 * Validador de requisitos mínimos del sistema
 */
class RequirementsValidator {
  constructor(capabilities) {
    this.capabilities = capabilities;
    this.requirements = null;
    this.failures = [];
  }

  /**
   * Carga los requisitos desde un archivo YAML
   */
  async loadRequirements(yamlPath) {
    try {
      const response = await fetch(yamlPath);
      const yamlText = await response.text();
      this.requirements = yaml.load(yamlText);
      return this.requirements;
    } catch (error) {
      console.error('Error al cargar requisitos:', error);
      throw error;
    }
  }

  /**
   * Valida los requisitos contra las capacidades
   */
  validate() {
    if (!this.requirements || !this.capabilities) {
      throw new Error('Requisitos o capacidades no inicializados');
    }

    this.failures = [];

    // Validar navegador
    if (this.requirements.browser) {
      this.validateBrowser(this.requirements.browser);
    }

    // Validar dispositivo
    if (this.requirements.device) {
      this.validateDevice(this.requirements.device);
    }

    // Validar hardware
    if (this.requirements.hardware) {
      this.validateHardware(this.requirements.hardware);
    }

    // Validar red
    if (this.requirements.network) {
      this.validateNetwork(this.requirements.network);
    }

    // Validar pantalla
    if (this.requirements.screen) {
      this.validateScreen(this.requirements.screen);
    }

    // Validar características
    if (this.requirements.features) {
      this.validateFeatures(this.requirements.features);
    }

    // Validar almacenamiento
    if (this.requirements.storage) {
      this.validateStorage(this.requirements.storage);
    }

    // Validar medios
    if (this.requirements.media) {
      this.validateMedia(this.requirements.media);
    }

    return {
      passed: this.failures.length === 0,
      failures: this.failures
    };
  }

  /**
   * Valida requisitos del navegador
   */
  validateBrowser(requirements) {
    const browser = this.capabilities.browser;

    if (requirements.cookieEnabled !== undefined && browser.cookieEnabled !== requirements.cookieEnabled) {
      this.failures.push({
        category: 'browser',
        property: 'cookieEnabled',
        required: requirements.cookieEnabled,
        actual: browser.cookieEnabled,
        message: `Las cookies deben estar ${requirements.cookieEnabled ? 'habilitadas' : 'deshabilitadas'}`
      });
    }

    if (requirements.onLine !== undefined && browser.onLine !== requirements.onLine) {
      this.failures.push({
        category: 'browser',
        property: 'onLine',
        required: requirements.onLine,
        actual: browser.onLine,
        message: `Se requiere conexión ${requirements.onLine ? 'online' : 'offline'}`
      });
    }
  }

  /**
   * Valida requisitos del dispositivo
   */
  validateDevice(requirements) {
    const device = this.capabilities.device;

    if (requirements.minMemory && device.deviceMemory && device.deviceMemory < requirements.minMemory) {
      this.failures.push({
        category: 'device',
        property: 'deviceMemory',
        required: requirements.minMemory,
        actual: device.deviceMemory,
        message: `Se requieren al menos ${requirements.minMemory}GB de memoria. Disponible: ${device.deviceMemory}GB`
      });
    }

    if (requirements.minCores && device.hardwareConcurrency && device.hardwareConcurrency < requirements.minCores) {
      this.failures.push({
        category: 'device',
        property: 'hardwareConcurrency',
        required: requirements.minCores,
        actual: device.hardwareConcurrency,
        message: `Se requieren al menos ${requirements.minCores} núcleos de CPU. Disponible: ${device.hardwareConcurrency}`
      });
    }

    if (requirements.touchRequired !== undefined && requirements.touchRequired && device.maxTouchPoints === 0) {
      this.failures.push({
        category: 'device',
        property: 'maxTouchPoints',
        required: 'touch support',
        actual: device.maxTouchPoints,
        message: 'Se requiere soporte táctil'
      });
    }

    if (requirements.mobile !== undefined && device.mobile !== requirements.mobile) {
      this.failures.push({
        category: 'device',
        property: 'mobile',
        required: requirements.mobile,
        actual: device.mobile,
        message: `Se requiere dispositivo ${requirements.mobile ? 'móvil' : 'de escritorio'}`
      });
    }
  }

  /**
   * Valida requisitos de hardware
   */
  validateHardware(requirements) {
    const hardware = this.capabilities.hardware;

    if (requirements.minCores && hardware.cores && hardware.cores < requirements.minCores) {
      this.failures.push({
        category: 'hardware',
        property: 'cores',
        required: requirements.minCores,
        actual: hardware.cores,
        message: `Se requieren al menos ${requirements.minCores} núcleos. Disponible: ${hardware.cores}`
      });
    }

    if (requirements.minMemory && hardware.memory && hardware.memory < requirements.minMemory) {
      this.failures.push({
        category: 'hardware',
        property: 'memory',
        required: requirements.minMemory,
        actual: hardware.memory,
        message: `Se requieren al menos ${requirements.minMemory}GB de RAM. Disponible: ${hardware.memory}GB`
      });
    }
  }

  /**
   * Valida requisitos de red
   */
  validateNetwork(requirements) {
    const network = this.capabilities.network;

    if (!network.available) {
      if (requirements.required) {
        this.failures.push({
          category: 'network',
          property: 'available',
          required: true,
          actual: false,
          message: 'No se puede obtener información de red'
        });
      }
      return;
    }

    if (requirements.minDownlink && network.downlink && network.downlink < requirements.minDownlink) {
      this.failures.push({
        category: 'network',
        property: 'downlink',
        required: requirements.minDownlink,
        actual: network.downlink,
        message: `Se requiere velocidad de descarga mínima de ${requirements.minDownlink}Mbps. Actual: ${network.downlink}Mbps`
      });
    }

    if (requirements.maxRTT && network.rtt && network.rtt > requirements.maxRTT) {
      this.failures.push({
        category: 'network',
        property: 'rtt',
        required: requirements.maxRTT,
        actual: network.rtt,
        message: `Latencia demasiado alta. Máximo: ${requirements.maxRTT}ms. Actual: ${network.rtt}ms`
      });
    }

    if (requirements.effectiveType && network.effectiveType !== requirements.effectiveType) {
      this.failures.push({
        category: 'network',
        property: 'effectiveType',
        required: requirements.effectiveType,
        actual: network.effectiveType,
        message: `Tipo de conexión requerido: ${requirements.effectiveType}. Actual: ${network.effectiveType}`
      });
    }
  }

  /**
   * Valida requisitos de pantalla
   */
  validateScreen(requirements) {
    const screen = this.capabilities.screen;

    if (requirements.minWidth && screen.width < requirements.minWidth) {
      this.failures.push({
        category: 'screen',
        property: 'width',
        required: requirements.minWidth,
        actual: screen.width,
        message: `Ancho mínimo de pantalla: ${requirements.minWidth}px. Actual: ${screen.width}px`
      });
    }

    if (requirements.minHeight && screen.height < requirements.minHeight) {
      this.failures.push({
        category: 'screen',
        property: 'height',
        required: requirements.minHeight,
        actual: screen.height,
        message: `Alto mínimo de pantalla: ${requirements.minHeight}px. Actual: ${screen.height}px`
      });
    }

    if (requirements.minColorDepth && screen.colorDepth < requirements.minColorDepth) {
      this.failures.push({
        category: 'screen',
        property: 'colorDepth',
        required: requirements.minColorDepth,
        actual: screen.colorDepth,
        message: `Profundidad de color mínima: ${requirements.minColorDepth}bits. Actual: ${screen.colorDepth}bits`
      });
    }

    if (requirements.minDevicePixelRatio && screen.devicePixelRatio < requirements.minDevicePixelRatio) {
      this.failures.push({
        category: 'screen',
        property: 'devicePixelRatio',
        required: requirements.minDevicePixelRatio,
        actual: screen.devicePixelRatio,
        message: `Ratio de píxeles mínimo: ${requirements.minDevicePixelRatio}. Actual: ${screen.devicePixelRatio}`
      });
    }
  }

  /**
   * Valida requisitos de características
   */
  validateFeatures(requirements) {
    const features = this.capabilities.features;

    Object.keys(requirements).forEach(feature => {
      if (requirements[feature] === true && !features[feature]) {
        this.failures.push({
          category: 'features',
          property: feature,
          required: true,
          actual: features[feature],
          message: `Característica requerida no soportada: ${feature}`
        });
      }
    });
  }

  /**
   * Valida requisitos de almacenamiento
   */
  validateStorage(requirements) {
    const storage = this.capabilities.storage;

    if (requirements.localStorage && !storage.localStorage) {
      this.failures.push({
        category: 'storage',
        property: 'localStorage',
        required: true,
        actual: false,
        message: 'localStorage requerido pero no disponible'
      });
    }

    if (requirements.sessionStorage && !storage.sessionStorage) {
      this.failures.push({
        category: 'storage',
        property: 'sessionStorage',
        required: true,
        actual: false,
        message: 'sessionStorage requerido pero no disponible'
      });
    }

    if (requirements.indexedDB && !storage.indexedDB) {
      this.failures.push({
        category: 'storage',
        property: 'indexedDB',
        required: true,
        actual: false,
        message: 'IndexedDB requerido pero no disponible'
      });
    }

    if (requirements.minQuota && storage.quota && storage.quota < requirements.minQuota) {
      this.failures.push({
        category: 'storage',
        property: 'quota',
        required: requirements.minQuota,
        actual: storage.quota,
        message: `Cuota de almacenamiento mínima: ${requirements.minQuota} bytes. Actual: ${storage.quota} bytes`
      });
    }
  }

  /**
   * Valida requisitos de medios
   */
  validateMedia(requirements) {
    const media = this.capabilities.media;

    if (requirements.mediaDevices && !media.mediaDevices) {
      this.failures.push({
        category: 'media',
        property: 'mediaDevices',
        required: true,
        actual: false,
        message: 'MediaDevices API requerida pero no disponible'
      });
    }

    if (requirements.webRTC && !media.webRTC) {
      this.failures.push({
        category: 'media',
        property: 'webRTC',
        required: true,
        actual: false,
        message: 'WebRTC requerido pero no disponible'
      });
    }

    if (requirements.audioCodecs) {
      Object.keys(requirements.audioCodecs).forEach(codec => {
        if (requirements.audioCodecs[codec] && !media.audioCodecs[codec]) {
          this.failures.push({
            category: 'media',
            property: `audioCodec.${codec}`,
            required: true,
            actual: false,
            message: `Codec de audio requerido no soportado: ${codec}`
          });
        }
      });
    }

    if (requirements.videoCodecs) {
      Object.keys(requirements.videoCodecs).forEach(codec => {
        if (requirements.videoCodecs[codec] && !media.videoCodecs[codec]) {
          this.failures.push({
            category: 'media',
            property: `videoCodec.${codec}`,
            required: true,
            actual: false,
            message: `Codec de video requerido no soportado: ${codec}`
          });
        }
      });
    }
  }

  /**
   * Obtiene los fallos de validación
   */
  getFailures() {
    return this.failures;
  }
}

export default RequirementsValidator;
