function initController(canvas, nNet){
  
    canvas.addEventListener("click", function(event) {
        canvasClick(event);
    }); //
        //var index = 0;
        //for(inputNode of inputNodes) {
        //    if(Math.sqrt(Math.pow(inputNode.x - event.x,2) + Math.pow(inputNode.y - event.y,2)) < 20 ){
        //        inputArr[index] = 1 - inputArr[index];
        //        setOutputArr(type);
        //        inputNodes[index].value = inputArr[index];
        //        inputNodes[index].bias = inputArr[index];
        //        clearCanvas();
        //        drawNet(myNet)
        //    }
        //    index++;
        //}
    //})    
}

function setOutputArr(outputType){
    type = outputType
    if(type == "OR" && (inputArr[0] || inputArr[1]))
        outputArr[0] = 1
    else if(type=="OR")
        outputArr[0] = 0
    else if(type == "AND" && (inputArr[0] && inputArr[1]))
        outputArr[0] = 1
    else if(type=="AND")
        outputArr[0] = 0
    else if(type == "XOR" && !(inputArr[0] && inputArr[1]) && (inputArr[0] || inputArr[1]))
        outputArr[0] = 1
    else if(type=="XOR")
        outputArr[0] = 0
    else if(type == "NAND" && !(inputArr[0] || inputArr[1]))
        outputArr[0] = 1
    else if(type=="NAND")
        outputArr[0] = 0 
}

function startStop(){
    animate = !animate;
    if(animate) {
        requestAnimationFrame(drawLoop);
    }
}

function canvasClick(event) {
    var mouseX = event.x, mouseY = event.y;
    for(layer of myNet.nodes) {
        for(node of layer) {
            if (Math.sqrt(Math.pow(node.x - mouseX,2) + Math.pow(node.y - mouseY,2)) < 20){
                if(node.layer == 0){
                    inputArr[node.index] = 1 - inputArr[node.index];
                    setOutputArr(type);
                    inputNodes[node.index].value = inputArr[node.index];
                    inputNodes[node.index].bias = inputArr[node.index];
                    drawNet(myNet)
                }
            }

        }
    }
}