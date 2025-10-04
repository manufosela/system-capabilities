import SystemDetector from './detector.js';
import RequirementsValidator from './validator.js';
import CapabilitiesModal from './modal.js';

/**
 * Clase principal para detección de capacidades del sistema
 */
class SystemCapabilities {
  constructor() {
    this.detector = new SystemDetector();
    this.validator = null;
    this.modal = new CapabilitiesModal();
    this.capabilities = null;
  }

  /**
   * Obtiene las capacidades del sistema
   */
  getCapabilities() {
    if (!this.capabilities) {
      this.capabilities = this.detector.detect();
    }
    return this.capabilities;
  }

  /**
   * Verifica los requisitos mínimos desde un archivo YAML
   * @param {string} yamlPath - Ruta al archivo YAML con los requisitos
   * @param {boolean} showModal - Si se debe mostrar el modal en caso de fallo (default: true)
   * @returns {Promise<Object>} Resultado de la validación
   */
  async checkRequirements(yamlPath, showModal = true) {
    // Obtener capacidades si no están ya cargadas
    if (!this.capabilities) {
      this.getCapabilities();
    }

    // Crear validador
    this.validator = new RequirementsValidator(this.capabilities);

    // Cargar requisitos
    await this.validator.loadRequirements(yamlPath);

    // Validar
    const result = this.validator.validate();

    // Mostrar modal si hay fallos y showModal es true
    if (!result.passed && showModal) {
      this.modal.show(result.failures);
    }

    return result;
  }

  /**
   * Muestra el modal con fallos específicos
   * @param {Array} failures - Array de fallos a mostrar
   */
  showModal(failures) {
    this.modal.show(failures);
  }

  /**
   * Cierra el modal
   */
  closeModal() {
    this.modal.close();
  }

  /**
   * Obtiene información específica de una categoría
   * @param {string} category - Categoría (browser, device, hardware, network, screen, features, storage, performance, sensors, media)
   * @returns {Object} Información de la categoría
   */
  getCategory(category) {
    if (!this.capabilities) {
      this.getCapabilities();
    }
    return this.capabilities[category] || null;
  }

  /**
   * Verifica si una característica específica está soportada
   * @param {string} feature - Nombre de la característica
   * @returns {boolean} Si la característica está soportada
   */
  hasFeature(feature) {
    if (!this.capabilities) {
      this.getCapabilities();
    }
    return this.capabilities.features && this.capabilities.features[feature] === true;
  }

  /**
   * Obtiene información resumida del sistema
   * @returns {Object} Resumen de capacidades
   */
  getSummary() {
    if (!this.capabilities) {
      this.getCapabilities();
    }

    return {
      browser: {
        userAgent: this.capabilities.browser.userAgent,
        platform: this.capabilities.browser.platform,
        language: this.capabilities.browser.language,
        online: this.capabilities.browser.onLine
      },
      device: {
        mobile: this.capabilities.device.mobile,
        memory: this.capabilities.device.deviceMemory,
        cores: this.capabilities.device.hardwareConcurrency,
        touch: this.capabilities.device.maxTouchPoints > 0
      },
      screen: {
        resolution: `${this.capabilities.screen.width}x${this.capabilities.screen.height}`,
        viewport: `${this.capabilities.screen.viewportWidth}x${this.capabilities.screen.viewportHeight}`,
        pixelRatio: this.capabilities.screen.devicePixelRatio
      },
      network: this.capabilities.network.available ? {
        type: this.capabilities.network.effectiveType,
        downlink: this.capabilities.network.downlink,
        rtt: this.capabilities.network.rtt
      } : { available: false }
    };
  }
}

export default SystemCapabilities;
