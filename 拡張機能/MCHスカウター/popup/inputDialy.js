// 設定LOAD
chrome.storage.sync.get({
	extend_dialy: false
}, function (items) {
	let bExec = items.extend_dialy;
	if (bExec) extendInputDialy();
});

var elemBtn01 = document.createElement(`Button`);
var elemBtn02 = document.createElement(`Button`);
var elemBtn03 = document.createElement(`Button`);
var elemBtn04 = document.createElement(`Button`);
var elemBtn05 = document.createElement(`Button`);
var elemBtn06 = document.createElement(`Button`);

var elemDiv = document.createElement(`Div`);

var elemSel1 = document.getElementsByName('bunrui1');
var elemSel2 = document.getElementsByName('bunrui2');
var elemSel3 = document.getElementsByName('bunrui3');
var elemText = document.getElementsByTagName('textarea')[0];

function extendInputDialy() {
	elemBtn01.innerText = "機能改良選択";
	elemBtn01.addEventListener("click", selDenshiImpDev);
	elemBtn01.style.margin = 2;
	elemBtn02.innerText = "税制改正選択";
	elemBtn02.addEventListener("click", selDenshiTaxDev);
	elemBtn02.style.left = 100;
	elemBtn02.style.margin = 2;
	elemBtn03.innerText = "質問票対応　";
	elemBtn03.addEventListener("click", selDenshiFaqOther);
	elemBtn03.style.left = 200;
	elemBtn03.style.margin = 2;
	elemBtn04.innerText = "送信試験　　";
	elemBtn04.addEventListener("click", selDenshiSendTest);
	elemBtn04.style.left = 300;
	elemBtn04.style.margin = 2;
	elemBtn05.innerText = "社長朝礼　　";
	elemBtn05.addEventListener("click", selDenshiMorOther);
	elemBtn05.style.left = 400;
	elemBtn05.style.margin = 2;
	elemBtn06.innerText = "新製品検証　";
	elemBtn06.addEventListener("click", selDenshiNewGstepNX);
	elemBtn06.style.left = 500;
	elemBtn06.style.margin = 2;

	elemDiv.style.position = "fixed";
	elemDiv.style.left = 10;
	elemDiv.style.top = 60;
	elemDiv.style.height = 30;
	elemDiv.style.width = 600;
	elemDiv.style.background = `black`;
	document.body.appendChild(elemDiv);
	elemDiv.appendChild(elemBtn01);
	elemDiv.appendChild(elemBtn02);
	elemDiv.appendChild(elemBtn03);
	elemDiv.appendChild(elemBtn04);
	elemDiv.appendChild(elemBtn05);
	elemDiv.appendChild(elemBtn06);
}

function selDenshiImpDev(){
	selectOption(elemSel1[0].options, "電子申告(4801)");
	selectOption(elemSel2[0].options, "機能改良(2)");
	selectOption(elemSel3[0].options, "開発(2)");
}

function selDenshiTaxDev(){
	selectOption(elemSel1[0].options, "電子申告(4801)");
	selectOption(elemSel2[0].options, "税制改正(1)");
	selectOption(elemSel3[0].options, "開発(2)");
}

function selDenshiFaqOther(){
	selectOption(elemSel1[0].options, "電子申告(4801)");
	selectOption(elemSel2[0].options, "問合せ(5)");
	selectOption(elemSel3[0].options, "その他(9)");
}

function selDenshiSendTest(){
	selectOption(elemSel1[0].options, "電子申告(4801)");
	selectOption(elemSel2[0].options, "その他(9)");
	selectOption(elemSel3[0].options, "その他(9)");
    elemText.innerText = "e-Tax送信試験結果報告";
}

function selDenshiMorOther(){
	selectOption(elemSel1[0].options, "その他(9999)");
	selectOption(elemSel2[0].options, "その他(9)");
	selectOption(elemSel3[0].options, "その他(9)");
    elemText.innerText = "社長朝礼・部内朝礼";
}

function selDenshiNewGstepNX(){
	selectOption(elemSel1[0].options, "電子申告(4801)");
	selectOption(elemSel2[0].options, "新製品（G-step NX）(266)");
	selectOption(elemSel3[0].options, "開発(2)");
}

function selectOption(options, text) {
	for (var i = 0; i < options.length; i++){
		if (options[i].text === text) {
			options[i].selected = true;
			return options[i];
		}
	}
	return null;
}