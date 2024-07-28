<script>
export default {
    data() {
        return {
            isActive: "",
        };
    },
    created() {

    },
    mounted() {
        //進入頁面時會直接顯示第一個內頁，也就算是主頁
        this.openTab(this.tabsName[0]);

    },
    computed: {

    },
    components: {

    },
    props: [
        //這邊接收父也就是vue頁面傳來想生成的陣列
        "tabsPresent" ,
        "tabsName"
    ],

    methods: {
        //哪個內頁被點擊時執行方法 isActive紀錄哪個內頁被點擊會變不同顏色
        openTab(tabName) {
            console.log(tabName)
            var i, tabcontent;
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            
            console.log(document.getElementById(tabName))
            document.getElementById(tabName).style.display = "block";
            this.isActive = tabName;
        },
    }
};
</script>

<template>
    <div class="tabArea">
        <!-- 父vue頁面傳來需要幾個內頁，v-for的是頁籤名稱 -->
        <div class="tabs">
            <button v-for="(item, index) in this.tabsPresent" class="tablink"
                :class="{ 'active': isActive === tabsName[index] }"
                @click="openTab(this.tabsName[index])">{{ item }}
            </button>
        </div>
        <!-- 同樣父vue頁面傳來需要幾個內頁 v-for插槽出來-->
        <div v-for="(item, index) in this.tabsName" :id="item" class="tabcontent">
            <slot :name="item"></slot>
        </div>
        <slot name="re" >
            <RouterLink to="/BackStage" >
                <button class="re">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
            </RouterLink>
        </slot>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';
.tabArea {
    height: 100%;
    display: flex;
    position: relative;
    .tabs {
        height: 100%;
        width: 233px;
        background-color: $white;
        border-radius: 25px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    }
    .tablink {
        width: 152px;
        height: 70px;
        font-size: 23px;
        background-color: transparent;
        color: $dark03;
        border: none;
        outline: none;
        cursor: pointer;
        border-radius: 45px;
        font-weight: 500;
    
        &.active {
            background-color: $black;
            color: $white;
        }
    }
    /* 頁籤內容 */
    .tabcontent {
        display: none;
        padding-left: 28px;
       
    }
    .re{
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        font-size: 18px;
        top: 5px;
        left: 5px;
        background-color:$dark01 ;
        cursor: pointer;
    }
}

/* 顯示選中的頁籤內容 */
.show {
    display: block;
}
</style>