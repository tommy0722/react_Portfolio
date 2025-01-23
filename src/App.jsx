import './App.css'



function App() {
	return (
		<div>
			<div className={true ? 'a c' : 'b c'}>
				{true ? <h1>hello</h1> : <h1>world</h1>}
			</div>
			<div className={`c ${false ? 'a' : 'b'}`}>
				{true ? <h1>hello</h1> : <h1>world</h1>}
			</div>
		</div>
	)

}

export default App
