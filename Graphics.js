var canvas;
var ctx;
var canvasReady = false;
var animate = false;


function clearCanvas() {
    if (!canvasReady)
        return;
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(0,0, canvas.width, canvas.height);
}

function initGraphics() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvasReady = true;
}

function drawNode(node){
    var color;
    ctx.beginPath();
    if(Math.abs(node.bias) < 0.001) {
        color = 'rgba(0,0,0,1)';
    }
    else if (node.bias > 0) {
        color = 'rgba(0,180,0,1)';
    }
    else if (node.bias <= 0){
        color = 'rgba(180,0,0,1)';
    }
    ctx.fillStyle = color
    ctx.arc(node.x, node.y, 25 +  Math.abs(node.bias), 0, 2 * Math.PI)
    ctx.fill();
    ctx.beginPath();
    if(Math.abs(node.value) < 0.001) {
        color = 'rgba(0,0,0,1)';
    }
    else if (node.value > 0) {
        color = 'rgba(0,180,0,1)';
    }
    else if (node.value <= 0){
        color = 'rgba(180,0,0,1)';
    }
    ctx.fillStyle = color
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
    ctx.fill();
}

function drawConnection(connection){
    ctx.beginPath();
    ctx.moveTo(connection.nodeLeft.x, connection.nodeLeft.y);
    ctx.lineTo(connection.nodeRight.x, connection.nodeRight.y);
    ctx.lineWidth = Math.abs(connection.weight) * 5;
    if (connection.weight < 0) {
        ctx.strokeStyle = 'rgba(180,0,0,1)';
    }
    else {
        ctx.strokeStyle = 'rgba(0,180,0,1)';
    }
    ctx.stroke();
}

function drawNet(netToDraw){
    clearCanvas();
    drawController();
    for(layer of netToDraw.nodes) {
        for(node of layer){
            var connections = node.forwardConnections();
            for(connection of connections){
                drawConnection(connection);
            }
            drawNode(node);
        }
    }
}

function drawController() {

}

function drawLoop() {
    if (!animate)
        return;
    //forward calc
    //ctx.fillText("Forward Calc", canvas.width/2, 20);
    myNet.forwardCalc();
    drawNet(myNet);
    //backward calc
    //ctx.fillText("Backward Propogation", canvas.width/2, 20);
    myNet.findErrorVals(outputArr);
    drawNet(myNet);
    //update values
    //ctx.fillText("Update Net Values", canvas.width/2, 20);
    myNet.updateWeights();
    myNet.updateBiases();
    drawNet(myNet);

    requestAnimationFrame(drawLoop);
}