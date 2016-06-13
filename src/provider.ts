import {Principal} from "./principal";

export interface Provider {

    requestAuthorization(...scope: string[]): void;

}
