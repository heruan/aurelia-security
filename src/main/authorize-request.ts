import { autoinject } from "aurelia-dependency-injection";
import { Interceptor, HttpRequestMessage, HttpResponseMessage } from "aurelia-http-client";
import { HttpHeaders } from "aurelia-http-utils";
import { SecurityContext } from "./security-context";

@autoinject
export class AuthorizeRequest implements Interceptor {

    private securityContext: SecurityContext;

    public constructor(securityContext: SecurityContext) {
        this.securityContext = securityContext;
    }

    public request(message: HttpRequestMessage): HttpRequestMessage {
        let tenant = this.securityContext.getCurrentTenant();
        if (tenant) {
            message.headers.add(SecurityContext.TENANT_ID_HEADER, tenant.id);
        }
        if (!message.headers.has(HttpHeaders.AUTHORIZATION)) {
            return this.securityContext.getAuthenticator().authorizeMessage(message);
        }
        return message;
    }

    public responseError(message: HttpResponseMessage): HttpResponseMessage {
        switch (message.statusCode) {
            case 401:
            if (message.headers.has(HttpHeaders.WWW_AUTHENTICATE)) {
                let authenticateHeader = message.headers.get(HttpHeaders.WWW_AUTHENTICATE);
                let authenticateHeaderPattern = /(\w+)\s+(.+)/;
                let authenticateHeaderMatcher = authenticateHeaderPattern.exec(authenticateHeader);
                let authenticationScheme = authenticateHeaderMatcher[1].toUpperCase();
                let authenticationData = authenticateHeaderMatcher[2];
                switch (authenticationScheme) {
                    case "BEARER":
                    let bearerDataPattern = /realm="([^"]+)",\s+error="([^"]+)",\s+error_description="([^"]+)"/;
                    let bearerDataMatcher = bearerDataPattern.exec(authenticationData);
                    let realm = bearerDataMatcher[1];
                    let error = bearerDataMatcher[2];
                    let errorDescription = bearerDataMatcher[3];
                    switch (error) {
                        case "invalid_request":
                        // Only with 400 Bad Request
                        break;
                        case "invalid_token":
                        this.securityContext.deauthenticate(false);
                        break;
                        case "insufficient_scope":
                        // Only with 403 Frobidden
                        break;
                    }
                    this.securityContext.navigateToSignIn(errorDescription);
                    throw message;
                }
            }
            break;
        }
        throw message;
    }

}
