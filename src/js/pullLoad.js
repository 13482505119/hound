/**
 * Created by LiuSong on 2017/4/25.
 */

define("pullLoad", ["plugins/iscroll/iscroll-probe"], function (IScroll) {
    //新增锁定下拉方法
    IScroll.prototype.lockPullDown = function (lock) {
        var opts = this.options;
        opts.pullDownLock = !!lock;
        if (opts.pullDownEl) {
            if (opts.pullDownLock) {
                opts.pullDownEl.style.display = "none";
                this.y = 0;
                this.options.startY = 0;
                this.maxScrollY += opts.pullDownOffset;
            } else {
                opts.pullDownEl.style.display = "block";
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
        if (opts.pullUpEl) {
            if (opts.pullUpLock) {
                opts.pullUpEl.style.display = "none";
                this.maxScrollY += opts.pullUpOffset;
            } else {
                opts.pullUpEl.style.display = "block";
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
        pullEl: null,
        pullDownEl: '#pullDown',
        pullDownOffset: 0,
        pullDownAction: false,
        pullDownLock: false,
        pullDownText: ['下拉刷新', '松开加载', '加载中…'],
        pullUpEl: '#pullUp',
        pullUpOffset: 0,
        pullUpAction: false,
        pullUpLock: false,
        pullUpText: ['上拉加载更多', '松开加载', '加载中…']
    };

    var pullLoad = function (el, options) {
        var _IScroll,
            isScrolling = false,
            isLoading = false;

        options = extend(defaults, options);
        options.pullEl = document.querySelector(el);

        if (null === options.pullEl) {
            console.error("Pull element is null!!");
            return null;
        }

        options.pullDownEl = options.pullEl.querySelector(options.pullDownEl);
        if (options.pullDownEl) {
            //options.pullDownOffset = options.pullDownEl.offsetHeight;
            options.pullDownOffset = getDomWidthOrHeight("height", options.pullDownEl);
            if (options.pullDownLock) {
                options.startY = 0;
                options.pullDownEl.style.display = "none";
            } else {
                options.startY = -options.pullDownOffset;
                options.pullDownEl.style.display = "block";
            }
            options.pullDownEl.querySelector('.pullDownLabel').innerHTML = options.pullDownText[0];
        }
        options.pullUpEl = options.pullEl.querySelector(options.pullUpEl);
        if (options.pullUpEl) {
            //options.pullUpOffset = options.pullUpEl.offsetHeight;
            options.pullUpOffset = getDomWidthOrHeight("height", options.pullUpEl);
            options.pullUpEl.style.display = options.pullUpLock ? "none" : "block";
            options.pullUpEl.querySelector('.pullUpLabel').innerHTML = options.pullDownText[0];
        }

        //console.log('pullDownOffset:' + options.pullDownOffset);
        //console.log('pullUpOffset:' + options.pullUpOffset);

        _IScroll = new IScroll(el, options);

        //console.log('maxScrollY-1:' + _IScroll.maxScrollY);
        if (options.pullUpLock) {
            _IScroll.maxScrollY = _IScroll.maxScrollY;
        } else {
            _IScroll.maxScrollY = _IScroll.maxScrollY + options.pullUpOffset;
        }
        //console.log('maxScrollY-2:' + _IScroll.maxScrollY);

        //Event: scrollStart
        _IScroll.on("scrollStart", function() {
            if (this.y == this.startY) {
                isScrolling = true;
            }
            //console.log('start-y:' + this.y);
        });

        //Event: scroll
        _IScroll.on('scroll', function() {
            var opts = this.options;
            if (opts.pullDownEl && !opts.pullDownLock) {
                if (this.y >= 5 && !opts.pullDownEl.className.match('flip')) {
                    opts.pullDownEl.className = 'flip';
                    opts.pullDownEl.querySelector('.pullDownLabel').innerHTML = opts.pullDownText[1];
                    //this.minScrollY = 0;
                } else if (this.y < 5 && opts.pullDownEl.className.match('flip')) {
                    opts.pullDownEl.className = '';
                    opts.pullDownEl.querySelector('.pullDownLabel').innerHTML = opts.pullDownText[0];
                    //this.minScrollY = -pullDownOffset;
                }
            }
            if (opts.pullUpEl && !opts.pullUpLock) {
                if (this.y <= (this.maxScrollY - opts.pullUpOffset) && !opts.pullUpEl.className.match('flip')) {
                    opts.pullUpEl.className = 'flip';
                    opts.pullUpEl.querySelector('.pullUpLabel').innerHTML = opts.pullUpText[1];
                    //this.maxScrollY = this.maxScrollY;
                    this.maxScrollY = this.maxScrollY - opts.pullUpOffset;
                } else if (this.y > (this.maxScrollY - opts.pullUpOffset) && opts.pullUpEl.className.match('flip')) {
                    opts.pullUpEl.className = '';
                    opts.pullUpEl.querySelector('.pullUpLabel').innerHTML = opts.pullUpText[0];
                    //this.maxScrollY = pullUpOffset;
                    this.maxScrollY = this.maxScrollY + opts.pullUpOffset;
                }
            }
            //console.log('y:' + this.y);
        });

        //Event: scrollEnd
        _IScroll.on("scrollEnd", function() {
            if (isLoading) {
                return;
            }
            var opts = this.options;
            //console.log('scroll end');
            //console.log('directionY:' + this.directionY);
            //console.log('y1:' + this.y);
            //console.log('maxScrollY-3:' + this.maxScrollY);
            if (opts.pullDownEl && !opts.pullDownLock) {
                if (!opts.pullDownEl.className.match('flip') && this.y > this.options.startY) {
                    //console.log('resume');
                    this.scrollTo(0, this.options.startY, 800);
                } else if (opts.pullDownEl.className.match('flip')) {
                    opts.pullDownEl.className = 'loading';
                    opts.pullDownEl.querySelector('.pullDownLabel').innerHTML = opts.pullDownText[2];
                    // Execute custom function (ajax call?)
                    if (isScrolling && !opts.pullDownLock) {
                        isLoading = true;
                        //console.log('before pull down action:' + this.y);
                        //pullDownAction();
                        //console.log('after pull down action:' + this.y);
                        if (opts.pullDownAction) {
                            opts.pullDownAction()
                        } else {
                            this.refresh();
                        }
                    }
                }
            }
            if (opts.pullUpEl && !opts.pullUpLock) {
                if (opts.pullUpEl.className.match('flip')) {
                    //console.log('pull up loading');
                    opts.pullUpEl.className = 'loading';
                    opts.pullUpEl.querySelector('.pullUpLabel').innerHTML = opts.pullUpText[2];
                    // Execute custom function (ajax call?)
                    if (isScrolling && !this.options.pullUpLock) {
                        isLoading = true;
                        //console.log('before pull up action:' + this.y);
                        //pullUpAction();
                        //console.log('after pull up action:' + this.y);
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
        _IScroll.on("refresh", function() {
            var opts = this.options;
            //console.log('maxScrollY-4:' + this.maxScrollY);
            //this.maxScrollY = this.maxScrollY + opts.pullUpOffset;
            //console.log('maxScrollY-5:' + this.maxScrollY);

            if (opts.pullDownEl && opts.pullDownEl.className.match('loading')) {
                opts.pullDownEl.className = '';
                opts.pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh';
                this.scrollTo(0, this.options.startY, 0);
            } else if (opts.pullUpEl && opts.pullUpEl.className.match('loading')) {
                opts.pullUpEl.className = '';
                opts.pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more';
                this.scrollTo(0, this.maxScrollY, 0);
            }

            isLoading = false;
            //console.log('refresh finished!');
        });


        return _IScroll;
    };

    function extend(target, obj) {
        for ( var i in obj ) {
            target[i] = obj[i];
        }
        return target;
    }

    //获取隐藏元素宽高
    function getDomWidthOrHeight(widthOrHeight, el) {
        //console.log(widthOrHeight+"="+obj);
        var clone = el.cloneNode(true);
        clone.style.display = "block";
        clone.style.position = "absolute";
        clone.style.top = "-10000px";
        el.parentNode.appendChild(clone);

        var width = clone.offsetWidth;
        var height = clone.offsetHeight;
        //console.log(width+"--"+height);
        el.parentNode.removeChild(clone);
        return widthOrHeight == "width" ? width : height;
    }

    //test begin
    var myPullLoad = new pullLoad('#wrapper', {
        //pullUpLock: true,
        pullDownAction: function () {
            setTimeout(function () {
                myPullLoad.refresh();
            }, 30000)
        },
        pullUpAction: function () {
            setTimeout(function () {
                myPullLoad.refresh();
            }, 30000)
        }
    });
    console.log(myPullLoad);
    console.log("maxScrollY=" + myPullLoad.maxScrollY + ", y=" + myPullLoad.y + ", startY=" + myPullLoad.options.startY);
    myPullLoad.lockPullUp(true);
    console.log("maxScrollY=" + myPullLoad.maxScrollY + ", y=" + myPullLoad.y + ", startY=" + myPullLoad.options.startY);
    //test end

    return pullLoad;
});