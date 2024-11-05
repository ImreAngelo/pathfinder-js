import { Component, createEffect, createSignal, onMount } from "solid-js";
import processGeoJSON from "./processGeoJSON";
import renderCanvas from "./render";

const Map : Component = () => {
    const [ms, setMs] = createSignal<number>(0);

    onMount(() => {
        const start = performance.now();
        fetch('trondheim.geojson')
            .then(response => response.json())
            .then(renderCanvas)
            .then(processGeoJSON)
            .then(() => {
                const end = performance.now();
		        setMs(end - start);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    });

    return (
        <>
        <div style={{
            "flex-grow":"1",
            "background-color": "#17010b",
            // "background-color": "#171213",
            "border-radius": "8px"
        }}>
            <canvas id="canvas" style={{
                height:"90vh",
                width:"80vw",
            }} width="1920" height="1080"></canvas>
        </div>
        <div style={{ "margin-top":"1.4rem" }}>Loading and rendering map took {ms()} ms</div>
        </>
    )
}

export default Map;