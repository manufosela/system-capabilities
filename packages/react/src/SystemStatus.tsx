import React, { CSSProperties, useState, useEffect, useRef } from 'react';
import { useSystemCapabilities } from './useSystemCapabilities';
import { SystemRequirements, Size, StatusLevel } from './types';

export interface SystemStatusProps {
  requirements?: SystemRequirements;
  size?: Size;
  autoCheck?: boolean;
  showTooltip?: boolean;
  onClick?: (data: {
    status: StatusLevel;
    failures: any[];
    capabilities: any;
    systemInfo: any;
  }) => void;
  style?: CSSProperties;
  className?: string;
}

const sizeMap = {
  small: 24,
  medium: 48,
  large: 72
};

const statusColors = {
  success: 'linear-gradient(135deg, #66bb6a, #43a047)',
  warning: 'linear-gradient(135deg, #ffa726, #fb8c00)',
  error: 'linear-gradient(135deg, #ef5350, #e53935)',
  checking: 'linear-gradient(135deg, #78909c, #546e7a)'
};

const statusIcons = {
  success: '✓',
  warning: '!',
  error: '✕',
  checking: '...'
};

/**
 * Componente de círculo de estado que muestra el nivel de compatibilidad del sistema
 *
 * @example
 * ```tsx
 * <SystemStatus
 *   requirements={{ features: { webGL: true } }}
 *   size="medium"
 *   autoCheck
 * />
 * ```
 */
export const SystemStatus: React.FC<SystemStatusProps> = ({
  requirements = {},
  size = 'medium',
  autoCheck = false,
  showTooltip = true,
  onClick,
  style,
  className = ''
}) => {
  const { status, failures, capabilities } = useSystemCapabilities({
    requirements,
    autoCheck
  });

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (capabilities) {
      // Obtener resumen del sistema
      const summary = {
        browser: {
          platform: capabilities.browser?.platform || 'Unknown',
          online: capabilities.browser?.onLine ?? true
        },
        device: {
          memory: capabilities.device?.deviceMemory || 'N/A',
          cores: capabilities.device?.hardwareConcurrency || 'N/A',
          touch: (capabilities.device?.maxTouchPoints || 0) > 0
        },
        screen: {
          resolution: `${capabilities.screen?.width || 0}x${capabilities.screen?.height || 0}`,
          pixelRatio: capabilities.screen?.devicePixelRatio || 1
        },
        network: {
          available: capabilities.network?.available ?? false,
          type: capabilities.network?.effectiveType || 'N/A',
          downlink: capabilities.network?.downlink || 'N/A'
        }
      };
      setSystemInfo(summary);
    }
  }, [capabilities]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setTooltipVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const circleSize = sizeMap[size];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTooltipVisible(!tooltipVisible);

    if (onClick) {
      onClick({ status, failures, capabilities, systemInfo });
    }
  };

  const circleStyle: CSSProperties = {
    width: circleSize,
    height: circleSize,
    borderRadius: '50%',
    background: statusColors[status],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    color: 'white',
    fontSize: `${circleSize * 0.4}px`,
    fontWeight: 'bold',
    userSelect: 'none',
    ...style
  };

  const tooltipStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%) translateY(8px)',
    background: 'rgba(0, 0, 0, 0.95)',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '13px',
    minWidth: '280px',
    maxWidth: '400px',
    opacity: tooltipVisible ? 1 : 0,
    pointerEvents: tooltipVisible ? 'auto' : 'none',
    transition: 'opacity 0.3s',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    whiteSpace: 'normal'
  };

  const tooltipArrowStyle: CSSProperties = {
    content: '',
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '6px solid rgba(0, 0, 0, 0.95)'
  };

  const tooltipHeaderStyle: CSSProperties = {
    fontWeight: 'bold',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const tooltipSectionStyle: CSSProperties = {
    margin: '8px 0'
  };

  const tooltipLabelStyle: CSSProperties = {
    fontSize: '11px',
    opacity: 0.7,
    marginBottom: '4px'
  };

  const tooltipValueStyle: CSSProperties = {
    fontWeight: 500
  };

  const tooltipFailureStyle: CSSProperties = {
    color: '#ff6b6b',
    marginTop: '4px',
    fontSize: '12px'
  };

  const getMessage = () => {
    if (status === 'checking') return 'Verificando...';
    if (status === 'success') return 'Sistema compatible';
    if (status === 'warning') return `${failures.length} advertencia(s)`;
    return `${failures.length} problema(s) detectado(s)`;
  };

  return (
    <div
      ref={containerRef}
      style={{ display: 'inline-block', position: 'relative' }}
      className={`system-status ${className}`}
    >
      <div
        style={circleStyle}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={getMessage()}
      >
        <span>{statusIcons[status]}</span>
      </div>

      {showTooltip && systemInfo && (
        <div style={tooltipStyle}>
          <div style={tooltipArrowStyle} />

          <div style={tooltipHeaderStyle}>{getMessage()}</div>

          <div style={tooltipSectionStyle}>
            <div style={tooltipLabelStyle}>Sistema</div>
            <div style={tooltipValueStyle}>
              {systemInfo.browser.platform} - {systemInfo.browser.online ? 'Online' : 'Offline'}
            </div>
          </div>

          <div style={tooltipSectionStyle}>
            <div style={tooltipLabelStyle}>Hardware</div>
            <div style={tooltipValueStyle}>
              {systemInfo.device.memory}GB RAM ·{' '}
              {systemInfo.device.cores} cores ·{' '}
              {systemInfo.device.touch ? 'Touch' : 'No touch'}
            </div>
          </div>

          <div style={tooltipSectionStyle}>
            <div style={tooltipLabelStyle}>Pantalla</div>
            <div style={tooltipValueStyle}>
              {systemInfo.screen.resolution} ·{' '}
              {systemInfo.screen.pixelRatio}x DPR
            </div>
          </div>

          {systemInfo.network.available && (
            <div style={tooltipSectionStyle}>
              <div style={tooltipLabelStyle}>Red</div>
              <div style={tooltipValueStyle}>
                {systemInfo.network.type} ·{' '}
                {systemInfo.network.downlink}Mbps
              </div>
            </div>
          )}

          {failures.length > 0 && (
            <div style={tooltipSectionStyle}>
              <div style={tooltipLabelStyle}>Problemas detectados</div>
              {failures.slice(0, 3).map((f, i) => (
                <div key={i} style={tooltipFailureStyle}>
                  ✗ {f.message}
                </div>
              ))}
              {failures.length > 3 && (
                <div style={tooltipFailureStyle}>
                  ... y {failures.length - 3} más
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
