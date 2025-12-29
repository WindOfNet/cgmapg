require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

/**
 * 檢查環境變數設定
 */
function checkEnvironmentVariables() {
  const requiredVars = ['CG_PATH'];
  const missingVars = [];

  console.log('🔍 檢查環境變數...');

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
      console.log(`❌ ${varName}: 未設定`);
    } else {
      console.log(`✅ ${varName}: ${value}`);

      // 檢查目錄是否存在
      if (!fs.existsSync(value)) {
        console.log(`⚠️  警告: ${varName} 路徑不存在: ${value}`);
      }
    }
  }

  if (missingVars.length > 0) {
    console.log('\n❌ 缺少必要的環境變數:', missingVars.join(', '));
    console.log('請檢查 .env 檔案並設定正確的路徑');
    return false;
  }

  return true;
}

/**
 * 解析命令列參數
 */
function parseArguments() {
  const args = process.argv.slice(2);
  let datFilePath = null;
  let scale = 1; // 預設值為 1

  // 尋找 --dat 參數
  const datIndex = args.indexOf('--dat');
  if (datIndex !== -1 && datIndex + 1 < args.length) {
    datFilePath = args[datIndex + 1];
  }

  // 尋找 --scale 參數
  const scaleIndex = args.indexOf('--scale');
  if (scaleIndex !== -1 && scaleIndex + 1 < args.length) {
    const scaleValue = parseInt(args[scaleIndex + 1]);
    if (isNaN(scaleValue) || scaleValue < 1 || scaleValue > 10) {
      console.log('❌ scale 參數必須是 1 到 10 之間的整數');
      return null;
    }
    scale = scaleValue;
  }

  if (!datFilePath) {
    console.log('❌ 請提供 .dat 檔案路徑');
    console.log('使用方式: npm run start -- --dat D:\\path\\to\\file.dat [--scale 1-10]');
    return null;
  }

  if (!fs.existsSync(datFilePath)) {
    console.log(`❌ 檔案不存在: ${datFilePath}`);
    return null;
  }

  if (!datFilePath.endsWith('.dat')) {
    console.log(`❌ 檔案必須是 .dat 格式: ${datFilePath}`);
    return null;
  }

  return { datFilePath, scale };
}

/**
 * 處理設定檔案
 */
async function processConfigFiles(datFilePath) {
  const see4cgPath = path.join(__dirname, 'see4cg');
  const cgPath = process.env.CG_PATH;

  console.log('\n🔧 處理設定檔案...');

  const configFiles = ['cpath.ini', 'puk2-cpath.ini', 'puk3-cpath.ini'];

  // 處理 cpath 相關檔案
  for (const configFile of configFiles) {
    const filePath = path.join(see4cgPath, configFile);
    console.log(`📝 處理 ${configFile}...`);
    await processIniFile(filePath, cgPath);
  }

  // 處理 cmap.ini
  const cmapIniPath = path.join(see4cgPath, 'cmap.ini');
  const contentTmp = `D:\\${datFilePath.substring(datFilePath.lastIndexOf('map'))}`;
  const content = contentTmp.substring(0, contentTmp.lastIndexOf('\\'));

  console.log(`📝 更新 cmap.ini 為: ${content}`);
  fs.writeFileSync(cmapIniPath, content, 'utf8');
}

/**
 * 處理 INI 設定檔
 */
