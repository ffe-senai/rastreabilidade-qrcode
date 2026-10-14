// Barramento mínimo. O App Shell deve fornecer um objeto com a mesma forma:
//   { subscribe(handler) => unsubscribe, publish(event) }
export function createLocalBus() {
  const handlers = new Set();
  return {
    subscribe(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    publish(event) {
      handlers.forEach((h) => h(event));
    },
  };
}
