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
import { Router, Redirect } from "aurelia-router";
import { I18N } from "aurelia-i18n";
import { SecurityContext } from "./security-context";
export let AuthorizeStep = class AuthorizeStep {
    constructor(securityContext, router, i18n) {
        this.securityContext = securityContext;
        this.router = router;
        this.i18n = i18n;
    }
    run(currentInstruction, next) {
        for (let instruction of currentInstruction.getAllInstructions()) {
            if (instruction.config.settings.requireAuthentication || instruction.config.settings.hasOwnProperty("roles")) {
                if (this.securityContext.getUserPrincipal() == null) {
                    throw new Redirect(this.router.generate(this.securityContext.configuration.signInRoute, {
                        message: this.i18n.tr("security:unauthorized", {
                            defaultValue: "You are not authenticated, please sign-in."
                        }),
                        path: currentInstruction.fragment
                    }));
                }
                else if (Array.isArray(instruction.config.settings.roles) && !instruction.config.settings.roles.some((role) => this.securityContext.isUserInRole(role))) {
                    throw new Redirect(this.router.generate(this.securityContext.configuration.forbiddenRoute, {
                        message: this.i18n.tr("security:forbidden", {
                            defaultValue: "You are not authorized to access this resource."
                        }),
                        path: currentInstruction.fragment
                    }));
                }
            }
        }
        return next();
    }
};
AuthorizeStep = __decorate([
    autoinject, 
    __metadata('design:paramtypes', [SecurityContext, (typeof (_a = typeof Router !== 'undefined' && Router) === 'function' && _a) || Object, (typeof (_b = typeof I18N !== 'undefined' && I18N) === 'function' && _b) || Object])
], AuthorizeStep);
var _a, _b;
//# sourceMappingURL=authorize-step.js.map