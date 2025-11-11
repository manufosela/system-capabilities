import SystemDetector from './detector.js';
import RequirementsValidator from './validator.js';
import CapabilitiesModal from './modal.js';

// Verificación de entorno del navegador
const isBrowser = typeof window !== 'undefined';

/**
 * Clase principal para detección de capacidades del sistema
 */
class SystemCapabilities {
  constructor() {
    this.detector = new SystemDetector();
    this.validator = null;
    this.modal = new CapabilitiesModal();
    this.capabilities = null;
    this.isBrowser = isBrowser;
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
   * Verifica los requisitos mínimos desde un archivo YAML o un objeto
   * @param {string|Object} yamlPathOrObject - Ruta al archivo YAML o objeto con los requisitos
   * @param {boolean} showModal - Si se debe mostrar el modal en caso de fallo (default: true, solo funciona en navegador)
   * @returns {Promise<Object>} Resultado de la validación
   */
  async checkRequirements(yamlPathOrObject, showModal = true) {
    // Obtener capacidades si no están ya cargadas
    if (!this.capabilities) {
      this.getCapabilities();
    }

    // Crear validador
    this.validator = new RequirementsValidator(this.capabilities);

    // Cargar requisitos (acepta tanto string como objeto)
    await this.validator.loadRequirements(yamlPathOrObject);

    // Validar
    const result = this.validator.validate();

    // Mostrar modal si hay fallos y showModal es true (solo en navegador)
    if (!result.passed && showModal && this.isBrowser) {
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
