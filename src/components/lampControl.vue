<!-- 前台-首頁-左上角公告-元件 -->
<script>
import Switch from '@/components/Switch.vue';

export default {
    props: {
        lights: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            name: "總控台",
            type: "燈",
            brightness: 50,
            color_temp: 5000,
            status: false,
        };
    },
    components: {
        Switch,
    },
    methods: {
        updateLights() {
            this.$emit('update-lights', {
                status: this.status,
                brightness: this.brightness,
                color_temp: this.color_temp
            });
        },
        updateStatus(status) {
            this.status = status;
            if (status) {
                this.brightness = 100;
            } else {
                this.brightness = 0;
            }
            this.updateLights();
        }
    },
    watch: {
        brightness() {
            this.updateLights();
        },
        color_temp() {
            this.updateLights();
        }
    },
    mounted() {
        if (this.lights.length > 0) {
            const firstLight = this.lights[0].light;
            this.brightness = firstLight.brightness;
            this.color_temp = firstLight.color_temp;
            this.status = this.lights[0].status;
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
            <i class="fa-regular fa-lightbulb"></i>
            <p>{{ this.type }}</p>
        </div>
        <div class="right">
            <div class="rightUp">
                <p class="id">{{ name }}</p>
            </div>
            <div class="rightDown">
                <div class="target_temp">
                    <div class="brightness">
                        <span>{{ brightness }} %</span>
                        <p>亮度</p>
                    </div>
                    <div class="color_temp">
                        <span>{{ color_temp }}K</span>
                        <p>色溫</p>
                    </div>
                </div>
                <div class="brightnessRange">
                    <p>亮度</p>
                    <input type="range" min="0" max="100" v-model.number="brightness">
                </div>
                <div class="color_tempRange">
                    <p>色溫</p>
                    <input type="range" min="1000" max="10000" step="100" v-model.number="color_temp">
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

            // border: 1px solid black;
            .target_temp {
                width: 360px;
                height: 80px;
                border-radius: 15px;
                background-color: $dark01;
                display: flex;
                justify-content: space-evenly;
                padding-top: 20px;

                p {
                    margin: 0;
                    color: $black1;
                }

                span {
                    font-size: 25px;
                    color: $black1;
                }

                .brightness {
                    width: 180px;
                    height: 59px;
                    border-right: 1px solid $black1;
                    text-align: center;
                }

                .color_temp {
                    width: 180px;
                    text-align: center;

                }

            }

            .brightnessRange {
                width: 360px;
                height: 30px;
                border-radius: 15px;
                background-color: $dark01;
                margin-top: 20px;
                display: flex;

                input {
                    width: 290px;
                    margin-left: 12px;
                }

                p {
                    margin: 0;
                    line-height: 30px;
                    margin-left: 10px;
                    color: $black1;
                    
                }

            }

            .color_tempRange {
                width: 360px;
                height: 30px;
                border-radius: 15px;
                background-color: $dark01;
                margin-top: 10px;
                display: flex;

                input {
                    width: 290px;
                    margin-left: 12px;
                }

                p {
                    margin: 0;
                    line-height: 30px;
                    margin-left: 10px;
                    color: $black1;
                }
            }


        }
    }


}
</style>