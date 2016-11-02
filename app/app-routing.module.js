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
 * Created by varun on 12/10/16.
 */
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var login_component_1 = require('./login/login.component');
var welcome_component_1 = require('./welcome/welcome.component');
var auth_guard_service_1 = require('./shared/auth-guard.service');
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot([
                    { path: 'login', component: login_component_1.LoginComponent },
                    { path: 'welcome', component: welcome_component_1.WelcomeComponent, canActivate: [auth_guard_service_1.AuthGuard] },
                    /*{ path: 'edit-event', component: EventComponent, canActivate: [AuthGuard] },
                    { path: 'participants', component: ParticipantsComponent, canActivate: [AuthGuard] },
                    { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },*/
                    { path: '', component: login_component_1.LoginComponent },
                    { path: '**', component: login_component_1.LoginComponent }
                ], { useHash: true })
            ],
            exports: [
                router_1.RouterModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map