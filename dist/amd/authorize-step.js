define(["exports", "aurelia-property-injection", "aurelia-router", "aurelia-i18n", "./security-context"], function (exports, _aureliaPropertyInjection, _aureliaRouter, _aureliaI18n, _securityContext) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AuthorizeStep = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
            if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = undefined && undefined.__metadata || function (k, v) {
        if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var AuthorizeStep = exports.AuthorizeStep = function () {
        function AuthorizeStep(securityContext, router, i18n) {
            _classCallCheck(this, AuthorizeStep);

            this.securityContext = securityContext;
            this.router = router;
            this.i18n = i18n;
        }

        AuthorizeStep.prototype.run = function run(currentInstruction, next) {
            var _this = this;

            for (var _iterator = currentInstruction.getAllInstructions(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var instruction = _ref;

                if (instruction.config.settings.requireAuthentication || instruction.config.settings.hasOwnProperty("roles")) {
                    if (this.securityContext.getUserPrincipal() == null) {
                        throw new _aureliaRouter.Redirect(this.router.generate(this.securityContext.configuration.signInRoute, {
                            message: this.i18n.tr("security:unauthorized", {
                                defaultValue: "You are not authenticated, please sign-in."
                            }),
                            path: currentInstruction.fragment
                        }));
                    } else if (Array.isArray(instruction.config.settings.roles) && !instruction.config.settings.roles.some(function (role) {
                        return _this.securityContext.isUserInRole(role);
                    })) {
                        throw new _aureliaRouter.Redirect(this.router.generate(this.securityContext.configuration.forbiddenRoute, {
                            message: this.i18n.tr("security:forbidden", {
                                defaultValue: "You are not authorized to access this resource."
                            }),
                            path: currentInstruction.fragment
                        }));
                    }
                }
            }
            return next();
        };

        return AuthorizeStep;
    }();
    exports.AuthorizeStep = AuthorizeStep = __decorate([_aureliaPropertyInjection.autoinject, __metadata('design:paramtypes', [_securityContext.SecurityContext, typeof (_a = typeof _aureliaRouter.Router !== 'undefined' && _aureliaRouter.Router) === 'function' && _a || Object, typeof (_b = typeof _aureliaI18n.I18N !== 'undefined' && _aureliaI18n.I18N) === 'function' && _b || Object])], AuthorizeStep);
    var _a, _b;
});