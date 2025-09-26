# CrossGate Map Generator (CGMAPG)

🎮 一個用於自動化生成 CrossGate 魔力寶貝遊戲地圖的 Node.js 工具，內建 see4cg 和 DOSBox-X 來處理 .dat 地圖檔案。

## ✨ 特色功能

- 🔍 **簡化環境檢查**：僅需設定 CrossGate 遊戲目錄路徑
- ⚙️ **內建工具**：整合 see4cg 和 DOSBox-X，無需額外安裝
- 🚀 **一鍵執行**：自動配置並執行地圖生成
- 📝 **完整日誌**：提供詳細的執行過程和錯誤訊息
- 🛡️ **智慧設定**：自動產生三種版本設定檔（標準版、PUK2、PUK3）
- 📁 **動態路徑**：根據輸入檔案自動計算地圖目錄路徑

## 📋 系統需求

- Node.js 16+
- Windows 作業系統
- CrossGate 遊戲檔案

## 🚀 安裝與設定

### 1. 安裝依賴套件

```bash
npm install
```

### 2. 設定環境變數

建立 `.env` 檔案並設定 CrossGate 遊戲目錄路徑：

```env
# CrossGate 遊戲資料目錄路徑
CG_PATH=D:\CrossGate
```

## 💻 使用方式

### 基本用法

```bash
# 生成地圖檔案
npm run start -- --dat "完整的.dat檔案路徑"
```

### 使用範例

```bash
# 處理 151 地圖
npm run start -- --dat "D:\cg\map\1\1\151.dat"

# 處理其他地圖
npm run start -- --dat "D:\cg\map\2\5\205.dat"
```

## 🔧 程式功能詳解

### 環境變數檢查

- ✅ 自動驗證 `CG_PATH` 是否設定
- ✅ 檢查路徑是否存在
- ❌ 缺少環境變數時提供明確錯誤訊息

### 智慧設定檔處理

程式會自動在 `see4cg` 目錄中產生/更新以下設定檔：

#### **cpath.ini** (標準版)

```ini
GraphicInfo:D:/Bin/GraphicInfo_66.bin
Graphic:D:/Bin/Graphic_66.bin
Anime:D:/Bin/Anime_4.bin
AnimeInfo:D:/Bin/AnimeInfo_4.bin
PAL:D:/Bin/pal/Palet_00.cgp
GraphicInfoEx:D:/Bin/GraphicInfoEx_5.bin
GraphicEx:D:/Bin/GraphicEx_5.bin
AnimeEx:D:/Bin/AnimeEx_1.bin
AnimeInfoEx:D:/Bin/AnimeInfoEx_1.bin
Map:mapadrn_2.bin
```

#### **puk2-cpath.ini** (PUK2 版)

```ini
GraphicInfo:D:/Bin/GraphicInfo_20.bin
Graphic:D:/Bin/Graphic_20.bin
Anime:D:/Bin/Anime_3.bin
AnimeInfo:D:/Bin/AnimeInfo_3.bin
PAL:D:/Bin/pal/Palet_00.cgp
GraphicInfoEx:D:/Bin/Puk2/GraphicInfo_PUK2_2.bin
GraphicEx:D:/Bin/Puk2/Graphic_PUK2_2.bin
AnimeEx:D:/Bin/Puk2/Anime_PUK2_4.bin
AnimeInfoEx:D:/Bin/Puk2/AnimeInfo_PUK2_4.bin
Map:mapadrn_2.bin
```

#### **puk3-cpath.ini** (PUK3 版)

```ini
GraphicInfo:D:/Bin/GraphicInfo_20.bin
Graphic:D:/Bin/Graphic_20.bin
Anime:D:/Bin/Anime_3.bin
AnimeInfo:D:/Bin/AnimeInfo_3.bin
PAL:D:/Bin/pal/Palet_00.cgp
GraphicInfoEx:D:/Bin/Puk3/GraphicInfo_PUK3_1.bin
GraphicEx:D:/Bin/Puk3/Graphic_PUK3_1.bin
AnimeEx:D:/Bin/Puk3/Anime_PUK3_2.bin
AnimeInfoEx:D:/Bin/Puk3/AnimeInfo_PUK3_2.bin
Map:mapadrn_2.bin
```

#### **cmap.ini** (動態地圖路徑)

根據輸入的 .dat 檔案路徑自動生成對應的地圖目錄路徑。

### DOSBox-X 自動化執行

程式會使用內建的 DOSBox-X 自動執行以下命令：

```bash
dosbox-x.exe -set "dos lfn=true" -conf "dosbox-x.conf"
  -c "mount c [see4cg目錄]"
  -c "mount d [CG_PATH]"
  -c "C:"
  -c "cmap [檔案名稱] 1"
  -c "exit"
```

## 📊 執行流程

```
開始
  ↓
🔍 檢查環境變數 (僅 CG_PATH)
  ↓
📝 解析命令列參數
  ↓
✅ 驗證 .dat 檔案
  ↓
⚙️ 重新產生設定檔案
  ├── cpath.ini (標準版)
  ├── puk2-cpath.ini (PUK2版)
  ├── puk3-cpath.ini (PUK3版)
  └── cmap.ini (動態路徑)
  ↓
🚀 啟動內建 DOSBox-X
  ↓
🎉 完成
```

## ⚠️ 錯誤處理

| 錯誤類型              | 處理方式               |
| --------------------- | ---------------------- |
| 缺少 CG_PATH 環境變數 | 顯示錯誤訊息，程式結束 |
| CG_PATH 路徑不存在    | 顯示警告訊息，繼續執行 |
| .dat 檔案不存在       | 顯示錯誤訊息，程式結束 |
| DOSBox-X 執行失敗     | 顯示詳細錯誤訊息       |
| 設定檔處理失敗        | 顯示特定檔案錯誤訊息   |

## 📁 專案結構

```
cgmapg/
├── index.js              # 主程式檔案
├── package.json          # npm 套件設定
├── .env                  # 環境變數設定 (需自行建立)
├── README.md            # 專案說明文件
├── dosbox-x/            # 內建 DOSBox-X 工具
│   └── mingw-build/
│       └── mingw/
│           ├── dosbox-x.exe
│           ├── dosbox-x.conf
│           └── ...
└── see4cg/              # 內建 see4cg 工具和設定檔
    ├── cmap.exe
    ├── cpath.ini        (自動產生)
    ├── puk2-cpath.ini   (自動產生)
    ├── puk3-cpath.ini   (自動產生)
    ├── cmap.ini         (自動產生)
    └── ...
```

## 🔍 除錯提示

### 常見問題

1. **環境變數設定錯誤**

   ```bash
   ❌ CG_PATH: 未設定
   ```

   解決：建立 `.env` 檔案並設定 `CG_PATH=你的CrossGate遊戲路徑`

2. **路徑不存在**

   ```bash
   ⚠️  警告: CG_PATH 路徑不存在: D:\CrossGate
   ```

   解決：確認路徑是否正確，目錄是否存在

3. **DOSBox-X 執行失敗**
   ```bash
   ❌ DOSBox 執行檔不存在
   ```
   解決：確認專案目錄完整，包含 `dosbox-x/mingw-build/mingw/` 資料夾

## 🆕 版本特色

### v1.0.0

- ✅ 整合 DOSBox-X 和 see4cg，無需額外安裝
- ✅ 簡化環境設定，僅需 CG_PATH
- ✅ 自動產生三種版本設定檔
- ✅ 支援長檔名 (LFN) 處理
- ✅ 智慧路徑解析和錯誤處理

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個專案！
