import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
// pinia用
export default defineStore("location", {
    state: () => ({
        deviceArr: [],
        roomArr: [],
        dataArr: [],
        createRoomDevice: [],
        oneRoom: {},
        localRoomId: null,
        localRoomArea: "",
        allLogs: [],
        allArea: [],
        allAnn: [],
        frontLogs: [],
        annRoom: [],
        selectedArr: [],
        selectedIds: [],
        addAllRoom: []


    }),
    getters: {
        // getDeviceArr: (state) => state.deviceArr,
        // getRoomArr: (state) => state.roomArr,
        // getDataArr: (state) => state.dataArr,
        // getLocalRoomId: (state) => state.localRoomId,
        // getLocalRoomArea: (state) => state.localRoomArea,
        // getOneRoomArr: (state) => state.oneRoom,
        // getAllLogs: (state) => state.allLogs,
    },
    actions: {
        //進入頁面搜尋全房間
        searchAllRoom() {
            fetch(`http://localhost:8080/rooms`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    console.log('搜尋房間data', data)
                    this.roomArr = data
                    this.allArea = data
                    console.log('搜尋房間roomArr', this.roomArr)
                })
        },
        //進入頁面搜尋房間id
        searchRoom(i) {
            this.localRoomId = i
            fetch(`http://localhost:8080/rooms/${i}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    console.log('搜尋房間oneRoom', data)
                    this.oneRoom = data
                    this.localRoomArea = data.area
                    console.log(this.localRoomArea)
                    this.searchDevice(null, null, this.localRoomArea, null)
                    this.searchHistory(null, null, null, null, this.localRoomArea)
                    console.log('搜尋房間oneRoom', this.oneRoom)
                })
        },
        //房間搜尋列和是否使用中
        searchOnlyRoom(i, j, k, l) {
            const params = new URLSearchParams();
            //this.name 
            if (i) {
                params.append('name', i);
            }
            //this.type
            if (j) {
                params.append('type', j);
            }
            //this.area
            if (k) {
                params.append('area', k);
            }
            //this.status
            if (l !== null) {
                params.append('status', l);
            }
            fetch(`http://localhost:8080/rooms/search?${params.toString()}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data)
                    this.roomArr = data
                    console.log('搜尋房間', this.roomArr)
                })
        },
        //建立房間
        createRoom(i, j, k, l, m) {
            let obj = {
                id: i,
                name: j,
                area: k,
                type: l,
                status: m
            }
            fetch("http://localhost:8080/rooms", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.searchAllRoom()
                    this.searchDevice(null, null, null, null, false)
                })
        },
        //新增/修改設備狀態或欄位
        deviceStatus(i, j, k, l, m, judge = false) {
            let changeobj = {
                id: i,
                type: j,
                name: k,
                status: l,
                roomId: m
            }
            fetch(`http://localhost:8080/devices`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(changeobj)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (judge) {
                        this.searchRoom(this.localRoomId)
                    } else {
                        this.searchDevice(null, null, null, null, false)
                        this.searchAllRoom()
                    }
                })
        },
        createRoomDeviceSearch(i, j, k, l) {
            const params = new URLSearchParams();
            //this.name 
            if (i) {
                params.append('name', i);
            }
            //this.type
            if (j) {
                params.append('type', j);
            }
            //this.area
            if (k) {
                params.append('area', k);
            }
            //this.status
            if (l !== null) {
                params.append('status', l);
            }
            fetch(`http://localhost:8080/rooms/search?${params.toString()}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.createRoomDevice = data
                    console.log(this.createRoomDevice[0].id)
                })
        },
        //搜尋設備
        searchDevice(i, j, k, l, judge = false) {


            if (judge) {
                k = this.localRoomArea;
            }
            const params = new URLSearchParams();
            //this.name 
            if (i) {
                params.append('name', i);
            }
            //this.type
            if (j) {
                params.append('type', j);
            }
            //this.area
            if (k) {
                params.append('area', k);
            }
            //this.status
            if (l !== null) {
                params.append('status', l);
            }
            fetch(`http://localhost:8080/devices/search?${params.toString()}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.deviceArr = data
                    console.log(this.deviceArr)
                })
        },
        //刪除設備
        deleteDevice(i, judge = false) {
            let arr = []
            for (let j = 0; j < i.length; j++) {
                arr.push(i[j]);
            }

            fetch("http://localhost:8080/devices", {
                method: "delete",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(arr),
            })
                // .then(res => res.json())
                .then(data => {
                    if (judge) {
                        this.searchDevice(null, null, this.localRoomArea, null)
                    } else {
                        this.searchDevice(null, null, null, null, false)
                    }

                })
        },
        //刪除設備
        deleteRooms(i) {
            let arr = []
            for (let j = 0; j < i.length; j++) {
                arr.push(i[j]);
            }

            fetch("http://localhost:8080/rooms", {
                method: "delete",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(arr),
            })
                // .then(res => res.json())
                .then(data => {
                    this.searchAllRoom()
                })
        },
        //搜尋歷史紀錄
        searchHistory(i, j, k, l, m) {
            const params = new URLSearchParams();

            if (i) {
                params.append('deviceName', i);
            }

            if (j) {
                params.append('deviceType', j);
            }

            if (k) {
                params.append('startDate', k);
            }

            if (l) {
                params.append('endDate', l);
            }

            if (m) {
                params.append('roomArea', m);
            }
            fetch(`http://localhost:8080/history/search?${params.toString()}`, {
                method: "get",
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    console.log('allLog', data)
                    this.allLogs = data
                    this.allLogs = this.allLogs.reverse()
                })
        },
        getAllLogs() {
            fetch(`http://localhost:8080/history`, {
                method: "get",
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    console.log('allLog', data)
                    this.allLogs = data
                    this.allLogs = this.allLogs.reverse()
                })
        },
        //刪除公告
        deleteAnn(i) {
            let arr = []
            for (let j = 0; j < i.length; j++) {
                arr.push(i[j]);
            }
            fetch(`http://localhost:8080/announcements`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(arr)
            })
                // .then(res => res.json())
                .then(data => {

                })
        },
        //新增公告
        createAnn(i, j, k) {
            let arr = []
            for (let x = 0; x < k.length; x++) {
                arr.push(k[x]);
            }
            let obj = {
                "title": i,
                "content": j,
                "roomIds": arr
            }

            fetch(`http://localhost:8080/announcements`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(res => res.json())
                .then(data => {
                    this.selectedArr=[]
                    this.selectedIds=[]
                    this.addAllRoom=[]
                })
        },
        searchFrontHistory(i, j, k, l, m) {
            const params = new URLSearchParams();
            if (i) {
                params.append('deviceName', i);
            }

            if (j) {
                params.append('deviceType', j);
            }

            if (k) {
                params.append('startDate', k);
            }

            if (l) {
                params.append('endDate', l);
            }

            if (m) {
                params.append('roomArea', m);
            }
            console.log(i,j,k,l,m)
            fetch(`http://localhost:8080/history/search?${params.toString()}`, {
                method: "get",
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    console.log('erLog', data)
                    this.frontLogs = []
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].eventType == "錯誤") {
                            this.frontLogs.push(data[i])
                        }
                    }
                    console.log('前台錯誤', this.frontLogs)
                })
        },
        //用於新增公告選擇房間
        searchAnnRoom(i, j, k, l) {

            const params = new URLSearchParams();
            //this.name 
            if (i) {
                params.append('name', i);
            }
            //this.type
            if (j) {
                params.append('type', j);
            }
            //this.area
            if (k) {
                params.append('area', k);
            }
            //this.status
            if (l !== null) {
                params.append('status', l);
            }
            fetch(`http://localhost:8080/rooms/search?${params.toString()}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data)
                    this.annRoom = data
                    console.log('搜尋房間', this.annRoom)
                    this.searchAndShowResults()
                })
        },
        searchAndShowResults() {
            console.log('搜索方法被调用');  // 调试信息，确保方法被调用
            // console.log('搜索参数:', name, type, area, status);  // 调试信息，打印搜索参数
            try {
                // const results = this.annRoom;
                console.log('搜索结果:', this.annRoom);

                // 处理搜索结果
                if (this.annRoom && this.annRoom.length > 0) {
                    const resultHtml = this.annRoom.map(item =>
                        `<div>
                            <input type="checkbox" id="room-${item.id}" value="${item.id}">
                            <label class="large-text" for="room-${item.id}" >${item.area || '未提供'} - ${item.name || '未提供'}</label>
                        </div>`
                    ).join('');

                    Swal.fire({
                        title: '搜尋結果',
                        html: resultHtml,
                        icon: 'info',
                        confirmButtonText: '確認',
                        customClass: {
                            popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                        },
                        preConfirm: () => {
                            this.annRoom.forEach(item => {
                                const checkbox = Swal.getPopup().querySelector(`#room-${item.id}`);
                                if (checkbox.checked) {
                                    if (!this.selectedIds.includes(item.id)) {
                                        this.selectedIds.push(item.id);
                                        this.selectedArr.push(item)
                                    }
                                }
                                console.log(this.selectedArr)
                            });
                            return this.selectedIds;
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log('選中的房间ID:', result.value);
                            // 選中房間的ID
                        }
                    });
                } else {
                    Swal.fire({
                        title: '無結果',
                        text: '未找到符合條件的空間',
                        icon: 'warning',
                        confirmButtonText: '確認',
                        customClass: {
                            popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                        },
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: '錯誤',
                    text: '搜尋過程中發生錯誤',
                    icon: 'error',
                    confirmButtonText: '確認',
                    customClass: {
                        popup: 'swal2-custom-popup DeviceManagement-custom-popup', // 自定義樣式
                    },
                });
            }
        },
        addAllroom() {
            fetch(`http://localhost:8080/rooms`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            })
                .then(res => res.json())
                .then(data => {
                    this.addAllRoom = data
                    this.addAllRoom.forEach(item => {
                        if (!this.selectedIds.includes(item.id)) {
                            this.selectedIds.push(item.id);
                        }
                    })
                    this.selectedArr = this.addAllRoom
                })
        }
    },

});