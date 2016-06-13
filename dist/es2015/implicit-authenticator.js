export class ImplicitAuthenticator {
    authorizeMessage(message) {
        return message;
    }
    getScheme() {
        return ImplicitAuthenticator.SCHEME;
    }
}
ImplicitAuthenticator.SCHEME = "Implicit";
//# sourceMappingURL=implicit-authenticator.js.map