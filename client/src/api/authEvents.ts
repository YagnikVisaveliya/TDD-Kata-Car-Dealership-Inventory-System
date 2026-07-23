type Handler = () => void;

let unauthorizedHandler: Handler | null = null;

export function onUnauthorized(handler: Handler): void {
  unauthorizedHandler = handler;
}

export function triggerUnauthorized(): void {
  unauthorizedHandler?.();
}