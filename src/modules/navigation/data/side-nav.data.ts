import { SideNavItems, SideNavSection } from '@modules/navigation/models';

export const sideNavSections: SideNavSection[] = [
    {
        text: '',
        items: ['dashboard'],
    },
    /*  {
        text: 'welcome',
        items: ['welcome'],
    }, */
    {
        text: 'Forex',
        items: ['pages', 'imports', 'exports', 'CPCFT', 'Guarantee', 'Forward'],
    },
    {
        text: 'Inland',
        items: ['inland'],
    },
];

export const sideNavItems: SideNavItems = {
    dashboard: {
        icon: 'tachometer-alt',
        text: 'Dashboard',
        link: '/dashboard',
    },
    welcome: {
        icon: 'tachometer-alt',
        text: 'Welcome to Fx4U',
        link: '/dashboard/welcome',
    },
    pages: {
        text: 'Remittances',
        icon: 'book-open',
        submenu: [
            {
                text: 'FOREIGN OUTWARD SWIFT TRANSFER',
                icon: 'book-open',
                submenu: [
                    {
                        text: 'Outward Remittance Application',
                        code: 'OUTWARD_REMITTNCE',
                        link: '/dashboard/outward/remittance/landing',
                    },
                    {
                        text: 'Advance Remittance Application',
                        code: 'ADVANCE_REMITTNCE',
                        link: '/dashboard/outward/advRem',
                    },
                ],
            },
        ],
    },
    imports: {
        text: 'Imports',
        icon: 'book-open',
        code: 'OTHER_HIDE_FOR_C',
        submenu: [
            {
                text: 'Letter of Credit Amendment',
                icon: 'book-open',
                submenu: [
                    {
                        text: 'Amendment  for Letter of Credit ',
                        link: '/dashboard/outward/ammendment',
                        code: 'AMENDMENT_LOC',
                    },
                ],
            },
            {
                text: 'Letter of Credit',
                icon: 'book-open',
                submenu: [
                    {
                        text: 'Irrevocable Documentry Letter Of Credit',
                        code: 'IRRVCBL_DOC_LTTR',
                        link: '/dashboard/outward/lcform',
                    },
                ],
            },
            {
                text: 'Bills Under Collection',
                icon: 'book-open',
                submenu: [
                    {
                        text: 'Import Bills Collection',
                        code: 'IRRVCBL_DOC_LTTR',
                        link: '/dashboard/billCollection',
                    },
                ],
            },
        ],
    },
    exports: {
        text: 'Exports',
        icon: 'book-open',
        code: 'OTHER_HIDE_FOR_C',
        submenu: [
            {
                text: 'Loans',
                icon: 'book-open',
                submenu: [
                    {
                        text: 'Packing Credit In Foreign Currency',
                        code: 'PACKING_CREDIT',
                        link: '/dashboard/outward/exports',
                    },
                ],
            },
            {
                text: 'Bills',
                icon: 'book-open',
                submenu: [
                    {
                        text: 'Export Bill Collection',
                        code: 'EXPORT_BILLS',
                        link: '/dashboard/outward/bill',
                    },
                ],
            },
        ],
    },
    CPCFT: {
        text: 'Inward Remmitance',
        icon: 'book-open',
        code: 'OTHER_HIDE_FOR_C',
        submenu: [
            {
                text: 'Inward Remmitance',
                code: 'INWARD_REMITTANCE',
                link: '/dashboard/outward/cpcft',
            },
        ],
    },
    Guarantee: {
        text: 'Guarantee',
        icon: 'book-open',
        code: 'OTHER_HIDE_FOR_C',
        submenu: [
            {
                text: 'Guarantee',
                code: 'GUARANTEE',
                link: '/dashboard/outward/guarantee',
            },
        ],
    },
    Forward: {
        text: 'Forward Contract',
        icon: 'book-open',
        submenu: [
            {
                text: 'Forward Contract',
                code: 'FORWARD_CONTRACT',
                link: '/dashboard/outward/forwardCntct',
            },
        ],
    },

    ///////////////// inland////////////////
    inland: {
        text: 'Inland LC',
        icon: 'book-open',
        submenu: [
            {
                text: 'Inland LC',
                code: 'INLAND_LC',
                link: '/dashboard/inlandlc',
            },
        ],
    },
    /*  IGurantee: {
        text: 'BG',
        icon: 'book-open',
        submenu: [

            {
                text: 'Inland BG',
                code: 'INLAND_BG',
                link: '/dashboard/BgInland',
            },

        ],
    }, */
};
