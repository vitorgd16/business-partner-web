import {mapGetters, mapActions} from 'vuex'

export const systemMethods =
    mapActions(
        'system',
        [
            'forceLoading',
        ]
    );

export const systemComputed = {
    ...mapGetters('system', ['isLoading']),
}