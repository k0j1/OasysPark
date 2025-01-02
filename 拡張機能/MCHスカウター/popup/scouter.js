const INTERVAL_CHECK_TAG = 1000
const INTERVAL_CHECK_STATUS = 18

// 設定LOAD
chrome.storage.sync.get({
	extend_mch_inventory_effect: true,
}, function (items) {
	let bExec = items.extend_mch_inventory_effect;
	if (bExec) setTimeout(fnCheckInventory,1000);
});

var elemItems = document.getElementsByClassName("assetSelectableListItem__inner");
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
// var scriptElem = document.createElement("script");
// scriptElem.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js";
// document.head.appendChild(scriptElem);

var styleElem = document.createElement("style");
	styleElem.textContent = `
        .appHeader[data-v-7ebbd4a4]{ z-index:3; }
	    .overlay { position: absolute; width: 124px; height: 124px; background-color: rgba(128,128,128,0.0); z-index: 1; padding:0; }
        .circle { display: block; border: 5px dashed white; border-radius: 50%; width: 80px; height: 80px; position: absolute; padding: 0; top: 17px; left: 17px; animation: spin-left 5s linear infinite }
        .circle2 { border: 5px dashed white; border-radius: 50%; width: 40px; height: 40px; position: absolute; top: 37px; left: 37px; animation: spin-right 4s linear infinite; }

        .fedein{
            animation-name: fadein;
            animation-duration: 0.5s;
            animation-iteration-count: 1;
        }
        .spin-left{
            animation: spin-left 5s linear infinite;  
        }


        .right-arrow {
            position: absolute; width: 0; height: 0; margin:0; padding:0; top: 30px; left: -17px;
            border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 10px solid white;
        }
        .right-arrow2 {
            position: absolute; width: 0; height: 0; left: -13px; top:14px;
            border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 6px solid white;
        }

        .left-arrow {
            position: absolute; width: 0; height: 0; right:-17px; top:30px;
            border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-right: 10px solid white;
        }
        .left-arrow2 {
            position: absolute; width: 0; height: 0; right:-13px; top: 14px;
            border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 6px solid white;
        }

        @-webkit-keyframes spin-left {
            100% {
                -webkit-transform: rotate(-360deg);
                -moz-transform: rotate(-360deg);
                -ms-transform: rotate(-360deg);
                -o-transform: rotate(-360deg);
                transform: rotate(-360deg);
            }
        }
        @-webkit-keyframes spin-right {
            100% {
                -webkit-transform: rotate(360deg);
                -moz-transform: rotate(360deg);
                -ms-transform: rotate(360deg);
                -o-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        @keyframes fadein {
            0% {
                transform: scale(0.5);
                opacity: 0;
            }
            50% {
                transform: scale(1.5);
                opacity: 0.8;
            }
            80% {
                transform: scale(0.8);
                opacity: 0.9;
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .line1{
            position:absolute;
            top:50%;
            left:50%;
            border:1px solid white;
            height:0;
            width: 0;
            transform: rotate(-45deg);
            transform-origin: 0% 0%;
            animation: border_anim 0.2s linear forwards;
            animation-delay: 1.5s;
        }
        .line2{
            position:absolute;
            top:-1px;
            left:101%;
            border:1px solid white;
            height:0;
            width: 0;
            transform: rotate(45deg);
            transform-origin: 0% 0%;
            animation: border_anim2 0.1s linear forwards;
            animation-delay: 1.7s;
        }

        @keyframes border_anim {
            0%{
                width: 0%;
            }
            100%{
                width: 100%;
            }
        }
        @keyframes border_anim2 {
            0%{
                width: 0%;
            }
            100%{
                width: 25%;
            }
        }

        .chart-status{
            position:absolute;
            width:100%;
            height:100%;
        }
        
        .assetInfo__lv--max {
            color: white;
            border-radius: 50px;
            background: linear-gradient(90deg, red, green, blue);
            font-size: 14px;
            height: 1.75em;
            line-height: 1;
            text-align: center;
            width: 50px;
            padding: .375em;
        }

        .asset_lvMax{
            border: 2px solid #da4033;
            border-radius: 4px;
            position: relative;
        }
        .asset_lvMax:after{
            color: white;
            border-radius: 50px;
            background: linear-gradient(90deg, red, green, blue);
            content: "Lv.Max";
            font-weight: bold;
            left: .7em;
            padding: .2em;
            position: absolute;
            top: -1em;
            width:70px;
            text-align:center;
            z-index:1;
        }

        // .assetSelector__assetInner{
        //     background: #282b33cc;
        // }        
	`;
