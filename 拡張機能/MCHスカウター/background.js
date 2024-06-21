// 定義
const SEND_NATIVE_MESSAGE_NAME = 'dispnotification.app';

// コンテキストメニュー追加処理
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "saveMemo",
		title: "メモに保存",
		contexts: ["all"]
	});
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
	if(info.menuItemId === "saveMemo") {
		//chrome.scripting.executeScript({
		//	target: { tabId: tab.id },
		//	function: saveContextMemo,
		//	args: [info.selectionText]
		//});
		saveContextMemo(info.selectionText);
	}
});
function saveContextMemo(saveText) {
	const id = new Date().toISOString();
	chrome.storage.sync.get({
		memo_ids: [],
	}, function (items) {
		//for(let i = 0; i < items.memo_ids.length; i++){}
		items.memo_ids.push(id);
		chrome.storage.sync.set({
			"memo_ids": items.memo_ids,
		}, function () {
			console.log("save memo_ids.");
			console.log("*** memo_ids=" + items.memo_ids);
		});
	});
	const data = {}
	data[id] = saveText;
	chrome.storage.local.set(data, () => {
		console.log("save memo.");
		console.log("*** data=" + data);
	});
}


// バックグラウンド処理
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("バックグラウンド処理 開始");
	console.log("request.url=" + request.url);
    console.log(request);
    if(request.EventID == "sendNativeMessage")
    {
        chrome.runtime.sendNativeMessage(
    		SEND_NATIVE_MESSAGE_NAME,
			{ "title": "新着メッセージ", "message": request.channelText, "link": request.url },
    		function(response) {
				console.log(response);
				if(response) {
					if(response.action == "clicked") {
						//activeMattermostTab(response.link);
					}
				} else {
					//sendMattermostTabMessage(request.url, request.channelText);
				}
                console.log(response);
    		});
	} else if(request.EventID == "activeTab"){
		//activeMattermostTab();
	}
	console.log("バックグラウンド処理 終了");
});

// async function sendMattermostTabMessage(url, htmlText) {
// 	const checkURL = "http://mattermost.tksf.jdl.co.jp/";
// 	await chrome.tabs.query({}, (tabs) => {
// 		for (let tab of tabs) {
// 			if (tab.url.includes(checkURL)) {
// 				// URLが見つかったら既存タブをアクティブ化
// 				chrome.tabs.sendMessage(tab.id, {
// 					action: "dispMessage",
// 					baseURI: url,
// 					htmlText: htmlText,
// 				});
// 				return;
// 			}
// 		}
// 	});
// }

// async function activeMattermostTab(url = ""){
// 	const checkURL = "http://mattermost.tksf.jdl.co.jp/";
// 	await chrome.tabs.query({}, (tabs) => {
// 		for (let tab of tabs) {
// 			if (tab.url.includes(checkURL)) {
// 				// URLが見つかったら既存タブをアクティブ化
// 				chrome.tabs.update(tab.id, { active: true });
// 				chrome.windows.update(tab.windowId, { focused: true });
// 				// URLが見つかったら既存タブをアクティブ化
// 				chrome.tabs.sendMessage(tab.id, {
// 					action: "dispChannel",
// 					link: url,
// 				});
// 				return;
// 			}
// 		}
// 		// URLが見つからなかったら新規タブ
// 		//chrome.tabs.create({ url: request.url });
// 	});
// }
//function openTag(tag) {
//	let elements = document.getElementByTagName
//}
