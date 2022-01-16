// Модули для управления приложением и создания окна
const {app, 
  BrowserWindow, 
  ipcMain, 
  Menu, 
  MenuItem, 
  Notification, 
  globalShortcut, 
  Tray} = require('electron')
const path = require ('path');
const url = require ('url');
var robot = require("robotjs");

let tray = null

function createWindow () {
  // Создаем окно браузера.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })


  // и загрузить index.html приложения.
  //mainWindow.loadFile('index.html')

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);
  // mainWindow.loadURL('http://localhost:3000');

  // Отображаем средства разработчика.
  // mainWindow.webContents.openDevTools()
}
ipcMain.on('start', (_, data) => {

  const max = 500
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
  }  
  // const width = getRandomInt(max)
  // const height = getRandomInt(max)
    setTimeout( function run() {
      let action = getRandomInt(3)
      if(action === 0) { 
        robot.moveMouseSmooth(getRandomInt(max), getRandomInt(max))
      } else if(action === 1) {
        robot.mouseClick()
      } else if (action === 2) { 
        robot.scrollMouse(50, 0) 
      }
      setTimeout(run, 2000)
      console.log(action);
    }, 0)

})

function showNotification () {
  new Notification({ title: 'Electron', body: 'Приложение запущено. Для выхода из приложения нажмите "CTRL + X"' }).show()
}
// Этот метод вызывается когда приложение инициализируется
// и будет готово для создания окон.
// Некоторые API могут использоваться только после возникновения этого события.
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+X', () => {
    app.quit()
  })
  createWindow()
  showNotification()
  tray = new Tray('/electron/tray.png')
  const size = robot.screen.capture([x], [y], [width], [height])
  console.log(size.width);
})
// .then(() => {
//   globalShortcut.register('Alt+CommandOrControl+I', () => {
//     console.log('Electron loves global shortcuts!')
//   })
app.on('activate', function () {
  // На MacOS обычно пересоздают окно в приложении,
  // после того, как на иконку в доке нажали и других открытых окон нету.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Выйти когда все окна закрыты
app.on('window-all-closed', function () {
  // Для приложений и строки меню в macOS является обычным делом оставаться
  // активными до тех пор, пока пользователь не выйдет окончательно используя Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// В этом файле вы можете включить остальную часть основного процесса вашего приложения
// Вы также можете поместить их в отдельные файлы и подключить через require.