async function processIniFile(filePath) {
  try {
    let lines = [];

    // 根據檔案名稱直接產生標準設定內容
    const fileName = path.basename(filePath);
    if (fileName === 'cpath.ini') {
      lines = [
        'GraphicInfo:D:/Bin/GraphicInfo_66.bin',
        'Graphic:D:/Bin/Graphic_66.bin',
        'Anime:D:/Bin/Anime_4.bin',
        'AnimeInfo:D:/Bin/AnimeInfo_4.bin',
        'PAL:D:/Bin/pal/Palet_00.cgp',
        'GraphicInfoEx:D:/Bin/GraphicInfoEx_5.bin',
        'GraphicEx:D:/Bin/GraphicEx_5.bin',
        'AnimeEx:D:/Bin/AnimeEx_1.bin',
        'AnimeInfoEx:D:/Bin/AnimeInfoEx_1.bin',
        'Map:mapadrn_2.bin',
      ];
    } else if (fileName === 'puk2-cpath.ini') {
      lines = [
        'GraphicInfo:D:/Bin/GraphicInfo_20.bin',
        'Graphic:D:/Bin/Graphic_20.bin',
        'Anime:D:/Bin/Anime_3.bin',
        'AnimeInfo:D:/Bin/AnimeInfo_3.bin',
        'PAL:D:/Bin/pal/Palet_00.cgp',
        'GraphicInfoEx:D:/Bin/Puk2/GraphicInfo_PUK2_2.bin',
        'GraphicEx:D:/Bin/Puk2/Graphic_PUK2_2.bin',
        'AnimeEx:D:/Bin/Puk2/Anime_PUK2_4.bin',
        'AnimeInfoEx:D:/Bin/Puk2/AnimeInfo_PUK2_4.bin',
        'Map:mapadrn_2.bin',
      ];
    } else if (fileName === 'puk3-cpath.ini') {
      lines = [
        'GraphicInfo:D:/Bin/GraphicInfo_20.bin',
        'Graphic:D:/Bin/Graphic_20.bin',
        'Anime:D:/Bin/Anime_3.bin',
        'AnimeInfo:D:/Bin/AnimeInfo_3.bin',
        'PAL:D:/Bin/pal/Palet_00.cgp',
        'GraphicInfoEx:D:/Bin/Puk3/GraphicInfo_PUK3_1.bin',
        'GraphicEx:D:/Bin/Puk3/Graphic_PUK3_1.bin',
        'AnimeEx:D:/Bin/Puk3/Anime_PUK3_2.bin',
        'AnimeInfoEx:D:/Bin/Puk3/AnimeInfo_PUK3_2.bin',
        'Map:mapadrn_2.bin',
      ];
    }

    console.log(`🔄 重新產生: ${path.basename(filePath)}`);

    // 直接寫入檔案（建立或覆蓋）
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`✅ 已產生: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ 處理 ${filePath} 時發生錯誤:`, error.message);
  }
}

/**
 * 執行 DOSBox
 */
async function runDOSBox(datFilePath, scale = 1) {
  const cgPath = process.env.CG_PATH;

  console.log('\n🚀 啟動 DOSBox...');
  console.log(`📏 縮放比例: ${scale}`);

  const dosboxPath = path.join(__dirname, 'dosbox-x\\mingw-build\\mingw');
  const dosboxExe = path.join(dosboxPath, 'dosbox-x.exe');
  const dosboxConf = path.join(dosboxPath, 'dosbox-x.conf');

  // 檢查 DOSBox 檔案是否存在
  if (!fs.existsSync(dosboxExe)) {
    console.log(`❌ DOSBox 執行檔不存在: ${dosboxExe}`);
    return;
  }

  if (!fs.existsSync(dosboxConf)) {
    console.log(`❌ DOSBox 設定檔不存在: ${dosboxConf}`);
    return;
  }

  const datFileName = path.basename(datFilePath);

  const command = [
    `"${dosboxExe}"`,
    `-set "dos lfn=true"`,
    `-conf "${dosboxConf}"`,
    `-c "mount c ${path.join(__dirname, 'see4cg')}"`,
    `-c "mount d ${cgPath}"`,
    `-c "C:"`,
    `-c "cmap ${datFileName.split('\\').at(-1).replace('.dat', '')} ${scale}"`,
    `-c "exit"`,
  ].join(' ');

  console.log('執行命令:', command);

  try {
    await execAsync(command);
    console.log('✅ DOSBox 執行完成');
  } catch (error) {
    console.error('❌ DOSBox 執行失敗:', error.message);
  }
}

/**
 * 主程式
 */
async function main() {
  console.log('🎮 CrossGate Map Generator');
  console.log('==========================\n');

  // 檢查環境變數
  if (!checkEnvironmentVariables()) {
    process.exit(1);
  }

  // 解析命令列參數
  const params = parseArguments();
  if (!params) {
    process.exit(1);
  }

  const { datFilePath, scale } = params;

  console.log(`\n📁 目標檔案: ${datFilePath}`);
  console.log(`📏 縮放比例: ${scale}`);

  try {
    // 處理設定檔案
    await processConfigFiles(datFilePath);

    // 執行 DOSBox
    await runDOSBox(datFilePath, scale);

    console.log('\n🎉 處理完成！');
  } catch (error) {
    console.error('❌ 發生錯誤:', error.message);
    process.exit(1);
  }
}

// 執行主程式
if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironmentVariables,
  parseArguments,
  processConfigFiles,
  runDOSBox,
};
