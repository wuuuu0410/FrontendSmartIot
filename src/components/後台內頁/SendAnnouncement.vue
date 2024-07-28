<script>
//以下為PINIA
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
//sweetalert2提示窗套件
import Swal from 'sweetalert2'
//以下為元件
import CreateAndDeleteButton from '@/components/CreateAndDeleteButton.vue';
import SearchAddRoom from '@/components/SearchAddRoom.vue';
import AnnouncementSearch from '@/components/AnnouncementSearch.vue';


export default {
    data() {
        return {
            // annArr:[{id:1,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合因近期果蠅眾多，營運團隊將進行場毒，以下是相關安排和注意事項，請大家務必配合因近期果蠅眾多，營運團隊將進行場毒，以下是相關安排和注意事項，請大家務必配合因近期果蠅眾多，營運團隊將進行場毒，以下是相關安排和注意事項，請大家務必配合因近期果蠅眾多，營運團隊將進行場毒，以下是相關安排和注意事項，請大家務必配合因近期果蠅眾多，營運團隊將進行場毒，以下是相關安排和注意事項，請大家務必配合因近期果蠅眾多，營運團隊將進行場",time:"2024-06-03",expanded: false},{id:2,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false},{id:3,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false},{id:4,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false},{id:5,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false},{id:6,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false},{id:7,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false},{id:8,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false},{id:9,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false},{id:10,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false},{id:11,title:"除果蠅公告",content:"因近期果蠅眾多，營運團隊將進行場域除蟲消毒，以下是相關安排和注意事項，請大家務必配合",time:"2024-06-03",expanded: false}],
            // sendroomARR:[{area:601,roomname:"南哥公司"},{area:602,roomname:"tta公司"},{area:603,roomname:"迪卡農公司"},{area:604,roomname:"愛迪達公司"},{area:605,roomname:"天方夜譚公司"},{area:606,roomname:"鵝你媽媽公司"},{area:607,roomname:"小小兵公司"}],
            addSendRoomARR: [{ area: 601, roomname: "南哥公司" }, { area: 602, roomname: "tta公司" }, { area: 603, roomname: "迪卡農公司" }, { area: 604, roomname: "愛迪達公司" }, { area: 605, roomname: "天方夜譚公司" }, { area: 606, roomname: "鵝你媽媽公司" }, { area: 607, roomname: "小小兵公司" }],
            showUseAdd: false, // 使用新增公告時切換搜尋欄位用
            showCheckbox: false, // 控制顯示 checkbox 的狀態
            select: [], // 儲存被選中的 id
            content: "",  //發布公告的內容
            allAnn:[],
            searchTrue:true,
            title:"",
            rooms: [],
            selectedRooms: [],
            filteredRooms: [],
            
            
        };
    },
    created() {
        // this.getAllAnn()
    },
    mounted() {
        this.fetchAnnouncements();
        this.fetchRooms();
    },
    computed: {
        ...mapState(location, ['selectedArr']),
    },
    components: {
        CreateAndDeleteButton,
        SearchAddRoom,
        AnnouncementSearch,


    },

    methods: {
        ...mapActions(location, ['getAllAnn','deleteAnn','createAnn','selectedIds']),
        async fetchAnnouncements() {
            try {
                const response = await fetch('http://localhost:8080/announcements', {
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
                this.allAnn = data.sort((a, b) => {
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
        //點擊切換expanded的ture/false屬性
        toggleContent(index) {
            this.allAnn[index].expanded = !this.allAnn[index].expanded;
        },
        // 控制顯示刪除 checkbox 的狀態
        toggleCheckbox() {
            this.allAnn.forEach(ann => {
                ann.expanded = false;
            });
            this.showUseAdd = false;
            this.showCheckbox = !this.showCheckbox;
            if (!this.showCheckbox) {
                this.showDeleteConfirmation();
            }
        },
        // 彈出 SweetAlert2 的刪除確認彈窗
        showDeleteConfirmation() {
            if (this.select.length === 0) {
                Swal.fire({
                    title: '無選取任何公告',
                    text: '請選擇至少一個公告進行刪除',
                    icon: 'info',
                    customClass: {
                        popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                    },
                });
                return;
            }
            const selectedDevices = this.allAnn.filter(ann => this.select.includes(ann.id));
            const selectedNames = selectedDevices.map(ann => `${ann.title}-${ann.time}`).join('<br>');
            Swal.fire({
                title: '確認刪除以下公告?',
                html: `<p>${selectedNames}<p>`, // 使用 html 属性
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '確認刪除',
                cancelButtonText: '取消',
                customClass: {
                    popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    // 在這裡處理確認刪除的邏輯
                    // this.allAnn = this.allAnn.filter(ann => !this.select.includes(ann.id));
                    this.deleteAnn(this.select)
                    this.fetchAnnouncements();
                    this.select = [];
                    Swal.fire({
                        title: '已刪除',
                        text: '所選公告已被刪除',
                        icon: 'success',
                        customClass: {
                            popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                        },
                    });
                } else {
                    // 在這裡處理取消刪除的邏輯
                    this.select = [];
                    this.showCheckbox = false;
                }
            });
        },
        // 將被選中的設備 ID 加入或移除 select 陣列的方法(刪除設備用)
        addToSelect(id) {
            const index = this.select.indexOf(id);
            if (index === -1) {
                this.select.push(id);
            } else {
                this.select.splice(index, 1);
            }
            console.log(this.select)
        },
        //以下三個用於切換新增公告時不同搜尋元件的切換
        showAddAnnouncement() {
            // this.showUseAdd = true;
            this.showUseAdd = !this.showUseAdd;
            this.showCheckbox = false;
            this.fetchRooms()
        },
        showSearchAnnouncement() {
            this.showCreateRoom = false;
        },
        handleSearchClick() {
            this.showCheckbox = false;
            this.showUseAdd = false;
            this.fetchRooms()
        },
        handleSearchResults(filteredAllAnnouncements) {
            this.allAnn = filteredAllAnnouncements.map(item => ({
                ...item,
                expanded: false,
                time: item.publishTime
            }));
        },
        async fetchRooms() {
            try {
                const response = await fetch('http://localhost:8080/rooms', {
                    method: 'GET',
                    headers: {
                        'Accept': '*/*'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
                }
                this.rooms = await response.json();
                this.filteredRooms = this.rooms;
            } catch (error) {
                console.error('獲取房間時出錯：', error);
            }
        },
        toggleRoomSelection(roomId) {
            const index = this.selectedRooms.indexOf(roomId);
            if (index === -1) {
                this.selectedRooms.push(roomId);
            } else {
                this.selectedRooms.splice(index, 1);
            }
        },
        async verifyX() {
            if (this.title == "" || this.content == "") {
                Swal.fire({
                    title: "新增失敗",
                    html: `<p>標題、內容不可為空</p>`,
                    // text: announcement.content,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    // confirmButtonText: 'OK',
                    icon: "error",
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/announcements', {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: this.title,
                        content: this.content,
                        roomIds: this.selectedRooms.length > 0 ? this.selectedRooms : []
                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
                }
                const result = await response.json();
                console.log('公告發送成功：', result);
                Swal.fire({
                    title: "新增成功",
                    // text: "That thing is still around?",
                    icon: "success"
                });
                this.fetchAnnouncements();
            } catch (error) {
                console.error('發送公告時出錯：', error);
                Swal.fire({
                    title: "新增失敗",
                    html: `<p>發送公告時出錯</p>`,
                    showCloseButton: true,
                    showConfirmButton: false,  //隱藏下方ok按鈕
                    icon: "error",
                    customClass: {
                        popup: 'swal2-custom-popup', // 可以自定義樣式
                    }
                });
            }
        },
        handleSearch(name, type) {
            this.filteredRooms = this.rooms.filter(room => {
                const nameMatch = !name || room.name.toLowerCase().includes(name.toLowerCase());
                const typeMatch = !type || room.type === type;
                return nameMatch && typeMatch;
            });
        },
    }
};
</script>

<template>
    <div class="outarr">
        <div class="announcementSearch">
            <SearchAddRoom v-if="this.showUseAdd" @search="handleSearch"/>
            <AnnouncementSearch v-else @search="handleSearchResults" :searchTrue="searchTrue"/>
            <div class="button">
                <button @click="handleSearchClick" :class="{ chick: !showCheckbox && !showUseAdd }"><i
                        class="fa-solid fa-magnifying-glass"></i></button>
                <button @click="toggleCheckbox" :class="{ chick: showCheckbox }"><i
                        class="fa-solid fa-trash-can"></i></button>
                <button @click="showAddAnnouncement" :class="{ chick: showUseAdd }"><i
                        class="fa-solid fa-circle-plus"></i></button>
            </div>
        </div>
        <!-- 公告發送房間 選擇加入此陣列 -->
        <div class="addSendRoomARR" v-if="this.showUseAdd">
            <p class="t">公告發送房間</p>
            <div class="outarea">
                <div 
                    v-for="room in filteredRooms" 
                    :key="room.id" 
                    class="sendroom" 
                    :class="{ selected: selectedRooms.includes(room.id) }"
                    @click="toggleRoomSelection(room.id)"
                >
                    <p>{{ room.area }}-{{ room.name }}</p>
                </div>
            </div>
        </div>
        <div class="announcementAddArea" v-if="this.showUseAdd">
            <span>公告標題</span>
            <br>
            <div class="in">
                <input type="text" class="title" v-model="this.title">
                <button class="send" @click="this.verifyX()">發送公告</button>
            </div>
            <br>
            <span>公告內容</span>
            <br>
            <textarea v-model="this.content">
            </textarea>
        </div>
        <div class="announcementListArea" v-else>
            <div class="list">
                <div class="content" v-for="(data, index) in allAnn" :key="index" @click="toggleContent(index)"
                    :class="{ expanded: allAnn[index].expanded }">
                    <div class="Modify"></div>
                    <div class="up">
                        <span>{{ data.title }}</span>
                        <p class="date">{{ data.time }}</p>
                    </div>
                    <p>{{ data.content }}</p>
                    <div class="sendrooms">
                        <p class="t">公告發送房間</p>
                        <div class="sendroom" v-for="(room, index) in data.roomInfo" :key="index">
                            <p>{{ room.area }}-{{ room.name }}</p>
                        </div>
                    </div>
                    <div class="checkbox-overlay" v-if="showCheckbox" @click="addToSelect(data.id)">
                        <input type="checkbox" :checked="select.includes(data.id)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';

.outarr {
    width: 1238px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: end;
    border-radius: 25px;
    // border: 1px solid black;
    background-color: $dark02;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);

    .announcementSearch {
        display: flex;
        justify-content: space-between;
        width: 1078px;
        height: 85px;
        background-color: $dark02;
        border-radius: 25px 25px 0 0;
        padding-top: 40px;
        padding-left: 80px;
        padding-right: 80px;

        button {
            height: 45px;
            width: 45px;
            background: $white;
            border-radius: 50%;
            border: none;
            outline: none;
            color: $dark03;
            font-size: 20px;
            line-height: 45px;
            margin-top: 12px;
            margin-left: 20px;
            cursor: pointer;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
        }

        .chick {
            color: $white;
            background: $black;
        }
    }

    .text {
        font-size: 20px;
        color: $white;
        padding-left: 10px;
        padding-bottom: 6px
    }

    .addSendRoomARR {
        width: 1100px;
        margin: 0 auto;
        margin-top: 20px;

        padding-top: 40px;
        position: relative;

        .t {
            margin: 0;
            position: absolute;
            left: 15px;
            top: 8px;
            font-size: 18px;
        }

        .outarea {
            width: 100%;
            height: 170px;
            display: flex;
            flex-wrap: wrap;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 12px;
            }

            &::-webkit-scrollbar-button {
                background: transparent;
                height: 5px;
            }

            &::-webkit-scrollbar-thumb {
                background: $black1;
                border-radius: 15px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 15px;
                width: 957px;
            }

            .sendroom {
                padding: 0 10px;
                margin-top: 10px;
                margin-right: 20px;
                width: auto;
                height: 40px;
                border-radius: 20px;
                background-color: $white;
                cursor: pointer;
                transition: background-color 0.3s;

                &.selected {
                    background-color: $dark03;
                    color: $white;
                }

                p {
                    margin: 0;
                    line-height: 40px;
                    margin: 0 10px;
                }

            }
        }
    }

    .announcementAddArea {
        border-radius: 25px;
        width: 1060px;
        height: 483px;
        border: 1px solid $white;
        padding: 20px 20px 30px 20px;
        margin: 20px auto 40px auto;

        span {
            font-size: 18px;
        }

        .in {
            width: 1020px;
            height: 40px;
            display: block;
            margin: auto;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;

            input {
                background-color: transparent;
                background-color: $white;
                outline: none;
                border-width: 0;
                padding-left: 20px;
            }

            .title {
                width: 860px;
                height: 100%;
                font-size: 18px;
                border-radius: 30px;
            }

            button {
                width: 120px;
                height: 100%;
                font-size: 18px;
                border-radius: 30px;
                cursor: pointer;
            }

            .chick {
                color: $white;
                background: $black;
            }
        }

        textarea {
            display: block;
            resize: none;
            outline: none;
            border-width: 0;
            width: 980px;
            height: 311px;
            background-color: $white;
            padding: 20px;
            font-size: 18px;
            margin: auto;
            margin-top: 10px;
            border-radius: 20px;
        }

    }

    .announcementListArea {
        border-radius: 25px;
        width: 1100px;
        height: 740px;
        border: 1px solid $dark03;
        // background-color: $dark02;
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        margin: 20px auto 20px auto;

        h2 {
            margin: 12px 0 0 30px;
        }

        .list {
            flex-wrap: nowrap;
            overflow-y: auto;
            overflow-x: hidden;

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
                width: 1000px;
                border-radius: 20px;
                padding: 10px;
                padding-top: 23px;
                overflow-y: hidden;
                background-color: $white;
                margin: 10px 20px;
                flex: 0 0 auto;
                /* 确保每个项目不会缩小并且保持其内容的宽度 */
                margin-top: 10px;
                /* 可选的间距 */
                //以下為點擊個別公告會展開的參數
                cursor: pointer;
                transition: max-height 1s ease;
                overflow: hidden;
                max-height: 75px;

                /* 初始高度，取决于你希望显示的截断内容的高度 */
                .Modify {
                    position: absolute;
                    z-index: 3;
                    left: 0;
                    bottom: 0;
                    width: 1030px;
                    height: 27px;
                    background-color: $white;
                    // background-color:aqua;
                    border-radius: 0 0 20px 20px;
                }

                &.expanded {
                    max-height: 500px;
                    /* 展开后的高度，可以根据内容长度调整 */
                }

                .date {
                    margin: 0;
                }

                .up {
                    display: flex;
                    justify-content: space-between;
                    padding-right: 42px;
                }

                span {
                    font-size: 18px;
                    font-weight: 600;
                    margin-left: 30px;
                    color: $dark03;
                }

                p {
                    margin-top: 5px;
                    font-size: 16px;
                    margin-left: 30px;
                    margin-right: 30px;
                    color: $dark03;
                }

                .sendrooms {
                    width: 950px;
                    margin: 0 auto;
                    margin-top: 30px;
                    padding-bottom: 20px;
                    padding-top: 40px;
                    border-top: 1px solid $black1;
                    display: flex;
                    flex-wrap: wrap;
                    position: relative;

                    .t {
                        margin: 0;
                        position: absolute;
                        left: 3px;
                        top: 13px;
                        color: $dark03;
                    }

                    .sendroom {
                        padding: 0 10px;
                        margin-top: 10px;
                        margin-right: 10px;
                        width: auto;
                        height: 40px;
                        border-radius: 20px;
                        background-color: $dark01;

                        p {
                            margin: 0;
                            line-height: 40px;
                            margin: 0 10px;
                            color: $dark03;
                        }

                    }
                }

                .checkbox-overlay {
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: $white;

                    input[type='checkbox'] {
                        /* 自定義 checkbox 样式 */
                        appearance: none;
                        width: 30px;
                        height: 30px;
                        border: 2px solid $white;
                        border-radius: 3px;
                        background-color: transparent;
                        cursor: pointer;
                        position: relative;

                        &:checked {
                            background-color: $black;
                            /* 勾選後的背景色 */
                        }

                        &:checked::after {
                            content: '';
                            position: absolute;
                            top: 5px;
                            left: 9px;
                            width: 6px;
                            height: 12px;
                            border: solid $white;
                            border-width: 0 2px 2px 0;
                            transform: rotate(45deg);
                        }
                    }
                }
            }
        }
    }
}
</style>