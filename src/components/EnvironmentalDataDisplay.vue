<!-- 前台-首頁-中間環境及時數據顯示-元件 -->
<script>
export default {
    data() {
        return {
            dataArr: []
        };
    },
    created() {
        this.fetchData();
        setInterval(this.fetchData, 300); // 300 毫秒 = 3 秒鐘
    },
    methods: {
        async fetchData() {
            try {
                const response = await fetch('http://localhost:8080/rooms/1');
                if (!response.ok) {
                    throw new Error('網絡響應不正確');
                }
                const roomData = await response.json();

                const airConditioner = roomData.devices.find(d => d.type === "冷氣機");
                const airPurifier = roomData.devices.find(d => d.type === "空氣清淨機");
                const dehumidifier = roomData.devices.find(d => d.type === "除濕機");

                this.dataArr = [
                    { name: "溫度", data: airConditioner ? `${airConditioner.airConditioner.current_temp.toFixed(1)}˚C` : '無數據' },
                    { name: "空氣品質", data: airPurifier ? `${airPurifier.airPurifier.air_quality}` : '無數據' },
                    { name: "濕度", data: dehumidifier ? `${dehumidifier.dehumidifier.current_humidity.toFixed(1)}%` : '無數據' }
                ];
            } catch (error) {
                console.error('獲取數據時出錯：', error);
            }
        }
    }
};
</script>

<template>
    <div class="outArea" v-for="(data, index) in dataArr" :key="index">
        <p>{{ data.name }}</p>
        <span>{{ data.data }}</span>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.outArea {
    width: 311px;
    height: 100%;
    border-radius: 25px;
    background-color: $dark01;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: $dark03;
    // backdrop-filter: blur(5px);
    p {
        font-size: 18px;
        color: $black1;
    }

    span {
        margin: 0 0 7px 0;
        font-size: 45px;
    }
}
</style>