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
/**
 * Created by varun on 19/9/16.
 */
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var session_service_1 = require('./shared/session.service');
var AppComponent = (function () {
    function AppComponent(sessionService, router) {
        this.sessionService = sessionService;
        this.router = router;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.admin = this.sessionService.getAdmin();
        this.redirectToDashboard(this.admin);
    };
    AppComponent.prototype.redirectToDashboard = function (admin) {
        if (admin && admin.name) {
            this.router.navigate(['/welcome']);
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app.component.html',
            providers: []
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map