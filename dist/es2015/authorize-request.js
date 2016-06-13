var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { autoinject } from "aurelia-property-injection";
import { HttpHeaders } from "http-utils";
import { SecurityContext } from "./security-context";
export let AuthorizeRequest = class AuthorizeRequest {
    constructor(securityContext) {
        this.securityContext = securityContext;
    }
    request(message) {
        let tenant = this.securityContext.getCurrentTenant();
        if (tenant) {
            message.headers.add(SecurityContext.TENANT_ID_HEADER, tenant.id);
        }
        if (!message.headers.has(HttpHeaders.AUTHORIZATION)) {
            return this.securityContext.getAuthenticator().authorizeMessage(message);
        }
        return message;
    }
    responseError(message) {
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
};
AuthorizeRequest = __decorate([
    autoinject, 
    __metadata('design:paramtypes', [SecurityContext])
], AuthorizeRequest);
//# sourceMappingURL=authorize-request.js.map