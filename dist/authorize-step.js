"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var aurelia_router_1 = require("aurelia-router");
var aurelia_i18n_1 = require("aurelia-i18n");
var security_context_1 = require("./security-context");
var AuthorizeStep = (function () {
    function AuthorizeStep(securityContext, router, i18n) {
        this.securityContext = securityContext;
        this.router = router;
        this.i18n = i18n;
    }
    AuthorizeStep.prototype.run = function (currentInstruction, next) {
        var _this = this;
        for (var _i = 0, _a = currentInstruction.getAllInstructions(); _i < _a.length; _i++) {
            var instruction = _a[_i];
            if (instruction.config.settings.requireAuthentication || instruction.config.settings.hasOwnProperty("roles")) {
                if (this.securityContext.getUserPrincipal() == null) {
                    throw new aurelia_router_1.Redirect(this.router.generate(this.securityContext.configuration.signInRoute, {
                        message: this.i18n.tr("security:unauthorized", {
                            defaultValue: "You are not authenticated, please sign-in."
                        }),
                        path: currentInstruction.fragment
                    }));
                }
                else if (Array.isArray(instruction.config.settings.roles) && !instruction.config.settings.roles.some(function (role) { return _this.securityContext.isUserInRole(role); })) {
                    throw new aurelia_router_1.Redirect(this.router.generate(this.securityContext.configuration.forbiddenRoute, {
                        message: this.i18n.tr("security:forbidden", {
                            defaultValue: "You are not authorized to access this resource."
                        }),
                        path: currentInstruction.fragment
                    }));
                }
            }
        }
        return next();
    };
    AuthorizeStep = __decorate([
        aurelia_dependency_injection_1.autoinject, 
        __metadata('design:paramtypes', [security_context_1.SecurityContext, aurelia_router_1.Router, aurelia_i18n_1.I18N])
    ], AuthorizeStep);
    return AuthorizeStep;
}());
exports.AuthorizeStep = AuthorizeStep;
//# sourceMappingURL=authorize-step.js.map