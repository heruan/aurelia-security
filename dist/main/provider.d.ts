export interface Provider {
    requestAuthorization(...scope: string[]): void;
}
