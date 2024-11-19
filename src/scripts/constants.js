const JSZip = require('../static/jszip.min.js');

export const IMGURL="https://eqmaster.blob.core.chinacloudapi.cn";
export const TOKEN="?sp=r&st=2024-11-18T09:41:26Z&se=2025-11-18T17:41:26Z&sv=2022-11-02&sr=c&sig=WL07d2l6cOkDXNTjNxkTEU3Yl0J%2FrNlWU%2FUPGJRPfhA%3D";
const platform =getPlatform();

export function getImg(picnName){
  if (finishload) {
    // #ifdef MP-WEIXIN
    return `${wx.env.USER_DATA_PATH}/static/${picnName}`;
    // #endif

    // #ifdef APP-PLUS
    return `_doc/static/${picnName}`;
    // #endif
  }
	return IMGURL+picnName+TOKEN;
}
function getPlatform() {
  if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
    return wx.getSystemInfoSync().platform;
  } else if (typeof plus !== 'undefined') {
    return 'app-plus';
  } else {
    return 'unknown';
  }
}
let startLoad=false;
export function downLoadZip() {
  if (startLoad) return;
  startLoad = true;
  console.log('downLoadZip');
  checkAndDownloadZip();
}

function checkAndDownloadZip() {
 //#ifdef MP-WEIXIN
 checkAndDownloadWx();
// #endif

// #ifdef APP-PLUS
 checkAndDownloadApp();
 //#endif
}

function checkAndDownloadWx() {
  const fs = wx.getFileSystemManager();
  const staticDir = `${wx.env.USER_DATA_PATH}/static`;
  console.log('checkAndDownloadWx');

  fs.access({
    path: staticDir,
    success: () => {
      console.log('Static directory already exists, skipping download.');
      startLoad = true;
    finishload = true;
    },
    fail: () => {
      console.log('Static directory does not exist, starting download.');
      downloadZip();
    }
  });
}

function checkAndDownloadApp() {
  plus.io.resolveLocalFileSystemURL('_doc/static', (entry) => {
    console.log('Static directory already exists, skipping download.');
    startLoad = true;
    finishload = true;
  }, () => {
    console.log('Static directory does not exist, starting download.');
    downloadZip();
  });
}

function downloadZip() {
  console.log(IMGURL + "/static/static.zip" + TOKEN);
  uni.downloadFile({
    url: IMGURL + "/static/static.zip" + TOKEN,
    success: (res) => {
      if (res.statusCode === 200) {
        const filePath = res.tempFilePath;
        console.log('ZIP file downloaded:', filePath);
        // 解压 ZIP 文件
        unzipFile(filePath);
      } else {
        console.error('Download failed:', res.statusCode);
      }
    },
    fail: (err) => {
      console.error('Download error:', err);
    }
  });
}

let finishload=false;

function unzipFile(filePath) {
  // #ifdef MP-WEIXIN
  unzipFileWx(filePath);
  // #endif

  // #ifdef APP-PLUS
  unzipFileApp(filePath);
  // #endif
}

function unzipFileWx(filePath) {
  console.log('微信小程序');
  const fs = wx.getFileSystemManager();
  fs.readFile({
    filePath,
    responseType: 'arraybuffer',
    success(res) {
      const uint8Array = new Uint8Array(res.data);
      const zip = new JSZip();
      zip.loadAsync(uint8Array).then((contents) => {
        console.log('ZIP file loaded successfully');
        const promises = Object.keys(contents.files).map((filename) => {
          const file = zip.file(filename);
          if (file) {
            return file.async('arraybuffer').then((content) => {
              // 保存解压后的文件
              return saveFile(filename, content);
            });
          } else if (contents.files[filename].dir) {
            console.log('Skipping directory:', filename); // 跳过文件夹
            return Promise.resolve();
          } else {
            console.error('File not found in ZIP:', filename);
            return Promise.resolve();
          }
        });
        return Promise.all(promises);
      }).then(() => {
        finishload = true;
        console.log('All files extracted and saved');
      }).catch((err) => {
        console.error('Error loading zip:', err);
      });
    },
    fail: (err) => {
      console.error('Read file error:', err);
    }
  });
}

function unzipFileApp(filePath) {
  console.log('App');
  plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
    entry.file((file) => {
      const reader = new plus.io.FileReader();
      reader.onloadend = (e) => {
        const zip = new JSZip();
        zip.loadAsync(e.target.result).then((contents) => {
          Object.keys(contents.files).forEach((filename) => {
            const file = zip.file(filename);
            if (file) {
              file.async('arraybuffer').then((content) => {
                // 保存解压后的文件
                return saveFile(filename, content);
              });
            } else if (contents.files[filename].dir) {
              console.log('Skipping directory:', filename); // 跳过文件夹
            } else {
              console.error('File not found in ZIP:', filename);
            }
          });
        }).catch((err) => {
          console.error('Error loading zip:', err);
        });
      };
      reader.readAsArrayBuffer(file);
    });
  });
}

function saveFile(filename, content) {
  // #ifdef MP-WEIXIN
  saveFileWx(filename, content);
  // #endif

  // #ifdef APP-PLUS
  saveFileApp(filename, content);
  // #endif
}

function saveFileWx(filename, content) {
  const fs = wx.getFileSystemManager();
  const savePath = `${wx.env.USER_DATA_PATH}/${filename}`;
  const dir = savePath.substring(0, savePath.lastIndexOf('/'));
  fs.access({
    path: dir,
    success: () => {
      // 目录已存在，直接保存文件
      writeFileWx(savePath, content);
    },
    fail: () => {
      // 目录不存在，创建目录
      fs.mkdir({
        dirPath: dir,
        recursive: true,
        success: () => {
          writeFileWx(savePath, content);
        },
        fail(err) {
          console.error('Create directory error:', err);
        }
      });
    }
  });
}

function writeFileWx(filePath, content) {
  const fs = wx.getFileSystemManager();
  fs.writeFile({
    filePath: filePath,
    data: content,
    encoding: 'binary',
    success() {
      // console.log('File saved:', filePath);
      // 使用保存的文件
    },
    fail(err) {
      console.error('Save file error:', err);
    }
  });
}

function saveFileApp(filename, content) {
  const savePath = `_doc/${filename}`;
  plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
    entry.getFile(filename, { create: true }, (fileEntry) => {
      fileEntry.createWriter((writer) => {
        writer.onwrite = () => {
          // console.log('File saved:', savePath);
          // 使用保存的文件
        };
        writer.onerror = (err) => {
          console.error('Save file error:', err);
        };
        writer.write(content);
      });
    });
  });
}
