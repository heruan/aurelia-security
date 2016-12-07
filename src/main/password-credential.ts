import { Credential } from "./credential";

export class PasswordCredential implements Credential {

    private identity: string;

    private password: string;

    constructor(identity: string, password: string) {
        this.identity = identity;
        this.password = password;
    }

    public getIdentity(): string {
        return this.identity;
    }

    public getPassword(): string {
        return this.password;
    }

}
