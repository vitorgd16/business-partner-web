import axios from 'axios';
import utils from "@/helpers/utils";
import constants from "@/helpers/constants";

export default {
    /**
     * Function system_call_api
     * Chama a API do sistema
     *
     * @param {string} method Tipo do método a ser chamado. Exemplo: POST, GET, PUT, DELETE
     * @param {string} uri Rota para o método desejado da API do sistema
     * @param {Object|array} data Objeto de dados a serem enviados ao server, o objeto deve conter as seguintes chaves:
     *                      - get: Objeto de dados para serem enviados no GET. Exemplo: {force: 1}
     *                      - post: Objeto de dados para serem enviados no POST.
     *                          Exemplo 1: {username: "USER", password: "PASSWORD"}
     *
     * @returns {Promise<any>}
     */
    async system_call_api(method, uri, data = null) {
        let retAPI = null;
        const getRetError = (httpStatus, code, msg) => {
            return {
                "httpStatus": httpStatus ?? 500,
                "error": {
                    "status": !utils.isEmpty(code) ? code : constants.REQUEST_ERROR_CODE_DEFAULT,
                    "message": !utils.isEmpty(msg) ? msg : constants.REQUEST_ERROR_MESSAGE_DEFAULT,
                }
            };
        };

        if(utils.isEmpty(uri)) {
            return getRetError();
        }

        let configAxios = {};
        configAxios['timeout'] = constants.REQUEST_TIMEOUT_MS;
        configAxios['crossDomain'] = true;

        if(utils.isEmpty(method)) {
            method = "post";
        }
        method = method.toUpperCase();
        configAxios['method'] = method;

        if(utils.isEmpty(data)) {
            data = {};
        }

        //Adicionar Content-Type na header causa o erro "Missing boundary in multipart/form-data POST"
        configAxios['headers'] = {};

        if(utils.isEmpty(data['get'])) {
            data['get'] = {};
        }

        if(utils.isEmpty(data['post'])) {
            data['post'] = {};
        }

        if(!utils.isEmpty(data['get'])) {
            uri += (uri.includes("?") ? "&" : "?") + new URLSearchParams(data['get']).toString();
        }
        uri = constants.URL_BACKEND + constants.URL_API_SEGMENT + uri;
        configAxios['url'] = uri;
        configAxios['data'] = JSON.stringify(data['post']);

        let tentativa = 1;
        let maxTentativas = 3;
        let intervalSecBetweenExecs = 3;

        //Tenta até uma certa quantidade de tentativas
        while(tentativa <= maxTentativas) {
            retAPI = null;
            try {
                await axios(configAxios).then(response => {
                    retAPI = {
                        "data": response.data?.data,
                    }
                }).catch(async (err) => {
                    let response = null;
                    let isJSON = false;
                    try{
                        response = JSON.parse(err?.request?.response);
                        isJSON = true;
                    } catch(e) {
                        response = err?.request?.response;
                    }

                    retAPI = getRetError(
                        err?.response?.status,
                        (isJSON && !utils.isEmpty(response?.error?.code) ? response.error.code : null),
                        (isJSON && !utils.isEmpty(response?.error?.msg) ? response.error.msg : null)
                    );

                    if(
                        retAPI.httpStatus.toString() === "401" ||
                        retAPI.httpStatus.toString() === "403" ||
                        retAPI.httpStatus.toString() === "404"
                    ) {
                        tentativa = maxTentativas;
                    }
                });
            } catch (e) {
                utils.ignoreBlock();
            }

            await utils.delay(intervalSecBetweenExecs * 1000);
            if(utils.isEmpty(this.get_api_response_error(retAPI))) {
                break;
            }
            tentativa++;
        }
        tentativa = null;
        maxTentativas = null;
        configAxios = null;

        return retAPI;
    },

    /**
     * Function get_api_response_error
     * Obtem o erro vindo da response da API para serem utilizados e verificados no sistema
     *
     * @param {Object|string} response Objeto do retorno da chamada da API
     *
     * @returns {Object}
     */
    get_api_response_error(response) {
        if(!utils.isArrayOrObject(response) || utils.isEmpty(response?.error)) {
            return {};
        }

        return response?.error;
    },

    /**
     * Function createMessageBS5Object
     * Obtêm um objeto para criação de uma mensagem do bootstrap 5 em tela
     *
     * @param {string} id ID especifico da mensagem para controle interno
     * @param {string} type Tipo da mensagem, deve ser um dos tipos válidos definidos na constante no inicio da função
     * @param {string} message Mensagem para ser exibida
     * @param {boolean} dismissable Define se a mensagem poderá ser dispensada ou não
     *
     * @return {Object|null}
     */
    createMessageBS5Object(id, type, message, dismissable = false) {
        const acceptedTypes = ["info", "success", "warning", "danger"];
        if(utils.isEmpty(id) || utils.isEmpty(type)) {
            return null;
        }

        id = id.toString().toLowerCase();
        type = type.toString().toLowerCase();
        if(!acceptedTypes.includes(type)) {
            return null;
        }

        let obj = {
            id: id,
            type: type,
            typeClass: null,
            typeSymbolHREF: null,
            dismissable: !utils.isEmpty(dismissable),
            body: message,
        };
        switch (type) {
            case "info":
                obj.typeClass = "alert-primary";
                obj.typeSymbolHREF = "#info-fill";
                break;
            case "success":
                obj.typeClass = "alert-success";
                obj.typeSymbolHREF = "#check-circle-fill";
                break;
            case "warning":
                obj.typeClass = "alert-warning";
                obj.typeSymbolHREF = "#exclamation-triangle-fill";
                break;
            case "danger":
                obj.typeClass = "alert-danger";
                obj.typeSymbolHREF = "#exclamation-triangle-fill";
                break;
        }

        return obj;
    }
}