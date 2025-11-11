import { useState, useEffect, useCallback } from 'react';
import SystemCapabilities from 'system-capabilities';
import { SystemRequirements, StatusLevel, ValidationResult } from './types';

export interface UseSystemCapabilitiesOptions {
  requirements?: SystemRequirements;
  autoCheck?: boolean;
}

export interface UseSystemCapabilitiesReturn {
  status: StatusLevel;
  passed: boolean;
  failures: any[];
  capabilities: any | null;
  checkSystem: () => Promise<void>;
  isChecking: boolean;
}

/**
 * Hook de React para detectar capacidades del sistema y validar requisitos
 *
 * @param options - Opciones de configuración
 * @returns Estado y funciones para verificar el sistema
 *
 * @example
 * ```tsx
 * const { status, passed, checkSystem } = useSystemCapabilities({
 *   requirements: { features: { webGL: true } },
 *   autoCheck: true
 * });
 * ```
 */
export function useSystemCapabilities(
  options: UseSystemCapabilitiesOptions = {}
): UseSystemCapabilitiesReturn {
  const { requirements = {}, autoCheck = false } = options;

  const [status, setStatus] = useState<StatusLevel>('checking');
  const [passed, setPassed] = useState(true);
  const [failures, setFailures] = useState<any[]>([]);
  const [capabilities, setCapabilities] = useState<any | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [systemCaps] = useState(() => new SystemCapabilities());

  const checkSystem = useCallback(async () => {
    setIsChecking(true);
    setStatus('checking');

    try {
      const caps = systemCaps.getCapabilities();
      setCapabilities(caps);

      if (Object.keys(requirements).length > 0) {
        const result: ValidationResult = await systemCaps.checkRequirements(requirements, false);
        setPassed(result.passed);
        setFailures(result.failures);

        if (result.passed) {
          setStatus('success');
        } else {
          // Determinar si son fallos críticos o advertencias
          const criticalFailures = result.failures.filter((f: any) =>
            f.category === 'features' || f.category === 'device'
          );

          setStatus(criticalFailures.length > 0 ? 'error' : 'warning');
        }
      } else {
        setStatus('success');
        setPassed(true);
      }
    } catch (error) {
      console.error('Error checking system:', error);
      setStatus('error');
      setPassed(false);
    } finally {
      setIsChecking(false);
    }
  }, [requirements, systemCaps]);

  useEffect(() => {
    if (autoCheck) {
      checkSystem();
    }
  }, [autoCheck, checkSystem]);

  return {
    status,
    passed,
    failures,
    capabilities,
    checkSystem,
    isChecking
  };
}
