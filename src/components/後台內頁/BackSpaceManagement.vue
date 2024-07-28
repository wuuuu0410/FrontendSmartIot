<script>
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
//sweetalert2提示窗套件
import Swal from 'sweetalert2'
import CreateAndDeleteButton from '@/components/CreateAndDeleteButton.vue';
import Switch from '@/components/Switch.vue';
import Energy from '@/components/Energy.vue';
import CreateRoom from '@/components/CreateRoom.vue';
import SearchRoom from '@/components/SearchRoom.vue';
export default {
    data() {
        return {
            showCreateRoom: false, // 用於控制顯示 CreateRoom 或 SearchRoom 组件
            isChecked: false,  //處理switch子元件值得同步
            showCheckbox: false, // 控制顯示 checkbox 的狀態
            select: []  //儲存被選中的id
        };
    },
    created() {

    },
    mounted() {

    },
    computed: {
        ...mapState(location, ['roomArr']),
        //用來隱藏超出指定長度的空間名稱內容
        truncatedContent() {
            return this.roomArr.map(data => {
                return {
                    ...data,
                    truncatedContent: data.name.length > 9 ? data.name.slice(0, 9) + '...' : data.name
                };
            });
        }
    },
    components: {
        CreateAndDeleteButton,
        Switch,
        Energy,
        CreateRoom,
        SearchRoom
    },

    methods: {
        ...mapActions(location, ['searchRoom', 'createRoom', 'deleteRooms']),
        //以下兩個用於切換新增房間及搜尋房間2個元件的顯示
        toggleCreateRoom() {
            this.showCreateRoom = true;
        },
        toggleSearchRoom() {
            this.showCreateRoom = false;
        },
        updateDeviceStatus(index, status) {
            this.roomArr[index].status = status;
            this.createRoom(this.roomArr[index].id, this.roomArr[index].name, this.roomArr[index].area, this.roomArr[index].type, this.roomArr[index].status)
            console.log('房間開關狀態', this.roomArr[index].status, index)
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
                    title: '無選取任何空間',
                    text: '請選擇至少一個空間進行刪除',
                    icon: 'info',
                    customClass: {
                        popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                    },
                });
                return;
            }
            const selectedDevices = this.roomArr.filter(device => this.select.includes(device.id));
            const selectedNames = selectedDevices.map(device => `${device.area}-${device.name}`).join('<br>');
            Swal.fire({
                title: '確認刪除以下區域?',
                html: `<p>${selectedNames}<p>`, // 使用 html 屬性
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
                    this.deleteRooms(this.select)
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
        <div class="energy-container">
            <Energy />
        </div>
        <!-- 根據 showCreateRoom 的值決定顯示 CreateRoom 或 SearchRoom 组件 -->
        <CreateRoom v-if="showCreateRoom" v-model:showCreateRoom="showCreateRoom"/>
        <SearchRoom v-else />
        <!-- 監聽 CreateAndDeleteButton 组件的 add-click 事件 -->
        <CreateAndDeleteButton @add-click="toggleCreateRoom" @search-click="toggleSearchRoom"
            @delete-click="toggleCheckbox" v-model:showCheckbox="showCheckbox" v-model:showCreateRoom="showCreateRoom"/>
        <div class="rooms">
            <div class="room" v-for="(data, index) in truncatedContent" :key="index" @click="addToSelect(data.id)">
                <div class="switch">
                    <Switch v-model:checked="data.status" @update:checked="updateDeviceStatus(index, $event)"/>
                </div>
                <p>{{ data.area }}-{{ data.type }}</p>
                <div class="area">
                    <RouterLink class="routerItem" @click="searchRoom(data.id)" to="/RoomConsole"><span>{{
                        data.truncatedContent }}</span></RouterLink>
                </div>
                <div class="checkbox-overlay" v-if="showCheckbox">
                    <input type="checkbox" :checked="select.includes(data.id)" />
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
    align-items: stretch;
    border-radius: 25px;
    background-color: $dark02;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);

    .energy-container {
        width: 100%;
        height: 316px;
        margin-bottom: 20px;
    }

    .rooms {
        flex: 1;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        overflow-y: auto;
        background-color: $dark02;
        border-radius: 20px;

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

        p {
            margin: 50px 20px 0 30px;
            font-size: 16px;
        }

        .area {
            margin: 0 20px 0 30px;
            font-size: 20px;
            font-weight: 600;
            color: $black1;
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

            // .area {
            //     margin: 0 20px 0 30px;
            //     font-size: 20px;
            //     font-weight: 600;
            //     color: $black1;
            //     span{
            //         color: $black;
            //     }
            // }
        }
    }
}
</style>