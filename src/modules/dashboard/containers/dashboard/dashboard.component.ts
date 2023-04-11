import { ChangeDetectorRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SBSortableHeaderDirective, SortEvent } from '@modules/tables/directives';
import { CountryService } from '@modules/tables/services';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Component({
    selector: 'sb-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;
    @Input() pageSize = 4;
    listApi: any = [];
    typeSelected: string | undefined;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    getdashboard: any;
    savedData: any = [];
    isCollapsed = true;
    isCollapsedCorporate = true;
    @ViewChild('client') client!: NgbCollapse;
    @ViewChild('corporate') corporate!: NgbCollapse;
    constructor(
        public countryService: CountryService,
        private changeDetectorRef: ChangeDetectorRef,
        private spinner: NgxSpinnerService
    ) {
        this.typeSelected = 'ball-fussion';
        setTimeout(() => {
            this.countryService.pageSize = this.pageSize;
            this.total$ = this.countryService.total$;
            this.spinner.hide();
        }, 15000); // 15 seconds
    }

    ngOnInit(): void {
        this.spinner.show();
        this.countryService.pageSize = this.pageSize;
        this.total$ = this.countryService.total$;
    }

    onSort({ column, direction }: SortEvent) {
        this.sortedColumn = column;
        this.sortedDirection = direction;
        this.countryService.sortColumn = column;
        this.countryService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }
    ViewDetail(e: any) {
        console.log(e);
    }
    viewDoc(link: any) {
        try {
            const pt = environment.app_url;
            window.open(pt + '/docDownload/' + link, '_blank');
        } catch (error) {}
    }
    corporateCollapse() {
        this.corporate.collapsed = !this.corporate.collapsed;
    }
    get isCorporate() {
        try {
            let sessionItem: any = sessionStorage.getItem('user');
            if (sessionItem != null) {
                sessionItem = JSON.parse(sessionItem);
            }
            if ((sessionItem && sessionItem.ibUsrType == 'C') || sessionItem.ibUsrType == 'Z') {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    }
}
