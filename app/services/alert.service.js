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
var ng2_toasty_1 = require('ng2-toasty');
var AlertService = (function () {
    function AlertService(toastyService, toastyConfig) {
        // clear alert message on route change
        this.toastyService = toastyService;
        this.toastyConfig = toastyConfig;
        this.toastyConfig.theme = 'material';
        this.toastyConfig.showClose = true;
    }
    AlertService.prototype.success = function (msg, title) {
        if (title === void 0) { title = 'Success'; }
        this.toastyService.success({
            title: title,
            msg: msg,
            showClose: true,
            timeout: 3000
        });
    };
    AlertService.prototype.error = function (msg, title) {
        if (title === void 0) { title = 'Error'; }
        this.toastyService.error({
            title: title,
            msg: msg,
            showClose: true,
            timeout: 3000
        });
    };
    AlertService.prototype.timeout = function () {
        this.toastyService.error({
            title: 'Request timed out',
            msg: 'Please check your internet connection',
            showClose: true,
            timeout: 3000
        });
    };
    AlertService.prototype.wait = function (msg, title) {
        var _this = this;
        this.toastyService.wait({
            title: title,
            msg: msg,
            showClose: true,
            timeout: 60000,
            onAdd: function (toast) {
                _this.currentToastId = toast.id;
            }
        });
    };
    AlertService.prototype.clear = function () {
        this.toastyService.clear(this.currentToastId);
    };
    AlertService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [ng2_toasty_1.ToastyService, ng2_toasty_1.ToastyConfig])
    ], AlertService);
    return AlertService;
}());
exports.AlertService = AlertService;
//# sourceMappingURL=alert.service.js.map