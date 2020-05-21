var b1 = document.getElementById("button");
var h2 = document.createElement("h2");
var titel = document.createTextNode("Ich bin noch eine Überschrift!");

h2.className = "h2 font-weight-normal";
h2.appendChild(titel);

var Ausgabebereich = document.getElementById("content");

b1.onclick = function () {
/*     window.alert("Der Button wurde gedrückt!"); */
    Ausgabebereich.appendChild(h2);
} 