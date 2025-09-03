import React, { useState } from 'react';
import './PwColor.css';

function AppB() {
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(0);
    const [gradientColor, setGradientColor] = useState('#1115');

    const handlePasswordChange = (event) => {
        const inputPassword = event.target.value;
        setPassword(inputPassword);

        // 計算密碼強度
        const newStrength = Math.min(inputPassword.length, 12); // 最大強度為 12
        setStrength(newStrength);

        // 根據強度設置顏色
        if (newStrength <= 4) {
            setGradientColor('#ff2c1c'); // 弱
        } else if (newStrength <= 8) {
            setGradientColor('#ff9800'); // 中等
        } else {
            setGradientColor('#12ff12'); // 強
        }
    };

    return (
        <div className='body_box'>
            <div className="box">
                <h2>
                    Password Strength <span id="text">Check</span>
                </h2>
                <input
                    type="password"
                    id="password"
                    placeholder="請輸入密碼"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <div
                    className="password-strength"
                    style={{
                        background: `conic-gradient(${gradientColor} ${strength * 30}deg, #1115 ${strength * 30}deg)`,
                    }}
                ></div>
                <div
                    className="password-strength"
                    style={{
                        background: `conic-gradient(${gradientColor} ${strength * 30}deg, #1115 ${strength * 30}deg)`,
                        filter: 'blur(5px)',
                    }}
                ></div>
                <div
                    className="password-strength"
                    style={{
                        background: `conic-gradient(${gradientColor} ${strength * 30}deg, #1115 ${strength * 30}deg)`,
                        filter: 'blur(10px)',
                    }}
                ></div>
            </div>
        </div>
    );
}

export default AppB;
