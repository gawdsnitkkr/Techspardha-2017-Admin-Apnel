/**
 * Created by varun on 11/10/16.
 */
"use strict";
var LocalStorage = (function () {
    function LocalStorage() {
    }
    LocalStorage.prototype.getItem = function (key) {
        var jsonString = localStorage.getItem(key);
        var json;
        try {
            json = JSON.parse(jsonString);
        }
        catch (exception) {
            return jsonString;
        }
        return json;
    };
    LocalStorage.prototype.setItem = function (key, value) {
        if (typeof value == 'object') {
            var jsonString = JSON.stringify(value);
            localStorage.setItem(key, jsonString);
        }
        else {
            localStorage.setItem(key, value);
        }
    };
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=localStorage.js.map