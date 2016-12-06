import { HttpRequestMessage } from "aurelia-http-client";
export interface Authenticator {
    authorizeMessage(message: HttpRequestMessage): HttpRequestMessage;
    getScheme(): string;
}
