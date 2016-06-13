import { Credential } from "./credential";
export declare class TokenCredential implements Credential {
    private token;
    constructor(token: string);
    getToken(): string;
}
