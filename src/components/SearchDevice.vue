<script>
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
export default {
    data() {
        return {
            name: "",
            area: "",
            type: "",
            status: null

        };
    },
    created() {

    },
    mounted() {

    },
    computed: {
        ...mapState(location, ['localRoomArea','allArea']),
    },
    components: {

    },

    methods: {
        ...mapActions(location, ['searchDevice']),
    },
    props: [
        "searchDeviceControl"
    ]
};
</script>

<template>
    <div class="createRoom">
        <label for=""><input type="text" v-model="this.name" placeholder="設備名稱"></label>
        <select name="" id="" v-model="this.status">
            <option value="">設備使用狀態</option>
            <option :value=1>使用中</option>
            <option :value=0>閒置中</option>
        </select>

        <slot name="roomid">
            <select name="" id="" v-model="this.area">
                <option value="">空間編號</option>
                <option v-for="(item,index) in allArea" :value=item.area>{{ item.area }}</option>
            </select>
        </slot>

        <select name="" id="" v-model="this.type">
            <option value="">設備類型</option>
            <option value="冷氣機">冷氣</option>
            <option value="燈">電燈</option>
            <option value="空氣清淨機">空氣清淨機</option>
            <option value="除濕機">除濕機</option>
        </select>
        <button v-if="searchDeviceControl" @click="this.searchDevice(this.name, this.type, null, this.status, true)">搜尋</button>
        <button v-else @click="this.searchDevice(this.name, this.type, this.area, this.status, false)">搜尋</button>
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

    select {
        width: 155px;
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