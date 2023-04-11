import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AppCommonService } from '@common/services';
import { SBSortableHeaderDirective, SortEvent } from '@modules/tables/directives';
import { CountryService } from '@modules/tables/services';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'sb-forward-cntct-list',
  templateUrl: './forward-cntct-list.component.html',
  styleUrls: ['./forward-cntct-list.component.scss']
})
export class ForwardCntctListComponent implements OnInit {

  @Input() pageSize = 10;
  currentPage = 1;
  listApi: any = []
  total$!: Observable<number>;
  sortedColumn!: string;
  sortedDirection!: string;
  maxSize = 10;
  searchTerm = "";
  formStatus: any = '';
  @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

  constructor(
      public countryService: CountryService,
      private changeDetectorRef: ChangeDetectorRef,
      private comservice: AppCommonService
  ) { }

  ngOnInit() {
      this.countryService.pageSize = this.pageSize;
      this.total$ = this.countryService.total$;

      this.comservice.listApiFwdCntct({}, this.currentPage).subscribe(result => {
          this.listApi = result;
          console.log(this.listApi);
          
          this.total$ = this.listApi.totalRecords
          this.changeDetectorRef.detectChanges();
      })
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
      this.comservice.listApiFwdCntct({ formStatus: this.formStatus, page:this.currentPage }, this.currentPage).subscribe(result => {
          this.listApi = result;
          this.total$ = this.listApi.totalRecords
          this.changeDetectorRef.detectChanges();
      })
  }
  
  searchQuery() {
      this.comservice.listApiFwdCntct({ transRefNo: this.searchTerm, page:this.currentPage }, this.currentPage).subscribe(result => {
          this.listApi = result;
          this.total$ = this.listApi.totalRecords
          this.changeDetectorRef.detectChanges();
      })
  }
  nextPage($event: any) {

      this.comservice.listApiFwdCntct({page:this.currentPage}, this.currentPage).subscribe(result => {
          this.listApi = result;
          this.total$ = this.listApi.totalRecords
          this.changeDetectorRef.detectChanges();
      })
  }

}
