<template>
    <PageHeader :title="$route.meta.title" />
    <div class="container">
        <div class="row mb-3">
            <div class="col-12" v-if="!utils.isEmpty(message)">
                <div class="alert d-flex align-items-center" :class="message?.typeClass" role="alert">
                    <svg v-if="!utils.isEmpty(message?.typeSymbolHREF)"
                         class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Symbol">
                        <use :xlink:href="message?.typeSymbolHREF"/>
                    </svg>
                    <div v-html="message?.body"></div>
                    <button v-if="!utils.isEmpty(message?.dismissable)"
                            type="button" class="btn-close" aria-label="Close"
                            @click="message = {}"></button>
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-12">
                <router-link to="/add" class="btn btn-success text-black float-end">
                    <i class="mdi mdi-plus-box-outline"></i> Novo
                </router-link>
            </div>
        </div>
        <div class="row gy-4">
            <div class="col-md-4 " v-for="(item) in items" :key="item.CardCode">
                <div class="card">
                    <img v-if="!utils.isEmpty(item.avatar)" :alt="item.CardName"
                         :src="item.avatar" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">{{ item.CardName }}</h5>
                        <p class="card-text">Criado {{ item.createdAtBR }}</p>
                        <router-link :to="'/update?id=' + item.CardCode" class="btn btn-warning m-2">
                            Alterar
                        </router-link>
                        <button class="btn btn-danger m-2" @click="deleteItem(item.CardCode)">Deletar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PageHeader from "@/components/PageHeader.vue";

import utils from "@/helpers/utils";
import utilsSystem from "@/helpers/system";
import constants from "@/helpers/constants";
import store from "@/state/store";

export default {
    name: "BusinessPartnerPage",
    components: {
        PageHeader
    },
    data() {
        return {
            items: [],
            message: {},
        }
    },
    computed: {
        utils() {
            return utils;
        },
        constants() {
            return constants;
        },
        utilsSystem() {
            return utilsSystem;
        },
    },
    methods: {
        async getItems() {
            await store.dispatch('system/forceLoading', true);
            let retWS = await utilsSystem.system_call_api(
                "get",
                "business-partner"
            );

            if(!utils.isEmpty(utilsSystem.get_api_response_error(retWS))) {
                this.message = utilsSystem.createMessageBS5Object(
                    'my-alert',
                    'warning',
                    (
                        utilsSystem.get_api_response_error(retWS)['status'] + " - " +
                        utilsSystem.get_api_response_error(retWS)['message']
                    ),
                    true
                );
            } else if(utils.isEmpty(retWS.data)) {
                this.message = utilsSystem.createMessageBS5Object(
                    'my-alert',
                    'warning',
                    "Erro desconhecido ao consultar os dados!",
                    true
                );
            } else {
                this.items = retWS.data;
            }

            retWS = null;
            await store.dispatch('system/forceLoading', false);
        },
        async deleteItem(code) {
            await store.dispatch('system/forceLoading', true);
            let retWS = await utilsSystem.system_call_api(
                "delete",
                ("business-partner/" + code),
            );

            if(!utils.isEmpty(utilsSystem.get_api_response_error(retWS))) {
                this.message = utilsSystem.createMessageBS5Object(
                    'my-alert',
                    'warning',
                    (
                        utilsSystem.get_api_response_error(retWS)['status'] + " - " +
                        utilsSystem.get_api_response_error(retWS)['message']
                    ),
                    true
                );
            } else if(utils.isEmpty(retWS.data)) {
                this.message = utilsSystem.createMessageBS5Object(
                    'my-alert',
                    'warning',
                    "Erro desconhecido ao realizar operação!",
                    true
                );
            } else {
                this.message = utilsSystem.createMessageBS5Object(
                    'my-alert',
                    'success',
                    'Operação concluída com sucesso!',
                    true
                );
            }
            retWS = null;

            await this.getItems();
            await store.dispatch('system/forceLoading', false);
        },
    },
    beforeMount() {
        this.message = {};
        this.items = [];

        this.getItems();
    }
};
</script>