"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var oauth2_1 = require("./oauth2");
var GitHub = (function (_super) {
    __extends(GitHub, _super);
    function GitHub(applicationId) {
        return _super.call(this, "github", "GitHub", applicationId, new oauth2_1.OAuth2Configuration({
            authorizationRequestUrl: "https://github.com/login/oauth/authorize"
        })) || this;
    }
    return GitHub;
}(oauth2_1.OAuth2));
exports.GitHub = GitHub;

//# sourceMappingURL=github.js.map
