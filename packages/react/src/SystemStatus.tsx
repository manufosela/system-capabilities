import React, { CSSProperties } from 'react';
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

const statusMessages = {
  success: 'Sistema compatible',
  warning: 'Advertencias detectadas',
  error: 'Problemas detectados',
  checking: 'Verificando...'
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

  const circleSize = sizeMap[size];

  const handleClick = () => {
    if (onClick) {
      onClick({ status, failures, capabilities });
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
    cursor: onClick ? 'pointer' : 'default',
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
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-8px)',
    background: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 1000
  };

  const [showTooltipState, setShowTooltipState] = React.useState(false);

  return (
    <div
      style={circleStyle}
      className={`system-status ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltipState(true)}
      onMouseLeave={() => setShowTooltipState(false)}
      role="button"
      tabIndex={0}
      aria-label={statusMessages[status]}
    >
      <span>{statusIcons[status]}</span>
      {showTooltip && showTooltipState && (
        <div style={tooltipStyle}>
          {failures.length > 0
            ? `${failures.length} problema(s) detectado(s)`
            : statusMessages[status]}
        </div>
      )}
    </div>
  );
};
