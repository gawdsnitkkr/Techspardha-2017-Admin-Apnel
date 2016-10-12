/**
 * Created by varun on 12/10/16.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var session_service_1 = require('./session.service');
var AuthGuard = (function () {
    function AuthGuard(sessionService, router) {
        this.sessionService = sessionService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function () {
        console.log('AuthGuard#canActivate called');
        var admin = this.sessionService.getAdmin();
        return this.checkLogin(admin);
    };
    AuthGuard.prototype.checkLogin = function (admin) {
        var _this = this;
        if (admin && admin.name && admin.status) {
            return true;
        }
        else if (admin && (!admin.name || !admin.status)) {
            this.router.navigate(['/login']);
            return false;
        }
        else {
            this.sessionService.retrieveAdmin().subscribe(function (admin) {
                _this.sessionService.setAdmin(admin);
                return _this.checkLogin(admin);
            });
        }
    };
    AuthGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [session_service_1.SessionService, router_1.Router])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth-guard.service.js.map