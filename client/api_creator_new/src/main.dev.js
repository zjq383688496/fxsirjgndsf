var electron = require('electron')
var path     = require('path')
var fs       = require('fs')

var { app, BrowserWindow, ipcMain } = electron

let welcomeWin, editWin

class WinDeskTop {
	constructor() {
		this.app = app
		this.appListen()
		this.init()
	}

	// 监听app
	appListen() {
		// 退出
		this.app.on('window-all-closed', async () => {
			welcomeWin = editWin = null
			this.app.quit()
		})
		// 准备好
		this.app.on('ready', async () => {
			this.createEditor()
		})
	}

	init() {
		// 只允许又一个实例
		if (!this.app.requestSingleInstanceLock()) {
			return this.app.quit()
		}
	}

	createEditor() {
		var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize

		editWin = new BrowserWindow({
			width,
			height,
			parent: welcomeWin,
			resizable: true,
			// titleBarStyle: 'hidden',
		})

		// 禁用缩放系统
		var { webContents } = editWin
		webContents.on('did-finish-load', () => {
			webContents.setZoomFactor(1)
			webContents.setVisualZoomLevelLimits(1, 1)
			webContents.setLayoutZoomLevelLimits(0, 0)
		})

		editWin.loadURL(`http://localhost:8222/`)
		editWin.once('ready-to-show', () => {
			editWin.show()
		})
		editWin.once('closed', () => {
			editWin = null
			welcomeWin.show()
		})
	}
}

new WinDeskTop()

process.on('uncaughtException', ({ message }) => {
	console.log('uncaughtException', message)
})

process.on('error', ({ message }) => {
	console.log('error', message)
})
