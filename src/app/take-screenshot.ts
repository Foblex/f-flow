export async function takeScreenshot(tagName: string) {
  const element = document.querySelector(tagName);

  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();

  let theme = 'light';
  if (document.documentElement.classList.contains('dark')) {
    theme = 'dark';
  }

  const filename = element.parentElement!.tagName.toLowerCase() + `.${ theme }.png`;

  const scrollX = window.pageXOffset;
  const scrollY = window.pageYOffset;

  try {
    const displayMediaOptions = {
      video: {
        displaySurface: "browser",
      },
      audio: false,
    };

    const mediaStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    const videoElement = document.createElement('video');
    videoElement.srcObject = mediaStream;

    videoElement.onloadedmetadata = () => {
      videoElement.play();

      const canvas = document.createElement('canvas');
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');

      const scale = window.devicePixelRatio || 1;

      const absoluteX = (rect.left + scrollX) * scale;
      const absoluteY = (rect.top + scrollY) * scale;

      const offsetY = window.outerHeight - window.innerHeight + 120;

      ctx?.drawImage(
        videoElement,
        absoluteX,
        absoluteY + offsetY,
        rect.width * scale,
        rect.height * scale,
        0, 0,
        rect.width,
        rect.height
      );

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = filename;
      link.click();

      mediaStream.getTracks().forEach(track => track.stop());
    };
  } catch (err) {
    console.error("Ошибка: " + err);
  }
}
