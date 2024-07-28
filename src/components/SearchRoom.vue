<script>
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
export default {
    data() {
        return {
            name:"",
            type:"",
            area:"",
            status:null
        };
    },
    created() {
        this.searchAllRoom();
    },
    mounted() {

    },
    computed: {
        ...mapState(location, ['allArea']),
    },
    components: {

    },

    methods: {
        ...mapActions(location, ['searchAllRoom','searchOnlyRoom']),
    }
};
</script>

<template>
    <div class="createRoom">
        <label for=""><input type="text"  placeholder="空間名稱" v-model="this.name"></label>
        <select name="" id="" v-model="this.status">
            <option value="">空間使用狀態</option>
            <option :value=1>使用中</option>
            <option :value=0>閒置中</option>
        </select>
        <select name="" id="" v-model="this.area" >
            <option value="">房間編號</option>
            <option v-for="(item,index) in allArea" :value=item.area>{{ item.area }}</option>
            
        </select>
        <select name="" id="" v-model="this.type" >
            <option value="">空間類型</option>
            <option value="公司">公司</option>
            <option value="會議室">會議室</option>
            <option value="公共區域">公共區域</option>
            <option value="機房">機房</option>
            <option value="廁所">廁所</option>
            <option value="教室">教室</option>
            <option value="其他">其他</option>
        </select>
        <button @click="this.searchOnlyRoom(this.name,this.type,this.area,this.status)">搜尋</button>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.createRoom {
    width: 100%;
    height: 100px;
    background: $white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 1px;
    
    select{
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
    input{
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
        line-height: 40px;
    }
    ::placeholder {
        color: $black1;
    }
    button{
        width: 88px;
        height: 40px;
        border-radius: 35px;
        border: none;
        cursor: pointer;
        background: $dark02;
        color: $black1;
        font-size: 16px;
        margin-left: 30px;
        line-height: 40px;
    }
}
</style>