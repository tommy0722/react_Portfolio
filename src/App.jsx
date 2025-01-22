import './App.css'

function Mycomponent() {
  return <h1>你好 </h1>
}


function App() {
  const listItems=[
    <Mycomponent key='1' />,
    <Mycomponent key='2' />,
    <Mycomponent key='3' />,
  ]
  return (
    <>
      {listItems}
    </>
  )
}

export default App
