// ********* STOREAGE ************
let collectedSheetDB = []; // contains all sheet DB
let sheetDB = [];

{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
}


// for(let i = 0; i < rows; i++){
//     let sheetRow = [];
//     for(let j = 0; j < cols; j++){
//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             BGcolor: "#000000",
//             value: "",
//             formula: "",
//             children: [],
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

// SELECTERS FOR CELL PROPERTIES

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let alignment = document.querySelectorAll(".alignment");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];


// ************* ATTACH PROPERTY LISTENERS ************
//    APPLICATION OF TWO WAY BINDING
//    change of ui and storage

//let addressBar = document.querySelector(".address-bar");
let activeCellProp = "#d1d8e0";
let inactiveCellProp = "#ecf0f1";


//        bold property 
bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let[cell, cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.bold = !cellProp.bold;
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; 
    bold.style.backgroundColor = cellProp.bold ? activeCellProp : inactiveCellProp;
});

//        italic property 
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let[cell, cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.italic = !cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; 
    italic.style.backgroundColor = cellProp.italic ? activeCellProp : inactiveCellProp;
});

//        unuderline property 
underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let[cell, cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.underline = !cellProp.underline;
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; 
    underline.style.backgroundColor = cellProp.underline ? activeCellProp : inactiveCellProp;
});

//        fontsize property 
fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let[cell, cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.fontSize = fontSize.value;
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
});

//        fontfamily property 
fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let[cell, cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.fontFamily = fontFamily.value;
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
});

//       font color
fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let[cell, cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
});

//         background color
BGcolor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let[cell, cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.BGcolor = BGcolor.value;
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
})

//        alignment
alignment.forEach((alignelem) => {
    alignelem.addEventListener("click", (e) => {
        let address = addressBar.value;
        let[cell, cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue
        cell.style.textAlign = cellProp.alignment;

        switch(alignValue){
            case "left": 
                leftAlign.style.backgroundColor = activeCellProp;
                centerAlign.style.backgroundColor = inactiveCellProp;
                rightAlign.style.backgroundColor = inactiveCellProp;
                break;
            
            case "center":
                leftAlign.style.backgroundColor = inactiveCellProp;
                centerAlign.style.backgroundColor = activeCellProp;
                rightAlign.style.backgroundColor = inactiveCellProp;
                break;
            
            case "right":
                leftAlign.style.backgroundColor = inactiveCellProp;
                centerAlign.style.backgroundColor = inactiveCellProp;
                rightAlign.style.backgroundColor = activeCellProp;
                break;
        }
    })
})

let allcells = document.querySelectorAll(".cell");
for(let i = 0; i < allcells.length; i++){
    addListenerToAttachCellProperties(allcells[i]);
}


function addListenerToAttachCellProperties(cell){
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        // Apply cell properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; 
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; 
        cell.style.textDecoration = cellProp.underline ? "underline" : "none"; 
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor == "#000000" ? "tansparent" : cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;
       
        
        // Apply properties to ui container
        bold.style.backgroundColor = cellProp.bold ? activeCellProp : inactiveCellProp;
        italic.style.backgroundColor = cellProp.italic ? activeCellProp : inactiveCellProp;
        underline.style.backgroundColor = cellProp.underline ? activeCellProp : inactiveCellProp; 
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        switch(cellProp.alignment){
            case "left": 
                leftAlign.style.backgroundColor = activeCellProp;
                centerAlign.style.backgroundColor = inactiveCellProp;
                rightAlign.style.backgroundColor = inactiveCellProp;
                break;
            
            case "center":
                leftAlign.style.backgroundColor = inactiveCellProp;
                centerAlign.style.backgroundColor = activeCellProp;
                rightAlign.style.backgroundColor = inactiveCellProp;
                break;
            
            case "right":
                leftAlign.style.backgroundColor = inactiveCellProp;
                centerAlign.style.backgroundColor = inactiveCellProp;
                rightAlign.style.backgroundColor = activeCellProp;
                break;
        }
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    })
}




function getCellAndCellProp(address){
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    
    // access cell and storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return[cell, cellProp];
}

function decodeRIDCIDFromAddress(address){
    let rid = Number(address.slice(1) -1);
    let cid = Number(address.charCodeAt(0)) - 65;
    return [rid, cid];
}

alert(`Write formula in this format -> ( A1 + B2 )

copy -> ctrl + (select range (first and last cell))

paste -> click on the cell from where you want to paste then click past icon

cut -> delete -> ctrl + (select range (first and last cell)) then click cut icon`);