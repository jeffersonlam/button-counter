// Button Counter
// Jefferson Lam
// August 8th, 2015

// Global Variables
// =======================

// DOM manipulation variables
var clicks = 0;
var btnDisplay = document.getElementById("btn");
var timeout = null;
var checkInterval = setInterval(checkDatabase, 5000);

// Database params
var baseUrl = "https://api.mongolab.com/api/1/databases/counter/collections/count";
var objId = "55c58e5de4b0aa5c25b09441";
var apiKey = "QaWyo5unVgsSooAX9ku4x4irzhqt_X5B";
var getUrl = baseUrl + "?apiKey=" + apiKey;
var putUrl = baseUrl + "/" + objId + "?apiKey=" + apiKey;

// Setup
// =======================
reqwest({
  url: getUrl,
  method: 'get',
  type: 'json',
  error: function (err) {
    console.error(err);
  },
  success: function (res) {
    setDisplay(btnDisplay, res[0].number);
  }
});

// Functions
// =======================

// Increment database value
// Called per click
// Uses a timeout to optimize AJAX requests
function increment() {
  setDisplay(btnDisplay, getDisplay(btnDisplay) + 1);
  clicks++;

  clearInterval(checkInterval);
  clearTimeout(timeout);
  timeout = setTimeout(function(){
    var dbCount;
    reqwest({
      url: getUrl,
      method: 'get',
      type: 'json',
      error: function (err) {
        console.error(err);
      },
      success: function (res) {
        dbCount = res[0].number;
        reqwest({
          url: putUrl,
          method: 'put',
          type: 'json',
          contentType: 'application/json',
          data: data = JSON.stringify({
                         "number": dbCount + clicks
                       }),
          error: function (err) {
            console.error(err);
          },
          success: function (res) {
            clearTimeout(timeout);
            setDisplay(btnDisplay, dbCount + clicks);
            clicks = 0;
            checkInterval = setInterval(checkDatabase, 5000);
          }
        });
      }
    });
  }, 500); // /timeout
}

// Get displayed number on button
function getDisplay(btn) {
  var number = "";
  var children = btn.getElementsByTagName("span");
  for (var i=0; i < children.length; i++) {
    number += children[i].innerHTML;
  }
  return parseInt(number);
}

// Set displayed number on button
function setDisplay(btn, number){
  if (typeof number != "number") {
    console.error(number + " is not a number");
    return;
  }
  var children = btn.getElementsByTagName("span");
  if (children.length != number.toString().length) {
    btn.innerHTML = "";
    for (var i = 0; i < number.toString().length; i++) {
      var span = document.createElement("span");
      btn.appendChild(span);
    }
  }
  for (var i = 0; i < children.length; i++) {
    children[i].innerHTML = number.toString()[i];
  }
}

// Check if DB value is different from display value
// If they're different, update display value
function checkDatabase() {
  reqwest({
    url: getUrl,
    method: 'get',
    type: 'json',
    error: function (err) { console.error(err); },
    success: function (res) {
      var dbCount = res[0].number;
      if (getDisplay(btnDisplay) != dbCount) {
        setDisplay(btnDisplay, dbCount);
      }
    }
  });
}
