// 初期化処理
var overlayElem = document.createElement("div");
overlayElem.className = "overlay fadein";
overlayElem.innerHTML = `
    <div class="circle">
        <div class="right-arrow"></div>
        <div class="left-arrow"></div>
    </div>
    <div class="circle2">
        <div class="right-arrow2"></div>
        <div class="left-arrow2"></div>      
    </div>
`;


//! Active Navbar Item

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((navItem, i) => {
  navItem.addEventListener("click", () => {
    navItems.forEach((item, j) => {
      item.className = "nav-item";
    });
    navItem.className = "nav-item active";
  });
});

//! Light/Dark Mode

const moonIcon = document.querySelector(".moon");
const sunIcon = document.querySelector(".sun");
const nightImage = document.querySelector(".night-img");
const morningImage = document.querySelector(".morning-img");
const toggle = document.querySelector(".toggle");

function switchTheme() {
  document.body.classList.toggle("darkmode");
  if (document.body.classList.contains("darkmode")) {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
    morningImage.classList.add("hidden");
    nightImage.classList.remove("hidden");
    localStorage.setItem("theme", "dark");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
    morningImage.classList.remove("hidden");
    nightImage.classList.add("hidden");
    localStorage.setItem("theme", "light");
  }
}

//! Share Button Popup

const sharebtns = document.querySelectorAll(".share-btn");

sharebtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const popup = btn.closest(".event-footer").querySelector(".popup");

    btn.classList.toggle("active");
    popup.classList.toggle("active");

    event.stopPropagation();
  });
});

document.addEventListener("click", (event) => {
  const popups = document.querySelectorAll(".popup");

  popups.forEach((popup) => {
    if (popup.classList.contains("active") && !popup.contains(event.target)) {
      popup.classList.remove("active");

      const shareBtn = popup
        .closest(".event-footer")
        .querySelector(".share-btn");
      shareBtn.classList.remove("active");
    }
  });
});

//! Like Buttons

const likeBtns = document.querySelectorAll(".like-btn");

likeBtns.forEach((likeBtn) => {
  likeBtn.addEventListener("click", () => {
    if (likeBtn.classList.contains("bxs-heart")) {
      likeBtn.classList.remove("bxs-heart");
      likeBtn.classList.add("bx-heart");
      likeBtn.classList.remove("bounce-in");
    } else {
      likeBtn.classList.add("bxs-heart");
      likeBtn.classList.remove("bx-heart");
      likeBtn.classList.add("bounce-in");
    }
  });
});

//! Chart JS

const chartData = {
  labels: ["Workshop", "Theater", "Concert", "Sport"],
  data: [40, 15, 25, 20],
};

const chart = document.getElementById("doughnut");
const eventList = document.querySelector(".chart ul");

