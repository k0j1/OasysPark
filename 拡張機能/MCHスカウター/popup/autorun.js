
function fnCheckQuest() {
    var nodeTypeElems = document.getElementsByClassName('nodeType__actions');    
    if(nodeTypeElems == null) return;

    let nElemNum = nodeTypeElems.length;
    if(nElemNum == 0) return;

    // 自動実行ボタン追加
    for (let i = 0; i < nElemNum; i++) {
        if(nodeTypeElems[i].childNodes.length > 2) continue;
        var btnAutoRunElem = document.createElement('button');
        btnAutoRunElem.textContent = '自動実行';
        btnAutoRunElem.classList.add('nodeType__autorun');
        nodeTypeElems[i].appendChild(btnAutoRunElem);
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
