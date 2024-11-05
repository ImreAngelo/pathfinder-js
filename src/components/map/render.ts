/** 
 * Render the map in a canvas
 * @param data : any
 * @param canvasID : type - 
 * @returns input data
 **/ 
const renderCanvas = (data : any, canvasID : string = 'canvas') => {
    const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    if(!canvas) {
        console.error(`Canvas element with id '${canvasID}' not found.`);
        return;
    }

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw lines in the GeoJSON data
    data.features.forEach((feature: any) => drawFeature(canvas, ctx, feature));

    // Add event listener for selecting nodes
    canvas.addEventListener('click', e => onCanvasClick(canvas, e));

    return data;
}

const drawFeature = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, feature: any) => {
    if (feature.geometry.type != 'LineString')
        return;

    ctx.beginPath();
    
    feature.geometry.coordinates.forEach(function(coord : number[], index : number) {
        const [x, y] = transformCoordinates(canvas, coord[0], coord[1]);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    // Style the roads
    // TODO: Move colors to color scheme class
    var highwayType = feature.properties.highway;
    switch (highwayType) {
        case 'primary':
            // ctx.strokeStyle = '#e3a209';
            ctx.strokeStyle = '#5c2306';
            ctx.lineWidth = 2.2;
            break;
        default:
            ctx.strokeStyle = '#5c230650';
            ctx.lineWidth = 0.45;
    }

    ctx.stroke();
}

let clickCount = 0;
let startNodeId : number = -1;
let endNodeId : number = -1;
   
// Transform geo-coordinates to canvas coordinates
function transformCoordinates(canvas: HTMLCanvasElement, lon: number, lat: number) {
    // Bounding box for map
    const minLon = 10.31513;
    const minLat = 63.39713;
    const maxLon = 10.52422;
    const maxLat = 63.45887;
    
    const x = ((lon - minLon) / (maxLon - minLon)) * canvas.width;
    const y = canvas.height - ((lat - minLat) / (maxLat - minLat)) * canvas.height;
    return [x, y];
}

function onCanvasClick(canvas: HTMLCanvasElement, event: MouseEvent) {
    // Get mouse coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // // Convert canvas coordinates to longitude and latitude
    // const [lon, lat] = inverseTransformCoordinates(x, y);

    // // Find the closest node
    // const closestNodeId = findClosestNode(lon, lat);

    // if (closestNodeId === null) {
    //     console.error('No nodes found.');
    //     return;
    // }

    // clickCount++;

    // if (clickCount === 1) {
    //     startNodeId = closestNodeId;
    //     console.log(`Start node selected: ${startNodeId}`);
    // } else if (clickCount === 2) {
    //     endNodeId = closestNodeId;
    //     console.log(`End node selected: ${endNodeId}`);
    // }

    // Highlight the selected node
    // highlightNode(closestNodeId);

    if (clickCount === 2) {
        // Call the C++ function to find the path
        // Module.findPath(startNodeId, endNodeId);
        // Reset click count for next selection
        clickCount = 0;
        // Optionally, clear previous highlights
        // clearHighlights();
    }
}

export default renderCanvas;