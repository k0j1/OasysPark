// 設定SAVE
function save_options() {
	let swMchInventoryEffectID1 = getCheckedID("mch1radio");
	let bExtMchInventoryEffectNotify = (swMchInventoryEffectID1 === "mch1on") ? true : false;
	chrome.storage.sync.set({
		mch_inventory_effect: swMchInventoryEffectID1,
		extend_mch_inventory_effect: bExtMchInventoryEffectNotify,
	}, function () {
		console.log("save setting.");
		console.log("*** swMattermost1ID=" + swMchInventoryEffectID1);
	});
}
function save_userinfo(userID) {
	chrome.storage.sync.set({
		user_id: userID,
	}, function () {
		console.log("save id.");
		console.log("*** id=" + userID);
	});
}
function save_textmemo() {
	let text = document.getElementById("text-memo").value;
	chrome.storage.sync.set({
		memo_text: text,
	}, function () {
		console.log("change memo.");
		console.log("*** text=" + text);
	});
}
async function save_newmemo() {
	let id = new Date().toISOString();
	await chrome.storage.sync.get({
		memo_ids: [],
	}, async function (items) {
		//for(let i = 0; i < items.memo_ids.length; i++){}
		items.memo_ids.push(id);
		await chrome.storage.sync.set({
			"memo_ids": items.memo_ids,
		}, function () {
			console.log("save memo_ids.");
			console.log("*** memo_ids=" + items.memo_ids);
			load_memos();
		});
	});
	const data = {}
	data[id] = document.getElementById("text-memo").value;
	await chrome.storage.local.set(data, () => {
		console.log("save memo.");
		console.log("*** data=" + data);
	});
}
function remove_memo(id) {
	chrome.storage.sync.get({
		memo_ids: [],
	}, function (items) {
		for(let i = 0; i < items.memo_ids.length; i++){
			if(items.memo_ids[i] === id){
				items.memo_ids.splice(i,1);
				break;
			}
		}
		chrome.storage.sync.set({
			"memo_ids": items.memo_ids,
		}, function () {
			console.log("save memo_ids.");
			console.log("*** memo_ids=" + items.memo_ids);
			load_memos();
		});
	});
	chrome.storage.local.remove([id], (result) => {
		console.log("remove memo.");
		console.log("*** id=" + id);
		console.log("*** result=" + result);
	});
}
function save_replacetext() {
	let oldText = document.getElementById("test-replace-pre").value;
	let newText = document.getElementById("test-replace-post").value;
	chrome.storage.sync.set({
		memo_old_text: oldText,
		memo_new_text: newText,
	});
}
function getCheckedID(name) {
	let checkedID = null;
	var radios = document.getElementsByName(name);
	for (let i = 0; i < radios.length; i++){
		if (radios[i].checked) {
			checkedID = radios[i].id;
		}
	}
	return checkedID;
}
// 設定LOAD
function load_options() {
	chrome.storage.sync.get({
		mch_inventory_effect: "mch1on",
	}, function (items) {
		document.getElementById(items.mch_inventory_effect).checked = true;
	});
}
function load_textmemo() {
	chrome.storage.sync.get({
		memo_text: "",
		//memo_test: "",
	}, function (items) {
		document.getElementById("text-memo").value = items.memo_text;
		//document.getElementById("test-html").value = items.memo_test;
		textOutput();
	});
}
async function load_memos() {
	await chrome.storage.sync.get({
		memo_ids: [],
	}, async function (items) {
		let divElem = document.getElementById("memos");
		// 事前にクリア
		while(divElem.firstChild) divElem.removeChild(divElem.firstChild);
		for(let i = 0; i < items.memo_ids.length; i++){
			let key = items.memo_ids[i];
			await chrome.storage.local.get([key], (result) => {
				let contentElem = document.createElement("div");
				contentElem.id = key;
				contentElem.classList.add("memo-card");
				let btnListElem = document.createElement("ul");
				btnListElem.id = "memo-btn";
				btnListElem.classList.add("btn_list");
				btnListElem.innerHTML = `<li><span id="${key}" class="memo-btn-copy fa fa-paste icon"></span><li><span id="${key}" class="memo-btn-delete fa fa-trash icon"></span>`;
				let memElem = document.createElement("div");
				memElem.id = "memo-content";
				const date = new Date(key);
				const options = {timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false};
				const jstDate = new Intl.DateTimeFormat('ja-JP', options).format(date);
				memElem.innerHTML = `<i class="memo-date">` + jstDate + "</i><br><br>" + result[key];
				contentElem.appendChild(btnListElem);
				contentElem.appendChild(memElem);
				divElem.appendChild(contentElem);
				// メモ-delete
				const inputMemoDelete = document.getElementsByClassName("memo-btn-delete");
				var listCount = inputMemoDelete.length;
				for (var n = 0; n < listCount; n++) {
					if (inputMemoDelete[n].id === key) {
						inputMemoDelete[n].onclick = async function(){
							remove_memo(key);
							showToast("削除しました");
						}
					}
				}
				// メモ-Copy
				const copyText = result[key];
				const inputMemoCopy = document.getElementsByClassName("memo-btn-copy");
				var listCount = inputMemoCopy.length;
				for (var n = 0; n < listCount; n++) {
					if (inputMemoCopy[n].id === key) {
						inputMemoCopy[n].onclick = async function () {
							navigator.clipboard.writeText(copyText).then(function () {
								showToast("コピーしました");
							}).catch(function (error) {
								console.error("コピーに失敗しました: ", error);
							});
						}
					}
				}
			});
		}
	});
}
function load_userinfo(){
	chrome.storage.sync.get({
		user_id: "",
	}, function (items) {
		document.getElementById('userID').value = items.user_id;
	});
}
function showToast(msgText) {
	const toast = document.getElementById("toast");
	toast.textContent = msgText;
	toast.className = "toast show";
	setTimeout(function(){
		toast.className = "toast";
	}, 2800);
}

