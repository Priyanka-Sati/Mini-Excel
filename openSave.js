let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

// Download
downloadBtn.addEventListener("click", (e) => {
    let jsondata = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsondata], { type: "application/json"});
    
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file); // window have global object we can take url through blob
    a.download = "SheetData.json"; // a have attribute download
    a.click(); // for downloading

})

// Open upload
openBtn.addEventListener("click", (e) => {
    // open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    // event -> select file 
    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let files = input.files; 
        let fileObj = files[0];

        // read file
        fr.readAsText(fileObj); 
        // after read
        fr.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fr.result);
            // new sheet
            addSheetBtn.click();

            sheetDB = readSheetData[0];
            graphComponentMatrix = readSheetData[1];
            
            collectedSheetDB[collectedSheetDB.length-1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent.length-1] = graphComponentMatrix;

            handleSheetProperties();
        });


    })

})