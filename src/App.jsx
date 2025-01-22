import './App.css'

function Mycomponent() {
	return <h1>你好 </h1>
}


function App() {
	const listItems = [
		{ content: '張三', id: 'abc' },
		{ content: '李四', id: 'qaz' },
		{ content: '老五', id: 'wsx' },
	]
	const filterItems = listItems.filter((item) =>{
		if (item.content !== '李四'){
			return true
		}
	})
	return (
		<>
			{listItems.map((item) => {
				return <div key={item.id}>{item.content}</div>
			})}
			{filterItems.map((item) => {
				return <div key={item.id}>{item.content}</div>
			})}
		</>
	)
}

export default App
