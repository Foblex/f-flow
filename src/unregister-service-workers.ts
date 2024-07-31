export async function unregisterServiceWorkers(): Promise<boolean> {
  if (!navigator.serviceWorker) {
    return false;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();

  registrations.forEach(registration => registration.unregister());

  return registrations.length > 0;
}
