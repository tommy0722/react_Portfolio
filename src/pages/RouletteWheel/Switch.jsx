import React from 'react';
import './Switch.css'; // 假设你将下面的CSS保存在Switch.css文件中

function Switch({ isActive, toggle }) {
  return (
    <div className={`container1 ${isActive ? 'is-active' : ''}`} onClick={toggle}>
      <div className="circle"></div>
    </div>
  );
}

export default Switch;
