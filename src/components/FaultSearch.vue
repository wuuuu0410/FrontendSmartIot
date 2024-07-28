<!-- 前台-故障設備搜尋-元件 -->
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
            date: [],
            startDate: null,  //儲存日期區間
            endDate: null
        };
    },
    components: {
        VueDatePicker,  //日曆用
    },
    methods: {
        ...mapActions(location, ['searchFrontHistory']),
        dateRange() {
            console.log('日期Range', this.date)
            if (this.date == null) {
                return this.startDate = null, this.endDate = null

            }
            this.startDate = moment(new Date(this.date[0])).format('YYYY-MM-DD')
            this.endDate = moment(new Date(this.date[1])).format('YYYY-MM-DD')
            if (this.startDate == "Invalid date" || this.endDate == "Invalid date") {
                this.startDate = null
                this.endDate = null
            }
            console.log('日期', this.startDate, this.endDate)
        },
        searchFuntion() {
            this.dateRange()
            this.searchFrontHistory(this.deviceName, this.deviceType, this.startDate, this.endDate, 600)
        },
    }

};
</script>

<template>
    <div class="search_big_area">
        <div class="left">
            <div class="name">
                <input type="text" v-model="this.deviceName" placeholder="設備名稱">
            </div>
            <div class="state">
                <select name="" id="" v-model="this.deviceType">
                    <option value="">所有類別</option>
                    <option value="冷氣機">冷氣</option>
                    <option value="燈">電燈</option>
                    <option value="空氣清淨機">空氣清淨機</option>
                    <option value="除濕機">除濕機</option>
                </select>
            </div>
            <div class="start_date">
                <VueDatePicker v-model="date" range format="yyyy-MM-dd" style="width: 260px" />
                <!-- <input type="date"  class="date"> -->
                <!-- <i class="fa-regular fa-calendar"></i> -->
            </div>
            <button @click="this.searchFuntion()" class="seach_list">搜尋</button>

        </div>

    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

    .search_big_area{
        width: 800px;
        height: 100%;
        display: flex;
        align-items: center;
        padding-bottom: 15px;
        padding-left: 82px;
        .left{
            display: flex;
            .name{
                input{
                    width: 110px;
                    height: 40px;
                    border-radius: 35px;
                    padding: 0;
                    padding-left: 20px;
                    padding-right: 10px;
                    color: $dark03;
                    background-color: $white;
                    border: 0;
                    outline:none;
                    font-size: 16px;
                    line-height: 40px;
                    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
                }
                ::placeholder {
                    color: $dark03;
                    
                }
            }
            .state{
                margin-left: 20px;
                i{
                    font-style: normal;
                    margin-left: 10px;
                    font-size: 16px;
                    color: $dark03;
                    
                }
                select{
                    width: 100px;
                    height: 40px;
                    border-radius: 35px;
                    padding-left: 10px;
                    color: $dark03;
                    font-size: 16px;
                    background-color: $white;
                    border: 0;
                    outline:none;
                    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
                }
            }
            .start_date{
                margin-left: 20px;
                width: 260px;
                height: 40px;
                border-radius: 35px;
                display: flex;
                justify-content: center;
                align-items: center;  
                background-color: $white;
                box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
                // i {
                //     position: absolute;
                //     right: 10px;
                //     top: 50%;
                //     transform: translateY(-50%);
                //     width: 20px;
                //     height: 20px;
                //     color: $white;
                //     background: transparent; 
                //     pointer-events: none;
                // }
                //原版input樣式
                // .date{
                //     width: 300px;
                //     height: 35px;
                //     border-radius: 30px;
                //     padding-left: 9px;
                //     padding-right: 10px;
                //     color: $white;
                //     background-color: $dark02;
                //     border: 0;
                //     outline:none; 
                // }
                // ::-webkit-calendar-picker-indicator {
                //     opacity: 0; /* 圖示設為透明 */
                // }
            
            }
            .seach_list{
                width: 75px;
                height: 40px;
                border-radius: 35px;
                padding: 0;
                padding-left: 10px;
                padding-right: 10px;
                color: $dark03;
                background-color: $white;
                border: 0;
                outline: none;
                font-size: 16px;
                line-height: 40px;
                box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
            }

            ::placeholder {
                color: $dark03;

            }
        }

        .state {
            margin-left: 20px;

            i {
                font-style: normal;
                margin-left: 10px;
                font-size: 16px;
                color: $dark03;

            }

            select {
                width: 100px;
                height: 40px;
                border-radius: 35px;
                padding-left: 10px;
                color: $dark03;
                font-size: 16px;
                background-color: $white;
                border: 0;
                outline: none;

            }
        }

        .start_date {
            margin-left: 20px;
            width: 260px;
            height: 40px;
            border-radius: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: $white;

            .left {
                display: flex;

                .name {
                    input {
                        width: 110px;
                        height: 40px;
                        border-radius: 35px;
                        padding: 0;
                        padding-left: 20px;
                        padding-right: 10px;
                        color: $white;
                        background-color: $white;
                        border: 0;
                        outline: none;
                        font-size: 16px;
                        line-height: 40px;
                    }

                    ::placeholder {
                        color: $dark03;

                    }
                }

                .state {
                    margin-left: 20px;

                    i {
                        font-style: normal;
                        margin-left: 10px;
                        font-size: 16px;
                        color: $dark03;

                    }

                    select {
                        width: 100px;
                        height: 40px;
                        border-radius: 35px;
                        padding-left: 10px;
                        color: $dark03;
                        font-size: 16px;
                        background-color: $white;
                        border: 0;
                        outline: none;

                    }
                }

                .start_date {
                    margin-left: 20px;
                    width: 260px;
                    height: 40px;
                    border-radius: 35px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: $white;

                    // i {
                    //     position: absolute;
                    //     right: 10px;
                    //     top: 50%;
                    //     transform: translateY(-50%);
                    //     width: 20px;
                    //     height: 20px;
                    //     color: $white;
                    //     background: transparent; 
                    //     pointer-events: none;
                    // }
                    //原版input樣式
                    // .date{
                    //     width: 300px;
                    //     height: 35px;
                    //     border-radius: 30px;
                    //     padding-left: 9px;
                    //     padding-right: 10px;
                    //     color: $white;
                    //     background-color: $dark02;
                    //     border: 0;
                    //     outline:none; 
                    // }
                    // ::-webkit-calendar-picker-indicator {
                    //     opacity: 0; /* 圖示設為透明 */
                    // }

                }

                .seach_list {
                    width: 60px;
                    height: 40px;
                    border-radius: 35px;
                    border-width: 0;
                    margin-left: 20px;
                    font-size: 16px;
                    padding: 0;
                    cursor: pointer;
                    background-color: $white;
                    color: $dark03;
                    line-height: 40px;
                }

            }
        }
    }

</style>