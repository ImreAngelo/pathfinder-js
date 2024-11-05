import Lib from "../lib/index.ts";

function processGeoJSON(data : any) {
    const nodes : any = {};
    const edges : any = [];
    let nodeIdCounter : number = 0;
    const coordToNodeId : any = {};

    data.features.forEach((feature : any) => {
        if (feature.geometry.type === 'LineString') {
            const coords = feature.geometry.coordinates;

            for (let i = 0; i < coords.length - 1; i++) {
                const coord1 = coords[i];
                const coord2 = coords[i + 1];
                const key1 = coord1.join(',');
                const key2 = coord2.join(',');

                let nodeId1, nodeId2;

                if (!(key1 in coordToNodeId)) {
                    nodeId1 = nodeIdCounter++;
                    coordToNodeId[key1] = nodeId1;
                    nodes[nodeId1] = { id: nodeId1, lon: coord1[0], lat: coord1[1] };
                } else {
                    nodeId1 = coordToNodeId[key1];
                }

                if (!(key2 in coordToNodeId)) {
                    nodeId2 = nodeIdCounter++;
                    coordToNodeId[key2] = nodeId2;
                    nodes[nodeId2] = { id: nodeId2, lon: coord2[0], lat: coord2[1] };
                } else {
                    nodeId2 = coordToNodeId[key2];
                }

                // Calculate weight (distance)
                const weight = haversineDistance(coord1[0], coord1[1], coord2[0], coord2[1]);

                // Add edges
                edges.push({ from: nodeId1, to: nodeId2, weight: weight });
                edges.push({ from: nodeId2, to: nodeId1, weight: weight });
            }
        }
    });

    // Pass the nodes and edges to C++ code
    loadGraphIntoCpp(nodes, edges);
}

// Haversine distance function
function haversineDistance(lon1 : number, lat1 : number, lon2 : number, lat2 : number) {
    const R = 6371000; // Earth radius in meters
    const toRad = (x : number) => (x * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// 
async function loadGraphIntoCpp(nodesObj : any, edgesArray : any) {
    const numNodes = Object.keys(nodesObj).length;
    const nodeLons = new Float64Array(numNodes);
    const nodeLats = new Float64Array(numNodes);

    for (const nodeId in nodesObj) {
        const node = nodesObj[nodeId];
        nodeLons[node.id] = node.lon;
        nodeLats[node.id] = node.lat;
    }

    const numEdges = edgesArray.length;
    const edgeFrom = new Int32Array(numEdges);
    const edgeTo = new Int32Array(numEdges);
    const edgeWeights = new Float64Array(numEdges);

    for (let i = 0; i < numEdges; i++) {
        const edge = edgesArray[i];
        edgeFrom[i] = edge.from;
        edgeTo[i] = edge.to;
        edgeWeights[i] = edge.weight;
    }

    console.log(`Loading graph with ${numEdges} edges and ${numNodes} nodes into C++`);
    const Module = await Lib;

    // Allocate memory on the Emscripten heap
    const nodeLonsPtr = Module.malloc(nodeLons.length * nodeLons.BYTES_PER_ELEMENT);
    const nodeLatsPtr = Module.malloc(nodeLats.length * nodeLats.BYTES_PER_ELEMENT);
    Module.HEAPF64.set(nodeLons, nodeLonsPtr / nodeLons.BYTES_PER_ELEMENT);
    Module.HEAPF64.set(nodeLats, nodeLatsPtr / nodeLats.BYTES_PER_ELEMENT);

    const edgeFromPtr = Module.malloc(edgeFrom.length * edgeFrom.BYTES_PER_ELEMENT);
    const edgeToPtr = Module.malloc(edgeTo.length * edgeTo.BYTES_PER_ELEMENT);
    const edgeWeightsPtr = Module.malloc(edgeWeights.length * edgeWeights.BYTES_PER_ELEMENT);
    Module.HEAP32.set(edgeFrom, edgeFromPtr / edgeFrom.BYTES_PER_ELEMENT);
    Module.HEAP32.set(edgeTo, edgeToPtr / edgeTo.BYTES_PER_ELEMENT);
    Module.HEAPF64.set(edgeWeights, edgeWeightsPtr / edgeWeights.BYTES_PER_ELEMENT);

    // Call the C++ function
    Module.loadGraph(numNodes, nodeLonsPtr, nodeLatsPtr, numEdges, edgeFromPtr, edgeToPtr, edgeWeightsPtr);

    // Free the allocated memory
    Module.free(nodeLonsPtr);
    Module.free(nodeLatsPtr);
    Module.free(edgeFromPtr);
    Module.free(edgeToPtr);
    Module.free(edgeWeightsPtr);

    // Now you can proceed to perform pathfinding in C++
    // findAndDrawPath();
    Module.bfs();
}


export default processGeoJSON;