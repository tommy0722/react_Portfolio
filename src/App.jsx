import { useState } from 'react';
import './App.css'
function ChlidCompoent({clicks}){
	return <div>{clicks}</div>
}
function Mycomponent() {
	const [clicks,setclicks] = useState(0);
	const handleClick = () => {
		setclicks(clicks+1)
		console.log(clicks);
	}

	return <>
		<button onClick={handleClick}>點擊次數：{clicks}</button>
		<ChlidCompoent clicks={clicks} />
	</>
}


function App() {
	return (
		<>
			<Mycomponent />
			<Mycomponent />
			<Mycomponent />
		</>
	)
}

export default App
