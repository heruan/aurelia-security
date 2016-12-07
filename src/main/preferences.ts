import { StorageEngine } from "aurelia-storage";

export class Preferences implements StorageEngine {

    public get<T>(key: string): Promise<T> {
        throw new Error(`${this.constructor.name} must implement ${this.get.name}`);
    }

    public set<T>(key: string, item: T): Promise<Preferences> {
        throw new Error(`${this.constructor.name} must implement ${this.set.name}`);
    }

    public remove<T>(key: string): Promise<T> {
        throw new Error(`${this.constructor.name} must implement ${this.remove.name}`);
    }

}
