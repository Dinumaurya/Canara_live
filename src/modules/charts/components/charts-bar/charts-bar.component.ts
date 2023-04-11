import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,

    Input,

    OnInit,
    ViewChild,
} from '@angular/core';
import { AppCommonService } from '@common/services/app-common.service';
import { DashboardService } from '@modules/dashboard/services';
import { Chart, ChartColor, Scriptable } from 'chart.js';
import { SortEvent } from '@modules/tables/directives/sortable.directive';
import { CountryService } from '@modules/tables/services';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';


@Component({
    selector: 'sb-charts-bar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './charts-bar.component.html',
    styleUrls: ['charts-bar.component.scss'],
})
export class ChartsBarComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChild('myBarChart') myBarChart!: ElementRef<HTMLCanvasElement>;
    @ViewChild('myPieChart') myPieChart!: ElementRef<HTMLCanvasElement>;


    chart!: Chart;
    getdashboard: any = [];
    Approved: any = []
    color: string | string[] | CanvasGradient | CanvasPattern | ChartColor[] | Scriptable<ChartColor> | undefined;
    display = false;
    efficiency = [];
    tableDataRecv: any = []
    public activePointLabel: any
    sortedColumn!: string;
    sortedDirection!: string;
    @Input() pageSize = 10;
    currentPage = 1;
    listApi: any = []
    total$!: Observable<number>;
    maxSize = 10;
    searchTerm = "";
    formStatus: any = '';
    constructor(private comservice: AppCommonService, private dashboardService: DashboardService,
        public countryService: CountryService,) { }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this.comservice.getDashboard().subscribe(result => {
            this.getdashboard = result;
            console.log("getdashboard", this.getdashboard);

            this.dashboardService.setNewUserInfo({
                dashboard: this.getdashboard
            });



            var data = this.getdashboard.Approved

            this.color = ['rgb(19, 129, 19)', 'rgba(2,117,216,1)', 'rgb(231, 162, 33)', 'rgba(2,117,216,1)',
                'rgb(185, 54, 54)', 'rgb(107, 196, 66)'];

            this.chart = new Chart(this.myBarChart.nativeElement, {

                type: 'bar',
                data: {

                    labels: ['Pending For Processing', 'Closed', 'Declined', 'InProcess', 'Pending', 'Draft'],
                    datasets: [
                        {
                            label: 'Task Process',
                            backgroundColor: this.color,
                            // borderColor: 'rgb(19, 129, 19)',
                            data: [this.getdashboard.Approved, this.getdashboard.Closed, this.getdashboard.Declined,
                            this.getdashboard.InProcess, this.getdashboard.Pending, this.getdashboard.Draft], //, this.getdashboard.Hold , this.getdashboard.Reassigned, this.getdashboard.Rejected
                        },
                    ],
                },

                options: {

                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    display: false,
                                },
                                ticks: {
                                    maxTicksLimit: 6,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    display: true,
                                },
                                ticks: {
                                    min: 0, // it is for ignoring negative step.
                                    beginAtZero: true,
                                    stepSize: 1
                                }
                            },

                        ],
                    },
                    legend: {
                        display: false,
                    },

                },
            });
        })
    }

    onClick(e: any) {
        this.display = true
        var temp: any = this.chart.getElementsAtEvent(e);
        var activePoints = temp[0]._model.label
        this.dashboardService.setNewUserInfo({
            activePoints: activePoints
        });
    }
    showModal: boolean = false
    tableData: any = []
    tablercv(evt: any) {
        this.showModal = true;
        this.tableData = evt
        console.log(this.tableData.list);
        var list = this.tableData.list
        console.log(list);

        // if(this.tableData.)
    }
    onSort({ column, direction }: SortEvent) {
        this.sortedColumn = column;
        this.sortedDirection = direction;
        this.countryService.sortColumn = column;
        this.countryService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }
    searchQuery() {
        this.comservice.listApiOutwardRem({ transRefNo: this.searchTerm, page: this.currentPage }, this.currentPage).subscribe(result => {
            this.listApi = result;
            this.total$ = this.listApi.totalRecords
            this.changeDetectorRef.detectChanges();
        })
    }
    nextPage($event: any) {

        this.comservice.listApiOutwardRem({ page: this.currentPage }, this.currentPage).subscribe(result => {
            this.listApi = result;
            this.total$ = this.listApi.totalRecords
            this.changeDetectorRef.detectChanges();
        })
    }

}
