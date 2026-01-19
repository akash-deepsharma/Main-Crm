export const menuList = [
    {
        id: 0,
        name: "dashboards",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name: "CRM",
                path: "/dashboards/crm",
                subdropdownMenu: false
            },
            // {
            //     id: 2,
            //     name: "Analytics",
            //     path: "/dashboards/analytics",
            //     subdropdownMenu: false
            // }
        ]
    },
    // {
    //     id: 1,
    //     name: "reports",
    //     path: "#",
    //     icon: 'feather-cast',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Sales Report",
    //             path: "/reports/sales",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Leads Report",
    //             path: "/reports/leads",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Project Report",
    //             path: "/reports/project",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Timesheets Report",
    //             path: "/reports/timesheets",
    //             subdropdownMenu: false
    //         },

    //     ]
    // },
    // {
    //     id: 2,
    //     name: "applications",
    //     path: '#',
    //     icon: 'feather-send',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Chat",
    //             path: "/applications/chat",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Email",
    //             path: "/applications/email",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Tasks",
    //             path: "/applications/tasks",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Notes",
    //             path: "/applications/notes",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 5,
    //             name: "Storage",
    //             path: "/applications/storage",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 6,
    //             name: "Calendar",
    //             path: "/applications/calendar",
    //             subdropdownMenu: false
    //         },
    //     ]
    // },
    // {
    //     id: 3,
    //     name: "proposal",
    //     path: "#",
    //     icon: 'feather-at-sign',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Proposal",
    //             path: "/proposal/list",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Proposal View",
    //             path: "/proposal/view",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Proposal Edit",
    //             path: "/proposal/edit",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Proposal Create",
    //             path: "/proposal/create",
    //             subdropdownMenu: false
    //         },

    //     ],
    // },
    // {
    //     id: 4,
    //     name: "payment",
    //     path: "#",
    //     icon: 'feather-dollar-sign',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Payment",
    //             path: "/payment/list",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Invoice View",
    //             path: "/payment/view",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Invoice Create",
    //             path: "/payment/create",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    // {
    //     id: 5,
    //     name: "customers",
    //     path: "#",
    //     icon: 'feather-users',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Customers",
    //             path: "/customers/list",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Customers View",
    //             path: "/customers/view",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Customers Create",
    //             path: "/customers/create",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    // {
    //     id: 6,
    //     name: "leads",
    //     path: "#",
    //     icon: 'feather-alert-circle',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Leads",
    //             path: "/leads/list",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Leads View",
    //             path: "/leads/view",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Leads Create",
    //             path: "/leads/create",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    // {
    //     id: 7,
    //     name: "projects",
    //     path: "#",
    //     icon: 'feather-briefcase',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Projects",
    //             path: "/projects/list",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Projects View",
    //             path: "/projects/view",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Projects Create",
    //             path: "/projects/create",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    {
        id: 8,
        name: "client",
        path: "#",
        icon: 'feather-layout',
        dropdownMenu: [
            {
                id: 1,
                name: "Client Lists",
                path: "#",
                subdropdownMenu: [
                    {
                id: 1,
                name: "GeM Clients",
                path: "/clients/list?type=GeM",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: " Corporate Clients",
                path: "/clients/list?type=Corporate",
                subdropdownMenu: false
            }
                ]
            },
            {
                id: 2,
                name: "Client Create",
                path: "/clients/create",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 9,
        name: "Employee",
        path: "#",
        icon: 'feather-user-plus',
        dropdownMenu: [
            {
                id: 1,
                name: "Employee List",
                path: "#",
                subdropdownMenu: [
                    {
                id: 1,
                name: "GeM Employee",
                path: "/employees/list?type=GeM",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: " Corporate Employee",
                path: "/employees/list?type=Corporate",
                subdropdownMenu: false
            }
                ]
            },
            {
                id: 2,
                name: " Employee Create",
                path: "/employees/create",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 9,
        name: " Wages",
        path: "#",
        icon: 'feather-user-plus',
        dropdownMenu: [            
            {
                id: 1,
                name: " Set wages",
                path: "/wages",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 10,
        name: "Attendance",
        path: "#",
        icon: 'feather-life-buoy',
        dropdownMenu: [
            {
                id: 1,
                name: "Client List",
                path: "#",
                subdropdownMenu: [
                    {
                        id: 1,
                        name: "GeM Client",
                        path: "/attendance/list",
                        subdropdownMenu: false
                    },
                    {
                        id: 2,
                        name: " Corporate Client",
                        path: "/",
                        subdropdownMenu: false
                    }
                ]
            },
            {
                id: 2,
                name: " Attendance Create",
                path: "/attendance/create",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 11,
        name: "Salary",
        path: "#",
        icon: 'feather-dollar-sign',
        dropdownMenu: [
            {
                id: 1,
                name: " Salary List",
                path: "#",
                subdropdownMenu: [
                    {
                        id: 1,
                        name: "GeM Client",
                        path: "/salary/list?type=GeM",
                        subdropdownMenu: false
                    },
                    {
                        id: 2,
                        name: " Corporate Client",
                        path: "/salary/list?type=Corporate",
                        subdropdownMenu: false
                    }
                ]
            },
            {
                id: 2,
                name: "Create Salary",
                path: "/salary/create",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 11,
        name: "Compliance ",
        path: "#",
        icon: 'feather-award',
        dropdownMenu: [
            {
                id: 1,
                name: " Compliance List",
                path: "#",
                subdropdownMenu: [
                    {
                        id: 1,
                        name: "GeM Client",
                        path: "/compliance/list",
                        subdropdownMenu: false
                    },
                    {
                        id: 2,
                        name: " Corporate Client",
                        path: "/",
                        subdropdownMenu: false
                    }
                ]
            },
            {
                id: 2,
                name: "Compliance Invoice",
                path: "/compliance/create",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 11,
        name: "Invoice ",
        path: "#",
        icon: 'feather-file-text',
        dropdownMenu: [
            {
                id: 1,
                name: " Invoice List",
                path: "#",
                subdropdownMenu: [
                    {
                        id: 1,
                        name: "GeM Client",
                        path: "/invoice/list",
                        subdropdownMenu: false
                    },
                    {
                        id: 2,
                        name: " Corporate Client",
                        path: "/",
                        subdropdownMenu: false
                    }
                ]
            },
            {
                id: 2,
                name: "Create Invoice",
                path: "/invoice/create",
                subdropdownMenu: false
            }
        ]
    },
    // {
    //     id: 9,
    //     name: "settings",
    //     path: "#",
    //     icon: 'feather-settings',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Ganeral",
    //             path: "/settings/ganeral",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "SEO",
    //             path: "/settings/seo",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Tags",
    //             path: "/settings/tags",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Email",
    //             path: "/settings/email",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 5,
    //             name: "Tasks",
    //             path: "/settings/tasks",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 6,
    //             name: "Leads",
    //             path: "/settings/leads",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 7,
    //             name: "Support",
    //             path: "/settings/Support",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 8,
    //             name: "Finance",
    //             path: "/settings/finance",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 9,
    //             name: "Gateways",
    //             path: "/settings/gateways",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 10,
    //             name: "Customers",
    //             path: "/settings/customers",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 11,
    //             name: "Localization",
    //             path: "/settings/localization",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 12,
    //             name: "reCAPTCHA",
    //             path: "/settings/recaptcha",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 13,
    //             name: "Miscellaneous",
    //             path: "/settings/miscellaneous",
    //             subdropdownMenu: false
    //         },
    //     ]
    // },
    // {
    //     id: 10,
    //     name: "authentication",
    //     path: "#",
    //     icon: 'feather-power',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "login",
    //             path: "/authentication/login/creative",
    //             subdropdownMenu: [
    //                 // {
    //                 //     id: 1,
    //                 //     name: "Cover",
    //                 //     path: "/authentication/login/cover",
    //                 // },
    //                 // {
    //                 //     id: 2,
    //                 //     name: "Minimal",
    //                 //     path: "/authentication/login/minimal",
    //                 // },
    //                 // {
    //                 //     id: 3,
    //                 //     name: "Creative",
    //                 //     path: "/authentication/login/creative",
    //                 // },
    //             ]
    //         },
    //         {
    //             id: 2,
    //             name: "register",
    //             path: "/authentication/register/creative",
    //             subdropdownMenu: [
    //                 // {
    //                 //     id: 1,
    //                 //     name: "Cover",
    //                 //     path: "/authentication/register/cover",
    //                 // },
    //                 // {
    //                 //     id: 2,
    //                 //     name: "Minimal",
    //                 //     path: "/authentication/register/minimal",
    //                 // },
    //                 // {
    //                 //     id: 3,
    //                 //     name: "Creative",
    //                 //     path: "/authentication/register/creative",
    //                 // },
    //             ]
    //         },
    //         {
    //             id: 3,
    //             name: "Error 404",
    //             path: "/authentication/404/creative",
    //             subdropdownMenu: [
    //                 // {
    //                 //     id: 1,
    //                 //     name: "Cover",
    //                 //     path: "/authentication/404/cover",
    //                 // },
    //                 // {
    //                 //     id: 2,
    //                 //     name: "Minimal",
    //                 //     path: "/authentication/404/minimal",
    //                 // },
    //                 // {
    //                 //     id: 3,
    //                 //     name: "Creative",
    //                 //     path: "/authentication/404/creative",
    //                 // },
    //             ]
    //         },
    //         {
    //             id: 4,
    //             name: "Reset Pass",
    //             path: "/authentication/reset/creative",
    //             subdropdownMenu: [
    //                 // {
    //                 //     id: 1,
    //                 //     name: "Cover",
    //                 //     path: "/authentication/reset/cover",
    //                 // },
    //                 // {
    //                 //     id: 2,
    //                 //     name: "Minimal",
    //                 //     path: "/authentication/reset/minimal",
    //                 // },
    //                 // {
    //                 //     id: 3,
    //                 //     name: "Creative",
    //                 //     path: "/authentication/reset/creative",
    //                 // },
    //             ]
    //         },
    //         {
    //             id: 5,
    //             name: "Verify OTP",
    //             path: "/authentication/verify/creative",
    //             subdropdownMenu: [
    //                 // {
    //                 //     id: 1,
    //                 //     name: "Cover",
    //                 //     path: "/authentication/verify/cover",
    //                 // },
    //                 // {
    //                 //     id: 2,
    //                 //     name: "Minimal",
    //                 //     path: "/authentication/verify/minimal",
    //                 // },
    //                 // {
    //                 //     id: 3,
    //                 //     name: "Creative",
    //                 //     path: "/authentication/verify/creative",
    //                 // },
    //             ]
    //         },
    //         {
    //             id: 6,
    //             name: "Maintenance",
    //             path: "/authentication/maintenance/creative",
    //             subdropdownMenu: [
    //                 // {
    //                 //     id: 1,
    //                 //     name: "Cover",
    //                 //     path: "/authentication/maintenance/cover",
    //                 // },
    //                 // {
    //                 //     id: 2,
    //                 //     name: "Minimal",
    //                 //     path: "/authentication/maintenance/minimal",
    //                 // },
    //                 // {
    //                 //     id: 3,
    //                 //     name: "Creative",
    //                 //     path: "/authentication/maintenance/creative",
    //                 // },
    //             ]
    //         },
    //     ]
    // },
    // {
    //     id: 11,
    //     name: "help center",
    //     path: "#",
    //     icon: 'feather-life-buoy',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Support",
    //             path: "https://wrapbootstrap.com/user/theme_ocean",
    //             target:"_blank",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "KnowledgeBase",
    //             path: "/help/knowledgebase",
    //             subdropdownMenu: false
    //         },
    //         
    //     ]
    // },
    
]
