


// クエストタイトル取得
function getQuestTitle(modalDlgElem) {
    var modalHeaderElem = modalDlgElem.getElementsByClassName('modal__header')[0];
    // タイトル取得
    let strTitle = "";
    for (let i = 0; i < modalHeaderElem.childNodes.length; i++) {
        var childElem = modalHeaderElem.childNodes[i];
        if(childElem == null) continue;
        if(childElem.nodeName !== "H2") continue;
        strTitle = childElem.textContent;
        break;
    }
    return strTitle;
}
// クエストレベル取得
function getQuestLevel(modalDlgElem) {
    var modalLevelElems = modalDlgElem.getElementsByClassName('departureModal__levelSection');
    if(modalLevelElems.length == 0) return;
    var activeLevelElems = modalLevelElems[0].getElementsByClassName('active');
    if(activeLevelElems.length == 0) return;
    var svgElems = activeLevelElems[0].getElementsByTagName('svg');
    if(svgElems.length == 0) return;
    var strLevelElem = svgElems[0].nextElementSibling;
    if(strLevelElem == null) return;
    let strLevel = strLevelElem.textContent;
    return strLevel;
}
// クエストチーム取得
function getQuestTeam(modalDlgElem) {
    var modalTeamElems = modalDlgElem.getElementsByClassName('departureModal__teamSection');
    if(modalTeamElems.length == 0) return;
    var activeTeamElems = modalTeamElems[0].getElementsByClassName('active');
    if(activeTeamElems.length == 0) return;
    var teamTitleElems = activeTeamElems[0].getElementsByClassName('team__title');
    if(teamTitleElems.length == 0) return;
    var strTeamTitle = teamTitleElems[0].textContent;
    return strTeamTitle;
}

// 自動実行ボタンクリック時の処理
function clickAutoRun(event) {
    // 自動実行ボタンの要素を取得
    var autorunElem = event.target;
    if(autorunElem == null) return;

    var modalDlgElems = document.getElementsByClassName('questDepartureModal');    
    if(modalDlgElems == null) return;
    if(modalDlgElems.length == 0) return;

    // タイトル取得
    let strTitle = getQuestTitle(modalDlgElems[0]);
    let strLevel = getQuestLevel(modalDlgElems[0]);
    let strTeam = getQuestTeam(modalDlgElems[0]);

    let strMsg = "スタミナをすべて使用するまで以下のクエストを実行します\n\n";
    strMsg += strTitle + "\nスタミナ消費：" + strLevel + "\nチーム：" + strTeam;
    strMsg += "\n\nよろしいですか？";

    if (confirm(strMsg)) {
        console.log("Yes が選択されました");
    } else {
        console.log("No が選択されました");
    }
}

// クエストノードの自動実行ボタン追加
function fnCheckQuest() {
    var modalDlgElems = document.getElementsByClassName('questDepartureModal');    
    if(modalDlgElems == null) return;

    let nElemNum = modalDlgElems.length;
    if(nElemNum == 0) return;

    // 自動実行ボタン追加
    for (let i = 0; i < nElemNum; i++) {
        var modalFooterElems = modalDlgElems[i].getElementsByClassName('modal__footer');    
        if(modalFooterElems == null) continue;
        if(modalFooterElems.length != 1) continue;
        if(modalFooterElems[0].childNodes.length > 2) continue;
        
        var btnAutoRunElem = document.createElement('button');
        btnAutoRunElem.textContent = 'スタミナ全消費';
        btnAutoRunElem.classList.add('autorunButton');
        btnAutoRunElem.addEventListener('click', clickAutoRun);
        // if(modalFooterElems[0].childNodes[1]){
        //     btnAutoRunElem.onclick = modalFooterElems[0].childNodes[1].onclick;
        // }
        modalFooterElems[0].appendChild(btnAutoRunElem);
    }
}

// DOM変更を検知
const observerAutorun = new MutationObserver(() => {
    // ここにDOM変更時の処理を書く
    setTimeout(fnCheckQuest,1000);
    console.log('変更を検知');
});
// DOM変更を監視する設定
observerAutorun.observe(document.body, {
    subtree: true,
    childList: true
});
