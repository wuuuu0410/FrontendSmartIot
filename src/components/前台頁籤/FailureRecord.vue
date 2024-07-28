<!-- 前台-故障紀錄-頁面 -->
<script>
//sweetalert2提示窗套件
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
import Swal from 'sweetalert2';
import FaultSearch from '@/components/FaultSearch.vue';
import moment from "moment"
export default {
    data() {
        return {
            // dataArr:[{id:203154,type:"冷氣",mane:"前方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203151,type:"電燈",mane:"右側電燈",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"空氣清淨機",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"},{id:203157,type:"冷氣",mane:"後方的冷氣",question:"網路連線中斷",date:"2024-06-02"}]
            
        };
    },
    created() {
        this.searchFrontHistory(null, null, null, null, 600)
    },
    components: {
        FaultSearch,

    },
    computed: {
        ...mapState(location, ['frontLogs']),
    },
    methods: {
        ...mapActions(location, ['searchFrontHistory']),
        // searchFrontHistory(i, j, k, l, m) {
        //     const params = new URLSearchParams();
        //     if (i) {
        //         params.append('deviceName', i);
        //     }

        //     if (j) {
        //         params.append('deviceType', j);
        //     }

        //     if (k) {
        //         params.append('startDate', k);
        //     }

        //     if (l) {
        //         params.append('endDate', l);
        //     }

        //     if (m) {
        //         params.append('roomArea', m);
        //     }
        //     fetch(`http://localhost:8080/history/search?${params.toString()}`, {
        //         method: "get",
        //         body: JSON.stringify()
        //     })
        //         .then(res => res.json())
        //         .then(data => {
        //             console.log('erLog', data)
        //             for (let i = 0; i < data.length; i++) {
        //                 if (data[i].eventType == "錯誤") {
        //                     this.frontLogs.push(data[i])
        //                 }
        //             }
        //             console.log('allLog', this.frontLogs)
        //         })
        // },
        formatDate(date) {
            return moment(new Date(date)).format('YYYY-MM-DD');
        },
        toggleContent(index) {
            const announcement = this.frontLogs[index];
            if (announcement.eventType === '錯誤') {
                Swal.fire({
                    title: this.frontLogs[index].eventType,
                    html: `<p><strong>設備名稱：</strong>${announcement.detail.deviceName}</p>
                            <p><strong>設備類型：</strong>${announcement.detail.deviceType}</p>
                            <p><strong>所在位置：</strong>${announcement.detail.roomArea}-${announcement.detail.roomName}</p>
                            <p><strong>錯誤訊息：</strong>${announcement.detail.message}</p>
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

    <div class="down">
        <div class="search">
            <FaultSearch />
        </div>
        <div class="oo">
            <div class="outArea" v-for="(data, index) in frontLogs" @click="toggleContent(index)"
                :class="{ expanded: frontLogs[index].expanded }">
                <div v-if="data.eventType === '錯誤'" class="box">
                    <h2>{{ data.detail.deviceName }}</h2>
                    <p class="id">編號:{{ data.id }}</p>
                    <p>{{ data.detail.deviceType }}</p>
                    <p>{{ data.detail.message }}</p>
                    <p class="right">{{ data.eventType }}</p>
                </div>
                <p class="date">{{ formatDate(data.eventTime) }}</p>
            </div>

        </div>
    </div>


</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.down {
    width: 900px;
    height: 650px;
    padding: 41px 0px 16px 50px;

    .oo {
        padding-left: 50px;
        width: 830px;
        height: 600px;
        // border: 1px solid black;
        overflow-y: auto;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 10px;
        }

        &::-webkit-scrollbar-button {
            background: transparent;
            height: 12px;
        }

        &::-webkit-scrollbar-thumb {
            background: $dark03;
            border-radius: 15px;

        }

        &::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 15px;
        }

        .outArea {
            width: 750px;
            height: 57px;
            margin: 20px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: $white;
            border-radius: 35px;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);

            .box {
                // width: 305px;
                height: 30px;
                display: flex;
                padding-left: 10px;
                cursor: pointer;

                h2 {
                    display: block;
                    font-size: 18px;
                    line-height: 30px;
                    margin-left: 23px;
                    margin-right: 25px;
                    color: $dark03;

                }

                p {
                    // font-size: 1px;
                    line-height: 30px;
                    margin-right: 18px;
                    color: $dark03;
                }

                .right {
                    display: block;
                    margin-left: 8px;
                    padding-left: 28px;
                    // width: 500px;
                    color: $black;
                    border-left: 1px solid $dark03;
                }
            }

            .date {
                display: block;
                margin-right: 30px;
                color: $dark03;
            }
        }
    }
}
</style>