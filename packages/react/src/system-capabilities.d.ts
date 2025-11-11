declare module 'system-capabilities' {
  export default class SystemCapabilities {
    constructor();
    getCapabilities(): any;
    checkRequirements(requirements: any, showModal?: boolean): Promise<{ passed: boolean; failures: any[] }>;
    getSummary(): any;
    getCategory(category: string): any;
    hasFeature(feature: string): boolean;
    showModal(failures: any[]): void;
    closeModal(): void;
  }
}
