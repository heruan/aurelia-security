import { Credential } from "./credential";
export declare class PasswordCredential implements Credential {
    private identity;
    private password;
    constructor(identity: string, password: string);
    getIdentity(): string;
    getPassword(): string;
}