document.head.appendChild(styleElem);

function resetTargetClass(target){
    if(!target) return false;
    //target.className = "assetSelectableListItem__inner";
}

var preTarget = null;
// イベントリの読み込み完了したら、ホバー時のアクションセット
var fnCheckInventory = function() {
    var elemItems = document.getElementsByClassName("assetSelectableListItem__inner");
    if(0 < elemItems.length){
        //elemItems[1].classList.add("fedein");    
        for(elem of elemItems){
            elem.addEventListener("mouseover", (event) => {
                let overElems = event.currentTarget.getElementsByClassName("overlay");
                if(overElems.length == 0){
                    // ホバー時の動作
                    if(preTarget != event.currentTarget){
                        overlayElem.className = "overlay";
                        overlayElem.classList.add("fedein");
                        event.currentTarget.prepend(overlayElem);
                    }
                    if(window.location.href.includes("/heroes/")){
                        // ヒーロー情報取得
                        const heroID = getID(event.currentTarget);
                        getRequestHeroInfo(event.currentTarget, heroID);
                    }else if(window.location.href.includes("/extensions/")){
                        // エクステンション情報取得
                        const extID = getID(event.currentTarget);
                        getRequestExtInfo(event.currentTarget, extID);
                    }
                    preTarget = event.currentTarget;
                }else{

                }
            });
            // elem.addEventListener("mouseleave", (event) =>{
            //     setTimeout(resetTargetClass, 3000, event.currentTarget);
            // });
            //setTimeout(fnCheckEmptyAsset,1000);
        }
    }
    if(0 >= elemItems.length){
        elemItems = document.getElementsByClassName("assetSelector__asset");
        if(0 < elemItems.length){
            for(elem of elemItems){
                elem.addEventListener("mouseover", (event) => {
                    // すでにステータス表示済みならクリックしない
                    if(event.currentTarget.id === "mouseovered") return;
                    let inputTag = event.currentTarget.getElementsByTagName("input");
                    // クリック済みならクリックしない
                    if(inputTag==null) return;
                    if(inputTag.length==0) return;
                    if(inputTag[0].checked) return;
                    event.currentTarget.id = "mouseovered";
                    inputTag[0].click();
                    startCheckAssets(event.currentTarget);
                });
                elem.addEventListener("click", (event) => {
                    // ステータス表示済みでならクリックしない
                    if(!(event.currentTarget.id === "mouseovered")) return;
                    let inputTag = event.currentTarget.getElementsByTagName("input");
                    // クリック済みならクリックしない
                    if(inputTag==null) return;
                    if(inputTag.length==0) return;
                    if(inputTag[0].checked) return;
                    inputTag[0].click();
                    var canvasElems = event.currentTarget.getElementsByTagName("canvas");
                    if(!canvasElems || 0 >= canvasElems.length){
                        startCheckAssets(event.currentTarget);
                    }        
                });
            }
        }
    }

    if(0 >= elemItems.length){
        setTimeout(fnCheckInventory,INTERVAL_CHECK_TAG);
    }
};
function startCheckAssets(checkElem){
    let imgAssetElem = checkElem.getElementsByTagName("img");
    if(0 >= imgAssetElem.length) return false;
    gImgCheckSrc = imgAssetElem[0].src;
    gCurTarget = event.currentTarget;
    gLimitLoop = 10;
    fnUpdateInfo();
}

