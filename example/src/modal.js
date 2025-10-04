/**
 * Modal para mostrar avisos de requisitos no cumplidos
 */
class CapabilitiesModal {
  constructor() {
    this.modal = null;
    this.overlay = null;
  }

  /**
   * Muestra el modal con los fallos de validación
   */
  show(failures) {
    if (this.modal) {
      this.close();
    }

    this.createModal(failures);
    this.attachEvents();
  }

  /**
   * Crea el modal
   */
  createModal(failures) {
    // Crear overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'capabilities-modal-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Crear modal
    this.modal = document.createElement('div');
    this.modal.className = 'capabilities-modal';
    this.modal.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 30px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      position: relative;
    `;

    // Contenido del modal
    const content = this.createContent(failures);
    this.modal.innerHTML = content;

    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }

  /**
   * Crea el contenido del modal
   */
  createContent(failures) {
    const title = '<h2 style="margin: 0 0 20px 0; color: #d32f2f; font-size: 24px;">⚠️ Requisitos del Sistema No Cumplidos</h2>';

    const description = `
      <p style="margin: 0 0 20px 0; color: #555; line-height: 1.6;">
        Tu navegador o dispositivo no cumple con los requisitos mínimos necesarios para ejecutar esta aplicación correctamente.
      </p>
    `;

    const failuresList = this.createFailuresList(failures);

    const closeButton = `
      <button class="capabilities-modal-close" style="
        background: #d32f2f;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        margin-top: 20px;
        width: 100%;
        font-weight: 500;
        transition: background 0.3s;
      ">
        Cerrar
      </button>
    `;

    return title + description + failuresList + closeButton;
  }

  /**
   * Crea la lista de fallos
   */
  createFailuresList(failures) {
    const grouped = this.groupFailuresByCategory(failures);

    let html = '<div style="margin: 20px 0;">';

    Object.keys(grouped).forEach(category => {
      html += `
        <div style="margin-bottom: 20px;">
          <h3 style="
            margin: 0 0 10px 0;
            color: #333;
            font-size: 18px;
            text-transform: capitalize;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 8px;
          ">${this.getCategoryLabel(category)}</h3>
          <ul style="
            margin: 0;
            padding: 0 0 0 20px;
            list-style: none;
          ">
      `;

      grouped[category].forEach(failure => {
        html += `
          <li style="
            margin: 8px 0;
            padding: 10px;
            background: #ffebee;
            border-left: 4px solid #d32f2f;
            border-radius: 4px;
            color: #333;
            line-height: 1.5;
          ">
            <strong style="color: #d32f2f;">✗</strong> ${failure.message}
            <div style="
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            ">
              Requerido: <code style="
                background: #f5f5f5;
                padding: 2px 6px;
                border-radius: 3px;
              ">${this.formatValue(failure.required)}</code>
              ${failure.actual !== undefined ? `| Actual: <code style="
                background: #f5f5f5;
                padding: 2px 6px;
                border-radius: 3px;
              ">${this.formatValue(failure.actual)}</code>` : ''}
            </div>
          </li>
        `;
      });

      html += '</ul></div>';
    });

    html += '</div>';
    return html;
  }

  /**
   * Agrupa los fallos por categoría
   */
  groupFailuresByCategory(failures) {
    const grouped = {};
    failures.forEach(failure => {
      if (!grouped[failure.category]) {
        grouped[failure.category] = [];
      }
      grouped[failure.category].push(failure);
    });
    return grouped;
  }

  /**
   * Obtiene la etiqueta de categoría traducida
   */
  getCategoryLabel(category) {
    const labels = {
      browser: 'Navegador',
      device: 'Dispositivo',
      hardware: 'Hardware',
      network: 'Red',
      screen: 'Pantalla',
      features: 'Características',
      storage: 'Almacenamiento',
      media: 'Medios',
      performance: 'Rendimiento'
    };
    return labels[category] || category;
  }

  /**
   * Formatea un valor para mostrar
   */
  formatValue(value) {
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return value.toString();
  }

  /**
   * Adjunta eventos
   */
  attachEvents() {
    const closeButton = this.modal.querySelector('.capabilities-modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
      closeButton.addEventListener('mouseenter', (e) => {
        e.target.style.background = '#b71c1c';
      });
      closeButton.addEventListener('mouseleave', (e) => {
        e.target.style.background = '#d32f2f';
      });
    }

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    document.addEventListener('keydown', this.handleEscape.bind(this));
  }

  /**
   * Maneja la tecla Escape
   */
  handleEscape(e) {
    if (e.key === 'Escape') {
      this.close();
    }
  }

  /**
   * Cierra el modal
   */
  close() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.modal = null;
    this.overlay = null;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleEscape.bind(this));
  }
}

export default CapabilitiesModal;
