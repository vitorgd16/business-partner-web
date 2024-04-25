import utils from "@/helpers/utils";

export const state = {
    isLoadingVisible: false,
    loadingCount: 0,
};

export const mutations = {
    SET_LOADING(state, newValue) {
        state.loadingCount = !utils.isEmpty(newValue) ? (state.loadingCount + 1) : (state.loadingCount - 1);
        if(utils.isEmpty(newValue) && state.loadingCount === 0) {
            state.isLoadingVisible = false;
        } else {
            state.isLoadingVisible = true;
        }
    },
}

export const getters = {
    isLoading(state) {
        return state.isLoadingVisible
    },
}

export const actions = {
    forceLoading({ commit }, isActive) { commit('SET_LOADING', isActive); },
}