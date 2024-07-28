<script>
import ACcontrol from '@/components/ACcontrol.vue';
import AirPurifierControl from '@/components/AirPurifierControl.vue';
import Announcement from '@/components/Announcement.vue';
import DehumidifierControl from '@/components/DehumidifierControl.vue';
import DeviceCell from '@/components/DeviceCell.vue';
import EnvironmentalData from '@/components/EnvironmentalData.vue';
import EnvironmentalDataDisplay from '@/components/EnvironmentalDataDisplay.vue';
import lampControl from '@/components/lampControl.vue';

export default {
    data() {
        return {
            roomDevices: [],
            dehumidifiers: [],
            lights: [],
            airPurifiers: [],
            airConditioners: [],
            selectedDeviceType: 'Announcement',
            resetTimer: null,
        };
    },
    components: {
        Announcement,  //公告元件
        EnvironmentalData,  //環境數據曲線圖
        EnvironmentalDataDisplay,  //即時顯示環境數據
        DeviceCell,  //啟動中設備顯示元件
        ACcontrol,   //冷氣控制元件
        AirPurifierControl,  //空氣清淨機
        DehumidifierControl,  //除濕機控制元件
        lampControl,
    },
    created() {
        this.fetchRoomDevices();
    },
    methods: {
        fetchRoomDevices() {
            fetch('http://localhost:8080/rooms/1')
                .then(response => response.json())
                .then(data => {
                    this.roomDevices = data.devices;
                    this.dehumidifiers = this.roomDevices.filter(device => device.type === '除濕機');
                    this.lights = this.roomDevices.filter(device => device.type === '燈');
                    this.airPurifiers = this.roomDevices.filter(device => device.type === '空氣清淨機');
                    this.airConditioners = this.roomDevices.filter(device => device.type === '冷氣機');
                    // 更新除濕機和燈光的狀態
                    this.$nextTick(() => {
                        // 更新除濕機的狀態
                        // if (this.dehumidifiers.length > 0) {
                        //     this.$refs.dehumidifierControl.updateCurrentHumidity(this.dehumidifiers[0].dehumidifier.current_humidity);
                        // }
                        // 更新燈光的狀態
                        // if (this.lights.length > 0) {
                        //     this.$refs.lampControl.updateLightStatus(this.lights[0].light);
                        // }
                    });
                })
                .catch(error => console.error('獲取房間設備失敗：', error));
        },
        updateDehumidifiers(newSettings) {
            console.log('接收到的 newSettings:', newSettings, 'target_humidity type:', typeof newSettings.target_humidity);

            const payload = this.dehumidifiers.map(dehumidifier => ({
                id: dehumidifier.id,
                status: newSettings.status,
                target_humidity: parseFloat(newSettings.target_humidity.toFixed(1)),
                fan_speed: newSettings.fan_speed
            }));

            console.log('準備發送的 payload:', payload);

            const requestBody = JSON.stringify(payload);
            console.log('最終的 API 請求體字符串:', requestBody);

            fetch('http://localhost:8080/dehumidifiers/batch', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('除濕機設置已更新', data);
                    this.fetchRoomDevices();
                })
                .catch(error => {
                    console.error('更新除濕機設置失敗：', error);
                    alert('更新除濕機設置失敗，請稍後再試。');
                });
        },
        updateLights(newSettings) {
            const payload = this.lights.map(light => ({
                id: light.id,
                status: newSettings.status ? 1 : 0,
                brightness: newSettings.brightness,
                color_temp: newSettings.color_temp
            }));

            console.log('準備發送的 payload:', payload);

            const requestBody = JSON.stringify(payload);
            console.log('最終的 API 請求體字符串:', requestBody);

            fetch('http://localhost:8080/lights/batch', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('燈光設置已更新', data);
                    this.fetchRoomDevices();
                })
                .catch(error => {
                    console.error('更新燈光設置失敗：', error);
                    alert('更新燈光設置失敗，請稍後再試。');
                });
        },
        updateAirPurifiers(newSettings) {
            const payload = this.airPurifiers.map(airPurifier => ({
                id: airPurifier.id,
                status: newSettings.status ? 1 : 0,
                fan_speed: newSettings.fan_speed
            }));

            console.log('準備發送的 payload:', payload);

            const requestBody = JSON.stringify(payload);
            console.log('最終的 API 請求體字符串:', requestBody);

            fetch('http://localhost:8080/air-purifiers/batch', {
                method: 'PATCH',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('空氣清淨機設置已更新', data);
                    this.fetchRoomDevices();
                })
                .catch(error => {
                    console.error('更新空氣清淨機設置失敗：', error);
                    alert(`更新空氣清淨機設置失敗：${error.message}`);
                });
        },
        updateAirConditioners(newSettings) {
            const payload = this.airConditioners.map(ac => ({
                id: ac.id,
                status: newSettings.status ? 1 : 0,
                fan_speed: newSettings.fan_speed,
                mode: newSettings.mode,
                target_temp: newSettings.target_temp
            }));

            console.log('準備發送的 payload:', payload);

            const requestBody = JSON.stringify(payload);
            console.log('最終的 API 請求體字符串:', requestBody);

            fetch('http://localhost:8080/air-conditioners/batch', {
                method: 'PATCH',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('冷氣機設置已更新', data);
                    this.fetchRoomDevices();
                })
                .catch(error => {
                    console.error('更新冷氣機設置失敗：', error);
                    alert('更新冷氣機設置失敗，請稍後再試。');
                });
        },
        selectDeviceType(type) {
            this.selectedDeviceType = type;
            this.startResetTimer();
        },
        resetToAnnouncement() {
            this.selectedDeviceType = 'Announcement';
        },
        startResetTimer() {
            // 清除現有的計時器
            if (this.resetTimer) {
                clearTimeout(this.resetTimer);
            }

            // 設置新的計時器，3分鐘後重置為公告
            this.resetTimer = setTimeout(() => {
                this.resetToAnnouncement();
            }, 3 * 60 * 1000); // 3分鐘
        },
    },
    beforeUnmount() {
        if (this.resetTimer) {
            clearTimeout(this.resetTimer);
        }
    },
};
</script>

