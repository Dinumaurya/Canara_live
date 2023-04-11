import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { AppCommonService } from '@common/services';
import { SBSortableHeaderDirective, SortEvent } from '@modules/tables/directives';
import { CountryService } from '@modules/tables/services';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Component({
    selector: 'sb-landing-form',
    templateUrl: './landing-form.component.html',
    styleUrls: ['./landing-form.component.scss'],
})
export class LandingFormComponent implements OnInit {
    @Input() pageSize = 10;
    currentPage = 1;
    listApi: any = [];
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    maxSize = 10;
    searchTerm = '';
    formStatus: any = '';
    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    constructor(
        public countryService: CountryService,
        private changeDetectorRef: ChangeDetectorRef,
        private comservice: AppCommonService
    ) {}

    ngOnInit() {
        this.countryService.pageSize = this.pageSize;
        this.total$ = this.countryService.total$;

        this.comservice.listApiFwdCntct({}, this.currentPage).subscribe(result => {
            this.listApi = result;
            console.log(this.listApi);

            this.total$ = this.listApi.totalRecords;
            this.changeDetectorRef.detectChanges();
        });
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
