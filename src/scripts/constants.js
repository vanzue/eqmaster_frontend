import JSZip from 'jszip';

export const IMGURL = "https://eqmaster.blob.core.chinacloudapi.cn";
export let TOKEN = "";

let finishload = false;
let isDownloading = false;
export function setToken(token){
	console.log("token="+token)
	TOKEN=token
}
export function getImg(picnName) {
  // const platform = getPlatform();
  // let filePath;
  // if (picnName!=='/static/splashZH2.png'&&(picnName!==' /static/onboarding/landing_zh.png')&& finishload) {
  //   // #ifdef MP-WEIXIN
  //   filePath = `${wx.env.USER_DATA_PATH}/static/${picnName}`;
  //   // #endif

  //   // #ifdef APP-PLUS
  //   filePath = `_doc/static/${picnName}`;
  //   // #endif

  //   // #ifdef H5
  //   filePath = IMGURL + picnName + TOKEN;
  //   // #endif

  //   if (fileExists(filePath)) {
  //     return { filePath, isDownloading: false };
  //   } else {
  //     if (!isDownloading) {
  //       isDownloading = true;
  //       clearStaticDir();
  //       downLoadZip();
  //     }
  //     return  IMGURL + picnName + TOKEN;
  //   }
  // }
  let filePath = IMGURL + picnName + TOKEN;

  // #ifdef WEB
  filePath = picnName;
  // #endif

  return filePath;
}

function checkJsonContent(filePath) {

  const fs = wx.getFileSystemManager();

  fs.readFile({
    filePath: filePath, // 文件路径
    encoding: 'utf8', // 文件编码
    success(res) {
     // console.log('文件内容:', res.data); // res.data即为文件内容
    },
    fail(err) {
      console.error('读取文件失败', err);
    }
  });

}


