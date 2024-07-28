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
        // 按鈕被點擊時通知父層並觸發父層方法
        handleSearchClick() {
            this.$emit('search-click');
            this.$emit('update:showCreateRoom', false); 
            this.$emit('update:showCheckbox', false); // 更新 showCheckbox 的值
        },
        handleDeleteClick() {
            this.$emit('delete-click');
            this.$emit('update:showCreateRoom', false); 
        },
        handleAddClick() {
            this.$emit('add-click');
            this.$emit('update:showCheckbox', false); // 更新 showCheckbox 的值
            this.$emit('update:showCreateRoom', true);
        },
    },
    props:[
        "showCheckbox",
        "showCreateRoom"
    ]
    
};
</script>

<template>
    <div class="buttonArea">
        <div class="lineArea">
            <slot name="text">
                <p>所有空間</p>
            </slot>    
            <div class="line"></div>
        </div>
        <div class="createAndDeleteButton">            
            <button @click="handleSearchClick" :class="{ chick: !showCheckbox && !showCreateRoom }"><i class="fa-solid fa-magnifying-glass" ></i></button>
            <button @click="handleDeleteClick" :class="{chick:showCheckbox}"><i class="fa-solid fa-trash-can" ></i></button>
            <button @click="handleAddClick" :class="{ chick:showCreateRoom }"><i class="fa-solid fa-circle-plus" ></i></button>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';
.buttonArea {
    // width: 1208px;
    height: 112px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.lineArea {
width: 950px;
height: 112px;
display: flex;
flex-direction: column;
justify-content: center;
margin-left: 36px;
    .line {
        width: 950px;
        height: 0;
        border: solid 1px $white;
    }
    p{
        font-size: 20px;
        color: $black1;
        padding-left: 10px;
        padding-bottom: 6px
    }
}

.createAndDeleteButton {
    width: 175px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    margin-right: 36px;
    
    button {
        height: 45px;
        width: 45px;
        background: $white;
        border-radius: 50%;
        border: none;
        outline: none;
        color: $dark03;  
        font-size: 20px;
        line-height: 45px; 
        cursor: pointer; 
    }
    .chick{
        color: $white;
        background: $black;
    }
}
</style>