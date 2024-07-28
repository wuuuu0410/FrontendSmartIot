<script>
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
//sweetalert2提示窗套件
import Swal from 'sweetalert2'
import Energy from '@/components/Energy.vue';
import CreateDeviceY from '@/components/CreateDeviceY.vue';
import CreateAndDeleteButtonNoUsing from '@/components/CreateAndDeleteButtonNoUsing.vue';
import Switch from '@/components/Switch.vue';
import SearchDevice from '@/components/SearchDevice.vue';

export default {
    data() {
        return {
            showCreateRoom: false, // 用於控制顯示 Create 或 Search 组件
            searchDeviceControl: true,
            createRoomDeviceControl: true,
            isChecked: false,  //處理switch子元件值得同步
            showCheckbox: false,
            select: []  //儲存被選中的id
        };
    },
    created() {

    },
    mounted() {

    },
    computed: {
        ...mapState(location, ['deviceArr', 'localRoomArea', 'oneRoom']),
        //用來隱藏超出指定長度的空間名稱內容
        truncatedContent() {
            return this.deviceArr.map(data => {
                return {
                    ...data,
                    truncatedContent: data.name.length > 9 ? data.name.slice(0, 9) + '...' : data.name
                };
            });
        }
    },
    components: {
        Energy,
        CreateAndDeleteButtonNoUsing,
        Switch,
        CreateDeviceY,
        SearchDevice
    },

    methods: {
        ...mapActions(location, ['searchDevice', 'deviceStatus', 'deleteDevice']),
        //以下兩個用於切換新增設備及搜尋設備2個元件的顯示
        toggleCreateDevice() {
            this.showCreateRoom = true;
        },
        toggleSearchDevice() {
            this.showCreateRoom = false;
        },
        updateDeviceStatus(index, status) {
            this.deviceArr[index].status = status;
            this.deviceStatus(this.deviceArr[index].id, this.deviceArr[index].type, this.deviceArr[index].name, this.deviceArr[index].status, this.deviceArr[index].roomId, true)
            console.log('設備開關狀態', this.deviceArr[index].status, index)
        },
        // 控制顯示刪除 checkbox 的狀態
        toggleCheckbox() {
            this.showCheckbox = !this.showCheckbox;
            if (!this.showCheckbox) {
                this.showDeleteConfirmation();
            }
        },
        // 彈出 SweetAlert2 的刪除確認彈窗
        showDeleteConfirmation() {
            if (this.select.length === 0) {
                Swal.fire({
                    title: '無選取任何公告',
                    text: '請選擇至少一個公告進行刪除',
                    icon: 'info',
                    customClass: {
                        popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                    },
                });
                return;
            }
            const selectedDevices = this.deviceArr.filter(device => this.select.includes(device.id));
            const selectedNames = selectedDevices.map(device => `${device.area}-${device.name}`).join('<br>');
            Swal.fire({
                title: '確認刪除',
                html: `<p>${selectedNames}<p>`, // 使用 html 属性
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '確認刪除',
                cancelButtonText: '取消',
                customClass: {
                    popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    // 在這裡處理確認刪除的邏輯
                    // this.deviceArr = this.deviceArr.filter(device => !this.select.includes(device.id));
                    this.deleteDevice(this.select, true)
                    this.select = [];
                    Swal.fire({
                        title: '已刪除',
                        text: '所選設備已被刪除',
                        icon: 'success',
                        customClass: {
                            popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                        },
                    });
                } else {
                    // 在這裡處理取消刪除的邏輯
                    this.select = [];
                    this.showCheckbox = false;
                }
            });
        },
        // 將被選中的設備 ID 加入或移除 select 陣列的方法(刪除設備用)
        addToSelect(id) {
            const index = this.select.indexOf(id);
            if (index === -1) {
                this.select.push(id);
            } else {
                this.select.splice(index, 1);
            }
            console.log(this.select)
        }
    }
};
</script>

