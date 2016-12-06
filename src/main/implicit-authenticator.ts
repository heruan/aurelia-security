import { HttpRequestMessage} from "aurelia-http-client";
import { Authenticator} from "./authenticator";
import { ImplicitCredential} from "./implicit-credential";

export class ImplicitAuthenticator implements Authenticator {

    private static SCHEME: string = "Implicit";


    public authorizeMessage(message: HttpRequestMessage): HttpRequestMessage {
        return message;
    }

    public getScheme(): string {
        return ImplicitAuthenticator.SCHEME;
    }

}
