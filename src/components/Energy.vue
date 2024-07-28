<script>
import * as echarts from 'echarts';

export default {
    data() {
        return {
            chartData: null, // 電力消耗數據
            carbonEmissionData: null, // 碳排放數據
            showCarbonComparison: false, // 是否顯示碳排放比較
            carbonDifference: 0,
            chart: null,
            isYearlyView: false, // 是否為年視圖
            yearlyData: null, // 年數據
            isLoading: false, // 是否加載中
            showRoomConsumption: false, // 是否顯示房間耗電量圓餅圖
            roomConsumptionData: [], // 存儲房間耗電量數據
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            this.isLoading = true;
            try {
                const year = new Date().getFullYear(); // 獲取當前年份
                const month = new Date().getMonth() + 1; // 獲取當前月份
                let url = this.isYearlyView // 根據是否為年視圖選擇不同的API
                   // ? `http://localhost:8080/power/yearly?year=${year}` // 年視圖的API
                   // : `http://localhost:8080/power/monthly?year=${year}&month=${month}`; // 月視圖的API
                    ? `https://backend-smartiot.onrender.com/power/yearly?year=${year}` // 年視圖的API
                    : `https://backend-smartiot.onrender.com/power/monthly?year=${year}&month=${month}`; // 月視圖的API
                const response = await fetch(url); // 發送請求
                if (!response.ok) { // 檢查響應是否成功
                    throw new Error('網絡響應不正確');
                }
                const data = await response.json();
                console.log('獲取的數據：', data); // 獲取的數據
                this.chartData = this.convertToWatts(data); // 將數據轉換為千瓦時
                this.carbonEmissionData = this.calculateCarbonEmission(data); // 將數據轉換為碳排放量
                if (this.isYearlyView) { // 如果為年視圖
                    this.yearlyData = data; // 將數據存儲到 yearlyData
                }
                console.log('碳排放數據：', this.carbonEmissionData); // 碳排放數據
                this.initChart(); // 初始化圖表
            } catch (error) {
                console.error('獲取數據時出錯：', error);
            } finally {
                this.isLoading = false; // 設置為非加載狀態
            }
        },
        convertToWatts(data) { // 將數據轉換為千瓦時
            const convertedData = {}; // 轉換後的數據
            for (const [date, kWh] of Object.entries(data)) { // 遍歷數據
                convertedData[date] = kWh * 1; // 將數據轉換為千瓦時
            }
            return convertedData;
        },
        calculateCarbonEmission(data) { // 將數據轉換為碳排放量
            const carbonData = {}; // 碳排放數據
            for (const [date, kWh] of Object.entries(data)) { // 遍歷數據
                carbonData[date] = kWh * 0.495; // 將數據轉換為碳排放量(經濟部)
            }
            return carbonData; // 返回碳排放數據
        },
        initChart() { // 初始化圖表
            const chartDom = document.getElementById('energyChart'); // 獲取圖表元素
            if (this.chart) { // 如果圖表存在
                this.chart.dispose(); // 銷毀圖表
            }
            this.chart = echarts.init(chartDom); // 初始化圖表

            const option = { // 設置圖表選項
                title: {
                    text: this.getChartTitle(), // 獲取圖表標題
                    textStyle: {
                        fontSize: 18 // 增加標題字體大小
                    }
                },
                tooltip: {
                    trigger: 'axis', // 設置提示框觸發類型
                    formatter: function (params) { // 設置提示框格式
                        const value = params[0].value.toFixed(1); // 獲取值
                        if (this.showCarbonComparison) { // 如果顯示碳排放比較
                            return `${params[0].name}<br/>${value} kg CO2e`; // 返回碳排放量
                        } else {
                            return `${params[0].name}<br/>${value} kW`; // 返回電力消耗
                        }
                    }.bind(this),
                    textStyle: {
                        fontSize: 14 // 增加提示框字體大小
                    }
                },
                xAxis: {
                    type: 'category', // 設置X軸類型
                    data: this.getXAxisData(), // 獲取X軸數據
                    axisLabel: {
                        fontSize: 14 // 增加 X 軸標籤字體大小
                    }
                },
                yAxis: {
                    type: 'value', // 設置Y軸類型
                    name: this.showCarbonComparison ? '碳排放量 (kg CO2e)' : '電力消耗 (kW)', // 獲取Y軸名稱
                    axisLabel: {
                        fontSize: 14 // 增加 Y 軸標籤字體大小
                    },
                    nameTextStyle: {
                        fontSize: 14 // 增加 Y 軸名稱字體大小
                    }
                },
                series: [{
                    data: this.getSeriesData(), // 獲取數據
                    type: 'bar', // 設置圖表類型
                    itemStyle: { // 設置圖表樣式
                        color: this.showCarbonComparison ? '#02F78E' : '#1E88E5' // 設置顏色 色碼
                    },
                    label: {
                        show: true, // 顯示標籤
                        position: 'top', // 設置標籤位置
                        formatter: function (params) { // 設置標籤格式
                            return params.value.toFixed(1); // 返回值
                        },
                        fontSize: 14 // 增加數據標籤字體大小
                    }
                }]
            };

            this.chart.setOption(option); // 設置圖表選項

            if (this.showCarbonComparison) { // 如果顯示碳排放比較
                this.calculateCarbonDifference();
            }
        },
        getChartTitle() {
            if (this.showCarbonComparison) { // 如果顯示碳排放比較
                return this.isYearlyView ? '本月與上月碳排比較' : '本日與昨日碳排比較'; // 返回圖表標題
            } else {
                return this.isYearlyView ? '年度電力消耗' : '月度電力消耗';
            }
        },
        getXAxisData() {
            if (this.showCarbonComparison) {
                if (this.isYearlyView) {
                    const currentDate = new Date();
                    const currentMonth = currentDate.getMonth();
                    const currentYear = currentDate.getFullYear();

                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

                    const lastMonthName = new Date(lastMonthYear, lastMonth, 1).toLocaleString('zh-TW', { month: 'long' });
                    const currentMonthName = currentDate.toLocaleString('zh-TW', { month: 'long' });

                    return [lastMonthName, currentMonthName];
                } else {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);

                    const todayString = today.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
                    const yesterdayString = yesterday.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });

                    return [yesterdayString, todayString];
                }
            } else {
                return Object.keys(this.chartData);
            }
        },
        getSeriesData() {
            if (this.showCarbonComparison) { // 如果顯示碳排放比較
                return this.getCarbonComparisonData(); // 獲取碳排放比較數據
            } else {
                return Object.values(this.chartData);
            }
        },
        getCarbonComparisonData() {
            if (this.isYearlyView) { // 如果為年視圖
                const currentDate = new Date(); // 獲取當前日期
                const currentMonth = currentDate.getMonth(); // 獲取當前月份
                const currentYear = currentDate.getFullYear(); // 獲取當前年份

                let currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`; // 獲取當前月份的key
                let lastMonthKey = currentMonth === 0
                    ? `${currentYear - 1}-12` // 如果當前月份為0(1月)，則取去年的12月
                    : `${currentYear}-${String(currentMonth).padStart(2, '0')}`; // 否則取去年的當前月份

                const currentMonthEmission = this.yearlyData[currentMonthKey] || 0; // 獲取當前月份的碳排放量
                const lastMonthEmission = this.yearlyData[lastMonthKey] || 0; // 獲取上個月的碳排放量

                return [lastMonthEmission * 0.495, currentMonthEmission * 0.495]; // 轉換為碳排放量
            } else {
                const today = new Date(); // 獲取當前日期
                const yesterday = new Date(today); // 獲取昨天日期
                yesterday.setDate(yesterday.getDate() - 1); // 設置昨天日期
                const todayKey = today.toISOString().slice(0, 10); // 獲取當前日期的key，格式為YYYY-MM-DD
                const yesterdayKey = yesterday.toISOString().slice(0, 10); // 獲取昨天日期的key，格式為YYYY-MM-DD
                const todayEmission = this.carbonEmissionData[todayKey] || 0; // 獲取當前日期的碳排放量
                const yesterdayEmission = this.carbonEmissionData[yesterdayKey] || 0; // 獲取昨天日期的碳排放量
                return [yesterdayEmission, todayEmission]; // 返回碳排放量
            }
        },
        calculateCarbonDifference() {
            const [previousEmission, currentEmission] = this.getCarbonComparisonData();
            this.carbonDifference = currentEmission - previousEmission;
        },
        toggleCarbonComparison() {
            this.showCarbonComparison = !this.showCarbonComparison;
            this.initChart();
        },
        toggleViewMode() {
            this.isYearlyView = !this.isYearlyView;
            this.fetchData();
        },
        async fetchRoomConsumptionData() {
            this.isLoading = true;
            try {
                const year = new Date().getFullYear();
                const month = new Date().getMonth() + 1;
                const url = `http://localhost:8080/power/total?year=${year}&month=${month}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('網絡響應不正確');
                }
                this.roomConsumptionData = await response.json();
                this.initRoomConsumptionChart();
            } catch (error) {
                console.error('獲取房間耗電量數據時出錯：', error);
            } finally {
                this.isLoading = false;
            }
        },
        initRoomConsumptionChart() {
            const chartDom = document.getElementById('roomConsumptionChart');
            if (this.chart) {
                this.chart.dispose();
            }
            this.chart = echarts.init(chartDom);

            const option = {
                title: {
                    text: '本月各房間耗電量',
                    left: '20px',
                    textStyle: {
                        fontSize: 18 // 增加標題字體大小
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return `${params.name}: ${params.value.toFixed(1)} kW (${params.percent.toFixed(2)}%)`;
                    },
                    textStyle: {
                        fontSize: 14 // 增加提示框字體大小
                    }
                },
                series: [
                    {
                        name: '房間耗電量',
                        type: 'pie',
                        radius: '50%',
                        data: this.roomConsumptionData.map(item => ({
                            value: Number(item.consumption.toFixed(2)),
                            name: item.roomName
                        })),
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            formatter: '{b}: {c} 度 ({d}%)',
                            fontSize: 14 // 增加標籤字體大小
                        },
                        emphasis: {
                            label: {
                                fontSize: 16 // 增加強調時的標籤字體大小
                            }
                        }
                    }
                ]
            };

            this.chart.setOption(option);
        },
        toggleRoomConsumption() {
            this.showRoomConsumption = !this.showRoomConsumption;
            if (this.showRoomConsumption) {
                this.fetchRoomConsumptionData();
            } else {
                this.$nextTick(() => {
                    this.initChart(); // 使用 $nextTick 確保 DOM 已更新
                });
            }
        },
    },
    computed: {
        carbonDifferenceText() {
            if (!this.showCarbonComparison) return '';
            const diff = Math.abs(this.carbonDifference).toFixed(2); // 獲取碳排放差異
            const diffText = `<span style="color: #4CAF50;">${diff}</span>`; // 獲取碳排放差異的文字
            const comparisonPeriod = this.isYearlyView ? '上個月' : '昨天'; // 獲取比較期間
            return this.carbonDifference > 0
                ? `比${comparisonPeriod}多了 ${diffText} 公斤的碳排`
                : `比${comparisonPeriod}少了 ${diffText} 公斤的碳排`;
        },
        yearlyTotalCarbonEmission() {
            if (!this.isYearlyView || !this.yearlyData) return 0;
            return Object.values(this.yearlyData).reduce((sum, kWh) => sum + kWh * 0.495, 0).toFixed(2);
        },
        weeklyTotalCarbonEmission() {
            if (this.isYearlyView || !this.chartData) return 0;
            const today = new Date();
            const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return Object.entries(this.chartData)
                .filter(([date]) => new Date(date) >= lastWeek && new Date(date) <= today)
                .reduce((sum, [, kWh]) => sum + kWh * 0.495, 0)
                .toFixed(2);
        }
    }
};
</script>

