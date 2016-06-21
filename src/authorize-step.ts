import {autoinject} from "aurelia-dependency-injection";
import {Router, PipelineStep, NavigationInstruction, Redirect} from "aurelia-router";
import {I18N} from "aurelia-i18n";
import {SecurityContext} from "./security-context";

@autoinject
export class AuthorizeStep implements PipelineStep {

    private securityContext: SecurityContext;

    private router: Router;

    private i18n: I18N;

    constructor(securityContext: SecurityContext, router: Router, i18n: I18N) {
        this.securityContext = securityContext;
        this.router = router;
        this.i18n = i18n;
    }

    run(currentInstruction: NavigationInstruction, next: Function): void {
        for (let instruction of currentInstruction.getAllInstructions()) {
            if (instruction.config.settings.requireAuthentication || instruction.config.settings.hasOwnProperty("roles")) {
                if (this.securityContext.getUserPrincipal() == null) {
                    throw new Redirect(this.router.generate(this.securityContext.configuration.signInRoute, {
                        message: this.i18n.tr("security:unauthorized", {
                            defaultValue: "You are not authenticated, please sign-in."
                        }),
                        path: currentInstruction.fragment
                    }));
                } else if (Array.isArray(instruction.config.settings.roles) && !instruction.config.settings.roles.some((role: string) => this.securityContext.isUserInRole(role))) {
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

}
