/**
 * Module dependencies
 */
var interfaceValidator = require('./interface-validator');

/**
 * Using the adapter pattern to log Requestify logs.
 */
var Logger = (function() {
    'use strict';

    /**
     * Current adapter
     * @type {object}
     */
    var adapter = null,

        /**
         * Interface mandatory methods to any logger adapter.
         * @type {array}
         */
        adapterInterface = [
            'error',
            'info',
            'debug',
            'warning'
        ],

        /**
         * Module API to return
         */
        api = {},

        /**
         * Supported logging levels
         * @type {array}
         */
        levels = [
            'error',
            'warning',
            'info',
            'debug'
        ],

        currentLoggingLevel = 0;

    /**
     * Logs to the adapter
     * @param {string} method
     * @param {string|object} message
     */
    function log(method, message) {
        if (!adapter) {
            return;
        }

        adapter[method](message);
    }

    /**
     * Create public log methods according to interface
     */
    adapterInterface.forEach(function(value) {
        api[value] = function(message) {
            log(value, message);
        };
    });

    /**
     * Sets a logger to log to. defaults to null (which means logs to no-where)
     * @param {string|object} loggerAdapter
     * @returns {Logger}
     */
    api.setLogger = function(loggerAdapter) {
        interfaceValidator.validate('LoggerInterface', loggerAdapter, adapterInterface);
        adapter = loggerAdapter;

        return this;
    };

    /**
     * Determines the level of logs to log in to
     * @param {number} level
     */
    api.logLevel = function(level) {
        if (levels[level] === undefined) {
            throw new Error(level + ' is not a valid logging level');
        }

        currentLoggingLevel = level;
    };

    return api;
}());

module.exports = Logger;