import router from '@/router';

export default {
    /**
     * Function ignoreBlock
     * Função não realiza ação, apenas impede o eslint de mostrar erros
     *
     * @return boolean
     */
    ignoreBlock() {
        return false;
    },

    /**
     * Function redirectPath
     * Realiza o redirect para uma página especifica
     *
     * @param {string} path Rota para redirecionamento
     * @param {Object} query Query para ser passada na rota
     */
    async redirectPath(path, query = {}) {
        if(this.isEmpty(path)) {
            path = "/";
        } else if(path.substring(0, 1) !== "/") {
            path = "/" + path;
        }
        if(this.isEmpty(query)) {
            query = {};
        }

        await router.push({ path: path, query: query });
    },

    /**
     * Function openPageNewTab
     * Abre uma nova aba com para a página especifica
     *
     * @param {string} path Rota para redirecionamento ou URL
     * @param {Object} query Query para ser passada na rota
     */
    openPageNewTab(path, query) {
        if(this.isEmpty(path)) {
            path = "/";
        } else if(path.substring(0, 1) !== "/") {
            path = "/" + path;
        }
        if(!this.isEmpty(query)) {
            path += (path.includes("?") ? "&" : "?");
            if(this.isObject(query)) {
                path += new URLSearchParams(query).toString();
            } else if((typeof query) === "string") {
                path += query;
            }
        }

        window.open(path, '_blank').focus();
    },

    /**
     * Function isArray
     * Determina se uma variavel é um array
     *
     * @param obj Variavel para ser testada
     * @returns {boolean}
     */
    isArray(obj) {
        return Array.isArray(obj);
    },

    /**
     * Function isObject
     * Determina se uma variavel é um objeto
     *
     * @param obj Variavel para ser testada
     * @returns {boolean}
     *
     * @ref https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
     */
    isObject(obj) {
        if(Array.isArray(obj) || obj === null) return false;
        return (typeof obj).toLowerCase() === "object";
    },

    /**
     * Function isArrayOrObject
     * Determina se uma variavel é um array ou um objeto
     *
     * @param obj Variavel para ser testada
     * @returns {boolean}
     *
     * @ref https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
     */
    isArrayOrObject(obj) {
        if(obj === null) return false;
        return (typeof obj).toLowerCase() === "object";
    },

    /**
     * Function isZero.
     * Testa se uma variavel está zerada
     *
     * @param {any} thing variavel para testar
     * @returns {boolean}
     */
    isZero(thing) {
        try{
            if((typeof thing) === "string" && thing.trim() === "") {
                return false;
            }

            thing = thing.toString() * 1;
            if(thing === 0) {
                return true;
            }
        } catch (e) {
            this.ignoreBlock();
        }

        return false;
    },

    /**
     * Function isEmpty.
     * Testa se uma variavel é vazia, testando todos os possiveis casos
     *
     * @param {any} thing variavel para testar
     * @returns {boolean}
     */
    isEmpty(thing) {
        if(
            thing === null ||
            thing === false ||
            thing === undefined
        ) {
            return true;
        } else if(this.isArrayOrObject(thing)){
            if(thing?.length === undefined) {
                let hasEntered = false;
                for (const prop in thing) {
                    hasEntered = true;
                    if (Object.hasOwn(thing, prop)) {
                        return false;
                    }
                }

                if(!hasEntered) {
                    return true;
                }
            }

            return thing.length === 0;
        }

        try{
            thing = thing.toString().trim().toLowerCase();
            if(
                thing === "" || thing === "false" ||
                thing === "null" || thing === "undefined" ||
                thing === "nan"
            ) {
                return true;
            }
        } catch (e) {
            this.ignoreBlock();
        }

        return this.isZero(thing);
    },

    /**
     * Function isEmptyDecimal.
     * Testa se uma variavel é vazia, ou vazia como float, testando todos os possiveis casos
     *
     * @param {any} thing variavel para testar
     * @returns {boolean}
     */
    isEmptyDecimal(thing) {
        try{
            return this.isEmpty(parseFloat(thing));
        } catch(e) {
            this.ignoreBlock();
        }

        return this.isEmpty(thing);
    },

    /**
     * Function isEmptyInteger.
     * Testa se uma variavel é vazia, ou vazia como integer, testando todos os possiveis casos
     *
     * @param {any} thing variavel para testar
     * @returns {boolean}
     */
    isEmptyInteger(thing) {
        try{
            return this.isEmpty(parseInt(thing));
        } catch(e) {
            this.ignoreBlock();
        }

        return this.isEmpty(thing);
    },

    /**
     * Function isEmptyExceptZero.
     * Testa se uma variavel é vazia, testando todos os possiveis casos, mas caso a string esteja zerada,
     * não considera vazio
     *
     * @param {any} thing váriavel para testar
     * @returns {boolean}
     */
    isEmptyExceptZero(thing) {
        return this.isEmpty(thing) && !this.isZero(thing);
    },

    /**
     * Function checkEvNewTab.
     * Verifica se o evento enviado foi o shift, ctrl, meta, alt
     *
     * @param {Event} e Evento a ser verificado
     * @returns {boolean}
     */
    checkEvNewTab(e) {
        return e.shiftKey || e.ctrlKey || e.metaKey || e.altKey;
    },

    /**
     * Function delay
     * Espera uma quantidade de tempo para realizar a próxima execução
     *
     * @param {number} ms Milisegundos para serem aguardados
     */
    async delay(ms) {
        await new Promise(res => setTimeout(res, ms));
    },

    /**
     * Realiza o reload da página atual
     */
    reloadPage() {
        window.location.reload();
    },

    /**
     * Cria um novo objeto ou array sem referência do anterior
     *
     * @param {Object|Array} obj Objeto a ser copiado
     *
     * @return {Object|Array}
     */
    copyObject(obj) {
        if(obj === null) {
            return null;
        } else if(!this.isArrayOrObject(obj)) {
            return obj;
        }

        return JSON.parse(JSON.stringify(obj));
    },
}