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
                <router-link to="/" class="btn btn-primary float-start">
                    <i class="mdi mdi-plus-box-outline"></i> Voltar
                </router-link>
            </div>
        </div>
        <div class="row gy-4" v-if="!utils.isEmpty(this.item)">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <div class="div-code mb-2" v-if="!utils.isEmpty(this.id)">
                            <label class="form-label titulo">Código: {{ item.CardCode }}</label>
                        </div>
                        <div class="div-card_name mb-2">
                            <label class="form-label titulo">Nome</label>
                            <input type="text" v-model="item.CardName" placeholder="João Silva Pereira"
                                   class="form-control" />
                        </div>
                        <div class="div-avatar mb-2">
                            <div v-if="utils.isEmpty(this.id)">
                                <label class="form-label titulo">Avatar</label>
                                <input type="text" v-model="item.avatar" placeholder="https://imagem.url"
                                       class="form-control" v-if="utils.isEmpty(this.id)" />
                            </div>
                            <div v-else>
                                <label class="form-label titulo">Avatar: {{ item.avatar }}</label>
                            </div>
                        </div>

                        <div class="div-created_at mb-2 mt-3" v-if="!utils.isEmpty(this.id)">
                            <label class="form-label titulo">Criado {{ item.createdAtBR }}</label>
                        </div>
                        <button class="btn btn-success text-black float-end" @click="saveItem()">
                            Salvar
                        </button>
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
    name: "BusinessPartnerMergePage",
    components: {
        PageHeader
    },
    data() {
        return {
            item: {},
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
    props: {
        id: {
            type: String,
        },
    },
    methods: {
        async getItem() {
            this.item = {};
            if(utils.isEmpty(this.id)) {
                this.item = {
                    CardName: null,
                    avatar: null
                };
                return;
            }

            await store.dispatch('system/forceLoading', true);
            let retWS = await utilsSystem.system_call_api(
                "get",
                ("business-partner/" + this.id)
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
                this.item = retWS.data;
            }

            retWS = null;
            await store.dispatch('system/forceLoading', false);
        },
        async saveItem() {
            await store.dispatch('system/forceLoading', true);

            let dataSave = utils.copyObject(this.item);
            delete dataSave.CardCode;
            delete dataSave.createdAt;
            delete dataSave.createdAtBR;
            if(!utils.isEmpty(this.id)) {
                delete dataSave.avatar;
            }

            console.log(this.item);
            console.log(dataSave);

            let retWS = await utilsSystem.system_call_api(
                (utils.isEmpty(this.id) ? "post" : "put"),
                ("business-partner" + (!utils.isEmpty(this.id) ? ("/" + this.id) : "")),
                {
                    "post": dataSave
                }
            );
            dataSave = null;

            console.log(retWS);

            if(!utils.isEmpty(utilsSystem.get_api_response_error(retWS))) {
                this.message = utilsSystem.createMessageBS5Object(
                    'my-alert',
                    'warning',
                    utilsSystem.get_api_response_error(retWS)['message'],
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
                await this.getItem();
            }
            retWS = null;

            await store.dispatch('system/forceLoading', false);
        },
    },
    beforeMount() {
        this.message = {};
        this.getItem();
    }
};
</script>