"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var events_1 = require("events");
var path = require("path");
var DefaultSearchWindowHtml = "file://" + path.join(__dirname, 'search-window.html');
var ShouldDebug = !!process.env.ELECTRON_IN_PAGE_SEARCH_DEBUG;
var log = ShouldDebug
    ? console.log.bind(console)
    : function nop() {
        /* nop */
    };
var InPageSearch = /** @class */ (function (_super) {
    __extends(InPageSearch, _super);
    function InPageSearch(searcher, searcherParent, searchTarget, preload) {
        var _this = _super.call(this) || this;
        _this.searcher = searcher;
        _this.searcherParent = searcherParent;
        _this.searchTarget = searchTarget;
        _this.opened = false;
        _this.requestId = null;
        _this.prevQuery = '';
        _this.activeIdx = 0;
        _this.maxIdx = 0;
        _this.initialized = false;
        if (preload) {
            _this.initialize();
        }
        return _this;
    }
    InPageSearch.prototype.openSearchWindow = function () {
        if (this.opened) {
            log('Already opened');
            return;
        }
        this.initialize();
        this.searcher.classList.remove('search-inactive');
        this.searcher.classList.remove('search-firstpaint');
        this.searcher.classList.add('search-active');
        this.opened = true;
        this.emit('open');
        this.focusOnInput();
    };
    InPageSearch.prototype.closeSearchWindow = function () {
        if (!this.opened) {
            log('Already closed');
            return;
        }
        this.stopFind();
        this.searcher.send('electron-in-page-search:close');
        this.searcher.classList.remove('search-active');
        this.searcher.classList.add('search-inactive');
        this.emit('stop');
        this.requestId = null;
        this.prevQuery = '';
        this.opened = false;
    };
    InPageSearch.prototype.isSearching = function () {
        return this.requestId !== null;
    };
    InPageSearch.prototype.startToFind = function (query) {
        this.requestId = this.searchTarget.findInPage(query);
        this.activeIdx = 0;
        this.maxIdx = 0;
        this.prevQuery = query;
        this.emit('start', query);
        this.focusOnInputOnBrowserWindow();
    };
    InPageSearch.prototype.findNext = function (forward) {
        if (!this.isSearching()) {
            throw new Error('Search did not start yet. Use .startToFind() method to start the search');
        }
        this.requestId = this.searchTarget.findInPage(this.prevQuery, {
            forward: forward,
            findNext: true
        });
        this.emit('next', this.prevQuery, forward);
        this.focusOnInputOnBrowserWindow();
    };
    InPageSearch.prototype.stopFind = function () {
        this.searchTarget.stopFindInPage('clearSelection');
    };
    // You need to call this method when destroying InPageSearch instance.
    // Or the <webview> element will ramain in DOM and leaks memory.
    InPageSearch.prototype.finalize = function () {
        this.searcherParent.removeChild(this.searcher);
    };
    InPageSearch.prototype.initialize = function () {
        if (this.initialized) {
            return;
        }
        this.registerFoundCallback();
        this.setupSearchWindowWebview();
        this.initialized = true;
    };
    InPageSearch.prototype.onSearchQuery = function (text) {
        log('Query from search window webview:', text);
        if (text === '') {
            this.closeSearchWindow();
            return;
        }
        if (!this.isSearching() || this.prevQuery !== text) {
            this.startToFind(text);
        }
        else {
            this.findNext(true);
        }
    };
    InPageSearch.prototype.onFoundInPage = function (result) {
        log('Found:', result);
        if (this.requestId !== result.requestId) {
            return;
        }
        if (typeof result.activeMatchOrdinal === 'number') {
            this.activeIdx = result.activeMatchOrdinal;
        }
        if (typeof result.matches === 'number') {
            this.maxIdx = result.matches;
        }
        if (result.finalUpdate) {
            this.sendResult();
        }
    };
    InPageSearch.prototype.registerFoundCallback = function () {
        var _this = this;
        if (isWebView(this.searchTarget)) {
            this.searchTarget.addEventListener('found-in-page', function (event) {
                _this.onFoundInPage(event.result);
            });
        }
        else {
            // When target is WebContents
            this.searchTarget.on('found-in-page', function (_, result) {
                _this.onFoundInPage(result);
            });
        }
    };
    InPageSearch.prototype.setupSearchWindowWebview = function () {
        var _this = this;
        this.searcher.classList.add('search-inactive');
        this.searcher.classList.add('search-firstpaint');
        if (this.searcher.parentElement === null) {
            this.searcherParent.appendChild(this.searcher);
        }
        this.searcher.addEventListener('ipc-message', function (event) {
            switch (event.channel) {
                case 'electron-in-page-search:query': {
                    var text = event.args[0];
                    _this.onSearchQuery(text);
                    break;
                }
                case 'electron-in-page-search:close': {
                    _this.closeSearchWindow();
                    break;
                }
                case 'electron-in-page-search:back': {
                    var text = event.args[0];
                    if (_this.isSearching() && text === _this.prevQuery) {
                        _this.findNext(false);
                    }
                    else {
                        if (text) {
                            _this.onSearchQuery(text);
                        }
                    }
                    break;
                }
                case 'electron-in-page-search:forward': {
                    var text = event.args[0];
                    if (_this.isSearching() && text === _this.prevQuery) {
                        _this.findNext(true);
                    }
                    else {
                        if (text) {
                            _this.onSearchQuery(text);
                        }
                    }
                    break;
                }
                default:
                    break;
            }
        });
        if (ShouldDebug) {
            this.searcher.addEventListener('console-message', function (e) {
                log('Console message from search window:', "line:" + e.line + ": " + e.message, e.sourceId);
            });
        }
    };
    InPageSearch.prototype.focusOnInput = function () {
        var _this = this;
        log('Set focus on search window');
        // XXX:
        // Directly calling .focus() doesn't focus on <webview> here.
        // We need to delay the call in order to fix it.
        setImmediate(function () {
            _this.searcher.focus();
            _this.searcher.send('electron-in-page-search:focus');
            _this.emit('focus-input');
        });
    };
    // XXX:
    // Search API's behavior is different depending on a target.
    //
    // When the search target is BrowserWindow, focus to <webview> will be
    // cleared after calling .findInPage(). So we need to focus on <webview>
    // after that. Below method does it.
    //
    // When the search target is <webview>, focus to <webview> (for search window)
    // won't be cleared. So we need to focus on search window <webview> again after
    // calling .findInPage(). Futhermore, we should not focus on it because of
    // <webview> bug. calling .focus() on search window <webview> also gives a focus
    // to another <webview>. As the result, search window <webview> can't have a focus.
    //
    // https://github.com/electron/electron/issues/7939
    //
    // At opening search window webview, it needs to give a focus to the webview
    // anyway in order to set first focus to <input> in it.
    InPageSearch.prototype.focusOnInputOnBrowserWindow = function () {
        if (isWebView(this.searchTarget)) {
            return;
        }
        if (this.maxIdx !== 0 && this.activeIdx === this.maxIdx) {
            // XXX:
            // Add 100ms delay before putting focus when scrolling up for search wrap (#8).
            // When scrolling up, clearing webview focus is delayed and calling this.focusOnInput()
            // directly focuses on input before removing focus from <input>.
            setTimeout(this.focusOnInput.bind(this), 100);
            return;
        }
        this.focusOnInput();
    };
    InPageSearch.prototype.sendResult = function () {
        var nth = this.activeIdx;
        var all = this.maxIdx;
        log('Send result:', nth, all);
        this.searcher.send('electron-in-page-search:result', nth, all);
        this.emit('found', this.prevQuery, nth, all);
    };
    return InPageSearch;
}(events_1.EventEmitter));
exports.InPageSearch = InPageSearch;
function isWebView(target) {
    return target.tagName !== undefined && target.tagName === 'WEBVIEW';
}
function fixPathSlashes(p) {
    if (process.platform !== 'win32') {
        return p;
    }
    // Note:
    // On Windows, path separator is not '/' but browser seems to understand
    // '/' separator only. So we need to convert separator manually.
    //
    // e.g.
    //  C:\Users\foo\bar\piyo.html -> /C:/Users/foo/bar/piyo.html
    //
    // c.f.
    //  https://github.com/electron/electron/issues/1298
    var replaced = p.replace(/\\/g, '/');
    if (replaced[0] !== '/') {
        replaced = '/' + replaced;
    }
    return replaced;
}
function injectScriptToWebView(target, opts) {
    var injected_script = fixPathSlashes(path.join(__dirname, 'search-window.js'));
    var css = fixPathSlashes(opts.customCssPath || path.join(__dirname, 'default-style.css'));
    var script = "(function(){\n        const l = document.createElement('link');\n        l.rel = 'stylesheet';\n        l.href = '" + css + "';\n        document.head.appendChild(l);\n        const s = document.createElement('script');\n        s.src = 'file://" + injected_script + "';\n        document.body.appendChild(s);\n    })()";
    // XXX:
    // Before <webview> completes to load its web contents, .getWebContents()
    // (and some other APIs) have some 'statuses'.
    //
    // 1. .getWebContents property does not exist
    // 2. .getWebContents property exsit but .getWebContents() returns undefined
    //
    // So we need to check both 1. and 2. Note that <webview> instance doesn't
    // have the method to check whether it's dom-ready or not such as .isReady()
    // of app instance.
    if (target.getWebContents && target.getWebContents()) {
        target.executeJavaScript(script, false);
    }
    else {
        target.addEventListener('dom-ready', function () {
            target.executeJavaScript(script, false);
        });
    }
}
function searchInPage(searchTarget, options) {
    options = options || {};
    if (!options.searchWindowWebview) {
        options.searchWindowWebview = document.createElement('webview');
        options.searchWindowWebview.className = 'electron-in-page-search-window';
        options.searchWindowWebview.setAttribute('nodeintegration', '');
        options.searchWindowWebview.style.outline = '0';
    }
    var wv = options.searchWindowWebview;
    if (!wv.src) {
        wv.src = options.customSearchWindowHtmlPath || DefaultSearchWindowHtml;
    }
    injectScriptToWebView(wv, options);
    if (options.openDevToolsOfSearchWindow) {
        // XXX:
        // Please check the comment in injectScriptToWebView() function to know
        // why .getWebContents property is checked here.
        var wc = wv.getWebContents && wv.getWebContents();
        if (wc) {
            wc.openDevTools({ mode: 'detach' });
        }
        else {
            wv.addEventListener('dom-ready', function () {
                wv.getWebContents().openDevTools({ mode: 'detach' });
            });
        }
    }
    return new InPageSearch(options.searchWindowWebview, options.searchWindowParent || document.body, searchTarget, !!options.preloadSearchWindow);
}
exports["default"] = searchInPage;
