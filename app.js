var request = require('request-promise');
var moment = require('moment');
var _ = require("underscore");
var htmlParser = require('./html_parser');
var csvWriter = require('./csv_writer');

const { JSDOM } = require("jsdom");
const formData = {
    gameId: 3,
    drawId: 9999,
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
            onFulfill(body);
        })
        .catch(onReject);
}

function extractLastDrawId(htmlText) {

}

function onFulfill(body, writer) {
    var data = htmlParser.extractNumbers(body);
    if (!data || data.drawId === 0) {
        console.log('Upload successful!  Server responded with:', sortList(result));
        return;
    }
    var numbers = _.pick(data, '0', '1', '2', '3', '4', '5');
    countNumbers(result, numbers);
    var params = _.pick(data, 'gameId', 'drawId', 'dayPrize');
    params.type = 0;
    getNumbers(request, params, result);
}

function onReject(error) {
    return console.error('Unknown error: ', error);
}

function countNumbers(frequency, numbers) {
    var keys = _.keys(numbers);
    _.each(keys, function(item) {
        frequency[numbers[item]] = _.contains(_.keys(frequency), numbers[item]) ?
        frequency[numbers[item]] + 1 : 1;
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