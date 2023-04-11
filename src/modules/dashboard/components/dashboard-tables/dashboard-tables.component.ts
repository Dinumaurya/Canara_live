import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppCommonService } from '@common/services';

@Component({
    selector: 'sb-dashboard-tables',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard-tables.component.html',
    styleUrls: ['dashboard-tables.component.scss'],
})
export class DashboardTablesComponent implements OnInit {
    listApi: any;
    constructor(private comservice:AppCommonService) {}
    ngOnInit() {
        this.comservice.listApiOutwardRem().subscribe(result => {
            this.listApi = result;
           console.log("wwwwwwwwww",this.listApi[0]);
           console.log(this.listApi.totalRecords);
        //    console.log(this.listApi.list[0]);
           
           
           
         })
    }
}