<template>
    <div class="up">
        <component :is="selectedDeviceType" :key="selectedDeviceType" :airConditioners="airConditioners"
            :lights="lights" :airPurifiers="airPurifiers" :dehumidifiers="dehumidifiers"
            @update-air-conditioners="updateAirConditioners" @update-lights="updateLights"
            @update-air-purifiers="updateAirPurifiers" @update-dehumidifiers="updateDehumidifiers" />
        <ElectricityConsumptionData/>
    </div>
    <div class="right">
        <EnvironmentalData />
    </div>
    <div class="middle">
        <EnvironmentalDataDisplay />
    </div>
    <div class="down">
        <DeviceCell @select-device="selectDeviceType" />
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.up {
    display: flex;
    justify-content: space-between;
    height: 40%;
    padding: 33px 50px 19px 50px;
    position: relative; // 添加相對定位
}

.right {
    position: absolute;
    left: 605px;
    top: 32px;
    width: 300px;
    height: 270px;
}

.middle {
    display: flex;
    justify-content: space-between;
    height: 15%;
    padding: 0 50px 0 50px;
}

.down {
    width: 957px;
    height: 31%;
    padding: 19px 50px 20px 50px;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
        height: 10px;
    }

    &::-webkit-scrollbar-button {
        background: transparent;
        width: 55px;
    }

    &::-webkit-scrollbar-thumb {
        background: $black1;
        border-radius: 15px;

    }

    &::-webkit-scrollbar-track {
        background: $dark01;
        border-radius: 15px;
        width: 957px;
    }
}
</style>