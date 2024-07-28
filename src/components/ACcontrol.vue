<!-- 前台-首頁-左上角公告-元件 -->
<script>
import Switch from '@/components/Switch.vue';

export default {
    props: {
        airConditioners: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            status: false,
            current_temp: 0.0,
            target_temp: 27.0,
            mode: 'COOL',
            fan_speed: 'LOW',
        };
    },
    components: {
        Switch,
    },
    computed: {
        firstAC() {
            return this.airConditioners[0] || {};
        }
    },
    watch: {
        airConditioners: {
            immediate: true,
            handler() {
                this.updateData();
            }
        }
    },
    methods: {
        updateData() {
            if (this.firstAC.airConditioner) {
                this.status = this.firstAC.status;
                this.current_temp = this.firstAC.airConditioner.current_temp;
                this.target_temp = this.firstAC.airConditioner.target_temp;
                this.mode = this.firstAC.airConditioner.mode;
                this.fan_speed = this.firstAC.airConditioner.fanSpeed;
            }
        },
        setMode(mode) {
            this.mode = mode;
            this.emitUpdate();
        },
        setFanSpeed(speed) {
            this.fan_speed = speed;
            this.emitUpdate();
        },
        increaseTemp() {
            this.target_temp = Math.min(parseFloat((this.target_temp + 1).toFixed(1)), 30);
            this.emitUpdate();
        },
        decreaseTemp() {
            this.target_temp = Math.max(parseFloat((this.target_temp - 1).toFixed(1)), 16);
            this.emitUpdate();
        },
        updateDeviceStatus(status) {
            this.status = status;
            this.emitUpdate();
        },
        emitUpdate() {
            const updatedData = {
                status: this.status,
                target_temp: this.target_temp,
                mode: this.mode,
                fan_speed: this.fan_speed,
            };
            this.$emit('update-air-conditioners', updatedData);
        },
    }
};
</script>

<template>
    <div class="outArea">
        <div class="switch">
            <Switch v-model:checked="status" @update:checked="updateDeviceStatus" />
        </div>
        <div class="left">
            <i class="fa-regular fa-snowflake"></i>
            <p>冷氣機</p>
        </div>
        <div class="right">
            <div class="rightUp">
                <p class="id">總控台</p>
            </div>
            <div class="rightDown">
                <div class="rightDownLeft">
                    <div class="target_temp">
                        <span>模式</span>
                        <div @click="setMode('COOL')" :class="{ selected: mode === 'COOL' }">
                            <i class="fa-regular fa-snowflake"></i>
                            <p>冷氣</p>
                        </div>
                        <div @click="setMode('HEAT')" :class="{ selected: mode === 'HEAT' }">
                            <i class="fa-solid fa-temperature-arrow-up"></i>
                            <p>暖氣</p>
                        </div>
                        <div @click="setMode('FAN')" :class="{ selected: mode === 'FAN' }">
                            <i class="fa-solid fa-fan"></i>
                            <p>送風</p>
                        </div>
                    </div>
                    <div class="fan_speed target_temp">
                        <span>風量</span>
                        <div @click="setFanSpeed('AUTO')" :class="{ selected: fan_speed === 'AUTO' }">
                            <i class="fa-solid fa-a"></i>
                            <p v-show="fan_speed === 'AUTO'">自動</p>
                        </div>
                        <div @click="setFanSpeed('LOW')" :class="{ selected: fan_speed === 'LOW' }">
                            <i class="fa-solid fa-wind"></i>
                            <p v-show="fan_speed === 'LOW'">低</p>
                        </div>
                        <div @click="setFanSpeed('MEDIUM')" :class="{ selected: fan_speed === 'MEDIUM' }">
                            <i class="fa-solid fa-wind"></i>
                            <p v-show="fan_speed === 'MEDIUM'">中</p>
                        </div>
                        <div @click="setFanSpeed('HIGH')" :class="{ selected: fan_speed === 'HIGH' }">
                            <i class="fa-solid fa-wind"></i>
                            <p v-show="fan_speed === 'HIGH'">高</p>
                        </div>
                    </div>
                </div>
                <div class="rightDownRight">
                    <span>溫度</span>
                    <div class="mode">
                        <i class="fa-solid fa-caret-up" @click="increaseTemp"></i>
                        <p>{{ target_temp.toFixed(1) }}˚C</p>
                        <i class="fa-solid fa-caret-down" @click="decreaseTemp"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';


.outArea {
    width: 541px;
    height: 268px;
    border-radius: 25px;
    // border: 1px solid black;
    background-color: $black;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    padding-top: 13px;
    position: relative;

    .switch {
        position: absolute;
        right: 24px;
        top: 15px;

        :deep(input[type="checkbox"]) {
            display: none;
        }
    }

    .left {
        height: 100%;
        width: 30%;
        text-align: center;

        i {
            font-size: 80px;
            color: $dark01;
            margin-top: 75px;
        }

        p {
            font-size: 20px;
            margin-top: 10px;
            color: $black1;
        }
    }

    .right {
        height: 100%;
        width: 70%;

        // border: 1px solid black;
        p {
            margin: 10px 0 20px 5px;
            font-size: 16px;
        }

        .rightUp {
            width: 100%;
            color: $black1;
        }

        .rightDown {
            width: 100%;
            display: flex;

            // border: 1px solid black;
            .rightDownLeft {
                height: 100%;
                width: 65%;

                // border: 1px solid black;
                .target_temp {
                    width: 234px;
                    height: 92px;
                    border-radius: 15px;
                    background-color: $dark01;
                    display: flex;
                    justify-content: space-evenly;
                    position: relative;

                    span {
                        position: absolute;
                        color: $black1;
                    }

                    i {
                        font-size: 25px;
                        color: $black;
                        cursor: pointer;
                    }

                    p {
                        margin: 0;
                        color: $black;
                        cursor: pointer;
                    }

                    div {
                        width: 33px;
                        margin-top: 35px;
                        text-align: center;

                    }
                }

                .selected {
                    i {
                        color: $black1;
                    }

                    p {
                        color: $black1;
                    }
                }

                .fan_speed {
                    margin-top: 10px;
                }
            }

            .rightDownRight {
                width: 110px;
                height: 194px;
                border-radius: 15px;
                background-color: $dark01;
                text-align: center;
                position: relative;

                span {
                    position: absolute;
                    color: $black1;
                    left: 39px;
                    top: 10px;
                }

                .mode {
                    padding-top: 55px;
                    color: $black1;

                    i {
                        font-size: 25px;
                        cursor: pointer;
                    }

                    p {
                        font-size: 35px;
                        margin: 0;
                        margin-bottom: 10px;
                    }
                }
            }

        }
    }


}
</style>