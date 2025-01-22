import './App.css'

function Mycomponent() {
  return <h1>你好 </h1>
}


function App() {
  const text = 'hello world!!!'
  const handleClick=() =>{
    alert('測試箭頭函數')
  }
  return (
    <>
    <button className='my5' onClick={function(){alert('你好')}}>我是按紐</button>
    <br />
    <button className='my5' onClick={handleClick}>我是按紐 箭頭函數</button>
    <br />
    <input type="text" placeholder={text} />
      <h1 className="h1-tag" style={{backgroundColor:'red'}} >{text.toUpperCase()}</h1>
      <div><Mycomponent /></div>
    </>
  )
}

export default App
