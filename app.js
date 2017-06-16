var request = require('request-promise');
var moment = require('moment');
var _ = require("underscore");
// var $ = require('jQuery');
const { JSDOM } = require("jsdom");

var formData = {
    gameId: 3,
    drawId: 142,
    dayPrize: moment(),
    type: 0,
};

var result = {};
getNumbers(request, formData, result);

function getNumbers(request, data, result) {
    var options = {
        method: 'POST',
        uri: 'http://vietlott.vn/Ajax/PrevNextResultGameMega645',
        body: data,
        json: true // Automatically stringifies the body to JSON 
    };
    request(options)
        .then(function(body) {
            onFulfill(body, data);
        })
        .catch(onReject);
}

function extractLastDrawId(htmlText) {

}

function onFulfill(body) {
    var data = extractNumbers(body);
    var numbers = _.pick(data, '0', '1', '2', '3', '4', '5');
    countNumbers(result, numbers);
    if (data.drawId > 0) {
        var params = _.pick(data, 'gameId', 'drawId', 'dayPrize');
        params.type = 0;
        getNumbers(request, params, result);
    } else {
        console.log('Upload successful!  Server responded with:', sortList(result));
    }
}

function onReject(error) {
    return console.error('Unknown error: ', error);
}

function extractNumbers(htmlText) {
    var numbers = {};
    var dom = new JSDOM(htmlText).window.document;

    domParams = dom.querySelector('a[data-gameid], a[data-drawid], a[data-dayprize]');
    numbers.gameId = domParams.getAttribute('data-gameid');
    numbers.drawId = domParams.getAttribute('data-drawid');
    numbers.dayPrize = domParams.getAttribute('data-dayprize');

    var i = 0;
    _.each(dom.querySelectorAll('li:not([class="arrow-result"])'), function(item) {
        numbers[i++] = item.innerHTML;
    });

    return numbers;
}

function countNumbers(frequency, numbers) {
    var keys = _.keys(numbers);
    _.each(keys, function(item) {
        frequency[item] = _.contains(_.keys(frequency), numbers[item]) ?
        frequency[item] + 1 : 1;
    });
}

function sortList(object) {
    var rank = _.map(_.keys(object), function(item) {
        return {
            number: item,
            count: object[item]
        };
    });
    return _.sortBy(rank, function(item) {
        return -item.count;
    });
}