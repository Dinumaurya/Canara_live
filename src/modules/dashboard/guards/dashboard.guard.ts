import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AppCommonService } from '@common/services/app-common.service';

@Injectable()
export class DashboardGuard implements CanActivate {
    constructor(public commonService: AppCommonService, public router: Router) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.commonService.isLoggedIn()) {
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['error/401'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
