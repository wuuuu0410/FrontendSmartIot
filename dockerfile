#build stage 第一階段
FROM node:20-alpine as build-stage

# 設置工作目錄為 /app
WORKDIR /app

# 複製 package.json 和 package-lock.json到工作目錄
COPY package*.json ./

#使用 npm 安裝應用程式的依賴
RUN npm install

# 複製所有專案文件和資料夾到工作目錄（這包括源代碼、配置文件等）
COPY . .

# 使用 npm 執行 build 命令，構建 Vue.js 應用程式的生產版本文件檔
RUN npm run build


#--------------------------------------------------------------------------------------------------------------

#production stage 第二階段 

# 使用 NGINX 的穩定版 Alpine 映像作為基礎映像
FROM nginx:stable-alpine as production-stage

# 從構建階段的 build-stage 中複製已經構建好的靜態資源到 NGINX 的預設靜態文件夾路徑
COPY --from=build-stage /app/dist usr/share/nginx/html

# 對外暴露容器內部的埠 80，允許外部訪問 NGINX 伺服器
EXPOSE 80

# 執行 NGINX 伺服器，並設置為以守護進程的方式運行
CMD ["nginx","-g","daemon off;"]

# 要自己額外運行的兩個指令 (下方)

# docker build -t vue_smartiot .
# 將此docker file 做成 vue_smartiot的映像檔


# docker run -it -p 5173:80 --rm --name test-container vue_smartiot
# 上面為 創建執行容器 來裝載映像檔並執行
# docker run 命令示例，運行容器並映射主機的埠 5173 到容器內部的埠 80
# --rm 選項表示容器停止後自動刪除容器本身
# --name 指定容器的名稱為 test-container
# vue_smartiot 為要運行的 Docker 映像名稱