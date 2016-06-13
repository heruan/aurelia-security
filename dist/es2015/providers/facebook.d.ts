import { Provider } from "../provider";
import { OAuth2 } from "./oauth2";
export declare class Facebook extends OAuth2 implements Provider {
    constructor(applicationId: string);
}
