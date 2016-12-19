"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var oauth2_1 = require("./oauth2");
var Facebook = (function (_super) {
    __extends(Facebook, _super);
    function Facebook(applicationId) {
        return _super.call(this, "facebook", "Facebook", applicationId, new oauth2_1.OAuth2Configuration({
            authorizationRequestUrl: "https://www.facebook.com/dialog/oauth"
        })) || this;
    }
    return Facebook;
}(oauth2_1.OAuth2));
exports.Facebook = Facebook;

//# sourceMappingURL=facebook.js.map
