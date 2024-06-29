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
	    .overlay { position: absolute; width: 124px; height: 124px; background-color: rgba(128,128,128,0.0); z-index: 2; padding:0; }
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
    }else{
        setTimeout(fnCheckInventory,1000);
    }
};

const observer = new MutationObserver(() => {
    // ここにDOM変更時の処理を書く
    setTimeout(fnCheckInventory,1000);
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
function setChart(parentElem, id, hp, phy, int, agi){
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
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    parentElem.prepend(canvElem);
    parentElem.removeChild(overlayElem);
}

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
