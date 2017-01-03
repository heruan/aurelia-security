import { StorageEngine } from "aurelia-storage";
export declare class Preferences implements StorageEngine {
    get<T>(key: string, type?: new (...args) => T, ...generics: any[]): Promise<T>;
    set<T>(key: string, item: T): Promise<Preferences>;
    remove<T>(key: string): Promise<T>;
}
