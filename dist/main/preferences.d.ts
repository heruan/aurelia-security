import { StorageEngine } from "aurelia-storage";
export declare class Preferences implements StorageEngine {
    get<T>(key: string): Promise<T>;
    set<T>(key: string, item: T): Promise<Preferences>;
    remove<T>(key: string): Promise<T>;
}
