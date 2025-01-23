import './App.css'

function Mycomponent({a,b='王曉明',c}) {
	c()
	return <>
		<div>{a}</div>
		<div>{b}</div>
	</>
}


function App() {
	return (
		<>
			<Mycomponent a="hello world" c={()=>console.log(123)} 
				
				/>
		</>
	)
}

export default App
