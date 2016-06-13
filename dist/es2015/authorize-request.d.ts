import { Interceptor, HttpRequestMessage, HttpResponseMessage } from "aurelia-http-client";
import { SecurityContext } from "./security-context";
export declare class AuthorizeRequest implements Interceptor {
    private securityContext;
    constructor(securityContext: SecurityContext);
    request(message: HttpRequestMessage): HttpRequestMessage;
    responseError(message: HttpResponseMessage): HttpResponseMessage;
}
