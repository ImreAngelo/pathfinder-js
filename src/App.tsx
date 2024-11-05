import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
// import Grid from './components/grid'
import './App.css'
import Map from './components/map'

function App() {
	const [count, setCount] = createSignal(0)

	return (
		<div style={{ display:"flex", gap: "4rem", "justify-content": "space-evenly", width: "100%" }}>
			{/* <div>
				<div>
					<a href="https://vite.dev" target="_blank">
						<img src={viteLogo} class="logo" alt="Vite logo" />
					</a>
					<a href="https://solidjs.com" target="_blank">
						<img src={solidLogo} class="logo solid" alt="Solid logo" />
					</a>
				</div>
				<h1>Vite + Solid</h1>
				<div class="card">
					<button onClick={() => setCount((count) => count + 1)}>
						count is {count()}
					</button>
					<p>
						Edit <code>src/App.tsx</code> and save to test HMR
					</p>
				</div>
				<p class="read-the-docs">
					Click on the Vite and Solid logos to learn more
				</p>
			</div> */}
			<div>
				{/* <Grid/> */}
				<Map/>
			</div>
		</div>
	)
}

export default App
