import { Injectable }     from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
}    from '@angular/router';
import {SessionService}      from './session.service';
import { Admin } from './admin.interface';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private sessionService: SessionService, private router: Router) {}
    canActivate(): boolean {
        //console.log('AuthGuard#canActivate called');
        let admin: Admin = this.sessionService.getAdmin();
        return this.checkLogin(admin);
    }
    checkLogin(admin: Admin): boolean {
        if (admin && admin.name && admin.email) {
            return true;
        } else if (admin && (!admin.name || !admin.email)) {
            this.router.navigate(['/login']);
            return false;
        } else {
            this.router.navigate(['/login']);
        }
    }
}
