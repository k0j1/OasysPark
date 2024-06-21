chrome.storage.sync.get({
	memo_old_text: "",
	memo_new_text: "",
}, function (items) {
	replaceText(items.memo_old_text, items.memo_new_text);
});

function replaceText(searchText, newText){
	let regex = new RegExp(searchText, 'g');
	console.log("pre: " + document.body.innerHTML);
    document.body.innerHTML = document.body.innerHTML.replace(regex, newText);
	console.log("post: " + document.body.innerHTML);
}