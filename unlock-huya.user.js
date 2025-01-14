// ==UserScript==
// @name         解锁虎牙扫码限制
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  解锁虎牙最新限制：当观看最高画质时需要手机虎牙扫码
// @author       郭巷蓝歌
// @match        https://www.huya.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 检查元素是否存在的函数
    const checkElement = setInterval(() => {
        try {
            const targetElement = document.querySelector('.player-videotype-list li');
            if (targetElement) {
                // 修改属性值
                if ($(targetElement).data("data").status !== 9) {
                    $(targetElement).data("data").status = 9;
                    alert("成功解锁扫码限制！");
                    // 清除定时器
                    clearInterval(checkElement);
                }
            }
        } catch (error) {
           // 跳过错误信息
        }
    }, 500); // 每 500ms 检查一次
})();
