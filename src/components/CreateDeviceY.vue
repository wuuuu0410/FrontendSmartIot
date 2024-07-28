<script>
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
//sweetalert2提示窗套件
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            name: "",
            type: "",
            area: "",


        };
    },
    created() {

    },
    mounted() {

    },
    computed: {
        ...mapState(location, ['localRoomId', 'createRoomDevice', 'allArea']),
    },
    components: {

    },

    methods: {
        ...mapActions(location, ['deviceStatus', 'createRoomDeviceSearch']),
        verify() {
            if (this.name == "" || this.type == "") {
                Swal.fire({
                    title: "新增失敗",
                    html: `<p>請輸入設備類型、設備名稱</p>`,
                    // text: announcement.content,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    // confirmButtonText: 'OK',
                    icon: "error",
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
                return
            }
            this.deviceStatus(null, this.type, this.name, 0, this.localRoomId, true)
            Swal.fire({
                title: "新增成功",
                // text: "That thing is still around?",
                icon: "success"
            });
        },
        verifyX() {
            if (this.name == "" || this.type == "") {
                Swal.fire({
                    title: "新增失敗",
                    html: `<p>請輸入設備類型、設備名稱</p>`,
                    // text: announcement.content,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    // confirmButtonText: 'OK',
                    icon: "error",
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
                return
            }
            this.deviceStatus(null, this.type, this.name, 0, this.createRoomDevice[0].id, false)
            Swal.fire({
                title: "新增成功",
                // text: "That thing is still around?",
                icon: "success"
            });
        },

    },
    props: {
        createRoomDeviceControl: {
            type: Boolean,
            required: true
        }
    }
};
</script>

<template>
    <div class="createRoom">
        <label for=""><input type="text" v-model="this.name" placeholder="設備名稱"></label>
        <select name="" id="" v-model="this.type">
            <option value="">設備類型</option>
            <option value="冷氣機">冷氣</option>
            <option value="燈">電燈</option>
            <option value="空氣清淨機">空氣清淨機</option>
            <option value="除濕機">除濕機</option>
        </select>
        <slot name="roomid">
            <select name="" id="" v-model="this.area" @change="createRoomDeviceSearch(null, null, this.area, null)">
                <option value="">空間編號</option>
                <option v-for="(item, index) in allArea" :value=item.area>{{ item.area }}</option>

            </select>
        </slot>
        <button v-if="this.createRoomDeviceControl" @click="verify">新增</button>
        <button v-else @click="verifyX">新增</button>
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

    // border: 1px solid black;
    select {
        width: 126px;
        height: 40px;
        font-size: 16px;
        border: none;
        border-radius: 35px;
        background: $dark01;
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
        background: $dark01;
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
        background: $dark01;
        color: $black1;
        font-size: 16px;
        margin-left: 30px;
    }
}
</style>