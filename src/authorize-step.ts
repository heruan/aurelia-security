import {autoinject} from "aurelia-dependency-injection";
import {Router, PipelineStep, NavigationInstruction, Redirect} from "aurelia-router";
import {SecurityContext} from "./security-context";

@autoinject
export class AuthorizeStep implements PipelineStep {

    private securityContext: SecurityContext;

    private router: Router;

    constructor(securityContext: SecurityContext, router: Router) {
        this.securityContext = securityContext;
        this.router = router;
    }

    run(currentInstruction: NavigationInstruction, next: Function): void {
        for (let instruction of currentInstruction.getAllInstructions()) {
            if (instruction.config.settings.requireAuthentication || instruction.config.settings.hasOwnProperty("roles")) {
                if (this.securityContext.getUserPrincipal() == null) {
                    throw new Redirect(this.router.generate(this.securityContext.configuration.signInRoute, {
                        // message: this.i18n.tr("security:unauthorized", {
                        //     defaultValue: "You are not authenticated, please sign-in."
                        // }),
                        message: "You are not authenticated, please sign-in.",
                        path: currentInstruction.fragment
                    }));
                } else if (Array.isArray(instruction.config.settings.roles) && !instruction.config.settings.roles.some((role: string) => this.securityContext.isUserInRole(role))) {
                    throw new Redirect(this.router.generate(this.securityContext.configuration.forbiddenRoute, {
                        // message: this.i18n.tr("security:forbidden", {
                        //     defaultValue: "You are not authorized to access this resource."
                        // }),
                        message: "You are not authorized to access this resource",
                        path: currentInstruction.fragment
                    }));
                }
            }
        }
        return next();
    }

}