new Chart(chart, {
  type: "doughnut",
  data: {
    labels: ["Workshop", "Theater", "Concert", "Sport"],
    datasets: [
      {
        label: "# of Events",
        data: [8, 3, 5, 4],
        backgroundColor: ["#582bac", "#b31a4d", "#e48e2c", "#4a920f"],
        offset: 10,
        hoverOffset: 8,
        hoverBorderColor: "#9a999b",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#8b8a96",
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
    },
    layout: {
      padding: {
        bottom: 10,
      },
    },
  },
});

function population() {
  chartData.labels.forEach((label, i) => {
    let eachEvent = document.createElement("li");
    eachEvent.innerHTML = `${label}: <span class="percentage">${chartData.data[i]}%</span> `;
    eventList.appendChild(eachEvent);
  });
}

population();






document.getElementById("get_id").addEventListener('click', getIDs);

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
		//save_userinfo(userID);
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
		let myImage = document.getElementById(strTagID).firstChild;
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
            let strTagID = strTagBaseID + Items[i];
            const myImage = new Image();
            myImage.src = "noimage.png";
            myImage.width = 80; // 横サイズ（px）
            myImage.height = 80; // 縦サイズ（px）

            const divImage = document.createElement('span');
            divImage.appendChild(myImage);
            divImage.setAttribute("id", strTagID);
            divImage.className = "chart-overlay";
            divImage.addEventListener("click", clickDispStatus);
            myArticle.appendChild(divImage);

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

function clickDispStatus(event){
  var targetElem = event.currentTarget;
  if(!targetElem.className.includes("scoutered")){
    targetElem.classList.add("scoutered");
    if(targetElem.id.includes("heroID")){
      // ヒーロー情報取得
      const heroID = targetElem.id.replace("heroID_", "");
      getRequestHeroInfo(targetElem, heroID);
    }else if(targetElem.id.includes("extsID")){
       // エクステンション情報取得
       const extID = targetElem.id.replace("extsID_", "");
       getRequestExtInfo(targetElem, extID);
    }
  }
}

// ヒーローIDを元にURLからjson取得
function getRequestHeroInfo(target, heroID)
{
	// ヒーローID一覧取得
    const urlHeroIDURL = "https://www.mycryptoheroes.net/metadata/hero/" + heroID.replace("#","");
	console.log(urlHeroIDURL)
	let request = new XMLHttpRequest();
	try {
		request.open('GET', urlHeroIDURL);
		request.responseType = 'json';
		request.onreadystatechange = function() {
            console.log("request.readyState="+request.readyState);
            console.log("request.status="+request.status);
            if(request.readyState==4 && request.status==0){
                //DispList(null, "heroID_", "❌所持ヒーロー", data, reqHeroInfoURL);
                console.log("getRequestHeroInfo error1");
            }
		}
		request.send();
	} catch (e) {
        console.log("getRequestHeroInfo error2");
	}
	request.onload = function()
	{
		const heroInfo = request.response;
		if(heroInfo && heroInfo.attributes)
		{
            setChart(target, heroID, heroInfo.attributes.hp, heroInfo.attributes.phy, heroInfo.attributes.int, heroInfo.attributes.agi);
        }else{
            console.log("getRequestHeroInfo error3");
		}
	};
	request.onerror = function(){
        console.log("getRequestHeroInfo error4");
	}
}

// エクステンションIDを元にURLからjson取得
function getRequestExtInfo(target, extID)
{
	// エクステンションID一覧取得
    const urlExtIDURL = "https://www.mycryptoheroes.net/metadata/extension/" + extID.replace("#","");
	console.log(urlExtIDURL)
	let requestExt = new XMLHttpRequest();
	try {
		requestExt.open('GET', urlExtIDURL);
		requestExt.responseType = 'json';
		requestExt.send();
	} catch (e) {
		console.log("getRequestExtInfo error1");
	}
	requestExt.onload = function() {
		const extInfo = requestExt.response;
		if(extInfo && extInfo.attributes)
		{
            setChart(target, extID, extInfo.attributes.hp, extInfo.attributes.phy, extInfo.attributes.int, extInfo.attributes.agi);
        }else{
            console.log("getRequestExtInfo error2");
		}
	};
	requestExt.onerror = function(){
		console.log("getRequestExtInfo error3");
	}
}

// グラフの描画
function setChart(parentElem, id, hp, phy, int, agi){
    if(parentElem==null) return;
    //var elemItems = document.getElementsByClassName("assetSelectableListItem__inner");
    var canvElem = document.createElement("canvas");
    canvElem.id = "chart_" + id;
    canvElem.className = "chart-status overlay";
    var chart = new Chart(canvElem, {
        type: 'pie',
        data: {
            label: 'ステータス',
            labels: ["HP", "PHY", "INT", "AGI"],
            datasets: [{
                data:[hp,phy,int,agi],
                backgroundColor: [
                    'rgba(255,206,86,0.3)',
                    'rgba(255,99,132,0.3)',
                    'rgba(153,102,255,0.3)',
                    'rgba(75,192,192,0.3)'
                ],
                borderColor: [
                    'rgba(255,206,86,1)',
                    'rgba(255,99,132,1)',
                    'rgba(153,102,255,1)',
                    'rgba(75,192,192,1)'
                ],
                borderWidth: 1
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: "#fff",
                    textStrokeColor: "#000",
                    textStrokeWidth: 2,
                    font: {
                        wight: "bold",
                        size: 18,
                    }
                }
            }
        }
    });
    if(canvElem){
        parentElem.prepend(canvElem);
    }
    var isContained = parentElem.contains(overlayElem);
    if(isContained){
        parentElem.removeChild(overlayElem);
    }
    return canvElem;
}
