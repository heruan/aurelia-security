"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var oauth2_1 = require("./oauth2");
var GitHub = (function (_super) {
    __extends(GitHub, _super);
    function GitHub(applicationId) {
        _super.call(this, "github", "GitHub", applicationId, new oauth2_1.OAuth2Configuration({
            authorizationRequestUrl: "https://github.com/login/oauth/authorize"
        }));
    }
    return GitHub;
}(oauth2_1.OAuth2));
exports.GitHub = GitHub;
