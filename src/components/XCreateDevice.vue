<script>

export default {
    data() {
        return {

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

    }
};
</script>

<template>
    <div class="createDevice">
        <p>id-123123</p>
        <select name="" id="">
            <option value="">設備類型</option>
            <option value="">冷氣</option>
            <option value="">燈</option>
            <option value="">除濕機</option>
            <option value="">空氣清淨機</option>
        </select>
        <label for=""><input type="text" placeholder="設備名稱"></label>
        <button>新增</button>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.createDevice {
    width: 947px;
    height: 87px;
    background: $dark02;
    border-radius: 35px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    p {
        font-size: 20px;
        font-weight: 400;
        margin: 0 30px;
        color: $white;
    }
    select{
        width: 126px;
        height: 40px;
        font-size: 16px;
        font-weight: 500;
        border: none;
        border-radius: 35px;
        background: $dark03;
        outline: none;
        margin: 0 20px;
        color: $white;
    }
    input{
        width: 180px;
        height: 40px;
        border-radius: 35px;
        border: none;
        outline: none;
        background: $dark03;
        font-size: 16px;
        font-weight: 500;
        color: $white;
        margin-right: 339px;
    }
    button{
        width: 88px;
        height: 40px;
        border-radius: 35px;
        border: none;
        background: $dark03;
        color: $white;
        font-size: 16px;
        font-weight: 500;
    }
}
</style>