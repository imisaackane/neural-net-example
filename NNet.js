function Connection(nodeLeft, nodeRight) {
    this.weight = Math.random() * 2 - 1;
    this.nodeLeft = nodeLeft;
    this.nodeRight = nodeRight;
}

function Node() {
    this.bias = 10 * Math.random() - 5;
    this.value = 0;
    this.connections = new Array();
    this.err = 0;
    this.layer = 0;
    this.index = 0;
    this.x = 0;
    this.y = 0;
    this.selected = false;

    this.makeForwardConnection = function (otherNode){
        var newConnection = new Connection(this, otherNode);
        this.connections[this.connections.length] = newConnection
        otherNode.addConnection(newConnection);
    }

    this.makeBackwardConnection = function (otherNode){
        var newConnection = new Connection(otherNode, this);
        this.connections[this.connections.length] = newConnection
        otherNode.addConnection(newConnection);
    }

    this.addConnection = function (connection){
        this.connections[this.connections.length] = connection;
    }

    this.forwardConnections = function() {
        var returnList = new Array();
        for (connection of this.connections) {
            if (connection.nodeLeft == this) {
                returnList[returnList.length] = connection;
            }
        }
        return returnList;
    }

    this.backwardConnections = function() {
        var returnList = new Array();
        for (connection of this.connections) {
            if (connection.nodeRight == this) {
                returnList[returnList.length] = connection;
            }
        }
        return returnList;
    }

}

function Net() {
    this.nodes = new Array();
    this.learningRate = 0.05;
    this.errors;
    
    /**
    * @param {string} netAsString String of the shape of a nueral Net in the form "{input layer count, hidden layer 1 count, hidden layer 2 count, ..., hidden layer n count, output layer count}"
    */
    this.buildFromString = function (netAsString) {
        var netArray = netAsString.replace(/\{|\}/g,'').split(', ');
        this.nodes = new Array(netArray.length);
        for(layer in netArray) {
            var layerCount = parseInt(netArray[layer])
            this.nodes[layer] = new Array(layerCount);
            for(var node=0; node < layerCount; node++) {
                this.nodes[layer][node] = new Node()
                this.nodes[layer][node].layer = layer;
                this.nodes[layer][node].index = node;
                this.nodes[layer][node].y = 50 + (500/(layerCount+1))*(node+1);
                this.nodes[layer][node].x = 100 + (800/(netArray.length+1))*(layer);
                if (layer > 0) {
                    for(prevNode of this.nodes[layer-1]){
                        this.nodes[layer][node].makeBackwardConnection(prevNode);
                    }
                }
            }
        }
    }

    this.setInputs = function(inputs) {
        if (inputs.length != this.nodes[0].length) {
            console.log ("err - Input length: " +  inputs.length +"  vs  Input Node Count: " + this.nodes[0].length);
            return;
        }
        
        for(i in inputs) {
            this.nodes[i].bias = inputs[i];
        }
    }

    this.forwardCalc = function(){
        for (layerIndex in this.nodes) {
            for(node of this.nodes[layerIndex]) {
                node.value = node.bias;
                for(connection of node.backwardConnections()) {
                    node.value += connection.weight * connection.nodeLeft.value;
                }
                if (layerIndex != 0 && layerIndex != this.nodes.length-1)
                    node.value = 1/(1+Math.pow(Math.E, node.value))
                node.err = 0;
            }
        }
    }

    this.findErrorVals = function (outputs){
        if (this.nodes[this.nodes.length - 1].length != outputs.length){
            console.log ("err - Output length: " +  outputs.length +"  vs  Output Node Count: " + this.nodes[this.nodes.length - 1].length);
        }
        for(layerIndex in this.nodes){
            var index = this.nodes.length - layerIndex - 1
            var layer = this.nodes[index]
            for(nodeIndex in layer) {
                if (index == this.nodes.length - 1){
                    layer[nodeIndex].err = outputs[nodeIndex] - layer[nodeIndex].value
                }
                else {
                    var forwardConnections = layer[nodeIndex].forwardConnections();
                    var sum = 0;
                    for(connection of forwardConnections) {
                        sum += connection.weight * connection.nodeRight.err;
                    }
                    layer[nodeIndex].err = layer[nodeIndex].value * (1-layer[nodeIndex].value) * sum;
                }
            }
        }
    }

    this.updateWeights = function() {
        for(layer of this.nodes) {
            for (node of layer) {
                var forwardingConnections = node.forwardConnections();
                for (connection of forwardingConnections) {
                    connection.weight +=  this.learningRate * connection.nodeLeft.value * connection.nodeRight.err;
                }
            }
        }
    }

    this.updateBiases = function() {
        for (layerIndex in this.nodes) {
            if(layerIndex != 0){
                for(node of this.nodes[layerIndex]){
                    node.bias += this.learningRate*node.err;
                }
            }
        }   
    }
}


