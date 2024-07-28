<!-- 前台頁面-入口 -->
<script>
import BookMark from '@/components/BookMark.vue';
import NormalDisplayScreen from '@/components/前台頁籤/NormalDisplayScreen.vue';
import DeviceList from '@/components/前台頁籤/DeviceList.vue';
import FailureRecord from '@/components/前台頁籤/FailureRecord.vue';
import AnnouncementList from '@/components/前台頁籤/AnnouncementList.vue';
export default {
    data() {
        return {
            //這個頁面vue想要幾個內頁
            tabsArray: {
                buttonName: ["首頁", "設備列表", "故障紀錄", "通知訊息"],
                //tab1、2、3是為了標記插槽名稱
                tabsNumber: ['tab1', 'tab2', 'tab3', 'tab4']
            },
            buttonState: false

        };
    },
    created() {

    },
    mounted() {

    },
    computed: {

    },
    components: {
        BookMark,
        NormalDisplayScreen,
        DeviceList,
        FailureRecord,
        AnnouncementList
    },

    methods: {
        toggleButton() {
            this.buttonState = !this.buttonState;
        }

    }
};
</script>

<template>
    <div class="background">
        <div class="goBackstage">
            <RouterLink :to="'/BackStage'" class="t">去後台</RouterLink>
        </div>
        <div class="ipad">
            <div class="showArea">
                <!-- this.tabsArray.buttomName是頁籤的名字陣列 可以往上拉到data看詳細內容 -->
                <!-- 這邊透過父傳子 父是這個vue傳想要幾個內頁給BookMark BookMark會v-for傳過去的這個陣列並生成插槽 -->
                <BookMark :tabsPresent="this.tabsArray.buttonName" :tabsName="this.tabsArray.tabsNumber">
                    <!-- 子BookMark會v-for我們所需要的插槽數量出來 -->
                    <!-- 下面template接收插槽並放入你所想要顯示的內頁資料 -->
                    <template v-slot:tab1>
                        <NormalDisplayScreen />
                    </template>
                    <template v-slot:tab2>
                        <DeviceList />
                    </template>
                    <template v-slot:tab3>
                        <FailureRecord />
                    </template>
                    <template v-slot:tab4>
                        <AnnouncementList />
                    </template>


                </BookMark>


            </div>
        </div>


    </div>


</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.background {
    width: 100%;
    height: 100dvh;
    background-image: url(../../img/slightly.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    .goBackstage{
        position: absolute;
        font-size: 30px;
        top: 20px;
        left: 20px;
        .t{
            color:transparent;
        }
    }
    .ipad {
        position: fixed;
        left: 50%;
        top: 50%;
        margin-top: -550px;
        margin-left: -760px;
        width: 1600px;
        height: 1100px;
        // border: 1px solid black;
        background-image: url(../../img/ipad2.png);
        background-repeat: no-repeat;
        background-size: contain;

        .showArea {
            position: absolute;
            width: 1060px;
            height: 800px;
            // border: 1px solid #b1b1b1;
            background-color: $dark02;
            top: 50%;
            left: 50%;
            margin-top: -404px;
            margin-left: -575px;


        }
    }

}
</style>