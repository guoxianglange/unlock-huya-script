// ==UserScript==
// @name         解锁虎牙扫码限制
// @namespace    http://tampermonkey.net/
// @version      2025-02-03
// @description  解锁虎牙最新限制：当观看最高画质时需要手机虎牙扫码
// @author       郭巷蓝歌
// @match        https://www.huya.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 记录上次 alert 时间
    let lastAlertTime = 0;
    // 设置 1 秒冷却时间
    const alertCooldown = 1000;

    // 修改属性值
    const checkElement = setInterval(() => {
        try {
            const targetElement = document.querySelectorAll('.player-videotype-list li');
            if (targetElement) {
                // 修改属性值
                targetElement.forEach((element) => {
                    try {
                        var isFlag = false
                        if ($(element).data("data").status !== 9) {
                            $(element).data("data").status = 9;
                            isFlag = true
                        }
                        if (isFlag) {
                            const now = Date.now();
                            if (now - lastAlertTime > alertCooldown) {
                                alert("成功解锁扫码限制！");
                                lastAlertTime = now; // 更新上次 alert 时间
                            }
                        }
                    } catch (e) {
                        // 跳过错误信息
                    }
                })
                // 清除定时器
                //clearInterval(checkElement);
            }
        } catch (error) {
            // 跳过错误信息
        }
    }, 500); // 每 500ms 检查一次

    // 防止切换线路时降画质
    // 定时任务，每 500ms 查找 .player-videotype-list
    const intervalId = setInterval(() => {
        const targetNode = document.querySelector(".player-videotype-list");

        if (targetNode) {

            // 找到后清除定时任务
            clearInterval(intervalId);

            // 监听 .player-videotype-list 变化
            observeListChanges(targetNode);
        }
    }, 500);

    // 监听列表变化的函数
    function observeListChanges(targetNode) {
        const config = {childList: true, subtree: false};

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.type === "childList") {
                    const list = document.querySelector(".player-videotype-list");
                    const items = list.querySelectorAll("li");

                    if (items.length > 0) {
                        // 如果已经存在 data-cloned="true" 的 li，不再重复插入
                        if (list.querySelector('li[data-cloned="true"]')) {
                            return;
                        }

                        // 复制第一个 li
                        const firstLiClone = items[0].cloneNode(true);

                        // 标记克隆的 li，防止死循环
                        firstLiClone.setAttribute("data-cloned", "true");

                        // 确保 `on` class 正确设置
                        firstLiClone.classList.remove("on");
                        firstLiClone.classList.add("on");

                        // 设置 `display: none`
                        firstLiClone.style.display = "none";

                        // 插入到列表最前面
                        list.insertBefore(firstLiClone, list.firstChild);
                    }
                }
            });
        });

        // 启动 MutationObserver 监听
        observer.observe(targetNode, config);
    }
})();
