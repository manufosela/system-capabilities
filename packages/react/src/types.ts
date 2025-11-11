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

export interface ValidationFailure {
  category: string;
  property: string;
  required: any;
  actual?: any;
  message: string;
}

export interface ValidationResult {
  passed: boolean;
  failures: ValidationFailure[];
}
