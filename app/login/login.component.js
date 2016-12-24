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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var authentication_service_1 = require("../services/authentication.service");
var alert_service_1 = require("../services/alert.service");
var session_service_1 = require("../shared/session.service");
var LoginComponent = (function () {
    function LoginComponent(http, authenticationService, sessionService, router, alertService) {
        this.http = http;
        this.authenticationService = authenticationService;
        this.sessionService = sessionService;
        this.router = router;
        this.alertService = alertService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        if (this.sessionService.getAdmin()) {
            this.router.navigate(['/welcome']);
        }
    };
    LoginComponent.prototype.adminLogin = function (username, password) {
        var _this = this;
        this.alertService.wait('Please wait', 'Signing in...');
        this.authenticationService.login(username, password).subscribe(function (data) {
            _this.alertService.clear();
            if (data.status.code === 200) {
                var admin = {
                    email: data.data.Email,
                    name: data.data.Name,
                    id: data.data.Id,
                    token: data.data.token
                };
                _this.sessionService.setAdmin(admin);
                // Show success alert
                _this.router.navigate(['/welcome']);
            }
            else {
                // Invalid credentials
                _this.alertService.error('Error', data.status.message);
            }
        }, function (err) {
            _this.alertService.clear();
            console.log("Error occured", err);
            _this.alertService.timeout();
        });
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/login/login.component.html',
        providers: [authentication_service_1.AuthenticationService]
    }),
    __metadata("design:paramtypes", [http_1.Http,
        authentication_service_1.AuthenticationService,
        session_service_1.SessionService,
        router_1.Router,
        alert_service_1.AlertService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map