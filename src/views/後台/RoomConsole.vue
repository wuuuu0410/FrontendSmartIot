<script>
import BackBookMark from '@/components/BackBookMark.vue';
import RoomFront from '@/components/房間內頁/RoomFront.vue';
import RoomHistoricalRecord from '@/components/房間內頁/RoomHistoricalRecord.vue';
import RoomErrorLog from '@/components/房間內頁/RoomErrorLog.vue';
export default {
    data() {
        return {
            tabsArray: {
                buttonName: ["設備管理", "歷史記錄"],
                //tab1、2、3是為了標記插槽名稱
                tabsNumber: ['tab1', 'tab2', 'tab3']
            }
        };
    },
    created() {

    },
    mounted() {

    },
    computed: {

    },
    components: {
        BackBookMark,
        RoomFront,
        RoomHistoricalRecord,
        RoomErrorLog
    },

    methods: {

    }
};
</script>

<template>
    <div class="background">
        <div class="showArea">
            <BackBookMark :tabsPresent="this.tabsArray.buttonName" :tabsName="this.tabsArray.tabsNumber">
                <template  v-slot:tab1>
                    <RoomFront/>
                </template>
                <template  v-slot:tab2>
                    <RoomErrorLog/>
                </template>
            
        
            </BackBookMark>

        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.background{
    width: 100%;
    height: 100dvh;
    background: $dark01;
    position: relative;
    .showArea{
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -475px;
        margin-left: -750px;
        width: 1500px;
        height: 950px;
        // border: 1px solid black;
    }
}
</style>