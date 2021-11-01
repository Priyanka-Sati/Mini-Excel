// Storage
let collectedGraphComponent = [];
let graphComponentMatrix = [];

// for(let i = 0; i < rows; i++){
//     let row = [];
//     for(let j = 0; j < cols; j++){
//         // why array -> more then one child relation(dependency)
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }

// Check is graph cyclic
function isGraphCyclic(graphComponentMatrix){
    // Dependency -> visited, dfsVisited
    let visited = []; // node visited trace
    let dfsVisited = []; // stack visited trace

    for(let i = 0; i < rows; i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j = 0; j < cols; j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(visited[i][j] === false){
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if(response == true)
                    return [i, j];
            }
        }
    }
    return null;
}

// Start = vis(True) dfsVis(True)
// End = dfsVis(False)
// if vis[i][j] = true -> already visited go back
// Cycle detection condition -> if(vis[i][j] == true && dfsvis[i][j] = true)
function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited){

    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    for(let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++){
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];

        if(visited[nbrr][nbrc] === false){
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if(response === true)
                return true;
        }
        else if(visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true){
            return true; // found cycle
        } 
    }


    dfsVisited[srcr][srcc] = false;
    return false;
}