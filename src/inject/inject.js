chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		//console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
	}}, 10);
});


////////////// TODO : TOOLS CLASS ////////////
function GetQueryStringInUrl(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//////////////////////////////////////////////

var _isInit = false;
var _maxJacques = 10;
var _currentJacques = 0;
var _soundPlayed = false;

//init
$(function(){
	/*chrome.storage.local.get("co2Count", function (obj) { 
		if(isNaN(obj.co2Count)){ obj.co2Count = 0.0; SaveCo2Count(obj.co2Count); }
		_co2Count = obj.co2Count;
		InitCo2Detections();
	});	*/
	
	if(!_isInit){
		var elements = document.body.getElementsByTagName('*');
		var imgURL = chrome.extension.getURL("icons/jacques.png");		
		var textTitle = /*node.nodeValue || */document.title;
		var words = textTitle.split(/(\s+)/);
		for(var i = words.length-1; i--;){
			if (words[i] === " " || words[i].length < 2) words.splice(i, 1);
		}
		//console.log(words);

		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];

			for (var j = 0; j < element.childNodes.length; j++) {
				var node = element.childNodes[j];

				if (_currentJacques < _maxJacques && node.nodeType === 3) {
					
					
					var word = words[Math.floor(Math.random() * words.length)];		
					var vortexUrl = "https://duckduckgo.com/?q=!ducky+tout+" + Math.random().toString(36).substr(2, 1) + "+" + word;
					var text = node.nodeValue;
					var replacedText = text.replace(/Tout/gi, '<a href="' + vortexUrl + '">T O U T</a><img src="' + imgURL + '" style="height: 40px;" />');

					if (replacedText !== text) {
						_currentJacques ++;
						element.innerHTML = replacedText;
						//element.replaceChild(document.createHtmlNode(replacedText), node);
						//console.log("Tout est magnifique")
						if(!_soundPlayed){
							_soundPlayed = true;
							var soundURL = chrome.extension.getURL("sounds/bell3.mp3");
							element.innerHTML += '<audio id="playerJacques" src="'+soundURL+'" >';
						}
					}
				}
			}
		}

		var player = document.getElementById('playerJacques');
		if (player != undefined){
			player.play();
		}

	}

})

