import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import SystemCapabilities from 'system-capabilities';
import { SystemRequirements } from './system-status.js';

/**
 * Componente completo para verificar requisitos del sistema y mostrar modal
 *
 * @element system-checker
 *
 * @prop {SystemRequirements} requirements - Requisitos del sistema a validar
 * @prop {boolean} autoCheck - Si debe verificar automáticamente al cargar
 * @prop {boolean} showOnFail - Si debe mostrar el modal automáticamente en caso de fallo
 * @prop {boolean} open - Si el modal debe estar abierto
 *
 * @fires check-complete - Se dispara cuando completa la verificación
 * @fires modal-open - Se dispara cuando se abre el modal
 * @fires modal-close - Se dispara cuando se cierra el modal
 *
 * @example
 * ```html
 * <system-checker
 *   .requirements=${{ features: { webGL: true } }}
 *   autoCheck
 *   showOnFail
 * ></system-checker>
 * ```
 */
@customElement('system-checker')
export class SystemChecker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal {
      background: white;
      border-radius: 8px;
      padding: 30px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-icon {
      font-size: 32px;
      margin-right: 12px;
    }

    .modal-icon.success {
      color: #43a047;
    }

    .modal-icon.warning {
      color: #fb8c00;
    }

    .modal-icon.error {
      color: #e53935;
    }

    .modal-title {
      margin: 0;
      font-size: 24px;
      color: #333;
      flex: 1;
    }

    .modal-description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .capabilities-section {
      margin: 20px 0;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e0e0e0;
      text-transform: capitalize;
    }

    .failure-item {
      margin: 8px 0;
      padding: 12px;
      background: #ffebee;
      border-left: 4px solid #e53935;
      border-radius: 4px;
    }

    .failure-message {
      color: #333;
      margin-bottom: 4px;
    }

    .failure-details {
      font-size: 12px;
      color: #666;
    }

    .failure-details code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    .success-message {
      padding: 20px;
      background: #e8f5e9;
      border-left: 4px solid #43a047;
      border-radius: 4px;
      color: #2e7d32;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #2196f3;
      color: white;
      flex: 1;
    }

    .btn-primary:hover {
      background: #1976d2;
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #bdbdbd;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin: 20px 0;
    }

    .summary-card {
      padding: 12px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .summary-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .summary-value {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  `;

  @property({ type: Object })
  requirements: SystemRequirements = {};

  @property({ type: Boolean })
  autoCheck = false;

  @property({ type: Boolean })
  showOnFail = true;

  @property({ type: Boolean, reflect: true })
  open = false;

  @state()
  private passed = true;

  @state()
  private failures: any[] = [];

  @state()
  private capabilities: any = null;

  private systemCapabilities = new SystemCapabilities();

  connectedCallback() {
    super.connectedCallback();
    if (this.autoCheck) {
      this.checkSystem();
    }
  }

  async checkSystem() {
    try {
      this.capabilities = this.systemCapabilities.getCapabilities();
      const result = await this.systemCapabilities.checkRequirements(this.requirements, false);

      this.passed = result.passed;
      this.failures = result.failures;

      this.dispatchEvent(new CustomEvent('check-complete', {
        detail: {
          passed: this.passed,
          failures: this.failures,
          capabilities: this.capabilities
        },
        bubbles: true,
        composed: true
      }));

      if (!this.passed && this.showOnFail) {
        this.openModal();
      }
    } catch (error) {
      console.error('Error checking system:', error);
    }
  }

  openModal() {
    this.open = true;
    document.body.style.overflow = 'hidden';
    this.dispatchEvent(new CustomEvent('modal-open', {
      bubbles: true,
      composed: true
    }));
  }

  closeModal() {
    this.open = false;
    document.body.style.overflow = '';
    this.dispatchEvent(new CustomEvent('modal-close', {
      bubbles: true,
      composed: true
    }));
  }

  private handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.closeModal();
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }

  private groupFailuresByCategory() {
    const grouped: Record<string, any[]> = {};
    this.failures.forEach(failure => {
      if (!grouped[failure.category]) {
        grouped[failure.category] = [];
      }
      grouped[failure.category].push(failure);
    });
    return grouped;
  }

  private getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
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

  private formatValue(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return value.toString();
  }

  private renderSummary() {
    if (!this.capabilities) return '';

    const summary = this.systemCapabilities.getSummary();

    return html`
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-label">Navegador</div>
          <div class="summary-value">${summary.browser.platform}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Memoria</div>
          <div class="summary-value">${summary.device.memory || 'N/A'} GB</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Núcleos CPU</div>
          <div class="summary-value">${summary.device.cores || 'N/A'}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Resolución</div>
          <div class="summary-value">${summary.screen.resolution}</div>
        </div>
      </div>
    `;
  }

  private renderFailures() {
    const grouped = this.groupFailuresByCategory();

    return html`
      ${Object.keys(grouped).map(category => html`
        <div class="capabilities-section">
          <div class="section-title">${this.getCategoryLabel(category)}</div>
          ${grouped[category].map(failure => html`
            <div class="failure-item">
              <div class="failure-message">
                <strong>✗</strong> ${failure.message}
              </div>
              <div class="failure-details">
                Requerido: <code>${this.formatValue(failure.required)}</code>
                ${failure.actual !== undefined ? html`
                  | Actual: <code>${this.formatValue(failure.actual)}</code>
                ` : ''}
              </div>
            </div>
          `)}
        </div>
      `)}
    `;
  }

  render() {
    if (!this.open) return html``;

    return html`
      <div
        class="overlay"
        @click=${this.handleOverlayClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-header">
            <div class="modal-icon ${this.passed ? 'success' : 'error'}">
              ${this.passed ? '✓' : '⚠'}
            </div>
            <h2 class="modal-title">
              ${this.passed ? 'Sistema Compatible' : 'Requisitos No Cumplidos'}
            </h2>
          </div>

          <div class="modal-description">
            ${this.passed
              ? 'Tu navegador y dispositivo cumplen con todos los requisitos necesarios.'
              : 'Tu navegador o dispositivo no cumple con algunos requisitos mínimos necesarios para ejecutar esta aplicación correctamente.'}
          </div>

          ${this.renderSummary()}

          ${this.passed ? html`
            <div class="success-message">
              <strong>¡Perfecto!</strong> Todos los requisitos se cumplen correctamente.
            </div>
          ` : this.renderFailures()}

          <div class="button-group">
            ${!this.passed ? html`
              <button class="btn btn-secondary" @click=${this.checkSystem}>
                Volver a verificar
              </button>
            ` : ''}
            <button class="btn btn-primary" @click=${this.closeModal}>
              ${this.passed ? 'Continuar' : 'Cerrar'}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'system-checker': SystemChecker;
  }
}
