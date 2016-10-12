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
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var app_component_1 = require('./app.component');
var event_component_1 = require('./event/event.component');
var notification_component_1 = require('./notification/notification.component');
var participants_component_1 = require('./participants/participants.component');
var welcome_component_1 = require('./welcome/welcome.component');
var app_routing_module_1 = require('./app-routing.module');
var session_service_1 = require('./shared/session.service');
var auth_guard_service_1 = require('./shared/auth-guard.service');
var login_component_1 = require('./login/login.component');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpModule
            ],
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                event_component_1.EventComponent,
                welcome_component_1.WelcomeComponent,
                notification_component_1.NotificationComponent,
                participants_component_1.ParticipantsComponent
            ],
            providers: [
                session_service_1.SessionService, auth_guard_service_1.AuthGuard
            ],
            bootstrap: [
                app_component_1.AppComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map