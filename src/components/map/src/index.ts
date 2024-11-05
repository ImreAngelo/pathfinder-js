import { haversineDistance } from "../processGeoJSON";
import { Coordinate, transformCoordinates } from "./drawFeatures";

type ReturnType = {
    data: any;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    nodes: Coordinate[];
};

// Add event listener for selecting nodes
export const addListener = ({ data, canvas, ctx, nodes }: ReturnType) => {    
    canvas.addEventListener('click', event => {
        // Get mouse coordinates relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find the closest node
        const [ nodeId, nodeIndex ] = findClosestNode(nodes, x, y);
        // console.log("Closest:", data.features[nodeId]);

        if (nodeId === -1) {
            console.error('No nodes found.');
            return;
        }

        // clickCount++;

        // Highlight the selected node
        highlightNode(data, canvas, nodeId, nodeIndex);
    });

    return { data, canvas, ctx, nodes };
}

function findClosestNode(nodes: Coordinate[], lon: number, lat: number) : number[] {
    let minDist : number = Infinity;
    let closestNodeId : number = -1;
    let closestIndex : number = 0;
    
    for (const node of nodes) {
        const dx = lon - node.lon;
        const dy = lat - node.lat;
        const dist = dx*dx + dy*dy;
        if (dist < minDist) {
            minDist = dist;
            closestNodeId = node.id;
        }
    }
    
    return [ closestNodeId, closestIndex ];
}

// Highlight node in map
function highlightNode(data: any, canvas: HTMLCanvasElement, nodeId: number, nodeIndex: number = 0) {
    const node = data.features[nodeId];
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.beginPath();
    const [x0, y0] = node.geometry.coordinates[nodeIndex];
    const [x1, y1] = transformCoordinates(canvas, x0, y0);
    ctx.arc(x1, y1, 1, 0, 2 * Math.PI);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    // ctx.beginPath();
    // ctx.fillStyle = 'green';

    // node.geometry.coordinates.forEach(function(coord : number[], index : number) {
    //     const [x, y] = transformCoordinates(canvas, coord[0], coord[1]);
    //     if (index === 0) ctx.moveTo(x, y);
    //     else ctx.lineTo(x, y);
    // });

    // console.log(node);

    // ctx.fill();
}