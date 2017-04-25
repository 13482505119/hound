/**
 * pullLoad module
 *
 * Created by LiuSong on 2017/4/25.
 */

define(["plugins/iscroll/iscroll-probe"], function (IScroll) {
    //新增锁定下拉方法
    IScroll.prototype.lockPullDown = function (lock) {
        var opts = this.options;
        opts.pullDownLock = !!lock;
        if (opts.pullDownElement) {
            if (opts.pullDownLock) {
                opts.pullDownElement.style.display = "none";
                this.y = 0;
                this.options.startY = 0;
                this.maxScrollY += opts.pullDownOffset;
            } else {
                opts.pullDownElement.style.display = "block";
                this.y = -opts.pullDownOffset;
                this.options.startY = -opts.pullDownOffset;
                this.maxScrollY -= opts.pullDownOffset;
            }
            this.refresh();
            this.scrollTo(0, this.options.startY, 600);
        }
    };
    //新增锁定上啦方法
    IScroll.prototype.lockPullUp = function (lock) {
        var opts = this.options;
        opts.pullUpLock = !!lock;
        if (opts.pullUpElement) {
            if (opts.pullUpLock) {
                opts.pullUpElement.style.display = "none";
                this.maxScrollY += opts.pullUpOffset;
            } else {
                opts.pullUpElement.style.display = "block";
                this.maxScrollY -= opts.pullUpOffset;
            }
            this.refresh();
        }
    };

    var defaults = {
        mouseWheel: true,
        scrollbars: true,
        fadeScrollbars: true,
        probeType: 1,
        startY: 0, //-pullDownOffset
        //extend
        pullElement: null,
        pullDownSelector: '#pullDown',
        pullDownElement: null,
        pullDownOffset: 0,
        pullDownAction: false,
        pullDownLock: false,
        pullDownText: ['下拉刷新', '松开加载', '加载中…'],
        pullUpSelector: '#pullUp',
        pullUpElement: null,
        pullUpOffset: 0,
        pullUpAction: false,
        pullUpLock: false,
        pullUpText: ['上拉加载更多', '松开加载', '加载中…']
    };

    function extend(target, obj) {
        for ( var i in obj ) {
            target[i] = obj[i];
        }
        return target;
    }

    //获取隐藏元素宽高
    function getDomWidthOrHeight(widthOrHeight, el) {
        var clone = el.cloneNode(true);
        clone.style.display = "block";
        clone.style.position = "absolute";
        clone.style.top = "-10000px";
        el.parentNode.appendChild(clone);

        var width = clone.offsetWidth;
        var height = clone.offsetHeight;
        el.parentNode.removeChild(clone);
        return widthOrHeight == "width" ? width : height;
    }

    return function (el, options) {
        var options;
        var _IScroll,
            isScrolling = false,
            isLoading = false;

        options = extend(defaults, options);
        options.pullElement = document.querySelector(el);

        if (null === options.pullElement) {
            console.error("Pull element is null!!");
            return null;
        }

        options.pullDownElement = options.pullDownElement || options.pullElement.querySelector(options.pullDownSelector);
        if (options.pullDownElement) {
            //options.pullDownOffset = options.pullDownElement.offsetHeight;
            options.pullDownOffset = getDomWidthOrHeight("height", options.pullDownElement);
            if (options.pullDownLock) {
                options.startY = 0;
                options.pullDownElement.style.display = "none";
            } else {
                options.startY = -options.pullDownOffset;
                options.pullDownElement.style.display = "block";
            }
            options.pullDownElement.querySelector('.pullDownLabel').innerHTML = options.pullDownText[0];
        }
        options.pullUpElement = options.pullUpElement || options.pullElement.querySelector(options.pullUpSelector);
        if (options.pullUpElement) {
            //options.pullUpOffset = options.pullUpElement.offsetHeight;
            options.pullUpOffset = getDomWidthOrHeight("height", options.pullUpElement);
            options.pullUpElement.style.display = options.pullUpLock ? "none" : "block";
            options.pullUpElement.querySelector('.pullUpLabel').innerHTML = options.pullDownText[0];
        }

        _IScroll = new IScroll(el, options);

        if (options.pullUpLock) {
            _IScroll.maxScrollY = _IScroll.maxScrollY;
        } else {
            _IScroll.maxScrollY = _IScroll.maxScrollY + options.pullUpOffset;
        }

        //Event: scrollStart
        _IScroll.on("scrollStart", function () {
            if (this.y == this.startY) {
                isScrolling = true;
            }
        });

        //Event: scroll
        _IScroll.on('scroll', function () {
            var opts = this.options;
            if (opts.pullDownElement && !opts.pullDownLock) {
                if (this.y >= 5 && !opts.pullDownElement.className.match('flip')) {
                    opts.pullDownElement.className = 'flip';
                    opts.pullDownElement.querySelector('.pullDownLabel').innerHTML = opts.pullDownText[1];
                } else if (this.y < 5 && opts.pullDownElement.className.match('flip')) {
                    opts.pullDownElement.className = '';
                    opts.pullDownElement.querySelector('.pullDownLabel').innerHTML = opts.pullDownText[0];
                }
            }
            if (opts.pullUpElement && !opts.pullUpLock) {
                if (this.y <= (this.maxScrollY - opts.pullUpOffset) && !opts.pullUpElement.className.match('flip')) {
                    opts.pullUpElement.className = 'flip';
                    opts.pullUpElement.querySelector('.pullUpLabel').innerHTML = opts.pullUpText[1];
                    this.maxScrollY = this.maxScrollY - opts.pullUpOffset;
                } else if (this.y > (this.maxScrollY - opts.pullUpOffset) && opts.pullUpElement.className.match('flip')) {
                    opts.pullUpElement.className = '';
                    opts.pullUpElement.querySelector('.pullUpLabel').innerHTML = opts.pullUpText[0];
                    this.maxScrollY = this.maxScrollY + opts.pullUpOffset;
                }
            }
            //console.log('y:' + this.y);
        });

        //Event: scrollEnd
        _IScroll.on("scrollEnd", function () {
            if (isLoading) {
                return;
            }
            var opts = this.options;
            if (opts.pullDownElement && !opts.pullDownLock) {
                if (!opts.pullDownElement.className.match('flip') && this.y > this.options.startY) {
                    //console.log('resume');
                    this.scrollTo(0, this.options.startY, 800);
                } else if (opts.pullDownElement.className.match('flip')) {
                    opts.pullDownElement.className = 'loading';
                    opts.pullDownElement.querySelector('.pullDownLabel').innerHTML = opts.pullDownText[2];
                    // Execute custom function (ajax call?)
                    if (isScrolling && !opts.pullDownLock) {
                        isLoading = true;
                        if (opts.pullDownAction) {
                            opts.pullDownAction()
                        } else {
                            this.refresh();
                        }
                    }
                }
            }
            if (opts.pullUpElement && !opts.pullUpLock) {
                if (opts.pullUpElement.className.match('flip')) {
                    opts.pullUpElement.className = 'loading';
                    opts.pullUpElement.querySelector('.pullUpLabel').innerHTML = opts.pullUpText[2];
                    // Execute custom function (ajax call?)
                    if (isScrolling && !this.options.pullUpLock) {
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

            if (opts.pullDownElement && opts.pullDownElement.className.match('loading')) {
                opts.pullDownElement.className = '';
                opts.pullDownElement.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh';
                this.scrollTo(0, this.options.startY, 0);
            } else if (opts.pullUpElement && opts.pullUpElement.className.match('loading')) {
                opts.pullUpElement.className = '';
                opts.pullUpElement.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more';
                this.scrollTo(0, this.maxScrollY, 0);
            }

            isLoading = false;
        });


        return _IScroll;
    };
});