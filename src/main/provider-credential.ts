import { Credential } from "./credential";

export class ProviderCredential implements Credential {

    private provider: string;

    private code: string;

    constructor(provider: string, code: string) {
        this.provider = provider;
        this.code = code;
    }

    public getProvider(): string {
        return this.provider;
    }

    public getCode(): string {
        return this.code;
    }

}
