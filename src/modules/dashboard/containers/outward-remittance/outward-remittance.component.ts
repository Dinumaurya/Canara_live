import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AppCommonService } from '@common/services';
import { SBSortableHeaderDirective, SortEvent } from '@modules/tables/directives';
import { CountryService } from '@modules/tables/services';
import { Observable } from 'rxjs/internal/Observable';

@Component({
    selector: 'sb-outward-remittance',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './outward-remittance.component.html',
    styleUrls: ['outward-remittance.component.scss'],
})
export class OutwardRemittanceComponent implements OnInit {
    @Input() pageSize = 10;
    currentPage = 1;
    listApi: any = []
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    maxSize = 10;
    searchTerm = "";
    formStatus: any = '';
    public canCreateNew= true;
    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    constructor(
        public countryService: CountryService,
        private changeDetectorRef: ChangeDetectorRef,
        private comservice: AppCommonService
    ) { }

    ngOnInit() {
        this.countryService.pageSize = this.pageSize;
        this.total$ = this.countryService.total$;

        this.comservice.listApiOutwardRem({}, this.currentPage).subscribe(result => {
            this.listApi = result;
            console.log(this.listApi);
            
            this.total$ = this.listApi.totalRecords
            this.changeDetectorRef.detectChanges();
        });
        let sessionItem:any = sessionStorage.getItem('user');
        if (sessionItem != null) {
            sessionItem = JSON.parse(sessionItem);
            if(sessionItem.brnchMaker == "BRNCH_MKR" || sessionItem.ibUsrType == "I" || sessionItem.ibData.UserType == "Z"){
                this.canCreateNew = true;
            }
        }
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

    formStatusChange() {
        this.comservice.listApiOutwardRem({ formStatus: this.formStatus, page:this.currentPage }, this.currentPage).subscribe(result => {
            this.listApi = result;
            this.total$ = this.listApi.totalRecords
            this.changeDetectorRef.detectChanges();
        })
    }
    
    searchQuery() {
        this.comservice.listApiOutwardRem({ transRefNo: this.searchTerm, page:this.currentPage }, this.currentPage).subscribe(result => {
            this.listApi = result;
            this.total$ = this.listApi.totalRecords
            this.changeDetectorRef.detectChanges();
        })
    }
    nextPage($event: any) {

        this.comservice.listApiOutwardRem({page:this.currentPage}, this.currentPage).subscribe(result => {
            this.listApi = result;
            this.total$ = this.listApi.totalRecords
            this.changeDetectorRef.detectChanges();
        })
    }
}
