<!-- 前台-首頁-左上角公告-元件 -->
<script>
//sweetalert2提示窗套件
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            annArr: []
        };
    },
    computed: {
        //用來隱藏超出指定長度的公告內容
        truncatedContent() {
            return this.annArr.map(data => ({
                ...data,
                truncatedContent: data.content.length > 19 ? data.content.slice(0, 19) + '...' : data.content
            }));
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
                let announcements = await response.json();

                // 對公告按發布時間進行排序，最新的在前
                this.annArr = announcements.sort((a, b) => {
                    const dateA = new Date(a.publishTime);
                    const dateB = new Date(b.publishTime);
                    return dateB - dateA;
                });
            } catch (error) {
                console.error('獲取公告時出錯：', error);
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: '無法獲取公告，請稍後再試。'
                });
            }
        },
        //點擊切換expanded的ture/false屬性
        // toggleContent(index) {
        // this.annArr[index].expanded = !this.annArr[index].expanded;
        // }
        toggleContent(index) {
            const announcement = this.annArr[index];
            Swal.fire({
                title: announcement.title,
                html: `<p><strong>公告時間：</strong>${announcement.publishTime}</p><p>${announcement.content}</p>`,
                // text: announcement.content,
                showCloseButton: true,
                showConfirmButton: false,  //隱藏下方ok按鈕
                // confirmButtonText: 'OK',
                customClass: {
                    popup: 'swal2-custom-popup', // 可以自定義樣式
                }
            });
        }
    },
    mounted() {
        this.fetchAnnouncements();
    }

};
</script>

<template>
    <div class="outArea">
        <h2>公告</h2>
        <div class="list">
            <div class="content" v-for="(data, index) in truncatedContent" :key="index" @click="toggleContent(index)">
                <span>{{ data.title }}</span>
                <p>{{ annArr[index].expanded ? data.content : data.truncatedContent }}</p>
                <div class="red"></div>
                <!-- <p>{{ data.truncatedContent }}</p> -->
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
    background-color: $dark01;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    padding-top: 10px;

    h2 {
        margin: 12px 0 0 30px;
        color: $dark03;
    }

    .list {
        flex-wrap: nowrap;
        overflow-y: auto;
        margin-right: 10px;

        &::-webkit-scrollbar {
            width: 9px;

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

        .content{
            position: relative;
            width: 335px;
            border-radius: 20px;
            padding: 8px 17px 0 33px;
            overflow-y: hidden;
            background-color: $white;
            margin: 10px 15px;
            flex: 0 0 auto;
            /* 确保每个项目不会缩小并且保持其内容的宽度 */
            margin-top: 10px;
            /* 可选的间距 */
            //以下為點擊個別公告會展開的參數
            cursor: pointer;
            transition: max-height 1s ease;
            overflow: hidden;
            max-height: 58px;

            /* 初始高度，取决于你希望显示的截断内容的高度 */
            &.expanded {
                max-height: 500px;
                /* 展开后的高度，可以根据内容长度调整 */
            }

            span {
                font-size: 16px;
                font-weight: 600;
                color: $black1;
            }

            p {
                margin-bottom: 7px;
                font-size: 14px;
                color: $black1;
            }
            .red{
                position: absolute;
                left: 14px;
                top: 16px;
                width: 9px;
                height: 9px;
                border-radius: 10px;
                background-color: rgb(255, 99, 15);
            }
        }
    }
}
</style>