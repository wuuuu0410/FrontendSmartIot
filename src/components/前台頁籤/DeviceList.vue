<script>
import ForestageSearchDevice from '@/components/ForestageSearchDevice.vue';
import Switch from '@/components/Switch.vue';
import location from '@/stores/location';
import { mapActions } from 'pinia';

export default {
    data() {
        return {
            roomDevices: [],
            lastExpandedTime: 0,
            saveTimers: {},
            activeDeviceId: null, // 追踪當前開啟的設備ID
        };
    },
    created() {
        this.fetchRoomDevices();
    },
    components: {
        Switch,
        ForestageSearchDevice,
    },
    methods: {
        ...mapActions(location, ['deviceStatus', 'searchRoom']),

        fetchRoomDevices() {
            fetch('http://localhost:8080/rooms/1')
                .then(response => response.json())
                .then(data => {
                    this.roomDevices = data.devices.map(device => ({
                        ...device,
                        expanded: false,
                        showControl: false,
                        mode: '',
                        fan_speed: device.type === '冷氣機' ? device.airConditioner.fanSpeed :
                            device.type === '空氣清淨機' ? device.airPurifier.fan_speed :
                                device.type === '除濕機' ? device.dehumidifier.fanSpeed : '',
                        target_temp: device.type === '冷氣機' ? device.airConditioner.target_temp : null,
                        target_humidity: device.type === '除濕機' ? device.dehumidifier.target_humidity : null,
                        brightness: device.type === '燈' ? device.light.brightness : null,
                        color_temp: device.type === '燈' ? device.light.color_temp : null,
                        tempSettings: {},
                    }));
                })
                .catch(error => console.error('獲取房間設備失敗：', error));
        },
        updateTempSettings(deviceId, newSettings) {
            const device = this.roomDevices.find(d => d.id === deviceId);
            if (device) {
                device.tempSettings = { ...device.tempSettings, ...newSettings };
                this.scheduleSave(deviceId);
            }
        },
        scheduleSave(deviceId) {
            if (this.saveTimers[deviceId]) {
                clearTimeout(this.saveTimers[deviceId]);
            }
            this.saveTimers[deviceId] = setTimeout(() => {
                this.saveDeviceSettings(deviceId);
            }, 3000);
        },
        saveDeviceSettings(deviceId) {
            const device = this.roomDevices.find(d => d.id === deviceId);
            if (!device || Object.keys(device.tempSettings).length === 0) return;

            const endpoint = this.getEndpoint(device.type);
            if (!endpoint) return;

            const url = `http://localhost:8080/${endpoint}/batch`;
            const payload = [{
                id: deviceId,
                status: device.status ? 1 : 0,
                ...device.tempSettings
            }];

            fetch(url, {
                method: 'PATCH',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(`${device.type} 設置已更新`, data);
                    Object.assign(device, data[0], { expanded: true, showControl: true });
                    device.tempSettings = {};
                    this.toggleExpand(this.roomDevices.indexOf(device));
                })
                .catch(error => {
                    console.error(`更新 ${device.type} 設置失敗：`, error);
                    alert(`更新 ${device.type} 設置失敗，請稍後再試。`);
                });
        },
        getEndpoint(deviceType) {
            switch (deviceType) {
                case '冷氣機': return 'air-conditioners';
                case '除濕機': return 'dehumidifiers';
                case '空氣清淨機': return 'air-purifiers';
                case '燈': return 'lights';
                default: return null;
            }
        },
        updateDeviceStatus(deviceId, status) {
            const device = this.roomDevices.find(d => d.id === deviceId);
            if (!device) return;

            const endpoint = this.getEndpoint(device.type);
            if (!endpoint) return;

            const url = `http://localhost:8080/${endpoint}/batch`;
            const payload = [{
                id: deviceId,
                status: status ? 1 : 0
            }];

            fetch(url, {
                method: 'PATCH',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(`${device.type} 狀態已更新`, data);
                    this.fetchRoomDevices();
                })
                .catch(error => {
                    console.error(`更新 ${device.type} 狀態失敗：`, error);
                    alert(`更新 ${device.type} 狀態失敗，請稍後再試。`);
                });
        },

        setMode(index, mode) {
            this.roomDevices[index].mode = mode;
        },
        setFanSpeed(index, fan_speed) {
            this.roomDevices[index].fan_speed = fan_speed;
        },
        increaseTemp(index) {
            const device = this.roomDevices[index];
            if (device.type === '冷氣機') {
                device.target_temp++;
            } else if (device.type === '除濕機') {
                device.target_humidity++;
            }
        },
        decreaseTemp(index) {
            const device = this.roomDevices[index];
            if (device.type === '冷氣機') {
                device.target_temp--;
            } else if (device.type === '除濕機') {
                device.target_humidity--;
            }
        },
        toggleExpand(index) {
            const currentTime = Date.now();
            const device = this.roomDevices[index];

            if (device.expanded && currentTime - this.lastExpandedTime < 500) {
                return;
            }

            if (device.expanded) {
                if (device.tempSettings && Object.keys(device.tempSettings).length > 0) {
                    this.saveDeviceSettings(device.id);
                }
                this.activeDeviceId = null; // 關閉面板時清除活動設備ID
            } else {
                // 關閉其他開啟的面板
                this.roomDevices.forEach(d => {
                    if (d.id !== device.id && d.expanded) {
                        d.expanded = false;
                        d.showControl = false;
                    }
                });

                this.fetchDeviceData(device.id);
                this.activeDeviceId = device.id; // 設置新的活動設備ID
            }

            device.expanded = !device.expanded;
            if (device.expanded) {
                this.lastExpandedTime = currentTime;
                setTimeout(() => {
                    device.showControl = true;
                }, 300);
            } else {
                device.showControl = false;
            }
        },
        fetchDeviceData(deviceId) {
            const device = this.roomDevices.find(d => d.id === deviceId);
            if (!device) return;

            const endpoint = this.getEndpoint(device.type);
            if (!endpoint) return;

            fetch(`http://localhost:8080/${endpoint}/${deviceId}`)
                .then(response => response.json())
                .then(data => {
                    // 更新設備數據
                    const updatedDevice = this.mapDeviceData(device.type, data);
                    Object.assign(device, updatedDevice);

                    // 添加控制台提示
                    console.log(`設備 ${device.name} (ID: ${device.id}, 類型: ${device.type}) 的面板狀態已更新`);

                    // 記錄更新的具體內容
                    console.log('更新的數據:', updatedDevice);
                })
                .catch(error => {
                    console.error(`獲取設備 ${device.name} (ID: ${device.id}) 數據失敗：`, error);
                });
        },
        mapDeviceData(deviceType, data) {
            const mappedData = {
                id: data.id,
                expanded: true,
                showControl: true,
                tempSettings: {},
            };

            switch (deviceType) {
                case '冷氣機':
                    mappedData.current_temp = data.current_temp;
                    mappedData.target_temp = data.target_temp;
                    mappedData.mode = data.mode;
                    mappedData.fan_speed = data.fanSpeed;
                    break;
                case '空氣清淨機':
                    mappedData.air_quality = data.air_quality;
                    mappedData.fan_speed = data.fan_speed;
                    mappedData.operating_time = data.operating_time;
                    break;
                case '除濕機':
                    mappedData.current_humidity = data.current_humidity;
                    mappedData.target_humidity = data.target_humidity;
                    mappedData.tank_capacity = data.tank_capacity;
                    mappedData.fan_speed = data.fanSpeed;
                    break;
                case '燈':
                    mappedData.brightness = data.brightness;
                    mappedData.color_temp = data.color_temp;
                    break;
            }

            return mappedData;
        },
        getDeviceIcon(type) {
            switch (type) {
                case '冷氣機': return 'fa-regular fa-snowflake';
                case '燈': return 'fa-regular fa-lightbulb';
                case '空氣清淨機': return 'fa-solid fa-leaf';
                case '除濕機': return 'fa-solid fa-droplet-slash';
                default: return 'fa-solid fa-question';
            }
        },
        handleSearchResults(results) {
            this.roomDevices = results.map(device => ({
                ...device,
                expanded: false,
                showControl: false,
                mode: '',
                fan_speed: device.type === '冷氣機' ? device.airConditioner.fanSpeed :
                    device.type === '空氣清淨機' ? device.airPurifier.fan_speed :
                        device.type === '除濕機' ? device.dehumidifier.fanSpeed : '',
                target_temp: device.type === '冷氣機' ? device.airConditioner.target_temp : null,
                target_humidity: device.type === '除濕機' ? device.dehumidifier.target_humidity : null,
                brightness: device.type === '燈' ? device.light.brightness : null,
                color_temp: device.type === '燈' ? device.light.color_temp : null,
                tempSettings: {},
            }));
        }
    }
};
</script>

