import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AppCommonService } from '@common/services';
import { SBSortableHeaderDirective, SortEvent } from '@modules/tables/directives';
import { CountryService } from '@modules/tables/services';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'sb-bill-collection-outward-rem',
  templateUrl: './bill-collection-outward-rem.component.html',
  styleUrls: ['./bill-collection-outward-rem.component.scss']
})
export class BillCollectionOutwardRemComponent implements OnInit  {

  @Input() pageSize = 10;
    currentPage = 1;
    listApi: any = []
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    maxSize = 10;
    searchTerm = "";
    formStatus: any = '';
    public canCreateNew= false;
    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    constructor(
        public countryService: CountryService,
        private changeDetectorRef: ChangeDetectorRef,
        private comservice: AppCommonService
    ) { }

    ngOnInit() {
        this.countryService.pageSize = this.pageSize;
        this.total$ = this.countryService.total$;

        this.comservice.billListApi({}, this.currentPage).subscribe(result => {
            // if (result && result.totalRecords) {
            
                this.listApi = result;
                console.log(this.listApi);
                
                this.total$ = this.listApi.totalRecords
                this.changeDetectorRef.detectChanges();
            // }

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


  

    formStatusChange() {
        this.comservice.billListApi({ formStatus: this.formStatus, page:this.currentPage }, this.currentPage).subscribe(result => {
            this.listApi = result;
            this.total$ = this.listApi.totalRecords
            this.changeDetectorRef.detectChanges();
        })
    }
    searchQuery() {
        this.comservice.billListApi({ transRefNo: this.searchTerm, page: this.currentPage }, this.currentPage).subscribe(result => {
            if (result && result.totalRecords) {
                this.listApi = result;
                this.total$ = this.listApi.totalRecords
                this.changeDetectorRef.detectChanges();
            }

        })
    }
    nextPage($event: any) {

        this.comservice.billListApi({ page: this.currentPage }, this.currentPage).subscribe(result => {
            if (result && result.totalRecords) {
                this.listApi = result;
                this.total$ = this.listApi.totalRecords
                this.changeDetectorRef.detectChanges();
            }

        })
    }
}