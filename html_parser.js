module.exports.extractNumbers = extractNumbers;

var _ = require("underscore");
const { JSDOM } = require("jsdom");

function extractNumbers(htmlText) {
    var numbers = null;
    var dom = new JSDOM(htmlText).window.document;

    domParams = dom.querySelector('a[data-gameid], a[data-drawid], a[data-dayprize]');
    if (domParams) {
        numbers = {};
        numbers.gameId = domParams.getAttribute('data-gameid');
        numbers.drawId = domParams.getAttribute('data-drawid');
        numbers.dayPrize = domParams.getAttribute('data-dayprize');

        var i = 0;
        _.each(dom.querySelectorAll('li:not([class="arrow-result"])'), function(item) {
            numbers[i++] = item.innerHTML;
        });
    }

    return numbers;
}