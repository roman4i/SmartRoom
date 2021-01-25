let buferDD = [];
let containers = [];

function addContainers(){
    let header = document.createElement("div");
    header.classList = "header";
    header.innerText = "Smart Room Control";
    header.id = "head";

    document.body.append(header);
    document.body.append(createBigCont());

    let mainContainer = document.createElement("div");
    mainContainer.classList = "mainCont";
    mainContainer.id = "mainContainer";
    document.body.append(mainContainer);

    containers[0] = {
        type: "pwm", name: "LED1", pin: 13, valuePWM: 0
    };
    containers[1] = {
        type: "pwm", name: "LED2", pin: 12, valuePWM: 0
    };
    containers[2] = {
        type: "sensor", name: "BMP180", sensorFunction: bmp180
    };
    containers[3] = {
        type: "binary", name: "PSU", pin: 14, valueBin: 0
    };

    for(let key in containers){
       document.getElementById("mainContainer").append(addSingleContainer(containers[key], key));
    };
}

function addSingleContainer(contObj, contPos){
    //creating of new container
    let contDiv = document.createElement("div");
    contDiv.id = "cont" + contPos;
    contDiv.classList = "cont unselectable";

    //div head container
    let contHead = document.createElement("div");
    contHead.classList = "contHead";

    //div for container name
    let contName = document.createElement("div");
    contName.id = "ctName" + contPos;
    contName.innerText= contObj.type + " " + contObj.name;
    
    //div for X "button"
    let delHeadDiv = document.createElement("div");
    delHeadDiv.innerText = "X";
    delHeadDiv.classList = "delCont";

    contDiv.append(contHead);
    contHead.append(contName);
    contHead.append(delHeadDiv);
    contDiv.append(document.createElement("br"));

    if(contObj.type == "pwm"){
        contDiv = addPWMContainer(contPos, contObj, contDiv);
    }
    if(contObj.type == "sensor")
    {
        contDiv = addSensorContainer(contPos, contObj, contDiv);
    }
     if(contObj.type == "binary"){
         contDiv = addBinaryContainer(contPos, contObj, contDiv);
     }

    return contDiv;
}

function createBigCont(){
    let bigDragCont = document.createElement("div");
    bigDragCont.id = "bigTarget";
    bigDragCont.classList = "bigContainer";

    bigDragCont.onmouseup = () => {
        if((buferDD[0] != null) && (buferDD[0] != buferDD[1])){
            if(document.getElementById("bigTarget") != null){
                document.getElementById("bigTarget").remove();
            }
            let smCont = addSingleContainer(containers[buferDD[0]], "Big");
            smCont.classList = "bigContainer unselectable";
            smCont.id = "bigTarget";
            smCont.onmouseup = bigDragCont.onmouseup;
            smCont.onmousedown = null;
            console.log(smCont.childNodes[2]);
            smCont.childNodes[2].onchange = null;
            if(document.getElementById("range"+buferDD[0]) != null){
                smCont.childNodes[2].onchange = () =>{
                    console.log(buferDD);
                    document.getElementById("range"+buferDD[0]).value = smCont.childNodes[2].value;
                    smCont.childNodes[3].innerText = "Value: " + smCont.childNodes[2].value;
                    document.getElementById("range"+buferDD[0]+"txt").innerText = "Value: " + smCont.childNodes[2].value;
                    console.log(smCont.childNodes[3].innerText);
                }
            }
            console.log(smCont.childNodes[3].innerText);
            document.getElementById("head").after(smCont);
            buferDD[1] = buferDD[0];
        }
    }
    return bigDragCont;
}

function addPWMContainer(contNum, targetObj, modCont){

    //input with range
    let powerRange = document.createElement("input");
    powerRange.id = "range" + contNum;
    powerRange.type = "range";
    powerRange.min = "0";
    powerRange.max = "1023";
    powerRange.value = targetObj.valuePWM;
    powerRange.onchange = function(){
        let textVal = document.getElementById("range" + contNum + "txt");
        textVal.textContent = "Value: " + document.getElementById(powerRange.id).value;
        targetObj.valuePWM = document.getElementById(powerRange.id).value;
    };

    //div with numbers from range
    let powerLevel = document.createElement("div");
    powerLevel.id = "range" + contNum + "txt";
    powerLevel.innerText = "Value: " + targetObj.valuePWM;

    //button for sending parameters
    let sendBtn = document.createElement("input");
    sendBtn.id = "cont" + contNum + "btn";
    sendBtn.type = "button";
    sendBtn.value = "Send";
    sendBtn.onclick = function (){
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/pwm?" + targetObj.name + "=" + powerRange.value, true);
        xhr.send();
    }

    modCont.appendChild(powerRange);
    modCont.appendChild(powerLevel);
    modCont.appendChild(sendBtn); 

    modCont.onmousedown = () => {
        buferDD[0] = contNum;
    }
    return modCont;
}

function addSensorContainer(contNum, targetObj, modCont){

    let sensorOutVal = document.createElement("div");
    sensorOutVal.id = "sensor"+contNum+"txt";
    sensorOutVal.innerText = targetObj.sensorFunction();

    modCont.appendChild(sensorOutVal);

    return modCont;
}

function bmp180(){
    setInterval(function ( ) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            document.getElementById("temperature").innerHTML = this.responseText;
          }
        };
        xhttp.open("GET", "/temperature", true);
        xhttp.send();
      }, 10000) ;
}

function addBinaryContainer(contNum, targetObj, modCont){
    
    let outCheck = document.createElement("input");
    outCheck.id = "chk" + contNum;
    outCheck.type = "checkbox";

    outCheck.onchange = function () {
        let xhr = new XMLHttpRequest();
        if(outCheck.checked){ xhr.open("GET", "/update?output="+targetObj.pin+"&state=0", true); }
        else { xhr.open("GET", "/update?output="+targetObj.pin+"&state=1", true); }
        xhr.send();
    }

    modCont.appendChild(outCheck);

    return modCont;
}