import { LCInlandComponent } from './containers/lc-inland/lc-inland.component';
/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SBRouteData } from '@modules/navigation/models';
import * as dashboardContainers from './containers';
import { ImportBillCollectionComponent, PcfcOutwardRemComponent } from './containers';
import { AdvOutwardRemComponent } from './containers/adv-outward-rem/adv-outward-rem.component';
import { AmendmentLcFormComponent } from './containers/amendment-lc-form/amendment-lc-form.component';
import { BillCollectionOutwardRemComponent } from './containers/bill-collection-outward-rem/bill-collection-outward-rem.component';
import { BillCollectionComponent } from './containers/bill-collection/bill-collection.component';
import { CpcftComponent } from './containers/cpcft/cpcft.component';
import { ExportOutwardRemComponent } from './containers/export-outward-rem/export-outward-rem.component';
import { ExportsComponent } from './containers/exports/exports.component';
import { ForwardCntctListComponent } from './containers/forward-cntct-list/forward-cntct-list.component';
import { ForwardCntctComponent } from './containers/forward-cntct/forward-cntct.component';
import { GuaranteeComponent } from './containers/guarantee/guarantee.component';
import { ImportBillCollectionOutwardComponent } from './containers/import-bill-collection-outward/import-bill-collection-outward.component';
import { InlandlcformComponent } from './containers/inlandlcform/inlandlcform.component';
import { LcOutwardRemmitanceComponent } from './containers/lc-outward-remmitance/lc-outward-remmitance.component';
import { OutwardGuaranteeComponent } from './containers/outward-guarantee/outward-guarantee.component';
import { DashboardModule } from './dashboard.module';
import { LandingFormComponent } from './containers/landing-form/landing-form.component';

