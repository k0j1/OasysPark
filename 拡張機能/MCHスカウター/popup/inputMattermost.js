javascript:
var elemBtn01 = document.createElement(`Button`);
var elemBtn02 = document.createElement(`Button`);
var elemBtn03 = document.createElement(`Button`);
elemBtn01.innerText = "送信結果登録";
elemBtn01.addEventListener("click", setReplySendTestResult);
elemBtn01.style.margin = 2;
elemBtn02.innerText = "　　　　　　";
elemBtn02.style.left = 100;
elemBtn02.style.margin = 2;
elemBtn03.innerText = "　　　　　　";
elemBtn03.style.left = 200;
elemBtn03.style.margin = 2;

var elemDiv = document.createElement(`Div`);
elemDiv.style.position = "absolute";
elemDiv.style.right = "100px";
elemDiv.style.bottom = "80px";
elemDiv.style.height = "30px";
elemDiv.style.width = "300px";
elemDiv.style.background = `black`;
elemDiv.style.zIndex = 999;
document.body.appendChild(elemDiv);
elemDiv.appendChild(elemBtn01);
elemDiv.appendChild(elemBtn02);
elemDiv.appendChild(elemBtn03);

var elemSel1 = document.getElementsByName('bunrui1');
var elemSel2 = document.getElementsByName('bunrui2');
var elemSel3 = document.getElementsByName('bunrui3');
var elemText = document.getElementsByTagName('textarea')[0];

function setReplySendTestResult(){
	var elem = document.getElementById("reply_textbox");
	elem.value = "送信試験結果のチケットを登録しました。ご対応お願いします。＞@kumakosi_kosf";
}