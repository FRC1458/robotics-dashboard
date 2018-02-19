
const config = {
	minVoltage: 0,
	maxVoltage: 20,
	maxHookPrecentage: -80,
	minHookPrecentage: -70,
	maxGrabberPrecentage: -75,
	minGrabberPrecentage: 0,
	imageURL: "test/chassis.png"
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

	NetworkTables.addKeyListener("/SmartDashboard/Arcade", (key, val) => {
		$("#driveSelect").value(`${val === "a" ? "Arcade" : "Tank"} Drive`)
	}, true)
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

	if(key == "hookLength"){
		updateHookLength(value);
		return;
	}

	if(key == "grabberLength"){
		updateGrabberLengh(value);
		return;
	}

	if(key == "blockHeld"){
		updateBlockHeld(value);
		return;
	}

	$("#"+key).text(value);
}

const statusCheckElements = [""]
function setStatusCheckElement(elementID, status, err) {
	$("#"+elementID).removeClass().addClass("glyphicon")
		.addClass(status ? "glyphicon-ok" : (err) ? "glyphicon-flag" : "glyphicon-remove")
		.addClass(status ? "text-success" : "text-danger")
		.text(err);
}

function updateHookLength(hookLengthPrecentage){
	$("#robotHook").css("margin-top", hookLengthPrecentage.map(0, 100, config.minHookPrecentage, config.maxHookPrecentage)+"%");
}

function updateGrabberLengh(grabberLengthPrecentage){
	$("#robotGrabber").css("margin-top", grabberLengthPrecentage.map(0, 100, config.minGrabberPrecentage, config.maxGrabberPrecentage)+"%");
}

function updateBlockHeld(value){
	$("#robotCube").css("display", value ? "inline" : "none");
}

function driveSelectChanged() {
	var newValue = ($("#driveSelect") == "Tank Drive" ? "t" : "a")
    NetworkTables.putValue("SmartDashboard/Arcade", newValue);
}

function updateVoltage(voltage){	
	var ofPotential = voltage.map(config.minVoltage, config.maxVoltage, 0, 100);

	$("#voltageIndicatorBar").css("margin-left", ofPotential+"%")
	$("#voltage").text(voltage)
}

function refreshImage() {
	$("#camFeed").prop("src", "")
	setTimeout(() => { $("#camFeed").prop("src", config.imageURL) }, 100)
}

refreshImage();