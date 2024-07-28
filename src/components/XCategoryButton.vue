<script>
// 棄用
export default {
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    computed: {

    },
    components: {

    },

    methods: {

    }
};
</script>

<template>
    <div class="buttonArea">
        <button>冷氣</button>
        <button>燈</button>
        <button>除濕機</button>
        <button>空氣清淨機</button>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';
.buttonArea {
    width: 1189px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

button {
    width: 120px;
    height: 50px;
    border: none;
    outline: none;
    border-radius: 35px;
    margin: 0 20px;
    font-size: 20px;
    font-weight: 500;
    color: $white;
    background: $dark03;
    cursor: pointer;
}
</style>