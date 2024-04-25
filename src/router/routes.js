export default [
    {
        path: "/",
        name: "businesspartner",
        meta: {
            title: "Parceiros de Negócio",
        },
        component: () => import("../views/admin/businessPartner/index.vue"),
    },
    {
        path: "/add",
        name: "businesspartneradd",
        meta: {
            title: "Adicionar - Parceiro de Negócio",
        },
        component: () => import("../views/admin/businessPartner/merge.vue"),
    },
    {
        path: "/update",
        name: "businesspartnerupdate",
        meta: {
            title: "Atualizar - Parceiro de Negócio",
        },
        props: route => ({ id: route.query.id }),
        component: () => import("../views/admin/businessPartner/merge.vue"),
    },
];