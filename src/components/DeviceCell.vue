<!-- 前台-首頁-下方設備顯示欄-元件 -->
<script>
import Switch from '@/components/Switch.vue';

export default {
    data() {
        return {
            dataArr: [
                { type: "冷氣機", component: "ACcontrol" },
                { type: "燈", component: "lampControl" },
                { type: "除濕機", component: "DehumidifierControl" },
                { type: "空氣清淨機", component: "AirPurifierControl" }
            ],
            selectedIndex: null, // 新增：儲存選擇的索引
        };
    },
    components: {
        Switch,
    },
    methods: {
        selectDevice(component,index) {
            this.$emit('select-device', component);
            this.selectedIndex = index;
        }
    }
};
</script>

<template>
    <div class="oo">
        <div class="outArea" v-for="(data, index) in dataArr" :key="index" 
        @click="selectDevice(data.component, index)" :class="{ selected: selectedIndex === index }">
            <i class="fa-regular fa-snowflake" v-if="data.type === '冷氣機'" :class="{ hidden: data.showControl }"></i>
            <i class="fa-solid fa-leaf" v-if="data.type === '空氣清淨機'" :class="{ hidden: data.showControl }"></i>
            <i class="fa-solid fa-droplet-slash" v-if="data.type === '除濕機'" :class="{ hidden: data.showControl }"></i>
            <i class="fa-regular fa-lightbulb" v-if="data.type === '燈'" :class="{ hidden: data.showControl }"></i>
            <br>
            <span>{{ data.type }}</span>
            <p>總控台</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.oo {
    display: flex;
    flex-direction: row;

    .outArea {
        width: 228px;
        height: 210px;
        border-radius: 25px;
        margin-bottom: 15px;
        background-color: $dark01;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
        flex: 0 0 auto;
        /* 确保每个项目不会缩小并且保持其内容的宽度 */
        margin-right: 15px;
        /* 可选的间距 */
        text-align: center;
        cursor: pointer;
        i {
            font-size: 80px;
            color: $dark03;
            margin: auto;
            margin-top: 36px;
            margin-bottom: 9px;
        }
        
        span {
            margin: auto;
            font-size: 20px;
            color: $dark03;
        }
        
        p {
            color: $black;
        }
    }
    .selected {
        background-color: $black;
        i{
            color: $dark01;
        }
        p {
            color: $black1;
        }
        span{
            color: $dark01;
        }
    }

}
</style>