<template>
    <div class="stateDiv">
        <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
        </div>
        <div id="energyChart" v-show="!showRoomConsumption"></div>
        <div id="roomConsumptionChart" v-show="showRoomConsumption"></div>
        <div class="button-group">
            <template v-if="!showRoomConsumption">
                <button @click="toggleCarbonComparison" :disabled="isLoading">
                    <i class="fas fa-exchange-alt"></i>
                    {{ showCarbonComparison ? '顯示電力消耗' : '顯示碳排比較' }}
                </button>
                <button @click="toggleViewMode" :disabled="isLoading">
                    <i class="fas fa-calendar-alt"></i>
                    {{ isYearlyView ? '切換到月視圖' : '切換到年視圖' }}
                </button>
                <button @click="toggleRoomConsumption" :disabled="isLoading">
                    <i class="fas fa-home"></i>
                    顯示各房間耗電量
                </button>
            </template>
            <button v-else @click="toggleRoomConsumption" :disabled="isLoading">
                <i class="fas fa-chart-bar"></i>
                返回主圖表
            </button>
        </div>
        <p v-if="showCarbonComparison && !showRoomConsumption" class="carbon-difference" v-html="carbonDifferenceText">
        </p>
        <p v-if="isYearlyView && !showCarbonComparison && !showRoomConsumption" class="carbon-emission">
            今年總碳排量：<span class="green-text">{{ yearlyTotalCarbonEmission }}</span> 公斤
        </p>
        <p v-if="!isYearlyView && !showCarbonComparison && !showRoomConsumption" class="carbon-emission">
            本週碳排量：<span class="green-text">{{ weeklyTotalCarbonEmission }}</span> 公斤
        </p>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.stateDiv {
    // width: 96.8%;
    height: 280px;
    background-color: $white;
    border-radius: 25px 25px 0 0;
    position: relative;
    padding: 39px 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p{
        width: 300px;
        margin: auto;
        position: absolute;
        bottom: 15px;
        left: 36%;
    }
}

#energyChart,
#roomConsumptionChart {
    width: 100%;
    height: 400px;
}

.button-group {
    position: absolute;
    right: 30px;
    top: 25px;
    display: flex;
    justify-content: center;
    gap: 15px;
    
}

button {
    padding: 0px 18px;
    height: 40px;
    background-color: $dark02;
    color: $black1;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    font-size: 1em;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: darken($dark02, 10%);
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    i {
        margin-right: 8px;
        font-size: 1.1em;
    }
}

.carbon-difference,
.carbon-emission {
    text-align: center;
    font-weight: bold;
    font-size: 1.1em;
}

.green-text {
    color: #4CAF50;
    font-weight: bold;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    border-radius: 25px 25px 0 0;
}

.loading-spinner {
    width: 60px;
    height: 60px;
    border: 6px solid $dark02;
    border-top: 6px solid $white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>