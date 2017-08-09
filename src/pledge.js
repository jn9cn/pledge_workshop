'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

// executor fx outside promise scope

let $Promise = function (executor) {
    // console.log(
    //     this._value + '\n' + this._state + '\n'
    // )
    if (typeof executor !== "function") {
        throw new TypeError("/executor.+function/i");
    }
    this._state = "pending";
    this._value = undefined;
    this._handlerGroups = []
    executor(this._internalResolve.bind(this), this._internalReject.bind(this));
};

$Promise.prototype._internalResolve = function (value) {
    if (typeof value === 'undefined' && this._handlerGroups) {
        // console.log(this)
        this._handlerGroups[0].successCb()
    }
    if (this._state === 'pending') {
        this._value = value;
        this._state = 'fulfilled';
        this._callHandlers(value);
    }

    //    if (this._state == 'fulfilled'){ 
    //         this._callHandlers();
    //     }
};

$Promise.prototype._internalReject = function (value) {
    if (!this._value) {
        if (typeof value === 'undefined') this._emptyVal = true
        if (!this._emptyVal) this._value = value;
    }
    if (this._state !== 'fulfilled') {
        this._state = 'rejected';
        this._callHandlers(value);
    }
};
//$Promise.prototype._handlerGroups = new Array();

$Promise.prototype.then = function (resolve, reject) {
    this._handlerGroups = this._handlerGroups || new Array();
    this._handlerGroups.push({
        successCb: typeof resolve === 'function' ? resolve : null,
        errorCb: typeof reject === 'function' ? reject : null
    });

    this._callHandlers(this._value)
}

$Promise.prototype._callHandlers = function (data) {
    if(this._state === "pending") return;
    this._handlerGroups.forEach(group => {
        if (this._state === 'fulfilled') {
            console.log(group.successCb)
           if (group.successCb)  group.successCb(data) 
        }
        if (this._state === 'rejected') {
           if (group.rejectCb)  group.rejectCb(data) 
        }

    })
    this._handlerGroups = [];
 

    // console.log(this._handlerGroups)
    // if(this._callHandlers.length === 0) return;
    // if (this._state === 'fulfilled' || !this._handlerGroups) {
    //     this._handlerGroups[0].successCb(data);
    //     this._handlerGroups.shift();
    //     this._callHandlers(data);
    //     // this._callHandlers( this._handlerGroups[0].successCb, this._handlerGroups[0].errorCb )
    // }
    // if (this._state === 'rejected') {
    //     this._handlerGroups[0].rejectCb(data);
    //     this._handlerGroups.shift();
    // }
}

//console.log(this._handlerGroups, '-------> ');
// var b = fs.readFile

// $Promise._state = new Promise(function (reject, resolve) {
//     return resolve("pending");
// }).then(function(){
//     fs
// });

// function () {
//     return "pending";
// }




/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/