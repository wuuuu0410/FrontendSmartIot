<script>
//棄用
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
    <div class="area">
        <div class="lineArea">
            <p>閒置中</p>
            <div class="line"></div>
        </div>
        <div></div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.area {
    width: 1189px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.lineArea {
    width: 1040px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .line {
        width: 924px;
        height: 0;
        border: solid 1px $white;
    }

    p {
        font-size: 20px;
        font-weight: 500;
        color: $white;
    }
}
</style>