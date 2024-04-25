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
     * Function delay
     * Espera uma quantidade de tempo para realizar a próxima execução
     *
     * @param {number} ms Milisegundos para serem aguardados
     */
    async delay(ms) {
        await new Promise(res => setTimeout(res, ms));
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