/* Routes */
export const ROUTES: Routes = [
    {
        path: 'welcome',
        data: {
            title: 'Welcome to Fx4U',
            breadcrumbs: [
                {
                    text: 'Welcome to Fx4U',
                    link: '/Dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: LandingFormComponent,
    },
    {
        path: '',
        data: {
            title: 'Dashboard  ',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    active: true,
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.DashboardComponent,
    },

    {
        path: 'outward/remittance/landing',
        data: {
            title: 'Outward Remittance',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.OutwardRemittanceComponent,
    },

    {
        path: 'outward/lcform',
        data: {
            title: 'LC Form',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: LcOutwardRemmitanceComponent,
    },

    {
        path: 'remittence',
        data: {
            title: 'Remittance ',
            breadcrumbs: [
                {
                    text: 'Remittance',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.OutwardCreateComponent,
    },

    {
        path: 'lcForm',
        data: {
            title: 'Lc Form ',
            breadcrumbs: [
                {
                    text: 'lcForm',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],

        component: dashboardContainers.LcFormComponent,
    },
    {
        path: 'remittence/:mode/:taskId/:outRmtncId',
        data: {
            title: 'Remittance ',
            breadcrumbs: [
                {
                    text: 'Remittance',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.OutwardCreateComponent,
    },
    {
        path: 'lcForm/:mode/:taskId/:lcFormId',
        data: {
            title: 'Lc Form ',
            breadcrumbs: [
                {
                    text: 'Outward',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.LcFormComponent,
    },
    {
        path: 'advRem',
        data: {
            title: 'Advance Outward Form',
            breadcrumbs: [
                {
                    text: 'lcForm',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.AdvanceRemComponent,
    },
    {
        path: 'advRem/:mode/:taskId/:advRemId',
        data: {
            title: 'New Advance Remittance Forms ',
            breadcrumbs: [
                {
                    text: 'advRem',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.AdvanceRemComponent,
    },
    {
        path: 'lcForm',
        data: {
            title: 'Lc Form ',
            breadcrumbs: [
                {
                    text: 'lcForm',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.AdvanceRemComponent,
    },
    {
        path: 'outward/advRem',
        data: {
            title: 'Advance Remmitance Form',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: AdvOutwardRemComponent,
    },
    {
        path: 'exports',
        data: {
            title: 'Exports Form ',
            breadcrumbs: [
                {
                    text: 'Exports',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: ExportsComponent,
    },
    {
        path: 'outward/exports',
        data: {
            title: 'Exports Remmitance Form',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: ExportOutwardRemComponent,
    },
    {
        path: 'outward/advRem',
        data: {
            title: 'Advance Remmitance Form',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: AdvOutwardRemComponent,
    },
    {
        path: 'exports',
        data: {
            title: 'Exports Form ',
            breadcrumbs: [
                {
                    text: 'Exports',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: ExportsComponent,
    },

    {
        path: 'bill',
        data: {
            title: 'Exports Bill Collection',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: BillCollectionComponent,
    },
    {
        path: 'import/bill',
        data: {
            title: 'Imports Collection Bill',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: ImportBillCollectionComponent,
    },
    {
        path: 'billCollection',
        data: {
            title: 'Imports Collection Bill',
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: ImportBillCollectionOutwardComponent,
    },
    {
        path: 'billCollection/:mode/:taskId/:importBillsId',
        data: {
            title: 'Import Bill Collection Form',
            breadcrumbs: [
                {
                    text: 'bill',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.ImportBillCollectionComponent,
    },
    {
        path: 'outward/ammendment',
        data: {
            title: 'Exports Bill Collection',
            breadcrumbs: [
                {
                    text: 'Amendment For letter of Credit',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: AmendmentLcFormComponent,
    },
    {
        path: 'bill/:mode/:taskId/:exportBillsId',
        data: {
            title: 'New Advance Remittance Forms ',
            breadcrumbs: [
                {
                    text: 'bill',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.BillCollectionComponent,
    },
    {
        path: 'outward/bill',
        data: {
            title: 'Bill Collection Form',
            breadcrumbs: [
                {
                    text: 'bill',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: BillCollectionOutwardRemComponent,
    },
    {
        path: 'exports/:mode/:taskId/:pcfcId',
        data: {
            title: 'Exports Remmitance Form',
            breadcrumbs: [
                {
                    text: 'exports',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.ExportsComponent,
    },
    {
        path: 'cpcft',
        data: {
            title: 'Inward Remmitance',
            breadcrumbs: [
                {
                    text: 'Inward Remmitance',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: CpcftComponent,
    },
    {
        path: 'cpcft/:mode/:taskId/:inRmtncId',
        data: {
            title: 'Inward Remmitance',
            breadcrumbs: [
                {
                    text: 'Inward Remmitance',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.CpcftComponent,
    },
    {
        path: 'outward/cpcft',
        data: {
            title: 'Inward Remmitance',
            breadcrumbs: [
                {
                    text: 'cpcft',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: PcfcOutwardRemComponent,
    },
    {
        path: 'guarantee',
        data: {
            title: 'Guarantee',
            breadcrumbs: [
                {
                    text: 'Guarantee',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: GuaranteeComponent,
    },
    {
        path: 'outward/guarantee',
        data: {
            title: 'Guarantee',
            breadcrumbs: [
                {
                    text: 'guarantee',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: OutwardGuaranteeComponent,
    },
    {
        path: 'outward/forwardCntct',
        data: {
            title: 'Forward Contract',
            breadcrumbs: [
                {
                    text: 'forward',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: ForwardCntctListComponent,
    },
    {
        path: 'forwardCntct',
        data: {
            title: 'Forward Contract',
            breadcrumbs: [
                {
                    text: 'forward',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: ForwardCntctComponent,
    },
    {
        path: 'inlandlc2/:mode/:taskId/:lcFormId',
        data: {
            title: 'Inland Lc Application',
            breadcrumbs: [
                {
                    text: 'Inland',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: InlandlcformComponent,
    },
    {
        path: 'inlandlc2',
        data: {
            title: 'Inland Lc Application',
            breadcrumbs: [
                {
                    text: 'Inland',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: InlandlcformComponent,
    },
    {
        path: 'inlandlc',
        data: {
            title: 'Inland ',
            breadcrumbs: [
                {
                    text: 'Inland lc',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: LCInlandComponent,
    },

    {
        path: 'forwardCntct/:mode/:taskId/:fwdCntId',
        data: {
            title: 'Forward Contract Form',
            breadcrumbs: [
                {
                    text: 'bill',
                    link: '/dashboard',
                },
            ],
        } as SBRouteData,
        canActivate: [],
        component: dashboardContainers.ForwardCntctComponent,
    },
];

@NgModule({
    imports: [DashboardModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
