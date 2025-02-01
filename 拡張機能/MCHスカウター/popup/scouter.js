const INTERVAL_CHECK_TAG = 1000
const INTERVAL_CHECK_STATUS = 18

//*****************************************************
// グローバル変数
let gLimitLoop = 10;
let gCurTarget = null;
let gImgCheckSrc = null;
let gSelectedItem = null;

//*****************************************************
// 設定LOAD
chrome.storage.sync.get({
	extend_mch_inventory_effect: true,
}, function (items) {
	let bExec = items.extend_mch_inventory_effect;
	if (bExec) setTimeout(fnCheckInventory,1000);
});

//*****************************************************
// 初期準備
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

// イベントリ画面でのホバー時のアクションセット
function setInventoryHoverAction(event){
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
}
// 選択画面でのホバー時のアクションセット
function setSelectableHoverAction(event){
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
}
// 選択画面でのクリック時のアクションセット
function setSelectableClickAction(event){
    // ステータス表示済みでならクリックしない
    if(!(event.currentTarget.id === "mouseovered")) return;
    let inputTag = event.currentTarget.getElementsByTagName("input");
    // クリック済みならクリックしない
    if(inputTag==null) return;
    if(inputTag.length==0) return;
    if(inputTag[0].checked) return;
    gSelectedItem = inputTag[0];
    inputTag[0].click();
    var canvasElems = event.currentTarget.getElementsByTagName("canvas");
    if(!canvasElems || 0 >= canvasElems.length){
        startCheckAssets(event.currentTarget);
    }        
} 

var preTarget = null;
// イベントリの読み込み完了したら、アイテムごとにホバー時のアクションセット
var fnCheckInventory = function() {
    // イベントリ画面でのアクション設定
    var elemItems = document.getElementsByClassName("assetSelectableListItem__inner");
    if(0 < elemItems.length){
        //elemItems[1].classList.add("fedein");    
        for(elem of elemItems){
            elem.addEventListener("mouseover", setInventoryHoverAction);
        }
    }
    
    // 選択画面でのアクション設定
    if(0 >= elemItems.length)
    {
        // マウスホバー＆クリック時のアクション設定
        elemItems = document.getElementsByClassName("assetSelector__asset");
        if(0 < elemItems.length){
            // 選択中のinputタグを保存
            if(gSelectedItem == null){
                var elemAssetSelectorItems = document.getElementsByClassName("assetSelector__wrapper");
                if(elemAssetSelectorItems){
                    if(0 < elemAssetSelectorItems.length){
                        var elemAssetSelectorInputs = elemAssetSelectorItems[0].getElementsByTagName("input");
                        for(let i=0; i < elemAssetSelectorInputs.length; i++){
                            if(elemAssetSelectorInputs[i].checked){
                                gSelectedItem = elemAssetSelectorInputs[i];
                                break;
                            }
                        }
                    }
                }
            }
            for(elem of elemItems){
                elem.addEventListener("mouseover", setSelectableHoverAction);
                elem.addEventListener("click", setSelectableClickAction);
            }
        }
        else
        {
            gSelectedItem = null;
        }
    }

    if(0 >= elemItems.length){
        setTimeout(fnCheckInventory,INTERVAL_CHECK_TAG);
    }
};

// アセット情報確認開始
function startCheckAssets(checkElem){
    let imgAssetElem = checkElem.getElementsByTagName("img");
    if(0 >= imgAssetElem.length) return false;
    gImgCheckSrc = imgAssetElem[0].src;
    gCurTarget = checkElem;
    gLimitLoop = 10;
    fnUpdateInfo();
}

// アセット情報更新
function fnUpdateInfo(){
    if(gImgCheckSrc == null) return;
    let bFind = false;
    var detailViewerElems = document.getElementsByClassName("changeAssetDetailViewer");
    // マウスオーバー中のアイテムとイメージが一致しているかのチェック
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
        // 選択していたアイテムに戻す
        if(gSelectedItem != null){
            gSelectedItem.click();
        }
    }else{
        if(0 < gLimitLoop){
            gLimitLoop--;
            setTimeout(fnUpdateInfo,INTERVAL_CHECK_STATUS);
        }
    }
}

// DOM変更を検知
const observer = new MutationObserver(() => {
    // ここにDOM変更時の処理を書く
    setTimeout(fnCheckInventory,INTERVAL_CHECK_TAG);
    console.log('変更を検知');
});
// DOM変更を監視する設定
observer.observe(document.body, {
    subtree: true,
    childList: true, 
    attributes: true,
    characterData: true
});


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
