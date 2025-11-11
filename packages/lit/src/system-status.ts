import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import SystemCapabilities from 'system-capabilities';

export type StatusLevel = 'success' | 'warning' | 'error' | 'checking';
export type Size = 'small' | 'medium' | 'large';

export interface SystemRequirements {
  features?: Record<string, boolean>;
  device?: {
    minMemory?: number;
    minCores?: number;
    mobile?: boolean;
    touchRequired?: boolean;
  };
  screen?: {
    minWidth?: number;
    minHeight?: number;
    minColorDepth?: number;
    minDevicePixelRatio?: number;
  };
  network?: {
    required?: boolean;
    minDownlink?: number;
    maxRTT?: number;
    effectiveType?: string;
  };
  hardware?: {
    minCores?: number;
    minMemory?: number;
  };
  storage?: {
    localStorage?: boolean;
    sessionStorage?: boolean;
    indexedDB?: boolean;
    minQuota?: number;
  };
  media?: {
    mediaDevices?: boolean;
    webRTC?: boolean;
    audioCodecs?: Record<string, boolean>;
    videoCodecs?: Record<string, boolean>;
  };
}

/**
 * Círculo de estado que muestra el nivel de compatibilidad del sistema
 *
 * @element system-status
 *
 * @prop {SystemRequirements} requirements - Requisitos del sistema a validar
 * @prop {Size} size - Tamaño del círculo: 'small', 'medium', 'large'
 * @prop {boolean} autoCheck - Si debe verificar automáticamente al cargar
 * @prop {boolean} showTooltip - Si debe mostrar tooltip con información
 *
 * @fires status-change - Se dispara cuando cambia el estado
 * @fires click - Se dispara al hacer click en el círculo
 *
 * @example
 * ```html
 * <system-status
 *   .requirements=${{ features: { webGL: true } }}
 *   size="medium"
 *   autoCheck
 * ></system-status>
 * ```
 */
@customElement('system-status')
export class SystemStatus extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      cursor: pointer;
    }

    .status-circle {
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .status-circle:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .status-circle.small {
      width: 24px;
      height: 24px;
    }

    .status-circle.medium {
      width: 48px;
      height: 48px;
    }

    .status-circle.large {
      width: 72px;
      height: 72px;
    }

    .status-circle.success {
      background: linear-gradient(135deg, #66bb6a, #43a047);
    }

    .status-circle.warning {
      background: linear-gradient(135deg, #ffa726, #fb8c00);
    }

    .status-circle.error {
      background: linear-gradient(135deg, #ef5350, #e53935);
    }

    .status-circle.checking {
      background: linear-gradient(135deg, #78909c, #546e7a);
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }

    .icon {
      color: white;
      font-size: 0.6em;
      font-weight: bold;
    }

    .tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
      z-index: 1000;
    }

    .status-circle:hover .tooltip {
      opacity: 1;
    }

    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.9);
    }
  `;

  @property({ type: Object })
  requirements: SystemRequirements = {};

  @property({ type: String })
  size: Size = 'medium';

  @property({ type: Boolean })
  autoCheck = false;

  @property({ type: Boolean })
  showTooltip = true;

  @state()
  private status: StatusLevel = 'checking';

  @state()
  private message = 'Verificando...';

  @state()
  private failures: any[] = [];

  private capabilities = new SystemCapabilities();

  connectedCallback() {
    super.connectedCallback();
    if (this.autoCheck) {
      this.checkSystem();
    }
  }

  async checkSystem() {
    this.status = 'checking';
    this.message = 'Verificando...';

    try {
      const result = await this.capabilities.checkRequirements(this.requirements, false);
      this.failures = result.failures;

      if (result.passed) {
        this.status = 'success';
        this.message = 'Sistema compatible';
      } else {
        // Determinar si son fallos críticos o advertencias
        const criticalFailures = result.failures.filter((f: any) =>
          f.category === 'features' || f.category === 'device'
        );

        if (criticalFailures.length > 0) {
          this.status = 'error';
          this.message = `${result.failures.length} problema(s) detectado(s)`;
        } else {
          this.status = 'warning';
          this.message = `${result.failures.length} advertencia(s)`;
        }
      }

      this.dispatchEvent(new CustomEvent('status-change', {
        detail: {
          status: this.status,
          failures: this.failures,
          message: this.message
        },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      this.status = 'error';
      this.message = 'Error al verificar';
      console.error('Error checking system:', error);
    }
  }

  private handleClick() {
    this.dispatchEvent(new CustomEvent('click', {
      detail: {
        status: this.status,
        failures: this.failures,
        capabilities: this.capabilities.getCapabilities()
      },
      bubbles: true,
      composed: true
    }));
  }

  private getIcon() {
    switch (this.status) {
      case 'success':
        return '✓';
      case 'warning':
        return '!';
      case 'error':
        return '✕';
      case 'checking':
        return '...';
      default:
        return '';
    }
  }

  render() {
    return html`
      <div
        class="status-circle ${this.size} ${this.status}"
        @click=${this.handleClick}
        role="button"
        aria-label="${this.message}"
        tabindex="0"
      >
        <span class="icon">${this.getIcon()}</span>
        ${this.showTooltip ? html`
          <div class="tooltip">${this.message}</div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'system-status': SystemStatus;
  }
}