function load_replacetext() {
	chrome.storage.sync.get({
		memo_old_text: "",
		memo_new_text: "",
	}, function (items) {
		document.getElementById("test-replace-pre").value = items.memo_old_text;
		document.getElementById("test-replace-post").value = items.memo_new_text;
		textOutput();
	});
}

function activeTab() {
	let url = "http://mattermost.tksf.jdl.co.jp/";
	if (url) {
		chrome.tabs.query({}, (tabs) => {
			for (let tab of tabs) {
				let checkURL = "" + tab.url;
				console.log("checkURL=" + checkURL);
				if (checkURL.includes(url)) {
					// URLが見つかったら既存タブをアクティブ化
					chrome.tabs.update(tab.id, { active: true });
					chrome.windows.update(tab.windowId, { focused: true });
					//chrome.storage.sync.set({
					//	extend_mattermost_tab_id: tab.id,
					//	extend_mattermost_window_id: tab.windowId
					//}, function () {
					//	console.log("[Mattermost]tab.id=" + tab.id);
					//	console.log("[Mattermost]tab.windowid=" + tab.windowId);
					//});
					return;
				}
			}
			// URLが見つからなかったら新規タブ
			chrome.tabs.create({ url: url });
		});
	}
}

//document.addEventListener('DOMContentLoaded', load_options);
//document.getElementById("redmine1on").addEventListener('click', save_options);
//document.getElementById("redmine1off").addEventListener('click', save_options);
//document.getElementById("dialy1on").addEventListener('click', save_options);
//document.getElementById("dialy1off").addEventListener('click', save_options);
document.getElementById("mch1on").addEventListener('click', save_options);
document.getElementById("mch1off").addEventListener('click', save_options);
//document.getElementById("matter2on").addEventListener('click', save_options);
//document.getElementById("matter2off").addEventListener('click', save_options);
//document.getElementById("test-replace-pre").addEventListener('change', save_replacetext);
//document.getElementById("test-replace-post").addEventListener('change', save_replacetext);
//document.getElementById("text-memo").addEventListener('change', save_textmemo);
//document.getElementById("mattermost").addEventListener('click', activeTab);
document.getElementById("get_id").addEventListener('click', getIDs);
load_options();
load_textmemo();
load_memos();
load_userinfo();

function textOutput() {
	let text = document.getElementById("text-memo").value;
	chrome.storage.sync.set({ memo_text: text });
	document.getElementById("text-outp-html").innerHTML = text;
	// markdown変換
	document.getElementById("text-outp").innerHTML = marked.parse(text);
}
document.getElementById("text-memo").addEventListener('change', textOutput);