let gLimitLoop = 10;
let gCurTarget = null;
let gImgCheckSrc = null;
function fnUpdateInfo(){
    if(gImgCheckSrc == null) return;
    let bFind = false;
    var detailViewerElems = document.getElementsByClassName("changeAssetDetailViewer");
    // マウスオーバー中の画面とイメージが一致しているかのチェック
    if(0 < detailViewerElems.length){
        var imgDetailElems = detailViewerElems[0].getElementsByTagName("img");
        for(let i=0; i < imgDetailElems.length; i++){
            if(imgDetailElems[i].src === gImgCheckSrc){
                bFind = true;
                break;
            }
        }
    }
    // 見つかった場合はステータス表示＆LVMAX表示
    if(bFind){
        // すでにステータス表示が追加されていれば追加しない
        var canvasElems = gCurTarget.getElementsByTagName("canvas");
        if(!canvasElems || 0 >= canvasElems.length){
            var statusElems = detailViewerElems[0].getElementsByClassName("changeAssetDetailViewer__status");
            if(0 < statusElems.length){
                let hp = 0;
                let hpElem = statusElems[0].getElementsByTagName("span");
                if(0 < hpElem.length) hp = hpElem[0].textContent;
                let phy = 0;
                let phyElem = statusElems[1].getElementsByTagName("span");
                if(0 < phyElem.length) phy = phyElem[0].textContent;
                let int = 0;
                let intElem = statusElems[2].getElementsByTagName("span");
                if(0 < intElem.length) int = intElem[0].textContent;
                let agi = 0;
                let agiElem = statusElems[3].getElementsByTagName("span");
                if(0 < agiElem.length) agi = agiElem[0].textContent;
                var canvElem = setChart(gCurTarget, "00", hp, phy, int, agi);
            }
        }
        // すでにLVMAX表示が追加されていれば追加しない
        if(!gCurTarget.className.includes("asset_lvMax")){
            var dataElems = detailViewerElems[0].getElementsByClassName("changeAssetDetailViewer__data");
            if(0 < dataElems.length){
                var pElems = dataElems[0].getElementsByTagName("p");
                for(let i=0; i < pElems.length; i++){
                    if(pElems[i].className.includes("changeAssetDetailViewer__lv--maxLv")){
                        gCurTarget.classList.add("asset_lvMax");
                        break;
                    }
                }
            }
        }
    }else{
        if(0 < gLimitLoop){
            gLimitLoop--;
            setTimeout(fnUpdateInfo,INTERVAL_CHECK_STATUS);
        }
    }
}

const observer = new MutationObserver(() => {
    // ここにDOM変更時の処理を書く
    setTimeout(fnCheckInventory,INTERVAL_CHECK_TAG);
    console.log('変更を検知');
});

observer.observe(document.body, {
    subtree: true,
    childList: true, 
    attributes: true,
    characterData: true
});
// // アイテムが空になったらイベントリにアクションセット開始
// var fnCheckEmptyAsset = function() {
//     var elemItems = document.getElementsByClassName("assetSelectableListItem__inner");
//     if(0 == elemItems.length){
//         setTimeout(fnCheckInventory,1000);
//     }else{
//         setTimeout(fnCheckEmptyAsset,1000);
//     }
// };

// popstate イベントは、ブラウザのアクション（例えば、戻るボタンや進むボタン）によってアクティブな履歴エントリが変更されたときに発生
// window.addEventListener('popstate', function(event) {
//     console.log('URLが変更されました: ', window.location.href);
//     // ここに処理を記述
//     setTimeout(fn,1000);
// });

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

// ヒーローID取得
function getID(target){
    const classNameForHeroID = "assetSelectableListItem__basic__id";
    const elemIDs = target.getElementsByClassName(classNameForHeroID);
    if(0 >= elemIDs.length) return 0;
    console.log("getID:" + elemIDs[0].textContent);
    return elemIDs[0].textContent;
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
