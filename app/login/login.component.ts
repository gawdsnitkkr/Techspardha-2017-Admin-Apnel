/**
 * Created by varun on 12/10/16.
 */
/**
 * Created by varun on 19/9/16.
 */
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: 'app/login/login.component.html'
})
export class LoginComponent {
    constructor() {
    }
    ngOnInit(): void {
    }
    adminLogin(username: string, password: string): void {
        console.log(username, password);
    }
}


