import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppCommonService } from '@common/services';

@Component({
    selector: 'sb-dashboard-charts',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard-charts.component.html',
    styleUrls: ['dashboard-charts.component.scss'],
})
export class DashboardChartsComponent implements OnInit {
    getdashboard: any;
    constructor(private comservice:AppCommonService) {
        
    }
    ngOnInit() {
        // this.comservice.getDashboard().subscribe(result => {
        //     this.getdashboard = result;
        //     console.log("getdashboard", this.getdashboard);
        // })
    }
}
