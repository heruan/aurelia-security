import { Router, PipelineStep, NavigationInstruction } from "aurelia-router";
import { SecurityContext } from "./security-context";
export declare class AuthorizeStep implements PipelineStep {
    private securityContext;
    private router;
    constructor(securityContext: SecurityContext, router: Router);
    run(currentInstruction: NavigationInstruction, next: Function): void;
}
