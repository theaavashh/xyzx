export type Factory<T> = (container: Container) => T | Promise<T>;

export interface Registration<T> {
  factory: Factory<T>;
  singleton: boolean;
  instance?: T;
}

export class Container {
  private registrations = new Map<string, Registration<unknown>>();
  private resolving = new Set<string>();

  register<T>(token: string, factory: Factory<T>, singleton = true): this {
    this.registrations.set(token, { factory, singleton, instance: undefined });
    return this;
  }

  registerInstance<T>(token: string, instance: T): this {
    this.registrations.set(token, {
      factory: () => instance,
      singleton: true,
      instance,
    });
    return this;
  }

  async resolve<T>(token: string): Promise<T> {
    const registration = this.registrations.get(token);
    if (!registration) {
      throw new Error(`No registration found for token: ${token}`);
    }

    if (registration.singleton && registration.instance) {
      return registration.instance as T;
    }

    if (this.resolving.has(token)) {
      throw new Error(`Circular dependency detected for token: ${token}`);
    }

    this.resolving.add(token);

    try {
      const instance = await registration.factory(this);
      if (registration.singleton) {
        registration.instance = instance;
      }
      return instance as T;
    } finally {
      this.resolving.delete(token);
    }
  }

  has(token: string): boolean {
    return this.registrations.has(token);
  }

  unregister(token: string): boolean {
    return this.registrations.delete(token);
  }

  clear(): void {
    this.registrations.clear();
    this.resolving.clear();
  }

  createScope(): Container {
    const child = new Container();
    for (const [token, registration] of this.registrations) {
      if (registration.singleton && registration.instance) {
        child.registerInstance(token, registration.instance);
      } else {
        child.register(token, registration.factory, registration.singleton);
      }
    }
    return child;
  }
}

export const container = new Container();