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
var http_1 = require('@angular/http');
var localStorage_1 = require('./localStorage');
var SessionService = (function () {
    function SessionService(http) {
        this.http = http;
        this.localStorage = new localStorage_1.LocalStorage();
    }
    SessionService.prototype.getAdmin = function () {
        var user = this.localStorage.getItem('user');
        if (user) {
            SessionService.admin = user;
        }
        return SessionService.admin;
    };
    SessionService.prototype.logout = function () {
        this.localStorage.removeItem('user');
        SessionService.admin = undefined;
        return true;
    };
    SessionService.prototype.setAdmin = function (admin) {
        this.localStorage.setItem('user', admin);
        SessionService.admin = admin;
        return true;
    };
    SessionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SessionService);
    return SessionService;
}());
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map