<!-- 前台-首頁-左上角公告-元件 -->
<script>
import Switch from '@/components/Switch.vue';

export default {
    props: {
        dehumidifiers: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            status: false,
            current_humidity: 0.0,
            target_humidity: 55.0,
            fan_speed: "MEDIUM",
        };
    },
    components: {
        Switch,
    },
    computed: {
        firstDehumidifier() {
            return this.dehumidifiers[0] || {};
        }
    },
    watch: {
        dehumidifiers: {
            immediate: true,
            handler() {
                this.updateData();
            }
        }
    },
    methods: {
        updateData() {
            if (this.firstDehumidifier.dehumidifier) {
                this.status = this.firstDehumidifier.status;
                this.current_humidity = this.firstDehumidifier.dehumidifier.current_humidity;
                this.target_humidity = this.firstDehumidifier.dehumidifier.target_humidity;
                this.fan_speed = this.firstDehumidifier.dehumidifier.fanSpeed;
            }
        },
        setFanSpeed(speed) {
            this.fan_speed = speed;
            this.emitUpdate();
        },
        increaseHumidity() {
            this.target_humidity = Math.min(parseFloat((this.target_humidity + 1).toFixed(1)), 100);
            this.emitUpdate();
        },
        decreaseHumidity() {
            this.target_humidity = Math.max(parseFloat((this.target_humidity - 1).toFixed(1)), 0);
            this.emitUpdate();
        },
        updateDeviceStatus(status) {
            this.status = status;
            this.emitUpdate();
        },
        emitUpdate() {
            const updatedData = {
                status: this.status,
                target_humidity: parseFloat(this.target_humidity.toFixed(1)),
                fan_speed: this.fan_speed,
            };
            this.$emit('update-dehumidifiers', updatedData);
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
            <i class="fa-solid fa-droplet-slash"></i>
            <p>除濕機</p>
        </div>
        <div class="right">
            <div class="rightUp">
                <p class="id">總控台</p>
            </div>
            <div class="rightDown">
                <div class="rightDownLeft">
                    <div class="target_temp">
                        <span>當前濕度</span>
                        <div class="time">
                            <i class="fa-solid fa-droplet"></i>
                            <p>{{ current_humidity.toFixed(1) }}</p>
                            <p>%</p>
                        </div>
                    </div>
                    <div class="fan_speed target_temp">
                        <span>風量</span>
                        <div @click="setFanSpeed('AUTO')" :class="{ selected: fan_speed === 'AUTO' }">
                            <i class="fa-solid fa-a"></i>
                            <p>{{ fan_speed === 'AUTO' ? '自動' : '' }}</p>
                        </div>
                        <div @click="setFanSpeed('LOW')" :class="{ selected: fan_speed === 'LOW' }">
                            <i class="fa-solid fa-wind"></i>
                            <p>{{ fan_speed === 'LOW' ? '低' : '' }}</p>
                        </div>
                        <div @click="setFanSpeed('MEDIUM')" :class="{ selected: fan_speed === 'MEDIUM' }">
                            <i class="fa-solid fa-wind"></i>
                            <p>{{ fan_speed === 'MEDIUM' ? '中' : '' }}</p>
                        </div>
                        <div @click="setFanSpeed('HIGH')" :class="{ selected: fan_speed === 'HIGH' }">
                            <i class="fa-solid fa-wind"></i>
                            <p>{{ fan_speed === 'HIGH' ? '高' : '' }}</p>
                        </div>
                    </div>
                </div>
                <div class="rightDownRight">
                    <span>目標濕度</span>
                    <div class="mode">
                        <i class="fa-solid fa-caret-up" @click="increaseHumidity"></i>
                        <p>{{ target_humidity.toFixed(1) }}%</p>
                        <i class="fa-solid fa-caret-down" @click="decreaseHumidity"></i>
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
                        cursor: pointer;
                    }

                    .time {
                        display: flex;
                        height: 30px;
                        width: 100%;
                        margin-left: 65px;

                        p {
                            line-height: 30px;
                            margin-left: 10px;
                            font-size: 27px;
                            color: $black1;
                            cursor: default;
                            transition: opacity 0.3s;
                        }

                        i {
                            font-size: 25px;
                            line-height: 34px;
                            color: $black1;
                            margin-right: 10px;
                            cursor: default;
                        }
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
                    left: 21px;
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