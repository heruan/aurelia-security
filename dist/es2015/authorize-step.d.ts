import { Router, PipelineStep, NavigationInstruction } from "aurelia-router";
import { I18N } from "aurelia-i18n";
import { SecurityContext } from "./security-context";
export declare class AuthorizeStep implements PipelineStep {
    private securityContext;
    private router;
    private i18n;
    constructor(securityContext: SecurityContext, router: Router, i18n: I18N);
    run(currentInstruction: NavigationInstruction, next: Function): void;
}
