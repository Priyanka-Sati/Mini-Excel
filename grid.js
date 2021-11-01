let rows = 100;
let cols = 26;

// *************** FIRST COLUMN ***********
let addressColCont = document.querySelector(".address-col-cont");
for(let i = 0; i < rows; i++){
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class", "address-col");
    addressCol.innerText = i+1;
    addressColCont.appendChild(addressCol);
}

// ************ FIRST ROW *****************
let addressRowCont = document.querySelector(".address-row-cont");
for(let i = 0; i < cols; i++){
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class", "address-row");
    addressRow.innerText = String.fromCharCode(65 + i);
    addressRowCont.appendChild(addressRow);
}

// *************** GRID **************
let cellsCont = document.querySelector(".cells-cont");
for(let i = 0; i < 100; i++){
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class", "row-cont");
    for(let j = 0; j < 26; j++){
        let cell = document.createElement("div");
        cell.setAttribute("class","cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("spellcheck", "false");
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);

        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j);
    }
    cellsCont.appendChild(rowCont);
}

// ************** FUNCTION TO PRINT ADDRESS OF CELL IN ADDRESS BAR  ***************
let addressBar = document.querySelector(".address-bar");
function addListenerForAddressBarDisplay(cell, i, j){
    cell.addEventListener("click", (e) => {
        let rowId = i+1;
        let colId = String.fromCharCode(65 + j);
        addressBar.value = `${colId}${rowId}`;
    })
}





