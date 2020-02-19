var arrTimes = [];
var i = 0; // start
var timesToTest = 5;
var tThreshold = 150; //ms
var testImage = "http://www.google.com/images/phd/px.gif"; // small image in your server
var dummyImage = new Image();
var isConnectedFast = false;

var downLink = navigator.connection
console.log(downLink)

const $ = s => document.querySelector(s);

testLatency(function (avg) {
    isConnectedFast = (avg <= tThreshold);
    /** output */
    /*
    document.body.appendChild(
        document.createTextNode("Time: " + (avg.toFixed(2)) + "ms - isConnectedFast? " + isConnectedFast)
    );
    */
    if (isConnectedFast) {
        $('#progress').innerHTML = `良好`;
    } else {
        $('#progress').innerHTML = `有點差`;
    }
});

/** test and average time took to download image from server, called recursively timesToTest times */
function testLatency(cb) {
    var tStart = new Date().getTime();
    if (i < timesToTest - 1) {
        dummyImage.src = testImage + '?t=' + tStart;
        dummyImage.onload = function () {
            var tEnd = new Date().getTime();
            var tTimeTook = tEnd - tStart;
            arrTimes[i] = tTimeTook;
            testLatency(cb);
            i++;
        };
    } else {
        /** calculate average of array items then callback */
        var sum = arrTimes.reduce(function (a, b) {
            return a + b;
        });
        var avg = sum / arrTimes.length;
        cb(avg);
    }
}