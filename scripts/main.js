
const config = {
	minVoltage: 0,
	maxVoltage: 20,
	maxHookPrecentage: -80,
	minHookPrecentage: -70,
	maxGrabberPrecentage: -75,
	minGrabberPrecentage: 0
};

$(document).ready(() => {

	NetworkTables.addWsConnectionListener(()=>{
		setStatusCheckElement("webSocketConnected", NetworkTables.isWsConnected());
	});

	NetworkTables.addRobotConnectionListener(()=>{
		setStatusCheckElement("robotConnected", NetworkTables.isRobotConnected());
	});

	NetworkTables.addGlobalListener(keyValueChanged, true);

	setStatusCheckElement("webSocketConnected", NetworkTables.isWsConnected());
	setStatusCheckElement("robotConnected", NetworkTables.isRobotConnected());

	updateVoltage(10);
});


Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function keyValueChanged(key, value, isNew){
	if(statusCheckElements.indexOf(key) > -1){
		setStatusCheckElement(key, value);
		return;
	}
	if(key == "voltage") {
		updateVoltage(value);
		return;
	}

	// By default, get an element with the ID of the key and set its text to the value.
	$("#"+key).text(value);
}


// Voltage metre
function updateVoltage(voltage){	
	var ofPotential = voltage.map(config.minVoltage, config.maxVoltage, 0, 100);

	$("#voltageIndicatorBar").css("margin-left", ofPotential+"%")
	$("#voltage").text(voltage)
}


// Robot diagram
function updateHookLength(hookLengthPrecentage){
	$("#robotHook").css("margin-top", hookLengthPrecentage.map(0, 100, config.minHookPrecentage, config.maxHookPrecentage)+"%");
}

function updateGrabberLengh(grabberLengthPrecentage){
	$("#robotGrabber").css("margin-top", grabberLengthPrecentage.map(0, 100, config.minGrabberPrecentage, config.maxGrabberPrecentage)+"%");
}

function updateBlockHeld(value){
	$("#robotCube").css("display", value ? "inline" : "none");
}

// Type status check ids in  which have associated keys
const statusCheckElements = [""]
// Status items
function setStatusCheckElement(elementID, status, err) {
	$("#"+elementID).removeClass().addClass("glyphicon")
		.addClass(status ? "glyphicon-ok" : (err) ? "glyphicon-flag" : "glyphicon-remove")
		.addClass(status ? "text-success" : "text-danger")
		.text(err);
}