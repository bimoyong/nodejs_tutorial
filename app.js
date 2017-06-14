var request = require('request-promise');
var moment = require('moment');
var _ = require("underscore");
const { JSDOM } = require("jsdom");
const DAY_FORMAT = 'D/M/YYYY';

var formData = {
    gameId: 3,
    drawId: 141,
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

function onFulfill(body, data) {
    countNumbers(result, extractNumbers(body));
    if (data.drawId-- >= 0) {
        getNumbers(request, data, result);
    } else {
        console.log('Upload successful!  Server responded with:', sortList(result));
    }
}

function onReject(error) {
    return console.error('Unknown error: ', error);
}

function extractNumbers(htmlText) {
    var dom = new JSDOM(htmlText);
    var items = dom.window.document.querySelectorAll('li');
    numbers = [];
    _.each(items, function(item){
        if (item.children.length === 0){
            numbers.push(item.innerHTML);
        }
    });
    return numbers;
}

function countNumbers(frequency ,numbers) {
    numbers.forEach(function(item) {
        frequency[item] = _.contains(_.keys(frequency), item) ?
            frequency[item] + 1 : 1;
    }, this);
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