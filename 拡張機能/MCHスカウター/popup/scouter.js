// 設定LOAD
chrome.storage.sync.get({
	extend_mch_inventory_effect: false,
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
var styleElem = document.createElement("style");
	styleElem.textContent = `
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
	`;
document.head.appendChild(styleElem);

function resetTargetClass(target){
    if(!target) return false;
    //target.className = "assetSelectableListItem__inner";
}

var preTarget = null;
var fnCheckInventory = function() {
    var elemItems = document.getElementsByClassName("assetSelectableListItem__inner");
    if(0 < elemItems.length){
        //elemItems[1].classList.add("fedein");    
        for(elem of elemItems){
            elem.addEventListener("mouseover", (event) => {
                if(preTarget != event.currentTarget){
                    overlayElem.className = "overlay";
                    overlayElem.classList.add("fedein");
                    event.currentTarget.prepend(overlayElem);                        
                }
                preTarget = event.currentTarget;
            });
            // elem.addEventListener("mouseleave", (event) =>{
            //     setTimeout(resetTargetClass, 3000, event.currentTarget);
            // });
            setTimeout(fnCheckChangeURL,1000);
        }
    }else{
        setTimeout(fnCheckInventory,1000);
    }
};

var fnCheckChangeURL = function() {
    var elemItems = document.getElementsByClassName("assetSelectableListItem__inner");
    if(0 == elemItems.length){
        setTimeout(fnCheckInventory,1000);
    }else{
        setTimeout(fnCheckChangeURL,1000);
    }
};

// popstate イベントは、ブラウザのアクション（例えば、戻るボタンや進むボタン）によってアクティブな履歴エントリが変更されたときに発生
// window.addEventListener('popstate', function(event) {
//     console.log('URLが変更されました: ', window.location.href);
//     // ここに処理を記述
//     setTimeout(fn,1000);
// });

