<script>
// vue3-datepicker製作日曆用
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import moment from "moment"

export default {
    data() {
        return {
            deviceName: "",
            deviceType: "",
            roomArea: "",
            date: [],
            startDate: null,  //儲存日期區間
            endDate: null

        };
    },
    created() {

    },
    mounted() {

    },
    computed: {
        ...mapState(location, ['allArea', 'oneRoom']),
    },
    components: {
        VueDatePicker,   //日曆用
    },

    methods: {
        ...mapActions(location, ['searchHistory']),
        dateRange() {
            console.log('日期Range', this.date)
            if(this.date == null){
                return this.startDate = null,this.endDate = null
                
            }
            this.startDate = moment(new Date(this.date[0])).format('YYYY-MM-DD')
            this.endDate = moment(new Date(this.date[1])).format('YYYY-MM-DD')
            if(this.startDate=="Invalid date" || this.endDate=="Invalid date"){
                this.startDate = null
                this.endDate = null
            }
            console.log('日期', this.startDate, this.endDate)

        },
        searchFuntionA() {
            this.dateRange()
            this.searchHistory(this.deviceName, this.deviceType, this.startDate, this.endDate, this.oneRoom.area)
        },
        searchFuntionB() {
            this.dateRange()
            this.searchHistory(this.deviceName, this.deviceType, this.startDate, this.endDate, this.roomArea)
        }
    },
    props: [
        "roomErrorLogSearch"
    ],
    watch: {

    }
};
</script>

<template>
    <div class="createRoom">

        <div class="date">

            <VueDatePicker v-model="date" range format="yyyy-MM-dd" style="width: 260px" />
        </div>
        <label for=""><input type="text" v-model="this.deviceName" placeholder="設備名稱"></label>
        <slot name="roomid">
            <select name="" id="" v-model="this.roomArea">
                <option value="">空間編號</option>
                <option v-for="(item, index) in allArea" :value=item.area>{{ item.area }}</option>
            </select>
        </slot>
        <select name="" id="" v-model="this.deviceType">
            <option value="">設備類型</option>
            <option value="冷氣機">冷氣</option>
            <option value="燈">電燈</option>
            <option value="空氣清淨機">空氣清淨機</option>
            <option value="除濕機">除濕機</option>
        </select>
        <button v-if="roomErrorLogSearch" @click="searchFuntionA">搜尋</button>
        <button v-else @click="searchFuntionB">搜尋</button>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.createRoom {
    width: 100%;
    height: 123px;
    background: $white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 25px 25px 0 0;
    

    .date {
        margin-left: 30px;
        width: 262px;
        height: 40px;
        border-radius: 35px;
        background: $dark02;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    select {
        width: 155px;
        height: 40px;
        font-size: 16px;
        border: none;
        border-radius: 35px;
        background: $dark02;
        outline: none;
        padding-left: 13px;
        margin-left: 30px;
        color: $black1;
    }

    input {
        width: 180px;
        height: 40px;
        border-radius: 35px;
        border: none;
        outline: none;
        background: $dark02;
        font-size: 16px;
        padding-left: 13px;
        color: $black1;
        margin-left: 30px;
    }

    ::placeholder {
        color: $black1;
    }

    button {
        width: 88px;
        height: 40px;
        border-radius: 35px;
        border: none;
        cursor: pointer;
        background: $dark02;
        color: $black1;
        font-size: 16px;
        margin-left: 30px;
    }
}
</style>