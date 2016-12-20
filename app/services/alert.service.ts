import { Injectable } from '@angular/core';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Injectable()
export class AlertService {
    private currentToastId;
    constructor(
        private toastyService:ToastyService,
        private toastyConfig: ToastyConfig) {
        // clear alert message on route change

        this.toastyConfig.theme = 'material';
        this.toastyConfig.showClose = true;
    }

    success(msg: string, title: string = 'Success') {
        this.toastyService.success({
            title,
            msg: msg,
            showClose: true,
            timeout: 3000
        });
    }

    error(msg: string, title: string = 'Error') {
        this.toastyService.error({
            title,
            msg,
            showClose: true,
            timeout: 3000
        });
    }

    timeout() {
        this.toastyService.error({
            title: 'Request timed out',
            msg: 'Please check your internet connection',
            showClose: true,
            timeout: 3000
        });
    }

    wait(msg: string, title: string) {
        this.toastyService.wait({
            title: title,
            msg: msg,
            showClose: true,
            timeout: 60000,
            onAdd: (toast: ToastData) => {
                this.currentToastId = toast.id;
            }
        });
    }

    clear() {
        this.toastyService.clear(this.currentToastId);
    }

}
