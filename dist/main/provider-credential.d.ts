import { Credential } from "./credential";
export declare class ProviderCredential implements Credential {
    private provider;
    private code;
    constructor(provider: string, code: string);
    getProvider(): string;
    getCode(): string;
}
