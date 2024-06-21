// 設定値定義
const listCloseCount = 8;

// 設定LOAD
chrome.storage.sync.get({
	extend_mattermost_leftmenu: true
}, function (items) {
	let bExec = items.extend_mattermost_leftmenu;
	if (bExec) extendLeftMenuMattermost();
});

function extendLeftMenuMattermost() {
	setTimeout(function () {
		var sideElem = document.getElementById("sidebar-left");
		var listElem = sideElem.getElementsByClassName("nav nav-pills nav-stacked");

		var listCount = listElem.length;
		for (var i = 0; i < listCount; i++) {
			// 最後の項目（ダイレクトメッセージ）以外はそのまま表示
			//if(i < listCount - 1) continue;

			var childNodes = listElem[i].childNodes;
			var newULItem = document.createElement("UL");
			newULItem.setAttribute("class", "nav");

			for (var j = 0; childNodes.length != 1;) {
				if (j === 0) {
					// ヘッダー
					childNodes[0].classList.add("accordion-menu");
					var newElemItem = document.createElement("label");
					newElemItem.setAttribute("for", "item" + i);
					// li.accordion-menu に label を追加
					childNodes[0].appendChild(newElemItem);
					// h4 を取得
					var childItem = childNodes[0].childNodes[0];
					for (const Item of childItem.childNodes) {
						console.log("Item.tagName=" + Item.tagName);
						switch (Item.tagName) {
							case "A":
								childItem.removeChild(Item);
								break;
							case "SPAN":
								Item.textContent = Item.textContent + "(" + (childNodes.length - 1) + ")";
								//console.log("Item.textContent=" + Item.textContent);
								break;
						}
					}
					newElemItem.appendChild(childItem);
					// インプット			
					var newInputElem = document.createElement("input");
					newInputElem.setAttribute("type", "checkbox");
					newInputElem.setAttribute("id", "item" + i);
					newInputElem.setAttribute("class", "accordion");
					newInputElem.checked = childNodes.length > listCloseCount ? false : true; // 子要素がlistCloseCount個以上の場合格納した状態
					childNodes[0].appendChild(newInputElem);
					childNodes[0].appendChild(newULItem);
					j = j + 1;
				} else {
					// コンテンツ
					newULItem.appendChild(childNodes[j]);
				}
			}
		}
		setStyleTag();
	}, 5000);
}

// スタイルタグセット関数
function setStyleTag()
{
	var styleElem = document.createElement("style");
	styleElem.textContent = `
		li.accordion-menu input.accordion{ width: 0px; }
		li.accordion-menu input.accordion:checked + ul li{ height: auto; padding-inline-start: 0px;}
		li.accordion-menu ul li#read-channel { height: auto; padding-inline-start: 0px;}
		li.accordion-menu ul li:has(.unread-title) { height: auto; padding-inline-start: 0px;}
		li.accordion-menu ul li.active { height: auto; padding-inline-start: 0px;}
		li.accordion-menu ul li{ height: 0; overflow:hidden; }
		li.accordion-menu label h4 {
		    color: #aaa;
		    font-size: 1em;
		    font-weight: 400;
		    letter-spacing: -.3px;
		    margin: 1.1em 0 .5em;
		    padding: 0 10px 0 15px;
		    text-transform: uppercase;
		}
		ul.nav li>a {
			border-radius: 0;
			line-height: 1.5;
			outline: none;
			overflow: hidden;
			padding: 3px 10px 3px 25px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.accordion-menu:has(.unread-title) label h4 span {
			color: white;
			font-weight: bold;
		}
	`;
	var headElem = document.head;
	headElem.appendChild(styleElem);
}

// 末端のテキスト取得関数
function getEndText(elem){
	var childNodes = elem.childNodes;
	if(childNodes.length === 0){
		return elem.textContent.trim();
	} else {
		var lastChild = childNodes[0];
		return getEndText(lastChild);
	}
}
