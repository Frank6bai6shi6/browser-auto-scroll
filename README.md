<a id="top"></a>

**语言 / Language：** [中文](#中文) · [English](#english)

---

<a id="中文"></a>

# 可调速自动滚动

这是一个适用于 Google Chrome 和 Microsoft Edge 的本地浏览器扩展。点击扩展按钮后，可以让当前网页持续向上或向下滚动，并随时调整速度、暂停或继续。

主播在用某曲谱网站练琴的时候，常常苦于需要手动进行翻页和滚轮操作，很影响练琴的效率和体验，又不太想给网站交大几百的会员费，所以就开发了这个基于JavaScript的网页扩展，适用于曲谱，聊天记录，在线表格，电子书等，使用说明如下：

## 下载最新版

点击下载 `browser-auto-scroll-v1.3.0.zip`。下载后先解压，再按照下面的 Chrome 或 Microsoft Edge 安装步骤加载解压后的文件夹。

> 浏览器不能直接加载 ZIP 压缩包，必须先解压。

安装完成后，可以手动点击选择需要进行滚动的区域，鼠标移到需要滚动区域后会出现蓝色方框，点击即可选择，按 `Esc` 可以退出区域选择。

速度滑块范围为 `0–120 像素/秒`，精度为 `0.5`。也可以在数字框中直接输入最高 `1000` 的速度。低于每帧 1 像素的移动会自动累积，因此低速也能正常滚动。

启用“间歇滚动”后，可以分别设置每轮滚动时间和暂停时间。例如速度设为 `60`、滚动设为 `20` 秒、暂停设为 `60` 秒，扩展会持续循环这一节奏。

滚动过程中可以重新打开面板实时调速，也可以随时暂停。



# 安装指南

## 安装到 Chrome

1. 在地址栏打开 `chrome://extensions/`。
2. 打开右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择整个 `browser-auto-scroll` 文件夹。
5. 建议点击浏览器工具栏的拼图图标，把“可调速自动滚动”固定到工具栏。

## 安装到 Microsoft Edge

1. 在地址栏打开 `edge://extensions/`。
2. 打开左侧的“开发人员模式”。
3. 点击“加载解压缩的扩展”。
4. 选择整个 `browser-auto-scroll` 文件夹。


## 更新

下载并解压新版本，用新文件替换原扩展文件夹中的文件，然后在 `chrome://extensions/` 或 `edge://extensions/` 中点击该扩展的刷新按钮，最后刷新正在使用的网页。

#安全检查

浏览器设置页、扩展商店、新标签页等受保护页面不允许扩展控制，这是 Chrome 和 Edge 的安全限制。切换标签页后，原页面会按原状态继续滚动，直到回到该页面并点击停止，或关闭/刷新该页面。


<a id="english"></a>

# Adjustable Auto Scroll

[中文](#中文) · **English** · [返回顶部 / Back to top](#top)

This is a browser extension for Google Chrome and Microsoft Edge. It lets you automatically scroll an entire webpage—or a specific section of it—up or down. You can adjust the speed, pause the scrolling, or resume it at any time.

I originally made this extension because I often use an online sheet music website while practicing Guitar. Having to stop playing to turn the page or use the mouse wheel was inconvenient and distracting, and I didn’t want to pay hundreds for a premium membership. This JavaScript-based extension may also be useful for chat histories, online spreadsheets, e-books, and similar content.

## Download the Latest Version

Download `browser-auto-scroll-v1.3.0.zip`, then extract it before following the Chrome or Microsoft Edge installation instructions below.

> Browsers cannot load the ZIP file directly. You must extract it first.

Once the extension is installed, click **Select Scroll Area** and move your mouse over the section you want to scroll. A blue outline will appear around the detected scrollable area. Click it to confirm your selection, or press `Esc` to cancel.

The speed slider ranges from `0–120 pixels per second` and can be adjusted in increments of `0.5`. You can also enter a speed of up to `1000` directly in the number field. Movements smaller than one pixel per frame are accumulated, so slower speeds still work smoothly.

You can also enable **Interval Scrolling** and choose how long the page should scroll and how long it should pause. For example, you can set the speed to `60`, scroll for `20 seconds`, and pause for `60 seconds`. The extension will repeat this cycle automatically.

You can reopen the extension at any time to change the speed, pause the scrolling, or resume it.

# Installation Guide

## Install on Google Chrome

1. Open `chrome://extensions/` in the address bar.
2. Turn on **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the entire `browser-auto-scroll` folder.
5. We recommend clicking the puzzle-piece icon in the browser toolbar and pinning **Adjustable Auto Scroll** for easy access.

## Install on Microsoft Edge

1. Open `edge://extensions/` in the address bar.
2. Turn on **Developer mode** in the left-hand menu.
3. Click **Load unpacked**.
4. Select the entire `browser-auto-scroll` folder.

## Updating the Extension

Download and extract the latest version, then replace the files in your existing extension folder with the new ones.

After that, open `chrome://extensions/` or `edge://extensions/`, click the refresh button on the extension card, and refresh any webpage where you want to use it.

# Safty Check

Browser-protected pages—such as settings pages, extension stores, and new-tab pages—cannot be controlled by extensions. This is a security restriction in Chrome and Edge.

If you switch to another tab, the original page will continue scrolling until you return and stop it, refresh the page, or close the tab.