chrome.tabs.query({ active: true, currentWindow: true },
  function(tabs){
	var activeTab = tabs[0];
//chrome.action.onClicked.addListener((activeTab) => {
//( chrome.action || chrome.browserAction ).onClicked.addListener((activeTab) => {
//chrome.browserAction.onClicked.addListener((activeTab) => {
	
	///////////////////////////////////////////////////////////////////////////////////////
	// 追加ボタン押下時の動作

	// マタモ
	const inputMattermostTag = document.getElementById("inputMattermost");
	if(inputMattermostTag)
	{
		inputMattermostTag.onclick = function(){
			chrome.scripting.executeScript({
				target: { tabId: activeTab.id },
				files: ["popup/inputMattermost.js"]
			});
		}
	}
	const extendLeftMenuTag = document.getElementById("extendLeftMenu");
	if (extendLeftMenuTag) {
		extendLeftMenuTag.onclick = function () {
			chrome.scripting.executeScript({
				target: { tabId: activeTab.id },
				files: ["popup/extendLeftMenu.js"]
			});
		}
	}

	// テストタブ－実行ボタン
	const buttonTextExec = document.getElementById("test-replace-exec");
	if (buttonTextExec) {
		buttonTextExec.onclick = function () {
			chrome.scripting.executeScript({
				target: { tabId: activeTab.id },
				files: ["popup/replaceHTMLText.js"]
			});
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////
	// サンプルページ表示動作

	// メモ-SAVE
	const inputMemoSave = document.getElementById("memo-save");
	if (inputMemoSave) {
		inputMemoSave.onclick = async function(){
			save_newmemo();
		}
	}
});






//*** 書換タグ定義
const id = document.querySelector('userID');
const header = document.querySelector('OwnHeroHeader');
const data = document.querySelector('OwnHeroData');
const headerExt = document.querySelector('OwnExtHeader');
const dataExt = document.querySelector('OwnExtData');
const connectButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');

//*** デフォルト定数
let val_userID = '';
const reqHeroIDURL = 'https://www.mycryptoheroes.net/api/proxy/mch/heroes/';
const reqHeroIDURLad = 'https://www.mycryptoheroes.net/api/proxy/HeroAsset/heroes/'
const reqHeroInfoURL = "https://www.mycryptoheroes.net/metadata/hero/";
const reqExtIDURL = 'https://www.mycryptoheroes.net/api/proxy/mch/extensions/';
const reqExtIDURLad = 'https://www.mycryptoheroes.net/api/proxy/ExtensionAsset/extensions/'
const reqExtInfoURL = "https://www.mycryptoheroes.net/metadata/extension/";
const reqUserInfoURL = 'https://www.mycryptoheroes.net/api/proxy/mch/users/';

//init();

function init()
{
	// Metamaskチェック
	let strErrText = "";
	if (typeof window.ethereum !== 'undefined') {
		console.log('MetaMask is installed!');
		strErrText = "MetaMask接続可能";
	} else {
		strErrText = "MetaMask接続できません";
	}
	// 接続ボタン設定
	connectButton.addEventListener('click', function(event)
	{
		// 今日の運勢表示
		let today = document.getElementById("today_fortune");
		today.setAttribute("style", "display:block;");
		connectMetaMask();
	});
	// URLを取得
	const userID = getUserID();
	if(userID != null && userID.length > 0)
	{
		let inputUserID = document.getElementById("userID");
		inputUserID.value = userID;
	}
}

////////////////////////////////////////////
// URLからユーザーID取得
function getUserID()
{
	let url = new URL(window.location.href);
	let params = url.searchParams;
	let nUserID = params.get('id');
	return nUserID;
}

/////////////////////////////////////////////
// メタマスク接続
async function connectMetaMask()
{
try {
	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
	const account = accounts[0];
	console.log(account);
	if(account != null && account.length > 0)
	{
		let inputUserID = document.getElementById("userID");
		inputUserID.value = account;
	}
}
catch (err)
{
	if (err.code === 4001) {
	// ユーザーが接続を拒否するとここに来ます
	alert('MetaMaskに接続してください');
	} else {
	alert('MetaMaskに接続できません');
	}
}
}

function dispFortune(userID)
{
	// リストクリア
	let today = document.getElementById("today_fortune");
	ClearList(today);
	// 今日の運勢表示
	today.setAttribute("style", "display:block;");
	const ftLink = document.createElement('a');
	ftLink.href = "MCH_Omikuji_Result.html?id=" + userID;
	const ftImage = document.createElement('img');
	ftImage.src = "https://www.takahara-books.com/Image/MCH/draw.png";
	ftImage.width = 180;
	ftLink.appendChild(ftImage);      
	today.appendChild(ftLink);
}

/////////////////////////////////////////////
// JSON取得：ユーザー所持ヒーローID
function getIDs()
{
	let element = document.getElementById('userID');
	let userID = element.value;
	console.log("UserID length : "+userID.length);
	if(userID.length <= 2)
	{
		alert("ユーザーIDかETHアドレスを入力してください");
	}
	else if(userID.length < 10)
	{
		save_userinfo(userID);
		// ユーザーIDでの検索
		let urlHeroIDURL = reqHeroIDURL + userID;
		let urlExtIDURL = reqExtIDURL + userID;
		reqInfo(urlHeroIDURL, urlExtIDURL);
		// 今日の運勢表示
		//dispFortune(element.value);
	}
	else
	{
		save_userinfo(userID);
		// アドレスでの検索
		let urlUserInfoURL = reqUserInfoURL + userID;
		reqUserInfo(urlUserInfoURL);
	}
}
function reqUserInfo(urlUserInfoURL)
{
	// ユーザー情報取得
	console.log(urlUserInfoURL)
	let request = new XMLHttpRequest();
	try {
		request.open('GET', urlUserInfoURL);
		request.responseType = 'json';
		request.send();
	} catch (e) {
		DispList(null, "heroID_", "❌所持ヒーロー", data, reqHeroInfoURL);
		DispList(null, "extsID_", "❌所持エクステ", dataExt, reqExtInfoURL);
	}
	request.onload = function()
	{
		const UserInfo = request.response;
		if(UserInfo)
		{
		const Info = UserInfo['user_data'];
		console.log('Info.uid:'+Info.uid);
		console.log('Info.name:'+Info.name);
		//if(Info.uid.length>0)
		{
			let urlHeroIDURL = reqHeroIDURL + Info.uid;
			let urlExtIDURL = reqExtIDURL + Info.uid;
			console.log(urlHeroIDURL);
			console.log(urlExtIDURL);
			reqInfo(urlHeroIDURL, urlExtIDURL);        
		}
		// 今日の運勢表示
		dispFortune(Info.uid);
		}
	};
}
function reqInfo(urlHeroIDURL, urlExtIDURL)
{
	// ヒーローID一覧取得
	console.log(urlHeroIDURL)
	let request = new XMLHttpRequest();
	try {
		request.open('GET', urlHeroIDURL);
		request.responseType = 'json';
		request.onreadystatechange = function()
		{
		console.log("request.readyState="+request.readyState);
		console.log("request.status="+request.status);
		if(request.readyState==4 && request.status==0)
		DispList(null, "heroID_", "❌所持ヒーロー", data, reqHeroInfoURL);
		}
		request.send();
	} catch (e) {
		DispList(null, "heroID_", "❌所持ヒーロー", data, reqHeroInfoURL);
	}
	request.onload = function()
	{
		var bDisp = false; 
		const HerosID = request.response;
		if(HerosID)
		{
		const Items = HerosID['hero_ids'];
		console.log('ID数:'+Items.length);
		if(Items.length>0)
		{
			bDisp = true;
			let strTitle = "◉所持ヒーロー(" + Items.length + ")";
			DispList(Items, "heroID_", strTitle, data, reqHeroInfoURL);
		}
		}
		if(!bDisp)
		{
		DispList(null, "heroID_", "❌所持ヒーロー", data, reqHeroInfoURL);
		}
	};
	request.onerror = function(){
		DispList(null, "heroID_", "❌所持ヒーロー", data, reqHeroInfoURL);
	}
	// エクステンションID一覧取得
	console.log(urlExtIDURL)
	let requestExt = new XMLHttpRequest();
	try {
		requestExt.open('GET', urlExtIDURL);
		requestExt.responseType = 'json';
		requestExt.send();
	} catch (e) {
		DispList(null, "extsID_", "❌所持エクステ", dataExt, reqExtInfoURL);
	}
	requestExt.onload = function() {
		const ExtsID = requestExt.response;
		if(ExtsID)
		{
		const Items = ExtsID['extension_ids'];
		let strTitle = "◉所持エクステ(" + Items.length + ")";
		DispList(Items, "extsID_", strTitle, dataExt, reqExtInfoURL);
		}
		else
		{
		DispList(null, "extsID_", "❌所持エクステ", dataExt, reqExtInfoURL);
		}
	};
	request.onerror = function(){
		DispList(null, "extsID_", "❌所持エクステ", dataExt, reqExtInfoURL);
	}
}
/////////////////////////////////////////////
// JSON取得：ヒーロー情報
function getInfo(reqObj, strTagID, urlText)
{
	console.log(urlText)
	reqObj.open('GET', urlText);
	reqObj.responseType = 'json';
	reqObj.send();
	reqObj.onload = function() {
		const getInfo = reqObj.response;
		console.log(strTagID+':'+getInfo.image)
		let myImage = document.getElementById(strTagID);
		myImage.src = getInfo.image; // 画像パス
	};  
}

/////////////////////////////////////////////
// JSON取得：ヒーロー情報
function getHeroInfo(reqObj, strTagID, strHeroID)
{
	let urlText = reqHeroInfoURL + strHeroID;
	getInfo(reqObj, strTagID, urlText);
}
/////////////////////////////////////////////
// JSON取得：エクステンション情報
function getExtInfo(reqObj, strTagID, strExtID)
{
	let urlText = reqExtInfoURL + strExtID;
	getInfo(reqObj, strTagID, urlText);
}

/////////////////////////////////////////////
// ユーザーIDの入力領域を表示
function DispID(strID)
{
	//const inputID = document.createElement('input');
	let inputID = document.getElementById("userID");
	inputID.setAttribute("id", "userID");
	inputID.setAttribute("type", "text");
	inputID.setAttribute("maxlength", "42");
	inputID.setAttribute("size", "42");
	inputID.setAttribute("value", strID);
	inputID.setAttribute("placeholder", "ユーザーID or アドレス(0x)")
	//id.appendChild(inputID);
}

/////////////////////////////////////////////
// ヒーローIDをcsv形式で１行表示
function DispLine(obj)
{
	while (header.firstChild) {
		header.removeChild(header.firstChild);
	}
	const myArticle = document.createElement('article');
	const myH1 = document.createElement('h1');
	myH1.textContent = "■所持ヒーロー";
	header.appendChild(myH1);
	
	const myPara = document.createElement('p');
	myPara.textContent = obj['hero_ids'];
	header.appendChild(myPara);
}

/////////////////////////////////////////////
// リストクリア
function ClearList(objSection)
{
	while (objSection.firstChild) {
		objSection.removeChild(objSection.firstChild);
	}  
}

/////////////////////////////////////////////
// ヒーローIDをリスト表示（箇条書き）
function DispList(Items, strTagBaseID, strHeader, objSection, urlBaseText)
{
	// リストクリア
	ClearList(objSection);
	
	const myArticle = document.createElement('article');
	const myH1 = document.createElement('h1');
	myH1.textContent = strHeader;
	myArticle.appendChild(myH1);

	if(!Items)
	{
		const myPara = document.createElement('p');
		myPara.textContent = "所持していません";
		myArticle.appendChild(myPara);    
		objSection.appendChild(myArticle);
	}
	else
	{
		//const Items = obj[strObjID];
		console.log('ID数:'+Items.length)

		var requests　=　new Array(Items.length);
		for (let i = 0; i < Items.length; i++)
		{    
		//const myList = document.createElement('ul');
		//const listItem = document.createElement('li');
		//listItem.textContent = heroes[i];
		//myList.appendChild(listItem);
		//myArticle.appendChild(myList);

		let strTagID = strTagBaseID + i;
		const myImage = new Image();
		myImage.setAttribute("id", strTagID);
		myImage.src = "noimage.png";
		myImage.width = 80; // 横サイズ（px）
		myImage.height = 80; // 縦サイズ（px）
		myArticle.appendChild(myImage);

		objSection.appendChild(myArticle);

		requests[i] = new XMLHttpRequest();
		//getHeroInfo(requests[i], strTagID, heroes[i]);
		let urlText = urlBaseText + Items[i];
		getInfo(requests[i], strTagID, urlText);
		}
	}
}

async function loadImgURL(cid, mime, limit)
{
	if (cid == "" || cid == null || cid == undefined) {
		return;
	}
	for await (const file of ipfs.get(cid)) {
		if (file.size > limit) {
			return;
		}
		const content = [];
		if (file.content) {
			for await(const chunk of file.content) {
				content.push(chunk);
			}
			return URL.createObjectURL(new Blob(content, {type: mime}));
		}
	}
}
