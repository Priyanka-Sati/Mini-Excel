for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
        let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;

            if(enteredData === cellProp.value)
                return;

            cellProp.value = enteredData;
            // If data modifies remove P-C relation, formula empty, children with new hardcoded value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);

        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async(e) => {
    let inputFormula = formulaBar.value;
    if(e.key == "Enter" && formulaBar.value){
                
        // if change in formula, break old parent child relationship, evaluate new formula and new parent child relation
        let address = addressBar.value;
        let[cell, cellProp] = getCellAndCellProp(address);
        if(inputFormula !== cellProp.formula){
            removeChildFromParent(cellProp.formula);
        }

        addChildToGraphComponent(inputFormula, address);
        // Check formula is cyclic or not, then only valuate
        // True - cyclic  False - not cyclic
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if(cycleResponse){
            let response = confirm("Your formula is cyclic. Do you want to trace your path?");
            while(response === true){
                // Keep on tracking color until used is satisfied
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse); // I want to complete full iteration of color tracking, so i will attach wait
                response = confirm("Your formula is cyclic. Do you want to trace your path?");
            }

            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);

        
        // update ui and cellprop in db
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        // parent child relationship
        addChildToParent(inputFormula);
        updateChildrenCells(address);
    }
})

// add children to graph component 
function addChildToGraphComponent(formula, childAddress){
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);

    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let assciiValue = encodedFormula[i].charCodeAt(0);
        if(assciiValue >= 65 && assciiValue <= 90){
            let[prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);

            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

// if cycle is presnt remove child from grap component
function removeChildFromGraphComponent(formula, childAddress){
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");

    for(let i = 0; i < encodedFormula.length; i++){
        let assciiValue = encodedFormula[i].charCodeAt(0);
        if(assciiValue >= 65 && assciiValue <= 90){
            let[prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);

            graphComponentMatrix[prid][pcid].pop();
        }
    }
}



// ************* DFS **************
// update children value after the change in the value of parent
function updateChildrenCells(parentAddress){
    let[parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for(let i = 0; i < children.length; i++){
        let childAddress = children[i];
        let[childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);        
    }
}


// Add children to parent
function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let assciiValue = encodedFormula[i].charCodeAt(0);
        if(assciiValue >= 65 && assciiValue <= 90){
            let [ParentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let assciiValue = encodedFormula[i].charCodeAt(0);
        if(assciiValue >= 65 && assciiValue <= 90){
            let [ParentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}


function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");

    for(let i = 0; i < encodedFormula.length; i++){
        let assciiValue = encodedFormula[i].charCodeAt(0); // if there is character it will return ascii value

        if(assciiValue >= 65 && assciiValue <= 90){
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address){
    //let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cell.innerText = evaluatedValue;
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}