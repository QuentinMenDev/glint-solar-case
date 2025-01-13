import "./App.css"
import WorldMap from "./components/WorldMap"

function App() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<div
				style={{
					height: "90vh",
					width: "90vw",
				}}
			>
				<WorldMap />
			</div>
		</div>
	)
}

export default App
