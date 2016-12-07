import { Credential } from "./credential";

export class TokenCredential implements Credential {

    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    public getToken(): string {
        return this.token;
    }

}
