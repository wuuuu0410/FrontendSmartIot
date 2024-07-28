<!-- 後台-首頁-入口 -->
<script>
import BackBookMark from '@/components/BackBookMark.vue';
import BackSpaceManagement from '@/components/後台內頁/BackSpaceManagement.vue';
import DeviceManagement from '@/components/後台內頁/DeviceManagement.vue';
// import HistoricalRecord from '@/components/後台內頁/HistoricalRecord.vue';
import ErrorLog from '@/components/後台內頁/ErrorLog.vue';
import SendAnnouncement from '@/components/後台內頁/SendAnnouncement.vue';
export default {
    data() {
        return {
            //這個頁面vue想要幾個內頁
            tabsArray: {
                buttonName: ["空間管理", "設備管理", "歷史記錄",  "公告列表"],
                //tab1、2、3是為了標記插槽名稱
                tabsNumber: ['tab1', 'tab2', 'tab3', 'tab4']
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
        BackBookMark,  //後台頁籤
        BackSpaceManagement,  //空間管理
        DeviceManagement,  //設備管理
        
        ErrorLog,  //錯誤紀錄
        SendAnnouncement,  //發布公告
    },

    methods: {


    }
};
</script>

<template>
    <div class="background">
        <div class="goBackstage">
            <RouterLink :to="'/'" class="t" >去前台</RouterLink>
        </div>
        <div class="showArea">
            <!-- this.tabsArray.buttomName是頁籤的名字陣列 可以往上拉到data看詳細內容 -->
            <!-- 這邊透過父傳子 父是這個vue傳想要幾個內頁給BookMark BookMark會v-for傳過去的這個陣列並生成插槽 -->
            <BackBookMark :tabsPresent="this.tabsArray.buttonName" :tabsName="this.tabsArray.tabsNumber">
                <!-- 子BookMark會v-for我們所需要的插槽數量出來 -->
                <!-- 下面template接收插槽並放入你所想要顯示的內頁資料 -->
                <template class="tab" v-slot:tab1>
                    <BackSpaceManagement />
                </template>
                <template class="tab" v-slot:tab2>
                    <DeviceManagement />
                </template>
                <template class="tab" v-slot:tab3>
                    <ErrorLog/>
                </template>
                <template class="tab" v-slot:tab4>
                    <SendAnnouncement/>
                </template>
                <template #re>
                    <p></p>
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
        .goBackstage{
            position: absolute;
            font-size: 30px;
            top: 20px;
            left: 20px;
            .t{
                color: transparent;
            }
        }
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