

export const permissions = {
    folder: {
        name: 'folders',
        module: 'carpetas',
        permissions: {
            add: 'folders[add]',
            update: 'folders[update]',
            view: 'folders[view]',
            delete: 'folders[delete]',
            report: 'folders[report]',
        }
    },
    town: {
        name: 'town',
        module: 'localidad',
        permissions: {
            add: 'town[add]',
            update: 'town[update]',
            view: 'town[view]',
            delete: 'town[delete]',
            report: 'town[report]',
        }
    },
    route: {
        name: 'route',
        module: 'rutas',
        permissions: {
            add: 'route[add]',
            view: 'route[view]',
            delete: 'route[delete]',
            active: 'route[active]',
            report: 'route[report]',
        }
    },
    municipality: {
        name: 'municipality',
        module: 'municipio',
        permissions: {
            add: 'municipality[add]',
            update: 'municipality[update]',
            view: 'municipality[view]',
            delete: 'municipality[delete]',
            report: 'municipality[report]',
        }
    },
    leaders: {
        name: 'leaders',
        module: 'lideres',
        permissions: {
            add: 'leaders[add]',
            update: 'leaders[update]',
            view: 'leaders[view]',
            active: 'leaders[active]',
            delete: 'leaders[delete]',
            report: 'leaders[report]',
            report_birthday: 'leaders[report-birthday]',
        }
    },
    credits: {
        name: 'credits',
        module: 'creditos',
        permissions: {
            view: 'credits[view]',
            layout: 'credits[layout]',
            statistics: 'credits[statistics]',
            add: 'credits[add]',
            add_additional: 'credits[add-additional]',
            renovate: 'credits[renovate]',
            delete: 'credits[delete]',
            update_client: 'credits[update-client]',
            update_aval: 'credits[update-aval]',
            update: 'credits[update]',
            view_detail: 'credits[view-detail]',
            report: 'credits[report]',
        }
    },
    pays: {
        name: 'pays',
        module: 'pagos rápidos',
        permissions: {
            view: 'pays[view]',
            add: 'pays[add]',
            view_detail: 'pays[view-detail]',
            delete: 'pays[delete]',
            add_no_payment: 'pays[add-no-payment]'
        }
    },
    payments: {
        name: 'payments',
        module: 'pagos',
        permissions: {
            view: 'payments[view]',
            add: 'payments[add]',
            delete: 'payments[delete]',
            update: 'payments[update]',
            report: 'payments[report]',
        }
    },
    agents: {
        name: 'agents',
        module: 'asesores',
        permissions: {
            report: 'agents[report]',
            view: 'agents[view]',
            add: 'agents[add]',
            delete: 'agents[delete]',
        }
    },
    utils: {
        name: 'utils',
        module: 'utilidades',
        permissions: {
            generate_overdue: 'utils[generate-overdue]',
            generate_groups: 'utils[generate-groups]',
        }
    },
    users: {
        name: 'users',
        module: 'usuarios',
        permissions: {
            report: 'users[report]',
            active: 'users[active]',
            view: 'users[view]',
            add: 'users[add]',
            update: 'users[update]',
            update_security: 'users[update-security]',
        }
    },
    roles: {
        name: 'roles',
        module: 'roles', 
        permissions: {
            update: 'roles[update]',
            view: 'roles[view]',
            view_detail: 'roles[view-detail]',
            report: 'roles[report]',
            report_permissions: 'roles[report-permissions]',
        }
    },
    region: {
        name: 'region',
        module: 'region', 
        permissions: {
            view: 'region[view]'
        }
    }
}