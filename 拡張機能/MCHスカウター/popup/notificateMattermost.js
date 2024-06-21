let pre_popup = null;

// 設定LOAD
chrome.storage.sync.get({
	extend_mattermost_notify: true
}, function (items) {
	let bExec = items.extend_mattermost_notify;
	if (bExec) extendNotificateMattermost();
});

// バックグラウンド処理
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("notificate バックグラウンド開始");
	if (!request) {
		console.log("request is null");
		return;
	}
	switch (request.action) {
		case "dispMessage":
			openPopupWindow2(request.baseURI, request.htmlText);
			break;
		case "dispChannel":
			//let findLink = request.link.substring(request.link.search("/dev-all/channels/"), request.link.length);
			var alinkElems = document.getElementsByClassName("sidebar-channel");
			for (let elem of alinkElems) {
				let link = elem.attributes["href"].nodeValue;
				if (link.includes(request.link)) {
					elem.click();
					elem.scrollIntoView({
						bevahior: "smooth",
						block: "center",
					});
					break;
				}
			}
			break;
	}
	console.log("notificate バックグラウンド終了");
});
window.addEventListener('message', () => {
	if(!event) return;
	if(event.source != window) return;
	if(event.data.EventID && event.data.EventID === "activeTab"){
		chrome.runtime.sendMessage({"EventID": "activeTab"});
	}
});

function extendNotificateMattermost() {
	const observerSide = new MutationObserver(mutations => {
		// console.log("observer実行中");
		mutations.forEach(mutation => {
			switch (mutation.type) {
				case 'attributes':
					//console.log("[observerSide] attributes-html:" + mutation.target.innerHTML);
					let bResult = channelCallback(mutation.target);
					//console.log("bNewMsg=" + bResult);
					if (bResult) {
						//console.log("mutation.target=" + mutation.target);
						//console.log("mutation.target.nodeValue=" + mutation.target.nodeValue);
						//console.log("mutation.target.classList=" + mutation.target.classList);
						let parentElem = mutation.target.parentElement;
						if (mutation.target.classList.contains("unread-title") && !parentElem.classList.contains("read-channel")) {
							parentElem.id = "read-channel";
							parentElem.classList.add("read-channel");
						}
					}
					break;
				case 'characterData':
					channelCallback(mutation.target);
					break;
				default:
					break;
			}
		});
	});

	const observerConfig = {
		attributes: true,
		childList: true,
		subtree: true,
		characterData: true
	};

	setTimeout(function () {
		var sideElem = document.getElementById("sidebar-left");
		observerSide.observe(sideElem, observerConfig);
		console.log("Load observerSide.observe()");
	}, 5000);
}

function channelCallback(target) {
	let baseURI = "";
	let link = "";
	let htmlText = "";
	//let addText = "";
	let bNewMsg = false;
	//console.log("[channelCallback] attributes[class].nodeValue:" + attributes["class"].nodeValue);
	var targetElem = target;
	var attributes = target.attributes;
	if (!attributes) {
		//addText = "@ﾒﾝｼｮﾝ-" + target.textContent;
		let parentBadge = target.parentElement;
		if (parentBadge.classList.contains("badge")) {
			targetElem = parentBadge.parentElement;
			attributes = targetElem.attributes;
		}
	}
	if (attributes) {
		if (attributes["class"].nodeValue.includes("unread-title")) {
			//console.log("[channelCallback] find unread-title");
			baseURI = attributes["class"].baseURI;
			link = attributes["href"].nodeValue;
			for (var child of targetElem.childNodes) {
				if (child.nodeName == "#text") {
					htmlText = child.nodeValue;
					break;
				}
			}
		}
	} else {
		let url = document.baseURI;
		let findLink = url.substring(url.search("/dev-all/channels/"), url.length);
		var alinkElems = document.getElementsByClassName("sidebar-channel");
		for (let elem of alinkElems) {
			link = elem.attributes["href"].nodeValue;
			if (link.includes(findLink)) {
				baseURI = url;
				for (var child of elem.childNodes) {
					if (child.nodeName == "#text") {
						htmlText = "メンションあり";
						break;
					}
				}
				break;
			}
		}
	}
	//if (0 < addText.length) htmlText += `（${addText}）`;
	if (0 < htmlText.length) {
		console.log("新着メッセージあり");
		//openPopupWindow2(baseURI, htmlText);
		openToastNotify(link, htmlText);
		bNewMsg = true;
	}
	return bNewMsg;
};
function openToastNotify(link, channelText) {
    var bNotificationPopup = false;
	chrome.runtime.sendMessage({
		"EventID": "sendNativeMessage",
		"channelText": channelText,
		"url": link,
	});
};


function openPopupWindow2(baseURI, channelText) {
	var margin = 10;
	var width = 200;
	var height = 50;
	var left = window.screen.availWidth - width - margin;
	var top = window.screen.availHeight - height - margin;

	if (pre_popup != null && !pre_popup.closed) {
		pre_popup.close();
		pre_popup = null;
	}

	const popup = window.open("", "popupWindow",
		"toolbar=no, location=no, directories=no, status=no, menubar=no, scollbars=yes, resizable=yes, " + 
		"width=" + width + ", height=" + height +
		", left=" + left + ", top=" + top
	);

	popup.document.write("<h3>新着メッセージ</h3><div><font size='2'>・<a href='#' id='linkMattermost' onclick='chrome.runtime.sendMessage({\"EventID\": \"activeTab\"});'>" + channelText + "</a></font></div>");
	var styleElem = popup.document.createElement("style");
	styleElem.textContent = `
		body{font-size:12px;}
		h3 {position: relative;padding-left:1.2em;line-height:1.4em;border-bottom:6px solid #094;font-size:18px;}
		h3:before {content:"✓";font-weight:900;position:absolute;font-size:1em;left:0;top:0;color:#5ab9ff;}
	`;
	popup.document.head.appendChild(styleElem);
	//var scriptElem = popup.document.createElement("script");
	//scriptElem.textContent = `
	//	document.getElementById("linkMattermost").addEventListener('click', () =>{
	//		let url = 'http://mattermost.tksf.jdl.co.jp/';
	//		console.log(url);
	//		chrome.tabs.query({}, (tabs) => {
	//			for (let tab of tabs) {
	//				if (tab.url.includes(url)) {
	//					// URLが見つかったら既存タブをアクティブ化
	//					chrome.tabs.update(tab.id, { active: true });
	//					chrome.windows.update(tab.windowId, { focus: true });
	//					return;
	//				}
	//			}
	//			// URLが見つからなかったら新規タブ
	//			chrome.tabs.create({ url: url });
	//		});
	//		chrome.runtime.sendMessage({ url: url });
	//	});
	//`;
	//popup.document.head.appendChild(scriptElem);

	pre_popup = popup;
	//popup.document.write(
	//	"<script>" +
	//	"document.getElementById('linkMattermost').addEventListener('click', function(event){ " + 
	//	"  event.preventDefault(); " + // リンクデフォルト動作をキャンセル
	//	"  chrome.tabs.query({active:true, currentWindow:true}, function(tabs){ " +
	//	"    chrome.tabs.executeScript(tab[0].id, {code:'window.open('" + baseURI + "'), '_blank'}); " +
	//	"  }); " +
	//	"}); " +
	//	"</script>"
	//);
	console.log(channelText);
	setTimeout(function () {
		if (pre_popup != null && !pre_popup.closed) {
			pre_popup.close();
			pre_popup = null;
		}
	}, 10000);
};
