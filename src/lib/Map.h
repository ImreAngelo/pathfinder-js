#ifndef MAP_H
#define MAP_H

#include <emscripten.h>
#include <emscripten/bind.h>
#include <vector>
#include <unordered_map>
#include <iostream>
#include "Node.h"
#include "Edge.h"


extern "C" namespace Map
{
    std::unordered_map<int, Node> nodes;
    std::vector<Edge> edges;
    std::unordered_map<int, std::vector<std::pair<int, double>>> graph;

    /// @brief Load a graph into virtual memory from javascript
    /// @param numNodes 
    /// @param nodeLons 
    /// @param nodeLats 
    /// @param numEdges 
    /// @param edgeFrom 
    /// @param edgeTo 
    /// @param edgeWeights 
    void loadGraph(int numNodes, double* nodeLons, double* nodeLats, int numEdges, int* edgeFrom, int* edgeTo, double* edgeWeights);
}

#endif