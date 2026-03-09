import html2canvas from 'html2canvas';

const EXTERNAL_COMPONENT_SELECTOR = 'external-component';
const NATIVE_CAPTURE_SELECTOR = 'iframe, video, canvas';
const SCREENSHOT_TARGET_ATTRIBUTE = 'data-screenshot-target';
const TRANSPARENT_BACKGROUND = 'rgba(0, 0, 0, 0)';

export function isScreenshotShortcut(event: KeyboardEvent): boolean {
  const hasPrimaryModifier = event.metaKey || event.ctrlKey;

  return (
    hasPrimaryModifier &&
    event.shiftKey &&
    !event.altKey &&
    (event.key.toLowerCase() === 's' || event.code === 'KeyS')
  );
}

export function findScreenshotTarget(root: Document = document): HTMLElement | null {
  return (
    _findClosestExternalComponent(root.fullscreenElement) ??
    root.querySelector<HTMLElement>(`${EXTERNAL_COMPONENT_SELECTOR}:hover`) ??
    _findClosestExternalComponent(root.activeElement) ??
    _getBestVisibleExternalComponent(root)
  );
}

export async function takeScreenshot(
  target: string | HTMLElement = EXTERNAL_COMPONENT_SELECTOR,
): Promise<boolean> {
  const selectedElement =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;

  if (!selectedElement) {
    console.warn('Screenshot target was not found.');
    return false;
  }

  const captureTarget = _resolveCaptureTarget(selectedElement);

  try {
    const image =
      _requiresNativeCapture(captureTarget.element) && _supportsDisplayMediaCapture()
        ? await _takeDisplayMediaScreenshot(captureTarget.host)
        : await _takeDomScreenshot(captureTarget.element);

    if (!image) {
      return false;
    }

    _downloadImage(image, _buildFileName(captureTarget.host));
    return true;
  } catch (error) {
    console.error('Unable to create screenshot.', error);
    return false;
  }
}

function _getBestVisibleExternalComponent(root: Document): HTMLElement | null {
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(EXTERNAL_COMPONENT_SELECTOR),
  ).filter(_isVisible);

  if (!elements.length) {
    return null;
  }

  return (
    elements
      .map((element) => ({ element, area: _getVisibleArea(element) }))
      .sort((a, b) => b.area - a.area)[0]?.element ?? elements[0]
  );
}

function _resolveCaptureTarget(element: HTMLElement): { host: HTMLElement; element: HTMLElement } {
  const host = element.matches(EXTERNAL_COMPONENT_SELECTOR)
    ? element
    : (element.closest<HTMLElement>(EXTERNAL_COMPONENT_SELECTOR) ?? element);

  return {
    host,
    element: _getPreferredCaptureElement(host),
  };
}

function _getPreferredCaptureElement(host: HTMLElement): HTMLElement {
  const contentChild = Array.from(host.children).find((child): child is HTMLElement => {
    return child instanceof HTMLElement && !child.classList.contains('f-fullscreen-button');
  });

  return contentChild ?? host;
}

function _findClosestExternalComponent(node: Element | null): HTMLElement | null {
  return node?.closest<HTMLElement>(EXTERNAL_COMPONENT_SELECTOR) ?? null;
}

function _isVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    styles.display !== 'none' &&
    styles.visibility !== 'hidden' &&
    styles.opacity !== '0'
  );
}

function _getVisibleArea(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const visibleWidth = Math.max(
    0,
    Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0),
  );
  const visibleHeight = Math.max(
    0,
    Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
  );

  return visibleWidth * visibleHeight;
}

function _supportsDisplayMediaCapture(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getDisplayMedia;
}

function _requiresNativeCapture(element: HTMLElement): boolean {
  return (
    element.matches(NATIVE_CAPTURE_SELECTOR) || !!element.querySelector(NATIVE_CAPTURE_SELECTOR)
  );
}

async function _takeDomScreenshot(element: HTMLElement): Promise<string> {
  const dimensions = _measureCaptureDimensions(element);
  element.setAttribute(SCREENSHOT_TARGET_ATTRIBUTE, '');

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: _resolveBackgroundColor(element),
      height: dimensions.height,
      logging: false,
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true,
      width: dimensions.width,
      windowHeight: dimensions.height,
      windowWidth: dimensions.width,
      onclone: (clonedDocument) => {
        const clonedElement = clonedDocument.querySelector<HTMLElement>(
          `[${SCREENSHOT_TARGET_ATTRIBUTE}]`,
        );
        if (!clonedElement) {
          return;
        }

        clonedElement.style.display = 'block';
        clonedElement.style.width = `${dimensions.width}px`;
        clonedElement.style.height = `${dimensions.height}px`;
        clonedElement.style.maxWidth = 'none';
        clonedElement.style.maxHeight = 'none';
        clonedElement.style.overflow = 'visible';

        _releaseClippingOnClone(clonedElement);
      },
    });

    return canvas.toDataURL('image/png');
  } finally {
    element.removeAttribute(SCREENSHOT_TARGET_ATTRIBUTE);
  }
}

