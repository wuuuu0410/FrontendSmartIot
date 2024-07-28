<script>
import { Chart, registerables } from 'chart.js';
import { onMounted, onUnmounted, ref } from 'vue';

Chart.register(...registerables);

export default {
    setup() {
        const chartRef = ref(null);
        let chart = null;
        const dataPoints = {
            temperature: [],
            humidity: [],
            airQuality: []
        };
        const activeDataType = ref('temperature');

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/rooms/1');
                if (!response.ok) {
                    throw new Error('網絡響應不正確');
                }
                const roomData = await response.json();

                const airConditioner = roomData.devices.find(d => d.type === "冷氣機");
                const airPurifier = roomData.devices.find(d => d.type === "空氣清淨機");
                const dehumidifier = roomData.devices.find(d => d.type === "除濕機");

                const currentTime = new Date().toLocaleTimeString();

                if (airConditioner) {
                    dataPoints.temperature.push({ x: currentTime, y: airConditioner.airConditioner.current_temp });
                }
                if (dehumidifier) {
                    dataPoints.humidity.push({ x: currentTime, y: dehumidifier.dehumidifier.current_humidity });
                }
                if (airPurifier) {
                    dataPoints.airQuality.push({ x: currentTime, y: airPurifier.airPurifier.air_quality });
                }

                // 只保留最近20個數據點
                Object.values(dataPoints).forEach(arr => {
                    if (arr.length > 20) arr.shift();
                });

                updateChart();
            } catch (error) {
                console.error('獲取數據時出錯：', error);
            }
        };

        const updateChart = () => {
            if (chart) {
                const datasets = ['temperature', 'humidity', 'airQuality'].map(type => ({
                    label: getLabel(type), // 設置數據集的標籤
                    data: dataPoints[type], // 設置數據集的數據
                    borderColor: getColor(type), // 設置數據集的邊框顏色
                    backgroundColor: getColor(type), // 設置數據集的背景顏色
                    pointBackgroundColor: getColor(type), // 設置數據點的背景顏色
                    tension: 0.3, // 設置曲線的張力
                    hidden: type !== activeDataType.value
                }));

                chart.data.datasets = datasets;
                chart.options.scales.y.title.text = getYAxisLabel(activeDataType.value);

                // 計算當前顯示數據的最小值和最大值
                const currentData = dataPoints[activeDataType.value]; // 獲取當前數據
                const minValue = Math.min(...currentData.map(d => d.y)); // 計算最小值
                const maxValue = Math.max(...currentData.map(d => d.y)); // 計算最大值
                const padding = (maxValue - minValue) * 0.1; // 添加10%的填充

                chart.options.scales.y.min = Math.max(0, minValue - padding); // 設置 y 軸的最小值
                chart.options.scales.y.max = maxValue + padding; // 設置 y 軸的最大值

                chart.update('none');
            }
        };

        const getLabel = (type) => {
            switch (type) {
                case 'temperature': return '溫度 (°C)';
                case 'humidity': return '濕度 (%)';
                case 'airQuality': return '空氣品質';
            }
        };

        const getColor = (type) => {
            switch (type) {
                case 'temperature': return 'rgb(144, 225, 198)'; // 設置溫度數據集的邊框顏色
                case 'humidity': return 'rgb(221, 60, 138)'; // 設置濕度數據集的邊框顏色
                case 'airQuality': return 'rgb(134, 61, 244)'; // 設置空氣品質數據集的邊框顏色
            }
        };

        const getYAxisLabel = (type) => {
            switch (type) {
                case 'temperature': return '溫度 (°C)';
                case 'humidity': return '濕度 (%)';
                case 'airQuality': return '空氣品質指數';
            }
        };

        const changeDataType = (type) => {
            activeDataType.value = type;
            updateChart();
        };

        // 初始化假數據的函數
        const initializeWithDummyData = () => {
            const now = new Date();
            for (let i = 19; i >= 0; i--) {
                const time = new Date(now - i * 3000).toLocaleTimeString();
                dataPoints.temperature.push({ x: time, y: Math.random() * 5 + 20 }); // 隨機生成溫度數據，範圍20-30
                dataPoints.humidity.push({ x: time, y: Math.random() * 10 + 40 }); // 隨機生成濕度數據，範圍40-60
                dataPoints.airQuality.push({ x: time, y: Math.random() * 40 + 50 }); // 隨機生成空氣品質數據，範圍50-100
            }
        };

        onMounted(() => {
            initializeWithDummyData(); // 初始化假數據
            const ctx = chartRef.value.getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: ['temperature', 'humidity', 'airQuality'].map(type => ({
                        label: getLabel(type),
                        data: dataPoints[type],
                        borderColor: getColor(type),
                        backgroundColor: getColor(type),
                        pointBackgroundColor: getColor(type),
                        tension: 0.3,
                        hidden: type !== activeDataType.value
                    }))
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: 'category',
                            title: {
                                display: true,
                                text: '時間' // 設置 x 軸的標題
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 8 // 設置 x 軸的最大刻度數
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: getYAxisLabel(activeDataType.value) // 設置 y 軸的標題
                            },
                            beginAtZero: false, // 允許動態調整
                            adapters: { // 添加一個適配器來動態設置刻度
                                update: (scale) => {
                                    const currentData = dataPoints[activeDataType.value]; // 獲取當前數據
                                    const minValue = Math.min(...currentData.map(d => d.y)); // 計算最小值
                                    const maxValue = Math.max(...currentData.map(d => d.y)); // 計算最大值
                                    const padding = (maxValue - minValue) * 0.1; // 添加10%的填充
                                    scale.min = Math.max(0, minValue - padding); // 設置 y 軸的最小值
                                    scale.max = maxValue + padding; // 設置 y 軸的最大值
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // 隱藏上方圖例
                        }
                    }
                }
            });

            // 每3秒更新一次數據
            const intervalId = setInterval(fetchData, 1500);

            onUnmounted(() => {
                clearInterval(intervalId);
                if (chart) {
                    chart.destroy();
                }
            });
        });

        return { chartRef, activeDataType, changeDataType };
    }
};
</script>

<template>
    <div class="outArea">
        <div class="buttons">
            <button @click="changeDataType('temperature')"
                :class="{ active: activeDataType === 'temperature' }">溫度</button>
            <button @click="changeDataType('humidity')" :class="{ active: activeDataType === 'humidity' }">濕度</button>
            <button @click="changeDataType('airQuality')"
                :class="{ active: activeDataType === 'airQuality' }">空氣品質</button>
        </div>
        <canvas ref="chartRef"></canvas>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.outArea {
    width: 388px;
    height: 260px;
    border-radius: 25px;
    background-color: $dark01;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.buttons {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 20px;
    margin-top: 10px;

    button {
        padding: 5px 10px;
        border: none;
        background-color: $white;
        color:$dark03;
        border-radius: 20px;
        cursor: pointer;

        &.active {
            background-color: $black;
            color: $white;
        }

        &:hover {
            opacity: 0.8;
        }
    }
}
.canvas{
    margin-top: 10px;
}
</style>