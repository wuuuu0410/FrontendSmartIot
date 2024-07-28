<script>
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
//sweetalert2提示窗套件
import Swal from 'sweetalert2';
export default {
    data() {
        return {
                name: "",
                area: "",
                type: ""
            
        };
    },
    created() {

    },
    mounted() {

    },
    computed: {

    },
    components: {

    },

    methods: {
        ...mapActions(location, ['createRoom']),
        verify(){
            if(this.name == "" || this.area == "" || this.type == "" ){
                Swal.fire({
                    title: "新增失敗",
                    html: `<p>請輸入空間編號、空間類型、空間名稱</p>`,
                    // text: announcement.content,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    // confirmButtonText: 'OK',
                    icon:"error",
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
                return
            }
            this.createRoom(null,this.name,this.area,this.type,false)
            Swal.fire({
                title: "新增成功",
                // text: "That thing is still around?",
                icon: "success"
            });
        }
    }
};
</script>

<template>
    <div class="createRoom">
        <label for=""><input type="text" v-model="this.area" placeholder="空間編號"></label>
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
        <label for=""><input type="text" v-model="this.name" placeholder="空間名稱"></label>
        <button @click="verify">新增</button>
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
        width: 126px;
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