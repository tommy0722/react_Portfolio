import React, { useEffect } from 'react';
import './AppA.css';

function AppA() {
    useEffect(() => {
        const container = document.querySelector('.contain');
        const boxSize = 50; // 格子大小（固定為 50px）
        const containerWidth = window.innerWidth; // 視窗寬度
        const containerHeight = window.innerHeight; // 視窗高度
        const cols = Math.ceil(containerWidth / boxSize); // 列數
        const rows = Math.ceil(containerHeight / boxSize); // 行數

        // 清空容器，避免多次渲染疊加
        container.innerHTML = '';

        // 動態生成格子
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const box = document.createElement('div');
                box.className = 'box';
                container.appendChild(box);
            }
        }

        // 為每個格子添加滑鼠事件
        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box) => {
            box.addEventListener('mouseover', () => {
                box.classList.add('active');
                box.style.setProperty('--x', getRandomValue());
                box.style.setProperty('--y', getRandomValue());
                const angleValue = Math.random() * 360;
                box.style.filter = `hue-rotate(${angleValue}deg)`;
            });
        });

        function getRandomValue() {
            return `${Math.random() * 2000 - 1000}px`;
        }
    }, []);

    return (
        <div className="AppA">
            <div className="contain"></div>
        </div>
    );
}

export default AppA;
