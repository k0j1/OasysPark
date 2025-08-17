let gFlagAutorun = 0; // 自動実行フラグ(0:オフ, 1:オン-SkipAll待ち, 2:オン-クエストリトライ待ち)

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

// クエスト開始ボタンをクリックする関数
function clickStartQuest(){
    if(gFlagAutorun == 0) return; // 自動実行フラグがオフの場合は何もしない

    var modalDlgElems = document.getElementsByClassName('questDepartureModal');    
    if(modalDlgElems == null) return;
    if(modalDlgElems.length == 0) return;

    let nElemNum = modalDlgElems.length;
    if(nElemNum == 0) return;

    for (let i = 0; i < nElemNum; i++) {
        var modalFooterElems = modalDlgElems[i].getElementsByClassName('modal__footer');    
        if(modalFooterElems == null) continue;
        if(modalFooterElems.length != 1) continue;
        for(elem of modalFooterElems[0].children){
            if(elem == null) continue;
            if(elem.nodeName !== "BUTTON") continue;
            if(elem.textContent !== "Go") continue;
            if(!elem.disabled){
                elem.click(); // クエスト開始ボタンをクリック
                console.log("クエスト開始ボタンをクリックしました");
                i = nElemNum; // ループ終了
            }else{
                gFlagAutorun = 0; // 自動実行フラグをオフにする
                console.log("クエスト開始ボタンが無効なため終了します");
                alert("クエスト開始ボタンが無効なため終了します");
            }
            break;
        }
    }
}

// 自動実行ボタンクリック時の処理
function clickAutoRun(event) {
    // 自動実行ボタンの要素を取得
    var autorunElem = event.target;
    if(autorunElem == null) return;

    var modalDlgElems = document.getElementsByClassName('questDepartureModal');    
    if(modalDlgElems == null) return;
    if(modalDlgElems.length == 0) return;

    gFlagAutorun = 1; // 自動実行フラグをオンにする
    clickStartQuest();
}
// （未使用）自動実行の確認画面表示
function confirmAutorun(){
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
        gFlagAutorun = 1; // 自動実行フラグをオンにする
        clickStartQuest();
    } else {
        console.log("No が選択されました");
    }
}

// Skip All ボタンをクリックする関数
function clickSkipAll(){
    if(gFlagAutorun != 1) return; // 自動実行フラグがオン-SkipAll待ちでない場合は何もしない
    clickQuestButton("Skip All", 2); // Skip All ボタンをクリックして自動実行フラグをリトライ待ちにする
}
// リトライボタンをクリックする関数
function clickQuestRetry(){
    if(gFlagAutorun != 2) return; // 自動実行フラグがリトライ待ちでない場合は何もしない
    let bClick = clickQuestButton("リトライ", 1); // リトライボタンをクリックして自動実行フラグをオフにする
    if(bClick){
        setTimeout(clickStartQuest, INTERVAL_CHECK_TAG);
    }
}
// クエストボタンをクリックする関数
function clickQuestButton(textBtn, nextFlagAutorun){
    let clickFlag = false; // ボタンがクリックされたかどうかのフラグ
    var Elems = document.getElementsByTagName("button");
    for(Elem of Elems){
        let flag = false;
        for(childElem of Elem.children){
            // 指定のボタンテキストか判定
            if(Elem.textContent === textBtn){
                console.log(textBtn + " ボタンを発見");
                flag = true;
                break;
            }
        }
        if(flag){
            console.log(textBtn + " ボタンをクリック");
            gFlagAutorun = nextFlagAutorun; // 自動実行フラグを指定の値にセット
            Elem.click();
            clickFlag = true; // ボタンがクリックされた
            break;
        }
    }
    return clickFlag;
}

function addAutoRunButton(modalDlgElems) {
    if(gFlagAutorun != 0) return; // 自動実行フラグがオンの場合は何もしない

    let nElemNum = modalDlgElems.length;
    if(nElemNum == 0) return;

    // 自動実行ボタン追加
    for (let i = 0; i < nElemNum; i++) {
        var modalFooterElems = modalDlgElems[i].getElementsByClassName('modal__footer');    
        if(modalFooterElems == null) continue;
        if(modalFooterElems.length != 1) continue;
        if(modalFooterElems[i].childNodes.length > 2) continue;
        
        var btnAutoRunElem = document.createElement('button');
        btnAutoRunElem.textContent = 'スタミナ全消費';
        btnAutoRunElem.classList.add('autorunButton');
        btnAutoRunElem.addEventListener('click', clickAutoRun);
        // if(modalFooterElems[0].childNodes[1]){
        //     btnAutoRunElem.onclick = modalFooterElems[0].childNodes[1].onclick;
        // }
        modalFooterElems[i].appendChild(btnAutoRunElem);
        break; // 最初のダイアログにのみ追加
    }
}

// クエストノードの自動実行ボタン追加
function fnCheckQuest() {
    if (!location.href.includes('quest')) return; // クエストページでない場合は何もしない

    switch(gFlagAutorun){
        case 0: // 自動実行フラグがオフ
            var modalDlgElems = document.getElementsByClassName('questDepartureModal');    
            // クエストダイアログが存在する場合は「スタミナ全消費ボタン」を追加
            if(modalDlgElems){
                addAutoRunButton(modalDlgElems);
            }
            break;
        case 1: // 自動実行フラグがオン-SkipAll待ち
            clickSkipAll();
            break;
        case 2: // 自動実行フラグがオン-クエストリトライ待ち
            clickQuestRetry();
            break;    
    }
}

// DOM変更を検知
const observerAutorun = new MutationObserver(() => {
    // ここにDOM変更時の処理を書く
    setTimeout(fnCheckQuest,INTERVAL_CHECK_TAG);
    //console.log('変更を検知');
});

// DOM変更を監視する設定
observerAutorun.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true
});