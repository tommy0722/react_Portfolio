import './App.css'

function Mycomponent() {
	let click = 0;
	const handleClick = () => {
		click++;
		console.log(click);
	}
	return <>
		<button onClick={handleClick}>點擊次數：{click}</button>
	</>
}


function App() {
	return (
		<>
			<Mycomponent />
		</>
	)
}

export default App
