<script>
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
//sweetalert2提示窗套件
import Swal from 'sweetalert2';
import moment from "moment"
import SearchError from '@/components/SearchError.vue';
export default {
    data() {
        return {
            roomErrorLogSearch:true
            // dataArr:[{id:203154,type:"冷氣",mane:"前方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203151,type:"電燈",mane:"右側電燈",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"南方麒麟股份有限公司"},{id:203157,type:"空氣清淨機",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02",area:602,roommane:"會議室"}]
        };
    },
    created() {
        
    },
    mounted() {
        
    },
    computed: {
        ...mapState(location, ['allLogs','oneRoom','localRoomArea']),
    },
    components: {
        SearchError
    },

    methods: {
        ...mapActions(location, ['searchHistory']),
        formatDate(date) {
            return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss');
        },
        toggleContent(index) {
            const announcement = this.allLogs[index];
            if (announcement.eventType === '設備開關') {
                Swal.fire({
                    title: this.allLogs[index].eventType,
                    html: `<p><strong>設備名稱：</strong>${announcement.detail.deviceName}</p>
                            <p><strong>設備類型：</strong>${announcement.detail.deviceType}</p>
                            <p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                            <p><strong>操作：</strong>${announcement.detail.status}</p>
                            <p><strong>時間：</strong>${moment(new Date(announcement.eventTime)).format("YYYY-MM-DD hh:mm:ss")}</p>`,
                    // text: announcement.content,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    // confirmButtonText: 'OK',
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
            }
            if (announcement.eventType === '設備參數調整') {
                if (announcement.detail.deviceType === '冷氣機') {
                    Swal.fire({
                        title: this.allLogs[index].eventType,
                        html: `<p><strong>設備名稱：</strong>${announcement.detail.deviceName}</p>
                                <p><strong>設備類型：</strong>${announcement.detail.deviceType}</p>
                                <p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                                <p><strong>模式:</strong>${announcement.detail.mode}</p>
                                <p><strong>風量:</strong>${announcement.detail.fan_speed}</p>
                                <p><strong>溫度:</strong>${announcement.detail.target_temp}</p>
                                <p><strong>開關狀態:</strong>${announcement.detail.status}</p>
                                <p><strong>時間：</strong>${moment(new Date(announcement.eventTime)).format("YYYY-MM-DD hh:mm:ss")}</p>`,
                        // text: announcement.content,
                        showCloseButton: true,
                        showConfirmButton: false,  //隱藏下方ok按鈕
                        // confirmButtonText: 'OK',
                        customClass: {
                            popup: 'swal2-custom-popup', // 可以自定義樣式
                        }
                    });
                }
                if (announcement.detail.deviceType === '燈') {
                    Swal.fire({
                        title: this.allLogs[index].eventType,
                        html: `<p><strong>設備名稱：</strong>${announcement.detail.deviceName}</p>
                                <p><strong>設備類型：</strong>${announcement.detail.deviceType}</p>
                                <p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                                <p><strong>亮度:</strong>${announcement.detail.brightness}</p>
                                <p><strong>色溫:</strong>${announcement.detail.color_temp}</p>
                                <p><strong>開關狀態:</strong>${announcement.detail.status}</p>
                                <p><strong>時間：</strong>${moment(new Date(announcement.eventTime)).format("YYYY-MM-DD hh:mm:ss")}</p>`,
                        // text: announcement.content,
                        showCloseButton: true,
                        showConfirmButton: false,  //隱藏下方ok按鈕
                        // confirmButtonText: 'OK',
                        customClass: {
                            popup: 'swal2-custom-popup', // 可以自定義樣式
                        }
                    });
                }
                if (announcement.detail.deviceType === '除濕機') {
                    Swal.fire({
                        title: this.allLogs[index].eventType,
                        html: `<p><strong>設備名稱：</strong>${announcement.detail.deviceName}</p>
                                <p><strong>設備類型：</strong>${announcement.detail.deviceType}</p>
                                <p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                                <p><strong>濕度:</strong>${announcement.detail.target_humidity}</p>
                                <p><strong>風量:</strong>${announcement.detail.fan_speed}</p>
                                <p><strong>開關狀態:</strong>${announcement.detail.status}</p>
                                <p><strong>時間：</strong>${moment(new Date(announcement.eventTime)).format("YYYY-MM-DD hh:mm:ss")}</p>`,
                        // text: announcement.content,
                        showCloseButton: true,
                        showConfirmButton: false,  //隱藏下方ok按鈕
                        // confirmButtonText: 'OK',
                        customClass: {
                            popup: 'swal2-custom-popup', // 可以自定義樣式
                        }
                    });
                }
                if (announcement.detail.deviceType === '空氣清淨機') {
                    Swal.fire({
                        title: this.allLogs[index].eventType,
                        html: `<p><strong>設備名稱：</strong>${announcement.detail.deviceName}</p>
                                <p><strong>設備類型：</strong>${announcement.detail.deviceType}</p>
                                <p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                                <p><strong>風量:</strong>${announcement.detail.fan_speed}</p>
                                <p><strong>開關狀態:</strong>${announcement.detail.status}</p>
                                <p><strong>時間：</strong>${moment(new Date(announcement.eventTime)).format("YYYY-MM-DD hh:mm:ss")}</p>`,
                        // text: announcement.content,
                        showCloseButton: true,
                        showConfirmButton: false,  //隱藏下方ok按鈕
                        // confirmButtonText: 'OK',
                        customClass: {
                            popup: 'swal2-custom-popup', // 可以自定義樣式
                        }
                    });
                }
            }
            if (announcement.eventType === '新增設備') {
                Swal.fire({
                    title: this.allLogs[index].eventType,
                    html: `<p><strong>設備名稱：</strong>${announcement.detail.deviceName}</p>
                            <p><strong>設備類型：</strong>${announcement.detail.deviceType}</p>
                            <p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                            <p><strong>時間：</strong>${moment(new Date(announcement.eventTime)).format("YYYY-MM-DD hh:mm:ss")}</p>`,
                    // text: announcement.content,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    // confirmButtonText: 'OK',
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
            }
            if (announcement.eventType === '刪除設備') {
                Swal.fire({
                    title: this.allLogs[index].eventType,
                    html: `<p><strong>設備名稱：</strong>${announcement.detail.deviceName}</p>
                            <p><strong>設備類型：</strong>${announcement.detail.deviceType}</p>
                            <p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                            <p><strong>時間：</strong>${moment(new Date(announcement.eventTime)).format("YYYY-MM-DD hh:mm:ss")}</p>`,
                    // text: announcement.content,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    // confirmButtonText: 'OK',
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
            }
            if (announcement.eventType === '新增房間') {
                Swal.fire({
                    title: this.allLogs[index].eventType,
                    html: `<p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                            <p><strong>類型：</strong>${announcement.detail.roomType}</p>
                            <p><strong>時間：</strong>${moment(new Date(announcement.eventTime)).format("YYYY-MM-DD hh:mm:ss")}</p>`,
                    // text: announcement.content,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    // confirmButtonText: 'OK',
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
            }
            if (announcement.eventType === '刪除房間') {
                Swal.fire({
                    title: this.allLogs[index].eventType,
                    html: ` <p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                            <p><strong>類型：</strong>${announcement.detail.roomType}</p>
                            <p><strong>時間：</strong>${moment(new Date(announcement.eventTime)).format("YYYY-MM-DD hh:mm:ss")}</p>`,
                    // text: announcement.content,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    // confirmButtonText: 'OK',
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
            }
        }
    }
};
</script>

<template>
    <div class="out">
        <div class="roomtitle">
                <h2>{{ this.oneRoom.area }}-{{ this.oneRoom.type  }}</h2><p>{{ this.oneRoom.name }}</p>
        </div>
        <SearchError :roomErrorLogSearch="roomErrorLogSearch">
            <template #roomid>
                <p></p>
            </template>    
        </SearchError>
        
        <div class="down">
            <div class="history" v-for="(data, index) in allLogs" @click="toggleContent(index)"
                :class="{ expanded: allLogs[index].expanded }">

                <div v-if="data.eventType === '設備開關'" class="box">

                    <h2>{{ data.detail.roomArea }}-{{ data.detail.roomName }}</h2>
                    <p class="id">編號:{{ data.id }}</p>
                    <p>{{ data.detail.deviceName }}</p>
                    <p>{{ data.detail.deviceType }}</p>
                    <p class="right">{{ data.eventType }}</p>
                </div>
                <div v-if="data.eventType === '設備參數調整'" class="box">

                    <h2>{{ data.detail.roomArea }}-{{ data.detail.roomName }}</h2>
                    <p class="id">編號:{{ data.id }}</p>
                    <p>{{ data.detail.deviceType }}</p>
                    <p>{{ data.detail.deviceName }}</p>
                    <p class="right">{{ data.eventType }}</p>
                </div>
                <div v-if="data.eventType === '新增房間'" class="box">

                    <h2>{{ data.detail.roomArea }}-{{ data.detail.roomName }}</h2>
                    <p class="id">編號:{{ data.id }}</p>
                    <p>{{ data.detail.roomType }}</p>
                    <p class="right">{{ data.eventType }}</p>
                </div>
                <div v-if="data.eventType === '刪除房間'" class="box">
                    <h2>{{ data.detail.roomArea }}-{{ data.detail.roomName }}</h2>
                    <p class="id">編號:{{ data.id }}</p>
                    <p>{{ data.detail.roomType }}</p>
                    <p class="right">{{ data.eventType }}</p>
                </div>
                <div v-if="data.eventType === '新增設備'" class="box">
                    <h2>{{ data.detail.roomArea }}-{{ data.detail.roomName }}</h2>
                    <p class="id">編號:{{ data.id }}</p>
                    <p>{{ data.detail.deviceType }}</p>
                    <p>{{ data.detail.deviceName }}</p>
                    <p class="right">{{ data.eventType }}</p>
                </div>
                <div v-if="data.eventType === '刪除設備'" class="box">
                    <h2>{{ data.detail.roomArea }}-{{ data.detail.roomName }}</h2>
                    <p class="id">編號:{{ data.id }}</p>
                    <p>{{ data.detail.deviceType }}</p>
                    <p>{{ data.detail.deviceName }}</p>
                    <p class="right">{{ data.eventType }}</p>
                </div>
                <p class="date">{{ formatDate(data.eventTime) }}</p>
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
    background-color: $white;
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
.down{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    // border: 1px solid black;
    border-radius: 0 0 25px 25px;
    background-color: $dark02;
    padding-top: 10px;
    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-button {
        background: transparent;
        height: 30px;
    }

    &::-webkit-scrollbar-thumb {
        background: $dark03;
        border-radius: 15px;

    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 15px;
    }
    .history {
        width: 1170px;
        height: 57px;
        margin: 20px auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: $white;
        border-radius: 35px;
        
        .box{
            // width: 305px;
            height: 30px;
            display: flex;
            padding-left: 10px;
            cursor: pointer;
            h2{
                display: block;
                font-size: 18px;
                line-height: 30px;
                margin-left: 23px;
                margin-right: 25px;
                color: $dark03;
                    
            }
            p{
                // font-size: 1px;
                line-height: 30px;
                margin-right: 18px;
                color: $dark03;
            }
            .right{
                display: block;
                margin-left: 8px;
                padding-left: 28px;
                // width: 500px;
                color: $black;
                border-left: 1px solid $dark03;
            }
        }
        .date{
            display: block;
            margin-right: 30px;
            color: $dark03;
        }
    }
}
</style>