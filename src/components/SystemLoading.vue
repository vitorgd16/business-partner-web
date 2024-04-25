<template>
    <div v-if="isLoading" class="overlay-container">
        <div class="spinner-border loading" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script>
import {
    systemComputed,
} from "@/state/helpers";

export default {
    name: 'PageLoading',
    computed: {
        ...systemComputed,
    }
};
</script>

<style scoped>
.overlay-container{
    position: fixed;
    z-index: 99999;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FFFFFF;
    opacity: 0.5;
}
</style>

