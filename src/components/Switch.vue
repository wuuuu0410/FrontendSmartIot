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
        toggleChecked(event) {
            event.stopPropagation(); // 防止事件冒泡
            this.$emit('update:checked', !this.checked);
        }
    },
    props: [
        "checked"
    ]
        
    

};
</script>

<template>
    
    <div class="slideThree"  @click="toggleChecked">
        <input type="checkbox" :checked="checked" @click.stop="toggleChecked" />
        <label @click.stop="toggleChecked"></label>
    </div>

</template>

<style scoped lang="scss">
@import '@/assets/main.scss';


.slideThree {
    width: 69px;
    height: 34px;
    background: $dark03;
    position: relative;
    border-radius: 50px;
    box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 1px 0px rgba(255, 255, 255, 0.2);
    cursor: pointer;

    &:before {
        content: 'OFF';
        color: $dark02;
        position: absolute;
        right: 9px;
        z-index: 0;
        font: 12px/34px Arial, sans-serif;
        font-weight: bold;
        text-shadow: 1px 1px 0px rgba(255, 255, 255, .15);
    }

    &:after {
        content: 'ON';
        color: greenyellow;
        position: absolute;
        left: 10px;
        z-index: 0;
        font: 12px/34px Arial, sans-serif;
        font-weight: bold;
    }

    label {
        display: block;
        width: 30px;
        height: 28px;
        cursor: pointer;
        position: absolute;
        top: 3px;
        left: 3px;
        z-index: 1;
        background: $dark02;
        border-radius: 50px;
        transition: all 0.4s ease;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
    }

    input[type=checkbox] {
        position: absolute;
        left: -10px;
        visibility: hidden;

        &:checked+label {
            left: 36px;
            background-color: greenyellow;
        }
    }
}
</style>