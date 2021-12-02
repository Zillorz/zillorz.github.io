let hits = 0;
var hitElement = document.querySelector(".hits");
document.body.onkeyup = function (e) {
  if (e.keyCode == 32) {
    addHit();
  }
};

var addHit = function () {
  hits += 1;
  renderHits();
  document.getElementById("a2").innerHTML = "Save";
};

var renderHits = function () {
  hitElement.innerHTML = hits;
};

function hit() {
  var w = window.prompt("Enter amount");
  hits = parseInt(w);
}

var resetHits = function () {  document.getElementById("a2").innerHTML = "Load";
  hits = 0;
  renderHits();
};

function save() {
  if (document.getElementById("a2").innerHTML == "Save") { window.localStorage.setItem("clicks", hits)
  } else {
     var value = window.localStorage.getItem("clicks")
    hits = parseInt(value);
    renderHits();
  }
}

