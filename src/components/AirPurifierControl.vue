<!-- 前台-首頁-左上角公告-元件 -->
<script>
import Switch from '@/components/Switch.vue';

export default {
    props: {
        airPurifiers: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            name: "總控台",
            type: "空氣清淨機",
            fan_speed: 50,
            air_quality: 0,
            operating_time: 0,
            status: false,
        };
    },
    components: {
        Switch,
    },
    methods: {
        updateAirPurifiers() {
            this.$emit('update-air-purifiers', {
                status: this.status,
                fan_speed: this.fan_speed
            });
        },
        updateStatus(status) {
            this.status = status;
            this.updateAirPurifiers();
        },
        setFanSpeed(speed) {
            const speedMap = { '自動': 25, '低': 50, '中': 75, '高': 100 };
            this.fan_speed = speedMap[speed];
            this.updateAirPurifiers();
        },
        getFanSpeedText(speed) {
            if (speed <= 25) return '自動';
            if (speed <= 50) return '低';
            if (speed <= 75) return '中';
            return '高';
        }
    },
    mounted() {
        if (this.airPurifiers.length > 0) {
            const firstAirPurifier = this.airPurifiers[0];
            this.fan_speed = firstAirPurifier.airPurifier.fan_speed;
            this.air_quality = firstAirPurifier.airPurifier.air_quality;
            this.operating_time = firstAirPurifier.airPurifier.operating_time;
            this.status = firstAirPurifier.status;
        }
    }
};
</script>

<template>
    <div class="outArea">
        <div class="switch">
            <Switch :id="0" v-model:checked="status" @update:checked="updateStatus" />
        </div>
        <div class="left">
            <i class="fa-solid fa-leaf"></i>
            <p>{{ this.type }}</p>
        </div>
        <div class="right">
            <div class="rightUp">
                <p class="id">{{ name }}</p>
            </div>
            <div class="rightDown">
                <div class="rightDownLeft">
                    <div class="target_temp">
                        <span>運轉時間</span>
                        <div class="time">
                            <i class="fa-regular fa-clock"></i>
                            <p>{{ operating_time.toFixed(2) }}</p>
                            <p>小時</p>
                        </div>
                    </div>
                    <div class="fan_speed target_temp">
                        <span>風量</span>
                        <div @click="setFanSpeed('自動')" :class="{ selected: fan_speed <= 25 }">
                            <i class="fa-solid fa-a"></i>
                            <p v-show="fan_speed <= 25">自動</p>
                        </div>
                        <div @click="setFanSpeed('低')" :class="{ selected: fan_speed > 25 && fan_speed <= 50 }">
                            <i class="fa-solid fa-wind"> </i>
                            <p v-show="fan_speed > 25 && fan_speed <= 50">低</p>
                        </div>
                        <div @click="setFanSpeed('中')" :class="{ selected: fan_speed > 50 && fan_speed <= 75 }">
                            <i class="fa-solid fa-wind"></i>
                            <p v-show="fan_speed > 50 && fan_speed <= 75">中</p>
                        </div>
                        <div @click="setFanSpeed('高')" :class="{ selected: fan_speed > 75 }">
                            <i class="fa-solid fa-wind"></i>
                            <p v-show="fan_speed > 75">高</p>
                        </div>
                    </div>
                </div>
                <div class="rightDownRight">
                    <span>當前<br>空氣品質</span>
                    <div class="mode">
                        <p>{{ air_quality }}</p>
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

                    .time {
                        display: flex;
                        height: 30px;
                        width: 100%;
                        margin-left: 45px;

                        p {
                            line-height: 30px;
                            margin-left: 10px;
                            font-size: 22px;
                            color: $black1;
                            cursor: default;
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
                    left: 23px;
                    top: 10px;
                }

                .mode {
                    padding-top: 55px;
                    color: $black1;

                    p {
                        font-size: 38px;
                        margin: 0;
                        margin-top: 27px;
                    }
                }
            }

        }
    }


}
</style>