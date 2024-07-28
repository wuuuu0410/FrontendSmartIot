<!-- 前台-公告列表搜尋-元件 -->
<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    data() {
        return {
            searchObj: {
                title: "",
                dateRange: null,
            }
        };
    },
    components: {
        VueDatePicker,
    },
    watch: {
        searchObj: {
            handler() {
                this.searchAnnouncements();
                this.searchAllAnnouncements();
            },
            deep: true,
            
        }
    },
    methods: {
        searchAnnouncements() {
            fetch('http://localhost:8080/announcements/1')
                .then(response => response.json())
                .then(data => {
                    let filteredAnnouncements = data.filter(announcement => {
                        const titleMatch = this.searchObj.title === "" || announcement.title.includes(this.searchObj.title);
                        const dateMatch = !this.searchObj.dateRange || this.isDateInRange(announcement.publishTime, this.searchObj.dateRange);
                        return titleMatch && dateMatch;
                    });
                    this.$emit('search-results', filteredAnnouncements);
                })
                .catch(error => console.error('搜尋公告失敗：', error));
        },
        isDateInRange(date, range) {
            if (!range || !range[0] || !range[1]) return true;
            const publishDate = new Date(date);
            return publishDate >= range[0] && publishDate <= range[1];
        },
        searchAllAnnouncements() {
            fetch('http://localhost:8080/announcements')
                .then(response => response.json())
                .then(data => {
                    let filteredAllAnnouncements = data.filter(announcement => {
                        const titleMatch = this.searchObj.title === "" || announcement.title.includes(this.searchObj.title);
                        const dateMatch = !this.searchObj.dateRange || this.isDateInRange(announcement.publishTime, this.searchObj.dateRange);
                        return titleMatch && dateMatch;
                    });
                    this.$emit('search', filteredAllAnnouncements);
                })
                .catch(error => console.error('搜尋公告失敗：', error));
        },
    },
    props:[
        "searchTrue"
    ]
};
</script>

<template>
    <div class="search_big_area">
        <div class="left">
            <div class="name">
                <input type="text" v-model="searchObj.title" placeholder="公告名稱">
            </div>
            <div class="start_date">
                <VueDatePicker v-model="searchObj.dateRange" range format="yyyy-MM-dd" style="width: 260px" />
            </div>
            <button v-if="searchTrue" class="seach_list" @click="searchAllAnnouncements">搜尋</button>
            <button v-else class="seach_list" @click="searchAnnouncements">搜尋</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.search_big_area {
    width: 800px;
    display: flex;
    align-items: center;
    padding-bottom: 15px;

    .left {
        display: flex;

        .name {
            input {
                width: 110px;
                height: 40px;
                border-radius: 35px;
                padding-left: 20px;
                padding-right: 10px;
                font-size: 16px;
                color: $black1;
                background-color: $white;
                border: 0;
                outline: none;
                line-height: 40px;
                box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
            }

            ::placeholder {
                color: $black1;
            }
        }
        .seach_list {
            width: 88px;
            height: 40px;
            border-radius: 35px;
            border: 0;
            margin-left: 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: $white;
            color: $black1;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
        }
    }
}

.start_date {
    margin-left: 20px;
    width: 260px;
    border-radius: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $white;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    // .left {
    //     display: flex;

    //     .name {
    //         input {
    //             width: 110px;
    //             height: 40px;
    //             border-radius: 35px;
    //             padding-left: 20px;
    //             padding-right: 10px;
    //             font-size: 16px;
    //             color: $white;
    //             background-color: $white;
    //             color: $black1;
    //             line-height: 40px;
    //         }
    //     }

    //     .start_date {
    //         margin-left: 20px;
    //         width: 260px;
    //         border-radius: 35px;
    //         display: flex;
    //         justify-content: center;
    //         align-items: center;
    //         background-color: $white;

            // i {
            //     position: absolute;
            //     right: 10px;
            //     top: 50%;
            //     transform: translateY(-50%);
            //     width: 20px;
            //     height: 20px;
            //     color: $white;
            //     background: transparent; /* 自定义图标颜色 */
            //     pointer-events: none;
            // }
            // .date{
            //     width: 150px;
            //     height: 35px;
            //     border-radius: 30px;
            //     padding-left: 9px;
            //     padding-right: 10px;
            //     color: $white;
            //     background-color: $dark02;
            //     border: 0;
            //     outline:none;
            // }
            // ::-webkit-calendar-picker-indicator {
            //     opacity: 0; /* 圖示設為透明 */
            // }
        
}
</style>