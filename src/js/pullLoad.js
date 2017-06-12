/**
 * pullLoad module
 *
 * Created by LiuSong on 2017/4/25.
 */

define("pullLoad", ["plugins/iscroll/iscroll-probe"], function (IScroll) {
    //新增锁定下拉方法
    IScroll.prototype.lockPullDown = function (lock) {
        var opts = this.options;
        if (opts.pullDownElement && opts.pullDownLock == !lock) {
            opts.pullDownLock = !!lock;
            if (opts.pullDownLock) {
                opts.pullDownElement.style.display = "none";
                this.y = 0;
                this.options.startY = 0;
                opts.maxScrollY = this.maxScrollY = this.maxScrollY + opts.pullDownOffset;
            } else {
                opts.pullDownElement.style.display = "block";
                this.y = -opts.pullDownOffset;
                this.options.startY = -opts.pullDownOffset;
                opts.maxScrollY = this.maxScrollY = this.maxScrollY - opts.pullDownOffset;
            }
            this.refresh();
            this.scrollTo(0, this.options.startY, 600);
        }
    };
    //新增锁定上拉方法
    IScroll.prototype.lockPullUp = function (lock) {
        var opts = this.options;
        if (opts.pullUpElement && opts.pullUpLock == !lock) {
            opts.pullUpLock = !!lock;
            if (opts.pullUpLock) {
                opts.pullUpElement.style.display = "none";
                opts.maxScrollY = this.maxScrollY = this.maxScrollY + opts.pullUpOffset;
            } else {
                opts.pullUpElement.style.display = "block";
                opts.maxScrollY = this.maxScrollY = this.maxScrollY - opts.pullUpOffset;
            }
            this.refresh();
        }
    };

    var defaults = {
        click: true,
        taps: true,
        mouseWheel: true,
        scrollbars: true,
        fadeScrollbars: true,
        probeType: 1,
        startY: 0, //-pullDownOffset
        //extend
        maxScrollY: 0,
        pullElement: null,
        pullContainer: null,
        pullDownSelector: '#pullDown',
        pullDownElement: null,
        pullDownOffset: 0,
        pullDownAction: false,
        pullDownLock: false,
        pullDownLabel: null,
        pullDownText: ['下拉刷新', '松开刷新', '刷新中…'],
        pullUpSelector: '#pullUp',
        pullUpElement: null,
        pullUpOffset: 0,
        pullUpAction: false,
        pullUpLock: false,
        pullUpLabel: null,
        pullUpText: ['上拉加载更多', '松开加载', '加载中…']
    };

    function extend(target, obj) {
        for ( var i in obj ) {
            target[i] = obj[i];
        }
        return target;
    }

    function trim(str) {
        return str.replace(/^\s|\s$/g, "")
    }

    function hasClass(el, className) {
        return (" " + ((el || {}).className || "").replace(/\s/g, " ") + " ").indexOf(" " + trim(className) + " ") >= 0
    }

    function addClass(el, className) {
        if (!hasClass(el, className)) {
            el.className = el.className ? el.className + ' ' + trim(className) : trim(className)
        }
    }

    function removeClass(el, className) {
        if (hasClass(el, className)) {
            el.className = trim((" " + el.className.replace(/\s+/g, "  ") + " ").replace(new RegExp(" " + trim(className) + " ", "gi"), "").replace(/\s+/g, " "))
        }
    }

    //获取隐藏元素宽高
    function getDomWidthOrHeight(widthOrHeight, el) {
        var clone = el.cloneNode(true);
        clone.style.display = "block";
        clone.style.position = "absolute";
        clone.style.top = "-10000px";
        el.parentNode.appendChild(clone);

        var width = clone.getBoundingClientRect().width;
        var height = clone.getBoundingClientRect().height;
        el.parentNode.removeChild(clone);
        return widthOrHeight == "width" ? width : height;
    }

    return function (el, options) {
        var _IScroll,
            isScrolling = false,
            isLoading = false;

        options = extend(defaults, options);
        options.pullElement = document.querySelector(el);

        if (options.pullElement === null) {
            console.error("Not found pull element!!");
            return null;
        }
        if (hasClass(options.pullElement, "IScroll")) {
            console.error("Element has been initialized!!");
            return null;
        }

        options.pullDownElement = options.pullDownElement || options.pullElement.querySelector(options.pullDownSelector);
        if (options.pullDownElement) {
            options.pullDownLabel = options.pullDownElement.querySelector('.pullDownLabel') || {};
            //options.pullDownOffset = options.pullDownElement.offsetHeight;
            options.pullDownOffset = getDomWidthOrHeight("height", options.pullDownElement);
            if (options.pullDownLock) {
                options.startY = 0;
                options.pullDownElement.style.display = "none";
            } else {
                options.startY = -options.pullDownOffset;
                options.pullDownElement.style.display = "block";
            }
            options.pullDownLabel.innerHTML = options.pullDownText[0];
        }
        options.pullUpElement = options.pullUpElement || options.pullElement.querySelector(options.pullUpSelector);
        if (options.pullUpElement) {
            options.pullUpLabel = options.pullUpElement.querySelector('.pullUpLabel') || {};
            //options.pullUpOffset = options.pullUpElement.offsetHeight;
            options.pullUpOffset = getDomWidthOrHeight("height", options.pullUpElement);
            options.pullUpElement.style.display = options.pullUpLock ? "none" : "block";
            options.pullUpLabel.innerHTML = options.pullUpText[0];
        }

        /*//如果内容高度小于容器高度，锁定上拉
        var scroller = options.pullElement.children[0];
        if (options.pullElement.offsetHeight > scroller.offsetHeight + options.startY) {
            options.pullUpLock = true;
            options.pullUpElement.style.display = "none";
            scroller.style.minHeight = (options.pullElement.offsetHeight + options.pullDownOffset) + "px";
        }*/
        //定义内部容器最小高度
        options.pullContainer = options.pullDownElement ? options.pullDownElement.nextElementSibling : options.pullElement.children[0].children[0];
        //options.pullContainer.style.minHeight = (options.pullElement.offsetHeight + 1) + "px";
        options.pullContainer.style.minHeight = Math.ceil(options.pullElement.getBoundingClientRect().height) + "px";

        //Build
        _IScroll = new IScroll(el, options);

        if (_IScroll) {
            addClass(options.pullElement, "IScroll");
        }

        if (_IScroll.options.pullUpLock) {
            _IScroll.options.maxScrollY = _IScroll.maxScrollY;
        } else {
            _IScroll.options.maxScrollY = _IScroll.maxScrollY = _IScroll.maxScrollY + _IScroll.options.pullUpOffset;
        }

        //Event: scrollStart
        _IScroll.on("scrollStart", function () {
            if (this.y == this.startY) {
                isScrolling = true;
            }
        });

        //Event: scroll
        _IScroll.on('scroll', function () {
            if (isLoading) {
                return;
            }
            var opts = this.options;
            if (opts.pullDownElement && !opts.pullDownLock) {
                //5 -> 0
                if (this.y >= 0 && !hasClass(opts.pullDownElement, "flip")) {
                    addClass(opts.pullDownElement, "flip");
                    opts.pullDownLabel.innerHTML = opts.pullDownText[1];
                } else if (this.y < 0 && hasClass(opts.pullDownElement, "flip")) {
                    removeClass(opts.pullDownElement, "flip");
                    opts.pullDownLabel.innerHTML = opts.pullDownText[0];
                }
            }
            if (opts.pullUpElement && !opts.pullUpLock) {
                if (this.y <= (opts.maxScrollY - opts.pullUpOffset) && !hasClass(opts.pullUpElement, "flip")) {
                    addClass(opts.pullUpElement, "flip");
                    opts.pullUpLabel.innerHTML = opts.pullUpText[1];
                    this.maxScrollY = this.maxScrollY - opts.pullUpOffset;
                } else if (this.y > (opts.maxScrollY - opts.pullUpOffset) && hasClass(opts.pullUpElement, "flip")) {
                    removeClass(opts.pullUpElement, "flip");
                    opts.pullUpLabel.innerHTML = opts.pullUpText[0];
                    this.maxScrollY = this.maxScrollY + opts.pullUpOffset;
                }
            }
            //console.log(_IScroll.maxScrollY);
        });

        //Event: scrollEnd
        _IScroll.on("scrollEnd", function () {
            if (isLoading) {
                return;
            }
            var opts = this.options;
            if (opts.pullDownElement && !opts.pullDownLock) {
                if (!hasClass(opts.pullDownElement, "flip") && this.y > opts.startY) {
                    //console.log('resume');
                    this.scrollTo(0, opts.startY, 800);
                } else if (hasClass(opts.pullDownElement, "flip")) {
                    removeClass(opts.pullDownElement, "flip");
                    addClass(opts.pullDownElement, "loading");
                    opts.pullDownLabel.innerHTML = opts.pullDownText[2];
                    // Execute custom function (ajax call?)
                    if (isScrolling) {
                        isLoading = true;
                        if (opts.pullDownAction) {
                            opts.pullDownAction();
                        } else {
                            this.refresh();
                        }
                    }
                }
            }
            if (opts.pullUpElement && !opts.pullUpLock) {
                if (hasClass(opts.pullUpElement, "flip")) {
                    removeClass(opts.pullUpElement, "flip");
                    addClass(opts.pullUpElement, "loading");
                    opts.pullUpLabel.innerHTML = opts.pullUpText[2];
                    // Execute custom function (ajax call?)
                    if (isScrolling) {
                        isLoading = true;
                        if (opts.pullUpAction) {
                            opts.pullUpAction();
                        } else {
                            this.refresh();
                        }
                    }
                }
            }

            isScrolling = false;
        });

        //Event: refresh
        _IScroll.on("refresh", function () {
            var opts = this.options;

            if (opts.pullUpLock) {
                opts.maxScrollY = this.maxScrollY;
            } else {
                opts.maxScrollY = this.maxScrollY = this.maxScrollY + opts.pullUpOffset;
            }

            if (opts.pullDownElement && hasClass(opts.pullDownElement, "loading")) {
                removeClass(opts.pullDownElement, "loading");
                opts.pullDownLabel.innerHTML = opts.pullDownText[0];
                this.scrollTo(0, opts.startY, 0);
            } else if (opts.pullUpElement && hasClass(opts.pullUpElement, "loading")) {
                removeClass(opts.pullUpElement, "loading");
                opts.pullUpLabel.innerHTML = opts.pullUpText[0];
                this.scrollTo(0, this.maxScrollY, 0);
            }

            //opts.pullContainer.style.minHeight = opts.pullElement.offsetHeight + "px";
            opts.pullContainer.style.minHeight = Math.ceil(opts.pullElement.getBoundingClientRect().height) + "px";

            isLoading = false;
        });


        return _IScroll;
    };
});