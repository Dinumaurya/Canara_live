import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { SortEvent } from '@modules/tables/directives/sortable.directive';
import { CountryService } from '@modules/tables/services';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { ChartsBarComponent } from '../charts-bar/charts-bar.component';


@Component({
    selector: 'sb-charts-pie',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './charts-pie.component.html',
    styleUrls: ['charts-pie.component.scss'],
})
export class ChartsPieComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('myPieChart') myPieChart!: ElementRef<HTMLCanvasElement>;
    @Output() myEvent = new EventEmitter();
    @Input() childProperty: string | undefined;
    @Output() tableDataRecv = new EventEmitter();
    // piechart
    chart!: Chart;
    display = false;
    showModal!: boolean;
    content!: string;
    listApi: any;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    public nItems = document.getElementById("demo");
    myBarChart: any;
    chartType = 'pie';
    arr: any = []
    dashboardinfo: any;
    piechart: any;
    unSubscripe: any;
    constructor(public countryService: CountryService,
        private changeDetectorRef: ChangeDetectorRef,
        private comservice: AppCommonService,
        private dashbosardService: DashboardService) { }
    ngOnInit() {
        this.unSubscripe = this.comservice.listApiOutwardRem();
        this.unSubscripe.subscribe((result: any) => {
            this.listApi = result;
        })

    }
    ngOnDestroy() {

    }
    ngAfterViewInit() {
        this.dashbosardService.getNewUserInfo().subscribe(info => {
            this.dashboardinfo = info;
            console.log();
            let Processing = this.dashboardinfo.activePoints;
            if (this.dashboardinfo.activePoints == "Pending For Processing") {
                Processing = "Approved"
            }
            this.comservice.getPiechart(Processing).subscribe(result => {
                this.piechart = result;
                this.myEvent.emit(null)
                let dataa;
                var arr = [];
                var labels = [];
                var backgroundColor = [];
                for (let index = 0; index < this.piechart.length; index++) {
                    const element: any = this.piechart[index];
                    labels.push(element.name);
                    arr.push(element.proCount);
                    var color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';

                    backgroundColor.push(color)
                    //  '#' + parseInt(+(Math.random() * 0xffffff)).toString(16)
                }

                this.myBarChart = new Chart(this.myPieChart.nativeElement, {
                    type: 'pie',

                    data: {
                        labels: labels,
                        datasets: [
                            {
                                data: arr,
                                backgroundColor: backgroundColor,
                            },
                        ],
                    },
                });
            })
        })
    }
    public labels = [];
    public data = [];
    generateDataSet() {

        // for (let i = 0; i < this.nItems; i++) {

        //     this.data[i] = Math.ceil(Math.random() * 100);
        // }
        this.chart.data.labels = this.labels;

        this.chart.update();

    }
    open(evt: any) {
        var activePoints = this.myBarChart.getElementsAtEvent(evt);
        // console.log(activePoints);
        // this.dashbosardService.getNewUserInfo().subscribe(info => {
        //     this.dashboardinfo = info;
        //     console.log(this.dashboardinfo.activePoints);

        //     this.comservice.getPiechart(this.dashboardinfo.activePoints).subscribe(result => {
        //         this.piechart = result;
        //         console.log("piechart", this.piechart);
        //         console.log(this.piechart[0].code);


        //         this.showModal = true; // Show-Hide Modal Check
        //         this.comservice.getDashBarPieList(this.piechart[0].code, this.dashboardinfo.activePoints, 1).subscribe(result => {
        //             this.listApi = result;
        //             console.log("dashboard list api", this.listApi);
        //             console.log(this.listApi.totalRecords);
        //             this.tableDataRecv.emit(this.listApi);
        //         })
        //     })
        // });

        var activePoints = this.myBarChart.getElementsAtEvent(evt);
        console.log(activePoints)
        if (activePoints.length > 0) {
            //get the internal index of slice in pie chart
            var clickedElementindex = activePoints[0]["_index"];
            var value = this.piechart[clickedElementindex]

            let aPoints = this.dashboardinfo.activePoints;
            if (this.dashboardinfo.activePoints == "Pending For Processing") {
                aPoints = "Approved"
            }
            /* other stuff that requires slice's label and value */
            this.comservice.getDashBarPieList(value.code, aPoints, 1).subscribe(result => {
                this.listApi = result;
                this.tableDataRecv.emit(this.listApi);
            })
        }

    }
    hide() {
        this.showModal = false;
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


}
