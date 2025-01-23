import './App.css'
function SecondComponent(){
	return <h1>Hello World</h1>
}
function Mycomponent({children}) {
	return <>
	{children}
	</>
}


function App() {
	return (
		<>
			<Mycomponent>
				<SecondComponent />
			</Mycomponent>

			<Mycomponent children={<SecondComponent />}>
				
			</Mycomponent>
		</>
	)
}

export default App
