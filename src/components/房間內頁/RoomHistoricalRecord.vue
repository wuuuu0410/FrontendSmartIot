<script>
import Idle from '@/components/XIdle.vue';
import Using from '@/components/XUsing.vue';
import SearchHistorical from '@/components/SearchHistorical.vue';
export default {
    data() {
        return {
            divArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
    },
    created() {

    },
    mounted() {

    },
    computed: {

    },
    components: {
        Idle,
        Using,
        SearchHistorical
    },

    methods: {

    }
};
</script>

<template>
    <div class="out">
        <div class="roomtitle">
                <h2>602-會議室</h2><p>南方麒麟股份有限公司嘶嘶嘶嘶</p>
        </div>
        <SearchHistorical>
            <template #roomid>
                <p></p>
            </template>
        </SearchHistorical>
        <div class="down">
            <div class="history" v-for="(div, index) in divArr">
                <div class="historyName"></div>
                <div class="historyCurve"></div>
            </div>

        </div>
        
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.out {
    width: 1238px;
    height: 910px;
    display: flex;
    flex-direction: column;
    align-items:end;
    border-radius: 25px;
    // border: 1px solid black;
    padding-top: 40px;
    position: relative;
    background-color: $dark03;
    .roomtitle{
        position: absolute;
        display: flex;
        align-items: center;
        top: 25px;
        left: 35px;
        color: $black1;
        p{
            display: block;
            font-size: 20px;
            margin-left: 20px;
        }
    }
}
.down{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    // border: 1px solid black;
    border-radius: 0 0 25px 25px;
    background-color: $dark01;
    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-button {
        background: transparent;
        height: 20px;
    }

    &::-webkit-scrollbar-thumb {
        background: $black1;
        border-radius: 15px;

    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 15px;
    }
    .history {
        width: 1170px;
        margin: 0 0 20px 0;
        display: flex;
        margin: 20px auto;
    }
    .historyName {
        width: 20%;
        height: 107px;
        border-radius: 25px 0 0 25px;
        background: $dark03;
    }
    .historyCurve{
        width:80%;
        height: 107px;
        border-radius: 0 25px 25px 0 ;
        background: $dark02;
    }
}

</style>