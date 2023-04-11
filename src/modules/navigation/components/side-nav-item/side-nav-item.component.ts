import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AppCommonService } from '@common/services/app-common.service';
import { SBRouteData, SideNavItem } from '@modules/navigation/models';
 
@Component({
    selector: 'sb-side-nav-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './side-nav-item.component.html',
    styleUrls: ['side-nav-item.component.scss'],
})
export class SideNavItemComponent implements OnInit, AfterViewInit {
    @Input() sideNavItem!: SideNavItem;
    @Input() isActive!: boolean;
    sessionItem: any;
    expanded = false;
    routeData!: SBRouteData;

    constructor(public commonService: AppCommonService) {

    }
    ngOnInit() {

    }
    isAllowedToView(code: any) {

        this.sessionItem = sessionStorage.getItem('user');
        if (this.sessionItem != null) {
            this.sessionItem = JSON.parse(this.sessionItem);
        }
        if (code && typeof (code) != "undefined") {
            if (this.sessionItem && this.sessionItem.ibUsrType == "I") {
                if (["OUTWARD_REMITTNCE", "FORWARD_CONTRACT"].indexOf(code) != -1) {
                    return true;
                }
                if (["OTHER_HIDE_FOR_C"].indexOf(code) != -1) {
                    return false;
                }
                return false
            }
            if (this.sessionItem && (this.sessionItem.ibUsrType == "C" || this.sessionItem.ibUsrType == "Z")) {
                if (["OUTWARD_REMITTNCE", "ADVANCE_REMITTNCE", "FORWARD_CONTRACT", "GUARANTEE", "IRRVCBL_DOC_LTTR", "IRRVCBL_DOC_LTTR", "PACKING_CREDIT", "EXPORT_BILLS", "INWARD_REMITTANCE", "GUARANTEE", "AMENDMENT_LOC","INLAND_LC","OTHER_HIDE_FOR_C"].indexOf(code) != -1) {
                    return true;
                }
                return false
            }
        }
        return true;
    }
    ngAfterViewInit() {
        this.sessionItem = sessionStorage.getItem('user');
        if (this.sessionItem != null) {
            this.sessionItem = JSON.parse(this.sessionItem);
            // if(sessionItem.brnchMaker == "BRNCH_MKR" || sessionItem.ibUsrType == "I" || sessionItem.ibData.UserType == "Z"){

            // }
        }

    }
    permissionForm(form: any) {
        const permission = this.commonService.permissionForm(form);
        if (permission) {
            return true;
        }
        return false;
    }
}