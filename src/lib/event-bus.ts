type Listener = (...args: any[]) => void;

interface Events {
  [event: string]: Listener[];
}

class EventBus {
  private events: Events = {};

  on(event: string, listener: Listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }

  // Handy for one-off analytics or global alerts
  toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.emit('app:toast', { message, type });
  }

  log(message: string, context?: any) {
    this.emit('sys:log', { message, context, timestamp: new Date() });
  }
}

export const eventBus = new EventBus();