function fileExists(filePath) {
  // #ifdef MP-WEIXIN
  const fs = wx.getFileSystemManager();
  try {
    fs.accessSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
  // #endif

  // #ifdef APP-PLUS
  try {
    plus.io.resolveLocalFileSystemURL(filePath, () => true, () => false);
  } catch (e) {
    return false;
  }
  // #endif

  // #ifdef H5
  return filePath !== null;
  // #endif
}

function clearStaticDir() {
  // #ifdef MP-WEIXIN
  const fs = wx.getFileSystemManager();
  const staticDir = `${wx.env.USER_DATA_PATH}/static`;
  fs.rmdir({
    dirPath: staticDir,
    recursive: true,
    success: () => {
      console.log('Static directory cleared.');
    },
    fail: (err) => {
      console.error('Failed to clear static directory:', err);
    }
  });
  // #endif

  // #ifdef APP-PLUS
  plus.io.resolveLocalFileSystemURL('_doc/static', (entry) => {
    entry.removeRecursively(() => {
      console.log('Static directory cleared.');
    }, (err) => {
      console.error('Failed to clear static directory:', err);
    });
  });
  // #endif

  // #ifdef H5
  localStorage.clear();
  console.log('Static directory cleared.');
  // #endif
}

let startLoad = false;

export function downLoadZip() {
  if (startLoad) return;
  startLoad = true;
  console.log('downLoadZip');
  checkAndDownloadZip();
}

function checkAndDownloadZip() {
  // #ifdef MP-WEIXIN
  checkAndDownloadWx();
  // #endif

  // #ifdef APP-PLUS
  checkAndDownloadApp();
  // #endif

  // #ifdef H5
  downloadZip();
  // #endif
}

function checkAndDownloadWx() {
  const fs = wx.getFileSystemManager();
  const staticDir = `${wx.env.USER_DATA_PATH}/static`;

  fs.access({
    path: staticDir,
    success: () => {
      console.log('Static directory already exists, skipping download.');
      startLoad = false;
      finishload = true;
    },
    fail: () => {
      console.log('Static directory does not exist, starting download.');
      downloadZip();
      downloadJson();
    }
  });
}

function checkAndDownloadApp() {
  plus.io.resolveLocalFileSystemURL('_doc/static', (entry) => {
    console.log('Static directory already exists, skipping download.');
    startLoad = false;
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
        //console.log('ZIP file downloaded:', filePath);
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

function downloadJson() {
  console.log(IMGURL + "/static/onboarding.zip" + TOKEN);
  uni.downloadFile({
    url: IMGURL + "/static/onboarding.zip" + TOKEN,
    success: (res) => {
      if (res.statusCode === 200) {
        const filePath = res.tempFilePath;
		//console.log('ZIP file downloaded:', filePath);
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

function unzipFile(filePath) {
  // #ifdef MP-WEIXIN
  unzipFileWx(filePath);
  // #endif

  // #ifdef APP-PLUS
  unzipFileApp(filePath);
  // #endif

  // #ifdef H5
  unzipFileH5(filePath);
  // #endif
}

function unzipFileWx(filePath) {
  console.log('微信小程序解压文件路径 ' + filePath);
  const fs = wx.getFileSystemManager();
  fs.readFile({
    filePath,
    responseType: 'arraybuffer',
    success(res) {
      //console.log('File read successfully');
      //console.log('Data type:', res.data.constructor.name); // 打印数据类型
     // console.log('Data length:', res.data.byteLength); // 打印数据长度
      const uint8Array = new Uint8Array(res.data);
      const zip = new JSZip();
      zip.loadAsync(uint8Array).then((contents) => {
        console.log('ZIP file loaded successfully');
        console.log('ZIP file contents:', Object.keys(contents.files)); // 打印 ZIP 文件内容
        const promises = Object.keys(contents.files).map((filename) => {
          const file = zip.file(filename);
          if (file) {
           // console.log('Processing file:', filename); // 打印正在处理的文件名
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
        isDownloading = false;
        console.log('All files extracted and saved');
      }).catch((err) => {
        isDownloading = false;
        console.error('Error loading zip:', err);
      });
    },
    fail: (err) => {
      isDownloading = false;
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
          isDownloading = false;
          console.error('Error loading zip:', err);
        });
      };
      reader.readAsArrayBuffer(file);
    });
  });
}

function unzipFileH5(filePath) {
  console.log('浏览器环境');
  fetch(filePath)
    .then(response => response.arrayBuffer())
    .then(data => {
      const uint8Array = new Uint8Array(data);
      const zip = new JSZip();
      zip.loadAsync(uint8Array).then((contents) => {
        //console.log('ZIP file loaded successfully');
        //console.log('ZIP file contents:', Object.keys(contents.files)); // 打印 ZIP 文件内容
        const promises = Object.keys(contents.files).map((filename) => {
          const file = zip.file(filename);
          if (file) {
           // console.log('Processing file:', filename); // 打印正在处理的文件名
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
        isDownloading = false;
        console.log('All files extracted and saved');
      }).catch((err) => {
        isDownloading = false;
        console.error('Error loading zip:', err);
      });
    })
    .catch((err) => {
      isDownloading = false;
      console.error('Fetch file error:', err);
    });
}

function saveFile(filename, content) {
  // #ifdef MP-WEIXIN
  saveFileWx(filename, content);
  // #endif

  // #ifdef APP-PLUS
  saveFileApp(filename, content);
  // #endif

  // #ifdef H5
  saveFileH5(filename, content);
  // #endif
}

function saveFileWx(filename, content) {
  const fs = wx.getFileSystemManager();
  const savePath = `${wx.env.USER_DATA_PATH}/${filename}`;
  //console.log('savePath: ' + savePath);
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
      //console.log('File saved:', filePath);
      // 使用保存的文件
      if(filePath.endsWith('json')) {
        checkJsonContent(filePath);
      }
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
          //console.log('File saved:', savePath);
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

function saveFileH5(filename, content) {
  const savePath = `static/${filename}`;
  localStorage.setItem(savePath, content);
  //console.log('File saved:', savePath);
  // 使用保存的文件
}

function useFile(filePath) {
  // 使用保存的文件的逻辑
  console.log('Using file:', filePath);
}

function getPlatform() {
  // #ifdef MP-WEIXIN
  return 'mp-weixin';
  // #endif

  // #ifdef APP-PLUS
  return 'app-plus';
  // #endif

  // #ifdef H5
  return 'h5';
  // #endif

  return 'unknown';
}