<template>
    <div class="down">
        <ForestageSearchDevice @search-results="handleSearchResults">
            <template #roomid>
                <p></p>
            </template>
            <template #button>
                <p></p>
            </template>
        </ForestageSearchDevice>

        <div class="oo">
            <div class="outArea" v-for="(device, index) in roomDevices" :key="device.id"
                :class="{ expanded: device.expanded, active: device.id === activeDeviceId }">
                <div class="switch">
                    <Switch v-model:checked="device.status"
                        @update:checked="(status) => updateDeviceStatus(device.id, status)" />
                </div>
                <p class="id">{{ device.id }}</p>
                <i :class="[getDeviceIcon(device.type), { hidden: device.showControl }]"></i>
                <p>{{ device.type }}</p>
                <span>{{ device.name }}</span>
                <button class="updated" @click="toggleExpand(index)">
                    <i class="fa-solid fa-gear"></i>
                </button>
                <transition name="fade">
                    <div v-if="device.showControl && device.id === activeDeviceId" class="control">
                        <!-- 冷氣機控制 -->
                        <template v-if="device.type === '冷氣機'">
                            <div class="AC">
                                <div @click="updateTempSettings(device.id, { mode: 'HEAT' })"
                                    :class="{ selected: (device.tempSettings.mode || device.mode) === 'HEAT' }">
                                    <i class="fa-solid fa-temperature-arrow-up"></i>
                                    <p>暖氣</p>
                                </div>
                                <div @click="updateTempSettings(device.id, { mode: 'COOL' })"
                                    :class="{ selected: (device.tempSettings.mode || device.mode) === 'COOL' }">
                                    <i class="fa-regular fa-snowflake"></i>
                                    <p>冷氣</p>
                                </div>
                                <div @click="updateTempSettings(device.id, { mode: 'FAN' })"
                                    :class="{ selected: (device.tempSettings.mode || device.mode) === 'FAN' }">
                                    <i class="fa-solid fa-fan"></i>
                                    <p>送風</p>
                                </div>
                            </div>
                            <div class="AC">
                                <div @click="updateTempSettings(device.id, { fan_speed: 'HIGH' })"
                                    :class="{ selected: (device.tempSettings.fan_speed || device.fan_speed) === 'HIGH' }">
                                    <i class="fa-solid fa-wind"></i>
                                    <p
                                        :class="{ hidden: (device.tempSettings.fan_speed || device.fan_speed) !== 'HIGH' }">
                                        高</p>
                                </div>
                                <div @click="updateTempSettings(device.id, { fan_speed: 'MEDIUM' })"
                                    :class="{ selected: (device.tempSettings.fan_speed || device.fan_speed) === 'MEDIUM' || (device.tempSettings.fan_speed || device.fan_speed) === 'HIGH' }">
                                    <i class="fa-solid fa-wind"></i>
                                    <p
                                        :class="{ hidden: (device.tempSettings.fan_speed || device.fan_speed) !== 'MEDIUM' }">
                                        中</p>
                                </div>
                                <div @click="updateTempSettings(device.id, { fan_speed: 'LOW' })"
                                    :class="{ selected: (device.tempSettings.fan_speed || device.fan_speed) === 'LOW' || (device.tempSettings.fan_speed || device.fan_speed) === 'MEDIUM' || (device.tempSettings.fan_speed || device.fan_speed) === 'HIGH' }">
                                    <i class="fa-solid fa-wind"></i>
                                    <p
                                        :class="{ hidden: (device.tempSettings.fan_speed || device.fan_speed) !== 'LOW' }">
                                        低</p>
                                </div>
                            </div>
                            <div class="AC">
                                <div class="mode">
                                    <span>目標溫度</span>
                                    <i class="fa-solid fa-caret-up"
                                        @click="updateTempSettings(device.id, { target_temp: (device.tempSettings.target_temp || device.target_temp) + 1 })"></i>
                                    <p>{{ device.tempSettings.target_temp || device.target_temp }}°C</p>
                                    <i class="fa-solid fa-caret-down"
                                        @click="updateTempSettings(device.id, { target_temp: (device.tempSettings.target_temp || device.target_temp) - 1 })"></i>
                                </div>
                            </div>
                            <!-- <div class="current-temp">
                                <span>當前溫度</span>
                                <p>{{ device.current_temp.toFixed(1) }}°C</p>
                            </div> -->
                        </template>

                        <!-- 空氣清淨機控制 -->
                        <template v-if="device.type === '空氣清淨機'">
                            <div class="Air">
                                <span>設備<br>運轉時間</span>
                                <div class="time">
                                    <p>{{ device.operating_time.toFixed(2) }}</p>
                                    <p class="hr">小時</p>
                                </div>
                            </div>
                            <div class="AC">
                                <div @click="updateTempSettings(device.id, { fan_speed: 100 })"
                                    :class="{ selected: (device.tempSettings.fan_speed || device.fan_speed) === 100 }">
                                    <i class="fa-solid fa-wind"></i>
                                    <p :class="{ hidden: (device.tempSettings.fan_speed || device.fan_speed) !== 100 }">
                                        高</p>
                                </div>
                                <div @click="updateTempSettings(device.id, { fan_speed: 50 })"
                                    :class="{ selected: (device.tempSettings.fan_speed || device.fan_speed) === 50 || (device.tempSettings.fan_speed || device.fan_speed) === 100 }">
                                    <i class="fa-solid fa-wind"></i>
                                    <p :class="{ hidden: (device.tempSettings.fan_speed || device.fan_speed) !== 50 }">
                                        中</p>
                                </div>
                                <div @click="updateTempSettings(device.id, { fan_speed: 25 })"
                                    :class="{ selected: (device.tempSettings.fan_speed || device.fan_speed) === 25 || (device.tempSettings.fan_speed || device.fan_speed) === 50 || (device.tempSettings.fan_speed || device.fan_speed) === 100 }">
                                    <i class="fa-solid fa-wind"></i>
                                    <p :class="{ hidden: (device.tempSettings.fan_speed || device.fan_speed) !== 25 }">
                                        低</p>
                                </div>
                            </div>
                            <div class="Air">
                                <div class="mode">
                                    <p>{{ device.air_quality }}</p>
                                    <span>當前<br>空氣品質</span>
                                </div>
                            </div>
                        </template>

                        <!-- 除濕機控制 -->
                        <template v-if="device.type === '除濕機'">
                            <div class="Air">
                                <span>水箱<br>剩餘容量</span>
                                <div class="time">
                                    <p>{{ device.tank_capacity.toFixed(1) }}</p>
                                    <p class="hr">ml</p>
                                </div>
                            </div>
                            <div class="AC">
                                <div @click="updateTempSettings(device.id, { fan_speed: 'HIGH' })"
                                    :class="{ selected: (device.tempSettings.fan_speed || device.fan_speed) === 'HIGH' }">
                                    <i class="fa-solid fa-wind"></i>
                                    <p
                                        :class="{ hidden: (device.tempSettings.fan_speed || device.fan_speed) !== 'HIGH' }">
                                        高</p>
                                </div>
                                <div @click="updateTempSettings(device.id, { fan_speed: 'MEDIUM' })"
                                    :class="{ selected: (device.tempSettings.fan_speed || device.fan_speed) === 'MEDIUM' || (device.tempSettings.fan_speed || device.fan_speed) === 'HIGH' }">
                                    <i class="fa-solid fa-wind"></i>
                                    <p
                                        :class="{ hidden: (device.tempSettings.fan_speed || device.fan_speed) !== 'MEDIUM' }">
                                        中</p>
                                </div>
                                <div @click="updateTempSettings(device.id, { fan_speed: 'LOW' })"
                                    :class="{ selected: (device.tempSettings.fan_speed || device.fan_speed) === 'LOW' || (device.tempSettings.fan_speed || device.fan_speed) === 'MEDIUM' || (device.tempSettings.fan_speed || device.fan_speed) === 'HIGH' }">
                                    <i class="fa-solid fa-wind"></i>
                                    <p
                                        :class="{ hidden: (device.tempSettings.fan_speed || device.fan_speed) !== 'LOW' }">
                                        低</p>
                                </div>
                            </div>
                            <div class="AC">
                                <div class="mode">
                                    <span>目標濕度</span>
                                    <i class="fa-solid fa-caret-up"
                                        @click="updateTempSettings(device.id, { target_humidity: (device.tempSettings.target_humidity || device.target_humidity) + 1 })"></i>
                                    <p>{{ device.tempSettings.target_humidity || device.target_humidity }}%
                                    </p>
                                    <i class="fa-solid fa-caret-down"
                                        @click="updateTempSettings(device.id, { target_humidity: (device.tempSettings.target_humidity || device.target_humidity) - 1 })"></i>
                                </div>
                            </div>
                            <!-- <div class="current-humidity">
                                <span>當前濕度</span>
                                <p>{{ device.current_humidity.toFixed(1) }}%</p>
                            </div> -->
                        </template>

                        <!-- 燈控制 -->
                        <template v-if="device.type === '燈'">
                            <div class="Lamp">
                                <div class="brightnessRange">
                                    <div class="brightness">
                                        <span>{{ device.tempSettings.brightness || device.brightness }} %</span>
                                    </div>
                                    <div class="area">
                                        <p>亮度</p>
                                        <input type="range" min="0" max="100"
                                            v-model.number="device.tempSettings.brightness"
                                            @change="updateTempSettings(device.id, { brightness: device.tempSettings.brightness })">
                                    </div>
                                </div>
                                <div class="color_tempRange">
                                    <div class="color_temp">
                                        <span>{{ device.tempSettings.color_temp || device.color_temp }}K</span>
                                    </div>
                                    <div class="area">
                                        <p>色溫</p>
                                        <input type="range" min="1000" max="10000" step="100"
                                            v-model.number="device.tempSettings.color_temp"
                                            @change="updateTempSettings(device.id, { color_temp: device.tempSettings.color_temp })">
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.down {
    width: 900px;
    height: 650px;
    padding: 27px 0px 16px 50px;

    .oo {
        height: 598px;
        display: flex;
        flex-wrap: wrap;
        padding-left: 82px;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 13px;

        }

        &::-webkit-scrollbar-button {
            background: transparent;
            height: 3px;
        }

        &::-webkit-scrollbar-thumb {
            background: $black1;
            border-radius: 15px;

        }

        &::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 15px;
        }

        .outArea {
            position: relative;
            width: 250px;
            height: 200px;
            border-radius: 25px;
            margin-bottom: 15px;
            background-color: $white;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);


            // flex: 0 0 auto; /* 确保每个项目不会缩小并且保持其内容的宽度 */
            margin-right: 17px;
            /* 可选的间距 */
            padding-bottom: 10px;
            transition: width 0.3s;

            /* 添加过渡效果 */
            &.expanded {
                width: 517px;
                /* 展开后的宽度 */
            }

            .switch {
                position: absolute;
                right: 18px;
                top: 15px;

                :deep(input[type="checkbox"]) {
                    display: none;
                }
            }

            i {
                font-size: 80px;
                color: $dark01;
                margin-left: 37%;
                margin-top: 21px;

                &.hidden {
                    visibility: hidden;
                    /* 隐藏但保留占位 */
                }
            }

            .id {
                margin-top: 10px
            }

            p {
                margin: 5px 20px 0 20px;
                font-size: 16px;
            }

            span {
                margin: 20px 30px 20px 20px;
                font-size: 20px;

            }

            .updated {
                position: absolute;
                right: 21px;
                bottom: 18px;
                height: 30px;
                width: 30px;
                text-align: center;
                background-color: transparent;
                cursor: pointer;

                i {
                    margin: 0;
                    line-height: 30px;
                    font-size: 21px;
                    color: $dark03 ;
                }
            }

            .control {
                position: absolute;
                top: 50px;
                right: 46px;
                display: flex;
                align-items: center;
                margin-top: 10px;

                .AC {
                    width: 95px;
                    height: 120px;
                    background-color: $dark01;
                    margin-right: 12px;
                    border-radius: 20px;
                    padding-top: 10px;

                    i {
                        width: 30px;
                        font-size: 25px;
                        color: $dark03;
                        cursor: pointer;
                        margin: 0;
                    }

                    p {
                        margin: 0;
                        color: $dark03;
                        cursor: pointer;

                        &.hidden {
                            visibility: hidden;
                            /* 隐藏但保留占位 */
                        }
                    }

                    div {
                        width: 68px;
                        display: flex;
                        justify-content: space-evenly;
                        margin: auto;
                        margin-top: 10px;

                    }

                    .selected {
                        i {
                            color: $black1;
                        }

                        p {
                            color: $black1;
                        }
                    }

                    .mode {
                        flex-direction: column;
                        align-items: center;
                        color: $black1;
                        padding-top: 10px;

                        i {
                            width: auto;
                            font-size: 25px;
                            cursor: pointer;
                        }

                        p {
                            font-size: 30px;
                            margin: 0;
                            color: $black1;
                            margin-top: -8px;
                        }

                        span {
                            position: absolute;
                            left: 234px;
                            top: 3px;
                            color: $black1;
                            margin: 0;
                            font-size: 14px;
                        }
                    }

                }

                .Air {
                    width: 95px;
                    height: 120px;
                    background-color: $dark01;
                    margin-right: 12px;
                    border-radius: 20px;
                    padding-top: 10px;

                    span {
                        position: absolute;
                        left: 19px;
                        top: 3px;
                        color: $black1;
                        margin: 0;
                        font-size: 14px;
                        text-align: center;
                    }

                    i {
                        width: 30px;
                        font-size: 25px;
                        color: $dark03;
                        cursor: pointer;
                        margin: 0;
                    }

                    p {
                        margin: 0;
                        color: $dark03;
                        cursor: pointer;

                        &.hidden {
                            visibility: hidden;
                            /* 隐藏但保留占位 */
                        }
                    }

                    div {
                        width: 68px;
                        display: flex;
                        justify-content: space-evenly;
                        margin: auto;
                        margin-top: 10px;

                    }

                    .selected {
                        i {
                            color: $black1;
                        }

                        p {
                            color: $black1;
                        }
                    }

                    .mode {
                        flex-direction: column;
                        align-items: center;
                        color: $black1;
                        margin-top: 19px;

                        p {
                            font-size: 35px;
                            margin: 0;
                            color: $black1;
                            margin-top: 24px;
                            cursor: default;
                        }

                        span {
                            position: absolute;
                            color: $black1;
                            text-align: center;
                            margin: 0;
                            left: 233px;
                            top: 3px;
                            font-size: 14px;
                        }
                    }

                    .time {
                        display: flex;
                        align-items: center;
                        flex-direction: column;

                        p {
                            color: $black1;
                            cursor: default;
                            font-size: 30px;
                            margin: 0;
                            margin-top: 26px;
                        }

                        .hr {
                            font-size: 14px;
                            margin-top: 0;
                        }
                    }
                }

                .Lamp {
                    width: 309px;
                    height: 130px;
                    background-color: $dark01;
                    margin-right: 12px;
                    border-radius: 20px;

                    .brightnessRange {
                        height: 65px;
                        display: flex;
                        border-bottom: 1px solid $dark03;

                        span {
                            font-size: 20px;
                            color: $black1;
                            font-size: 30px;
                            margin: 0;
                            line-height: 60px;
                        }

                        .brightness {
                            width: 120px;
                            text-align: center;
                        }

                        .area {
                            padding-top: 10px;

                            p {
                                margin: 0;
                                color: $black1;
                            }

                            input {
                                width: 170px;
                            }
                        }
                    }

                    .color_tempRange {
                        display: flex;

                        span {
                            font-size: 20px;
                            color: $black1;
                            font-size: 30px;
                            margin: 0;
                            line-height: 60px;
                        }

                        .color_temp {
                            width: 120px;
                            text-align: center;
                        }

                        .area {
                            padding-top: 10px;

                            p {
                                margin: 0;
                                color: $black1;
                            }

                            input {
                                width: 170px;
                            }
                        }
                    }






                }
            }
        }


    }

    /* 过渡效果 */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s width 0.3s;
    }

    .fade-enter,
    .fade-leave-to

    /* .fade-leave-active in <=2.1.8 */
        {
        opacity: 0;
        width: 0;
    }

}
</style>