async function _takeDisplayMediaScreenshot(element: HTMLElement): Promise<string | null> {
  const rect = element.getBoundingClientRect();

  const mediaStream = await navigator.mediaDevices.getDisplayMedia(_buildDisplayMediaOptions());
  const [videoTrack] = mediaStream.getVideoTracks();

  _warnIfCapturedSurfaceIsNotBrowserTab(videoTrack?.getSettings());

  try {
    const videoElement = document.createElement('video');
    videoElement.srcObject = mediaStream;

    await new Promise<void>((resolve, reject) => {
      videoElement.onloadedmetadata = () => resolve();
      videoElement.onerror = () => reject(new Error('Unable to read captured stream.'));
    });

    await videoElement.play();
    await _waitForCapturedFrame(videoElement);

    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const scaleX = videoElement.videoWidth / viewportWidth;
    const scaleY = videoElement.videoHeight / viewportHeight;

    const sourceX = Math.max(0, Math.round(rect.left * scaleX));
    const sourceY = Math.max(0, Math.round(rect.top * scaleY));
    const sourceWidth = Math.max(1, Math.round(rect.width * scaleX));
    const sourceHeight = Math.max(1, Math.round(rect.height * scaleY));

    const canvas = document.createElement('canvas');
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.drawImage(
      videoElement,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      sourceWidth,
      sourceHeight,
    );

    return canvas.toDataURL('image/png');
  } finally {
    mediaStream.getTracks().forEach((track) => track.stop());
  }
}

function _buildDisplayMediaOptions(): DisplayMediaStreamOptions {
  return {
    video: {
      displaySurface: 'browser',
      // Chromium understands these hints and usually offers the current tab first.
      // They are ignored by browsers that do not support them.
      ...({
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
        surfaceSwitching: 'exclude',
      } as MediaTrackConstraints),
    },
    audio: false,
  };
}

function _warnIfCapturedSurfaceIsNotBrowserTab(settings?: MediaTrackSettings): void {
  const displaySurface = settings?.displaySurface;

  if (displaySurface && displaySurface !== 'browser') {
    console.warn(
      `For accurate cropping select the current browser tab. Captured surface: ${displaySurface}.`,
    );
  }
}

function _waitForCapturedFrame(videoElement: HTMLVideoElement): Promise<void> {
  if ('requestVideoFrameCallback' in videoElement) {
    return new Promise((resolve) => {
      videoElement.requestVideoFrameCallback(() => resolve());
    });
  }

  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function _measureCaptureDimensions(element: HTMLElement): { width: number; height: number } {
  const rect = element.getBoundingClientRect();

  return {
    width: Math.max(
      1,
      Math.ceil(rect.width),
      Math.ceil(element.scrollWidth),
      Math.ceil(element.clientWidth),
    ),
    height: Math.max(
      1,
      Math.ceil(rect.height),
      Math.ceil(element.scrollHeight),
      Math.ceil(element.clientHeight),
    ),
  };
}

function _releaseClippingOnClone(element: HTMLElement): void {
  let current: HTMLElement | null = element;

  while (current && current.tagName.toLowerCase() !== 'body') {
    if (
      current.classList.contains('f-flow') ||
      current.classList.contains('f-example-view') ||
      current.style.overflow === 'hidden'
    ) {
      current.style.overflow = 'visible';
    }

    current = current.parentElement;
  }
}

function _resolveBackgroundColor(element: HTMLElement): string {
  let currentElement: HTMLElement | null = element;

  while (currentElement) {
    const backgroundColor = window.getComputedStyle(currentElement).backgroundColor;

    if (
      backgroundColor &&
      backgroundColor !== 'transparent' &&
      backgroundColor !== TRANSPARENT_BACKGROUND
    ) {
      return backgroundColor;
    }

    currentElement = currentElement.parentElement;
  }

  return document.documentElement.classList.contains('dark') ? '#101010' : '#ffffff';
}

function _buildFileName(element: HTMLElement): string {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const pathName =
    window.location.pathname.split('/').filter(Boolean).at(-1) || element.tagName.toLowerCase();

  const visibleElements = Array.from(
    document.querySelectorAll<HTMLElement>(EXTERNAL_COMPONENT_SELECTOR),
  ).filter(_isVisible);
  const elementIndex = visibleElements.indexOf(element);
  const suffix = visibleElements.length > 1 && elementIndex >= 0 ? `-${elementIndex + 1}` : '';

  return `${_sanitizeFileName(pathName)}${suffix}.${theme}.png`;
}

function _sanitizeFileName(value: string): string {
  return value
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function _downloadImage(image: string, filename: string): void {
  const link = document.createElement('a');
  link.href = image;
  link.download = filename;
  link.click();
}
