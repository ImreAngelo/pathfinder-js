#include "BFS.h"
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void bfs(int numNodes, double* nodeLons, double* nodeLats, int numEdges, int* edgeFrom, int* edgeTo, double* edgeWeights) {
    EM_ASM(
        console.log("[WASM] BFS!");
    );
}
