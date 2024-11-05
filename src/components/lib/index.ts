import LoadLib from "./lib.cpp.js";

let cache : Promise<LibWrapper> | null = null;

type LibWrapper = {
	malloc: (size: number) => number;
  	free: (ptr: number) => void;
	loadGraph: (numNodes: number, nodeLonsPtr: number, nodeLatsPtr: number, numEdges: number, edgeFromPtr: number, edgeToPtr: number, edgeWeightsPtr: number) => void;
	bfs: () => void;
	HEAPF64: Float64Array;
	HEAP32: Int32Array;
};

async function init(): Promise<LibWrapper> {
	const Module = await LoadLib();
	
	const malloc = Module._malloc;
  	const free = Module._free;
	
	const loadGraph = Module.cwrap('loadGraph', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number']);
	const bfs = Module.cwrap('bfs', null, []);

	const HEAPF64 = Module.HEAPF64;
	const HEAP32 = Module.HEAP32;

	return { malloc, free, loadGraph, bfs, HEAPF64, HEAP32 };
}

const Module: Promise<LibWrapper> = (async () => {
	if (!cache) cache = init();
	return cache;
})();

export default Module;