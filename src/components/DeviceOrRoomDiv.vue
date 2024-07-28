<script>
import Switch from '@/components/Switch.vue';
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
        //用來隱藏超出指定長度的空間名稱內容
        truncatedContent() {
            return this.dataArr.map(data => {
                return {
                    ...data,
                    truncatedContent: data.name.length > 9 ? data.name.slice(0, 9) + '...' : data.name
                };
            });
        }
    },
    components: {
        Switch
    },

    methods: {

    },
    props:[
        "dataArr"
    ]
};
</script>

<template>
    <div class="out">
        <div class="room" v-for="(data, index) in truncatedContent" :key="index">
            <div class="switch">
                <Switch :id="data.id" />
            </div>
            <p class="id">{{ data.id }}</p>
            <p>{{ data.type }}</p>
            <i class="fa-regular fa-snowflake"></i>
            <div class="area">
                <p>{{ data.area }}-{{ data.truncatedContent }}</p>
            </div>
        </div>

    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';
.out{
    width: 100%;
    height: 713px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    overflow-y: auto;
    border: 1px solid black;
    border-radius: 0 0 25px 25px;
    &::-webkit-scrollbar {
        width: 10px;
    
    }
    
    &::-webkit-scrollbar-button {
        background: transparent;
        height: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: $black1;
        border-radius: 15px;
    
    }
    
    &::-webkit-scrollbar-track {
        background:transparent;
        border-radius: 15px;
    }
    .room {
        width: 282px;
        height: 150px;
        background: $dark03;
        border-radius: 25px;
        margin: 20px 0 0 0 ;
        position: relative;
        
        .switch {
            position: absolute;
            right: 18px;
            top: 15px;
        }
        i{
            font-size: 50px;
            color: $dark01;
            margin-left: 43%;
            margin-top: -40px;
        }
        .id{
            margin-top: 10px
        }
        p{
            margin: 0px 20px 0 30px;
            font-size: 16px;
        }
        
        .area{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 50px;
            border-radius: 0 0 25px 25px;
            background-color: $dark01;
            p{
                margin: 0;
                font-size: 20px;
                line-height: 50px;
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>