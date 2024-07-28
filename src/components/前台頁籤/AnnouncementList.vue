<!-- 前台-通知訊息-頁面 -->
<script>
import AnnouncementSearch from '@/components/AnnouncementSearch.vue';

export default {
    data() {
        return {
            annArr: [],
            expandedIndex: null // 追蹤當前展開的公告索引
        };
    },
    components: {
        AnnouncementSearch,
    },
    computed: {
        //用來隱藏超出指定長度的公告內容
        truncatedContent() {
            return this.annArr.map(data => {
                return {
                    ...data,
                    truncatedContent: data.content.length > 38 ? data.content.slice(0, 38) + '...' : data.content
                };
            });
        }
    },
    methods: {
        async fetchAnnouncements() {
            try {
                const response = await fetch('http://localhost:8080/announcements/1', {
                    method: 'GET',
                    headers: {
                        'Accept': '*/*'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
                }
                const data = await response.json();
                // 對公告按發布時間進行排序，最新的在前
                this.annArr = data.sort((a, b) => {
                    const dateA = new Date(a.publishTime);
                    const dateB = new Date(b.publishTime);
                    return dateB - dateA;
                }).map(item => ({
                    ...item,
                    expanded: false,
                    time: item.publishTime
                }));
            } catch (error) {
                console.error('獲取公告時出錯：', error);
            }
        },
        // 只允許一個公告展開
        toggleContent(index) {
            if (this.expandedIndex === index) {
                this.expandedIndex = null;
            } else {
                this.expandedIndex = index;
            }
        },
        handleSearchResults(filteredAnnouncements) {
            this.annArr = filteredAnnouncements.map(item => ({
                ...item,
                expanded: false,
                time: item.publishTime
            }));
        }
    },
    mounted() {
        this.fetchAnnouncements();
    }
};
</script>

<template>
    <div class="down">
        <div class="announcementSearch">
            <AnnouncementSearch @search-results="handleSearchResults" />
        </div>
        <div class="outArea">
            <h2>公告</h2>
            <div class="list">
                <div class="content" v-for="(data, index) in truncatedContent" :key="data.id"
                    @click="data.content.length > 38 ? toggleContent(index) : null"
                    :class="{ expanded: expandedIndex === index, 'no-transition': expandedIndex !== index }">
                    <div class="up">
                        <span>{{ data.title }}</span>
                        <p class="date">{{ data.time }}</p>
                    </div>
                    <p>{{ expandedIndex === index ? data.content : data.truncatedContent }}</p>
                    <div class="red"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.down {
    width: 900px;
    height: 650px;
    padding: 41px 0px 16px 80px;

    .announcementSearch {
        padding-left: 128px;
    }

    .outArea {
        border-radius: 25px;
        height: 594px;
        border: 2px solid $white;
        // background-color: $dark02;
        display: flex;
        justify-content: space-between;
        padding-top: 10px;

        h2 {
            margin: 12px 0 0 30px;
        }

        .list {
            flex-wrap: nowrap;
            overflow-y: auto;
            margin-right: 30px;

            &::-webkit-scrollbar {
                width: 10px;

            }

            &::-webkit-scrollbar-button {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: $dark03;
                border-radius: 15px;

            }

            &::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 15px;
                width: 957px;
            }

            .content {
                position: relative;
                width: 685px;
                border-radius: 20px;
                padding: 10px;
                padding-left: 20px;
                overflow-y: hidden;
                background-color: $white;
                margin: 10px 15px;
                flex: 0 0 auto;
                /* 确保每个项目不会缩小并且保持其内容的宽度 */
                margin-top: 10px;
                /* 可选的间距 */
                cursor: pointer; // 所有公告都使用 pointer 游標樣式
                transition: none; // 移除默認過渡
                overflow: hidden;
                max-height: 58px;
                padding-top: 10px;
                padding-bottom: 10px;
                box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);

                /* 初始高度，取决于你希望显示的截断内容的高度 */
                &.expanded {
                    transition: max-height 0.3s ease, padding 0.3s ease; // 只在展開時添加過渡
                    max-height: 500px;
                    /* 展开后的高度，可以根据内容长度调整 */
                    padding-top: 20px; // 新增：展開時增加上下內邊距
                    padding-bottom: 20px;
                }

                &.no-transition {
                    transition: none !important; // 確保未展開的元素沒有過渡效果
                }

                .up {
                    display: flex;
                    justify-content: space-between;
                    padding-right: 10px;
                }

                span {
                    font-size: 16px;
                    font-weight: 600;
                    margin-left: 10px;
                    color: $dark03;
                }

                p {
                    margin-top: 5px;
                    font-size: 14px;
                    margin-left: 10px;
                    color: $dark03;
                }

                .red {
                    position: absolute;
                    left: 12px;
                    top: 18px;
                    width: 9px;
                    height: 9px;
                    border-radius: 5px;
                    background-color: red;
                }
            }
        }
    }
}
</style>