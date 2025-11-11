import React, { useState, useEffect, CSSProperties } from 'react';
import { useSystemCapabilities } from './useSystemCapabilities';
import { SystemRequirements } from './types';

export interface SystemCheckerProps {
  requirements?: SystemRequirements;
  autoCheck?: boolean;
  showOnFail?: boolean;
  open?: boolean;
  onCheckComplete?: (result: {
    passed: boolean;
    failures: any[];
    capabilities: any;
  }) => void;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

const getCategoryLabel = (category: string): string => {
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
};

const formatValue = (value: any): string => {
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return value.toString();
};

/**
 * Componente completo con modal para verificar requisitos del sistema
 *
 * @example
 * ```tsx
 * <SystemChecker
 *   requirements={{ features: { webGL: true } }}
 *   autoCheck
 *   showOnFail
 * />
 * ```
 */
export const SystemChecker: React.FC<SystemCheckerProps> = ({
  requirements = {},
  autoCheck = false,
  showOnFail = true,
  open: controlledOpen,
  onCheckComplete,
  onModalOpen,
  onModalClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { status, passed, failures, capabilities, checkSystem } = useSystemCapabilities({
    requirements,
    autoCheck
  });

  const open = controlledOpen !== undefined ? controlledOpen : isOpen;

  useEffect(() => {
    if (!passed && showOnFail && status !== 'checking') {
      openModal();
    }
  }, [passed, showOnFail, status]);

  useEffect(() => {
    if (onCheckComplete && status !== 'checking') {
      onCheckComplete({ passed, failures, capabilities });
    }
  }, [passed, failures, capabilities, status, onCheckComplete]);

  const openModal = () => {
    if (controlledOpen === undefined) {
      setIsOpen(true);
    }
    document.body.style.overflow = 'hidden';
    onModalOpen?.();
  };

  const closeModal = () => {
    if (controlledOpen === undefined) {
      setIsOpen(false);
    }
    document.body.style.overflow = '';
    onModalClose?.();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  if (!open) return null;

  const groupFailuresByCategory = () => {
    const grouped: Record<string, any[]> = {};
    failures.forEach(failure => {
      if (!grouped[failure.category]) {
        grouped[failure.category] = [];
      }
      grouped[failure.category].push(failure);
    });
    return grouped;
  };

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.3s ease'
  };

  const modalStyle: CSSProperties = {
    background: 'white',
    borderRadius: '8px',
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    animation: 'slideIn 0.3s ease'
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const iconStyle: CSSProperties = {
    fontSize: '32px',
    marginRight: '12px',
    color: passed ? '#43a047' : '#e53935'
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: '24px',
    color: '#333',
    flex: 1
  };

  const descriptionStyle: CSSProperties = {
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '20px'
  };

  const summaryGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    margin: '20px 0'
  };

  const summaryCardStyle: CSSProperties = {
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '4px'
  };

  const summaryLabelStyle: CSSProperties = {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px'
  };

  const summaryValueStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#333'
  };

  const successMessageStyle: CSSProperties = {
    padding: '20px',
    background: '#e8f5e9',
    borderLeft: '4px solid #43a047',
    borderRadius: '4px',
    color: '#2e7d32'
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '2px solid #e0e0e0',
    textTransform: 'capitalize'
  };

  const failureItemStyle: CSSProperties = {
    margin: '8px 0',
    padding: '12px',
    background: '#ffebee',
    borderLeft: '4px solid #e53935',
    borderRadius: '4px'
  };

  const failureMessageStyle: CSSProperties = {
    color: '#333',
    marginBottom: '4px'
  };

  const failureDetailsStyle: CSSProperties = {
    fontSize: '12px',
    color: '#666'
  };

  const codeStyle: CSSProperties = {
    background: '#f5f5f5',
    padding: '2px 6px',
    borderRadius: '3px',
    fontFamily: '"Courier New", monospace'
  };

  const buttonGroupStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  };

  const btnBaseStyle: CSSProperties = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s'
  };

  const btnPrimaryStyle: CSSProperties = {
    ...btnBaseStyle,
    background: '#2196f3',
    color: 'white',
    flex: 1
  };

  const btnSecondaryStyle: CSSProperties = {
    ...btnBaseStyle,
    background: '#e0e0e0',
    color: '#333'
  };

  const grouped = groupFailuresByCategory();

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div style={modalStyle} role="dialog" aria-modal="true">
        <div style={headerStyle}>
          <div style={iconStyle}>{passed ? '✓' : '⚠'}</div>
          <h2 style={titleStyle}>
            {passed ? 'Sistema Compatible' : 'Requisitos No Cumplidos'}
          </h2>
        </div>

        <div style={descriptionStyle}>
          {passed
            ? 'Tu navegador y dispositivo cumplen con todos los requisitos necesarios.'
            : 'Tu navegador o dispositivo no cumple con algunos requisitos mínimos necesarios para ejecutar esta aplicación correctamente.'}
        </div>

        {capabilities && (
          <div style={summaryGridStyle}>
            <div style={summaryCardStyle}>
              <div style={summaryLabelStyle}>Navegador</div>
              <div style={summaryValueStyle}>{capabilities.browser?.platform || 'N/A'}</div>
            </div>
            <div style={summaryCardStyle}>
              <div style={summaryLabelStyle}>Memoria</div>
              <div style={summaryValueStyle}>{capabilities.device?.deviceMemory || 'N/A'} GB</div>
            </div>
            <div style={summaryCardStyle}>
              <div style={summaryLabelStyle}>Núcleos CPU</div>
              <div style={summaryValueStyle}>{capabilities.device?.hardwareConcurrency || 'N/A'}</div>
            </div>
            <div style={summaryCardStyle}>
              <div style={summaryLabelStyle}>Resolución</div>
              <div style={summaryValueStyle}>
                {capabilities.screen ? `${capabilities.screen.width}x${capabilities.screen.height}` : 'N/A'}
              </div>
            </div>
          </div>
        )}

        {passed ? (
          <div style={successMessageStyle}>
            <strong>¡Perfecto!</strong> Todos los requisitos se cumplen correctamente.
          </div>
        ) : (
          Object.keys(grouped).map(category => (
            <div key={category} style={{ margin: '20px 0' }}>
              <div style={sectionTitleStyle}>{getCategoryLabel(category)}</div>
              {grouped[category].map((failure, idx) => (
                <div key={idx} style={failureItemStyle}>
                  <div style={failureMessageStyle}>
                    <strong>✗</strong> {failure.message}
                  </div>
                  <div style={failureDetailsStyle}>
                    Requerido: <code style={codeStyle}>{formatValue(failure.required)}</code>
                    {failure.actual !== undefined && (
                      <> | Actual: <code style={codeStyle}>{formatValue(failure.actual)}</code></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        <div style={buttonGroupStyle}>
          {!passed && (
            <button style={btnSecondaryStyle} onClick={checkSystem}>
              Volver a verificar
            </button>
          )}
          <button style={btnPrimaryStyle} onClick={closeModal}>
            {passed ? 'Continuar' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
};
