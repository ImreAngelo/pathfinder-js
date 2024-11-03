import { Component, createEffect, createSignal } from "solid-js";
import Lib from "../lib";

const Map : Component = () => {
    const [ms, setMs] = createSignal<number>(0);
	
    createEffect(async () => {
        const Module = await Lib();
		// const mat = matrix();
        
        const start = performance.now();
        
        // // Call the C++ function
        // const resultVector = await Module.bfs(mat, rows, cols);
        Module.draw_map();
		
        // // Convert the result vector to a JS array
		// const resultPath = [];
        // for (let i = 0; i < resultVector.size(); i++) {
        //     resultPath.push(resultVector.get(i));
        // }

        // resultVector.delete();

		// Measure the C++ specifics
		const end = performance.now();
		setMs(end - start);

        // // Update path
        // setPath(resultPath);
    });

    return (
        <div>
            <canvas id="canvas"></canvas>
            <div>Rendering map took {ms()} ms</div>
        </div>
    )
}

export default Map;