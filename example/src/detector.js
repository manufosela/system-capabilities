/**
 * Detector de capacidades del sistema del navegador
 */
class SystemDetector {
  constructor() {
    this.capabilities = null;
  }

  /**
   * Detecta todas las capacidades del sistema
   */
  detect() {
    this.capabilities = {
      // Información del navegador
      browser: this.getBrowserInfo(),

      // Información del dispositivo
      device: this.getDeviceInfo(),

      // Capacidades de hardware
      hardware: this.getHardwareInfo(),

      // Capacidades de red
      network: this.getNetworkInfo(),

      // Características de la pantalla
      screen: this.getScreenInfo(),

      // APIs y características soportadas
      features: this.getFeatures(),

      // Capacidades de almacenamiento
      storage: this.getStorageInfo(),

      // Información de rendimiento
      performance: this.getPerformanceInfo(),

      // Sensores y permisos
      sensors: this.getSensorsInfo(),

      // Información de medios
      media: this.getMediaInfo()
    };

    return this.capabilities;
  }

  /**
   * Obtiene la información del navegador
   */
  getBrowserInfo() {
    const ua = navigator.userAgent;
    return {
      userAgent: ua,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      vendor: navigator.vendor,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      onLine: navigator.onLine
    };
  }

  /**
   * Obtiene la información del dispositivo
   */
  getDeviceInfo() {
    return {
      deviceMemory: navigator.deviceMemory || null,
      hardwareConcurrency: navigator.hardwareConcurrency || null,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      mobile: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
    };
  }

  /**
   * Obtiene la información de hardware
   */
  getHardwareInfo() {
    const info = {
      cores: navigator.hardwareConcurrency || null,
      memory: navigator.deviceMemory || null
    };

    // Intentar obtener info de batería (si está disponible)
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        info.battery = {
          charging: battery.charging,
          level: battery.level,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      });
    }

    return info;
  }

  /**
   * Obtiene la información de red
   */
  getNetworkInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) {
      return { available: false };
    }

    return {
      available: true,
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
      type: connection.type
    };
  }

  /**
   * Obtiene la información de la pantalla
   */
  getScreenInfo() {
    return {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: screen.orientation ? screen.orientation.type : null,
      devicePixelRatio: window.devicePixelRatio,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  }

  /**
   * Detecta características y APIs soportadas
   */
  getFeatures() {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      webGL: this.checkWebGL(),
      webGL2: this.checkWebGL2(),
      webRTC: 'RTCPeerConnection' in window,
      webAssembly: typeof WebAssembly !== 'undefined',
      webWorker: typeof Worker !== 'undefined',
      sharedWorker: typeof SharedWorker !== 'undefined',
      indexedDB: 'indexedDB' in window,
      localStorage: this.checkLocalStorage(),
      sessionStorage: this.checkSessionStorage(),
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      vibration: 'vibrate' in navigator,
      bluetooth: 'bluetooth' in navigator,
      usb: 'usb' in navigator,
      mediaDevices: 'mediaDevices' in navigator,
      permissions: 'permissions' in navigator,
      clipboard: 'clipboard' in navigator,
      share: 'share' in navigator,
      wakeLock: 'wakeLock' in navigator,
      accelerometer: 'Accelerometer' in window,
      gyroscope: 'Gyroscope' in window,
      magnetometer: 'Magnetometer' in window,
      ambientLight: 'AmbientLightSensor' in window,
      proximiry: 'ProximitySensor' in window,
      webXR: 'xr' in navigator,
      webMIDI: 'requestMIDIAccess' in navigator,
      webSpeech: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
      canvas: this.checkCanvas(),
      svg: this.checkSVG(),
      touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      pointer: 'PointerEvent' in window,
      intersection: 'IntersectionObserver' in window,
      mutation: 'MutationObserver' in window,
      resize: 'ResizeObserver' in window,
      performance: 'performance' in window,
      crypto: 'crypto' in window,
      fullscreen: document.fullscreenEnabled || document.webkitFullscreenEnabled,
      pictureInPicture: document.pictureInPictureEnabled
    };
  }

  /**
   * Verifica soporte de WebGL
   */
  checkWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Verifica soporte de WebGL 2
   */
  checkWebGL2() {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch (e) {
      return false;
    }
  }

  /**
   * Verifica soporte de Canvas
   */
  checkCanvas() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Verifica soporte de SVG
   */
  checkSVG() {
    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
  }

  /**
   * Verifica localStorage
   */
  checkLocalStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Verifica sessionStorage
   */
  checkSessionStorage() {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Obtiene información de almacenamiento
   */
  getStorageInfo() {
    const info = {
      localStorage: this.checkLocalStorage(),
      sessionStorage: this.checkSessionStorage(),
      indexedDB: 'indexedDB' in window,
      cookies: navigator.cookieEnabled
    };

    // Intentar obtener la cuota de almacenamiento
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        info.quota = estimate.quota;
        info.usage = estimate.usage;
        info.usagePercentage = (estimate.usage / estimate.quota * 100).toFixed(2);
      });
    }

    return info;
  }

  /**
   * Obtiene información de rendimiento
   */
  getPerformanceInfo() {
    if (!('performance' in window)) {
      return { available: false };
    }

    const perf = window.performance;
    const timing = perf.timing;
    const memory = perf.memory;

    return {
      available: true,
      navigation: {
        type: perf.navigation ? perf.navigation.type : null,
        redirectCount: perf.navigation ? perf.navigation.redirectCount : null
      },
      timing: timing ? {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        responseTime: timing.responseEnd - timing.requestStart,
        renderTime: timing.domComplete - timing.domLoading
      } : null,
      memory: memory ? {
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize
      } : null
    };
  }

  /**
   * Obtiene información de sensores
   */
  getSensorsInfo() {
    return {
      accelerometer: 'Accelerometer' in window,
      gyroscope: 'Gyroscope' in window,
      magnetometer: 'Magnetometer' in window,
      ambientLight: 'AmbientLightSensor' in window,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      deviceMotion: 'DeviceMotionEvent' in window
    };
  }

  /**
   * Obtiene información de capacidades de medios
   */
  getMediaInfo() {
    const info = {
      mediaDevices: 'mediaDevices' in navigator,
      getUserMedia: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia),
      mediaRecorder: 'MediaRecorder' in window,
      webRTC: 'RTCPeerConnection' in window
    };

    // Codecs de audio
    const audio = document.createElement('audio');
    info.audioCodecs = {
      mp3: !!audio.canPlayType && audio.canPlayType('audio/mpeg') !== '',
      ogg: !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs="vorbis"') !== '',
      wav: !!audio.canPlayType && audio.canPlayType('audio/wav; codecs="1"') !== '',
      aac: !!audio.canPlayType && audio.canPlayType('audio/aac') !== '',
      webm: !!audio.canPlayType && audio.canPlayType('audio/webm') !== ''
    };

    // Codecs de video
    const video = document.createElement('video');
    info.videoCodecs = {
      h264: !!video.canPlayType && video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '',
      webm: !!video.canPlayType && video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '',
      ogg: !!video.canPlayType && video.canPlayType('video/ogg; codecs="theora"') !== '',
      vp9: !!video.canPlayType && video.canPlayType('video/webm; codecs="vp9"') !== '',
      av1: !!video.canPlayType && video.canPlayType('video/mp4; codecs="av01"') !== ''
    };

    return info;
  }

  /**
   * Obtiene las capacidades detectadas
   */
  getCapabilities() {
    if (!this.capabilities) {
      this.detect();
    }
    return this.capabilities;
  }
}

export default SystemDetector;
