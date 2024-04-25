<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">{{ title }}</span>
        </div>
    </nav>
    <br />
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "",
        },
    },
};
</script>