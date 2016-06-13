"use strict";

System.register(["aurelia-property-injection", "aurelia-router", "aurelia-i18n", "./security-context"], function (_export, _context) {
    "use strict";

    var autoinject, Router, Redirect, I18N, SecurityContext, _typeof, __decorate, __metadata, AuthorizeStep, _a, _b;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaPropertyInjection) {
            autoinject = _aureliaPropertyInjection.autoinject;
        }, function (_aureliaRouter) {
            Router = _aureliaRouter.Router;
            Redirect = _aureliaRouter.Redirect;
        }, function (_aureliaI18n) {
            I18N = _aureliaI18n.I18N;
        }, function (_securityContext) {
            SecurityContext = _securityContext.SecurityContext;
        }],
        execute: function () {
            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
                var c = arguments.length,
                    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
                    d;
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
                    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                }return c > 3 && r && Object.defineProperty(target, key, r), r;
            };

            __metadata = undefined && undefined.__metadata || function (k, v) {
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
            };

            _export("AuthorizeStep", AuthorizeStep = function () {
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
                                throw new Redirect(this.router.generate(this.securityContext.configuration.signInRoute, {
                                    message: this.i18n.tr("security:unauthorized", {
                                        defaultValue: "You are not authenticated, please sign-in."
                                    }),
                                    path: currentInstruction.fragment
                                }));
                            } else if (Array.isArray(instruction.config.settings.roles) && !instruction.config.settings.roles.some(function (role) {
                                return _this.securityContext.isUserInRole(role);
                            })) {
                                throw new Redirect(this.router.generate(this.securityContext.configuration.forbiddenRoute, {
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
            }());

            _export("AuthorizeStep", AuthorizeStep);

            _export("AuthorizeStep", AuthorizeStep = __decorate([autoinject, __metadata('design:paramtypes', [SecurityContext, typeof (_a = typeof Router !== 'undefined' && Router) === 'function' && _a || Object, typeof (_b = typeof I18N !== 'undefined' && I18N) === 'function' && _b || Object])], AuthorizeStep));
        }
    };
});