#include "Map.h"

EMSCRIPTEN_KEEPALIVE
void Map::loadGraph(int numNodes, double* nodeLons, double* nodeLats, int numEdges, int* edgeFrom, int* edgeTo, double* edgeWeights) {
    EM_ASM(
        console.log("[WASM] Loading graph.")
    );

    // Populate nodes
    for (int i = 0; i < numNodes; ++i) {
        nodes[i] = { i, nodeLons[i], nodeLats[i] };
    }

    // Populate edges
    for (int i = 0; i < numEdges; ++i) {
        edges.push_back({ edgeFrom[i], edgeTo[i], edgeWeights[i] });
    }

    // Build the graph
    for (const auto& edge : edges) {
        graph[edge.from].emplace_back(edge.to, edge.weight);
    }

    EM_ASM({
        console.log("[WASM] Loaded ", $0, " edges and ", $1, " nodes.");
    }, edges.size(), numNodes);
}

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("loadGraph", &Map::loadGraph, emscripten::allow_raw_pointers());
}

