import { Component, createEffect, createSignal, For, onMount } from 'solid-js';
import LibModule from "../lib";
import Square from './square';
import "./grid.css";

const Grid : Component = () => {
	const [ms, setMs] = createSignal<number>(0);
	const [path, setPath] = createSignal<number[]>([]);
    const [matrix, setMatrix] = createSignal<number[]>([
        1, 0, 1, 1, 1,
        1, 0, 0, 0, 1,
        1, 1, 1, 0, 1,
        1, 1, 1, 0, 0,
        1, 1, 1, 1, 1,
    ]);

    const rows = 5;
    const cols = 5;
	
    createEffect(async () => {
		const Module = await LibModule();
		const mat = matrix();

		const start = performance.now();

        // Call the C++ function
        const resultVector = await Module.bfs(mat, rows, cols);
		
        // Convert the result vector to a JS array
		const resultPath = [];
        for (let i = 0; i < resultVector.size(); i++) {
            resultPath.push(resultVector.get(i));
        }

        resultVector.delete();

		// Measure the C++ specifics
		const end = performance.now();
		setMs(end - start);

        // Update path
        setPath(resultPath);
    });
	
    return (
        <div>
			<div class='grid' style={{
				"grid-template-columns": `repeat(${rows}, 1fr)`,
			}}>
				<For each={matrix()}>
					{(v, i) => {
						const x = Math.floor(i()/rows);
						const y = i() % cols;
					
					return (
						<Square x={x} y={y} 
							state={v == 0} 
							highlight={path().includes(x * rows + y)}
						/>
					)}}
				</For>
			</div>
			<div style={{ "padding-top": "0.5rem" }}>
				Execution time: {ms()} ms
			</div>
            <div>
                <h2>Path Found:</h2>
                <ul>
                    {path().map((nodeIndex) => (
                        <li>{`Node Index: ${nodeIndex}`}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Grid;