<template>
    <div class="outarr">

        <div class="energy">
            <Energy />
        </div>
        <div class="headerArea">
            <div class="roomtitle">
                <h2>{{ this.oneRoom.area }}-{{ this.oneRoom.type }}</h2>
                <p>{{ this.oneRoom.name }}</p>
            </div>
            <CreateDeviceY :createRoomDeviceControl="createRoomDeviceControl" v-if="showCreateRoom">
                <template #roomid>
                    <p></p>
                </template>
            </CreateDeviceY>
            <SearchDevice :searchDeviceControl="searchDeviceControl" v-else>
                <template #roomid>
                    <p></p>
                </template>
            </SearchDevice>
            <div class="botton">
                <CreateAndDeleteButtonNoUsing @add-click="toggleCreateDevice" @search-click="toggleSearchDevice"
                    @delete-click="toggleCheckbox" v-model:showCheckbox="showCheckbox" v-model:showCreateRoom="showCreateRoom" />
            </div>
            <div class="out">
                <div class="room" v-for="(data, index) in truncatedContent" :key="index" @click="addToSelect(data.id)">
                    <div class="switch">
                        <Switch v-model:checked="data.status" @update:checked="updateDeviceStatus(index, $event)" />
                    </div>
                    <p class="id">{{ data.id }}</p>
                    <p>{{ data.type }}</p>
                    <i class="fa-regular fa-snowflake" v-if="data.type === '冷氣機'"></i>
                    <i class="fa-solid fa-leaf" v-if="data.type === '空氣清淨機'"></i>
                    <i class="fa-solid fa-droplet-slash" v-if="data.type === '除濕機'"></i>
                    <i class="fa-regular fa-lightbulb" v-if="data.type === '燈'"></i>
                    <div class="area">
                        <p>{{ data.name }}</p>
                    </div>
                    <div class="checkbox-overlay" v-if="showCheckbox">
                        <input type="checkbox" :checked="select.includes(data.id)" />
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.outarr {
    width: 1238px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: end;
    border-radius: 25px;
    
    // border: 1px solid black;

    .energy {
        width: 100%;
        height: 341px;
        background-color: $white;
        border-radius: 25px;
    }

    .headerArea {
        height: 120px;
        width: 100%;
        background: $white;
        margin-top: 25px;
        border-radius: 25px;
        position: relative;
        padding-top: 20px;

        .botton {
            position: absolute;
            right: 0;
            top: 62px;
        }

        .roomtitle {
            position: absolute;
            display: flex;
            align-items: center;
            top: 10px;
            left: 35px;
            color: $dark03;

            p {
                display: block;
                font-size: 20px;
                margin-left: 20px;
            }
        }

        .out {
            width: 100%;
            height: 439px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            overflow-y: auto;
            // border: 1px solid black;
            border-radius: 0 0 25px 25px;
            background-color: $dark02;

            &::-webkit-scrollbar {
                width: 10px;

            }

            &::-webkit-scrollbar-button {
                background: transparent;
                height: 10px;
            }

            &::-webkit-scrollbar-thumb {
                background: $dark03;
                border-radius: 15px;

            }

            &::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 15px;
            }

            .room {
                width: 282px;
                height: 150px;
                background: $white;
                border-radius: 25px;
                margin: 20px 0 0 0;
                position: relative;

                .switch {
                    position: absolute;
                    right: 18px;
                    top: 15px;
                }

                i {
                    font-size: 50px;
                    color: $dark01;
                    margin-left: 43%;
                    margin-top: -40px;
                }

                .id {
                    margin-top: 10px
                }

                p {
                    margin: 0px 20px 0 20px;
                    font-size: 16px;
                }

                .area {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 50px;
                    border-radius: 0 0 25px 25px;
                    background-color: $dark01;

                    p {
                        margin: 0;
                        font-size: 20px;
                        line-height: 50px;
                        display: flex;
                        justify-content: center;
                    }
                }

                .checkbox-overlay {
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: $white;
                    border-radius: 25px;

                    input[type='checkbox'] {
                        /* 自定義 checkbox 样式 */
                        appearance: none;
                        width: 30px;
                        height: 30px;
                        border: 2px solid $white;
                        border-radius: 3px;
                        background-color: transparent;
                        cursor: pointer;
                        position: relative;

                        &:checked {
                            background-color: $black;
                            /* 勾選後的背景色 */
                        }

                        &:checked::after {
                            content: '';
                            position: absolute;
                            top: 4px;
                            left: 9px;
                            width: 6px;
                            height: 12px;
                            border: solid $white;
                            border-width: 0 2px 2px 0;
                            transform: rotate(45deg);
                        }
                    }
                }
            }
        }
    }

}
</style>