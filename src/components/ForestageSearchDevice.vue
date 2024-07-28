<script>
export default {
    data() {
        return {
            showbox: false, // 控制顯示搜尋或刪除的狀態
            searchObj: {
                name: "",
                status: "",
                type: ""
            }
        };
    },
    watch: {
        searchObj: {
            handler() {
                this.searchDevices();
            },
            deep: true
        }
    },
    methods: {
        searchDevices() {
            fetch('http://localhost:8080/rooms/1')
                .then(response => response.json())
                .then(data => {
                    let filteredDevices = data.devices.filter(device => {
                        return (this.searchObj.name === "" || device.name.includes(this.searchObj.name)) &&
                            (this.searchObj.status === "" || device.status === (this.searchObj.status === "使用中")) &&
                            (this.searchObj.type === "" || device.type === this.searchObj.type);
                    });
                    this.$emit('search-results', filteredDevices);
                })
                .catch(error => console.error('搜尋設備失敗：', error));
        },
        showsearch() {
            this.showbox = !this.showbox;
        }
    }
};
</script>

<template>
    <div class="createRoom">
        <input type="text" v-model="searchObj.name" placeholder="設備名稱">
        <select v-model="searchObj.status">
            <option value="">全部</option>
            <option value="使用中">使用中</option>
            <option value="閒置中">閒置中</option>
        </select>

        <slot name="roomid"></slot>

        <select v-model="searchObj.type">
            <option value="">設備類型</option>
            <option value="冷氣機">冷氣</option>
            <option value="燈">電燈</option>
            <option value="空氣清淨機">空氣清淨機</option>
            <option value="除濕機">除濕機</option>
        </select>
        <button @click="searchDevices">搜尋</button>
        <slot name="button">
            <div class="createAndDeleteButton">
                <button @click="showsearch" :class="{ chick: !showbox }"><i class="fa-solid fa-magnifying-glass"></i></button>
                <button @click="showsearch" :class="{ chick: showbox }"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </slot>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.createRoom {
    width: 100%;
    height: 71px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;

    select {
        width: 125px;
        height: 40px;
        font-size: 16px;
        border: none;
        border-radius: 35px;
        background: $white;
        outline: none;
        padding-left: 20px;
        margin-left: 20px;
        color: $dark03;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);

    }

    input {
        width: 180px;
        height: 40px;
        border-radius: 35px;
        border: none;
        outline: none;
        background: $white;
        font-size: 16px;
        padding: 0;
        padding-left: 20px;
        color: $dark03;
        line-height: 40px;
        margin-left: 83px;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    }

    ::placeholder {
        color: $dark03;
    }

    button {
        width: 88px;
        height: 40px;
        border-radius: 35px;
        border: none;
        cursor: pointer;
        background: $white;
        color: $dark03;
        font-size: 16px;
        line-height: 40px;
        margin-left: 20px;
        padding: 0;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    }

    .createAndDeleteButton {
        position: absolute;
        right: 0;
        height: 40px;
        display: flex;
        // margin-right: 36px;

        button {
            height: 40px;
            width: 40px;
            background: $white;
            border-radius: 50%;
            border: none;
            outline: none;
            color: $dark03;
            font-size: 20px;
            line-height: 40px;
        }

        .chick {
            color: $white;
            background: $black;
        }
    }
}
</style>