/**
 * Created by LiuSong on 2017/4/27.
 */

!function(win, lib) {
    var timeout,
        doc = win.document,
        docEl = doc.documentElement,
        metaViewport = doc.querySelector('meta[name="viewport"]'),
        metaFlexible = doc.querySelector('meta[name="flexible"]'),
        dpr = 0,
        scale = 0,
        flexible = lib.flexible || (lib.flexible = {});

    if (metaViewport) {
        console.warn("将根据已有的meta标签来设置缩放比例");
        var match = metaViewport.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else {
        if (metaFlexible) {
            var content = metaFlexible.getAttribute("content");
            if (content) {
                var initialDpr = content.match(/initial\-dpr=([\d\.]+)/),
                    maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
                if (initialDpr) {
                    dpr = parseFloat(initialDpr[1]);
                    scale = parseFloat((1 / dpr).toFixed(2));
                }
                if (maximumDpr) {
                    dpr = parseFloat(maximumDpr[1]);
                    scale = parseFloat((1 / dpr).toFixed(2));
                }
            }
        }
    }

    if (!dpr && !scale) {
        var ua = win.navigator.userAgent,
            isMobile =  !!ua.match(/android/gi) || !!ua.match(/iphone/gi),
            isIOS9 = isMobile && !! ua.match(/OS 9_3/),
            devicePixelRatio = win.devicePixelRatio;

        dpr = isMobile && !isIOS9 ? (devicePixelRatio >= 3 && (!dpr || dpr >= 3) ? 3 : (devicePixelRatio >= 2 && (!dpr || dpr >= 2) ? 2 : 1)) : 1;
        scale = 1 / dpr;
    }

    docEl.setAttribute("data-dpr", dpr);
    if (!metaViewport) {
        metaViewport = doc.createElement("meta");
        metaViewport.setAttribute("name", "viewport");
        metaViewport.setAttribute("content", "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no");
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaViewport)
        } else {
            var wrap = doc.createElement("div");
            wrap.appendChild(metaViewport);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        var remWidth = width / 10;
        docEl.style.fontSize = remWidth + "px";
        flexible.rem = win.rem = remWidth;
    }

    win.addEventListener("resize", function() {
        clearTimeout(timeout);
        timeout = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener("pageshow", function(e) {
        if (e.persisted) {
            clearTimeout(timeout);
            timeout = setTimeout(refreshRem, 300);
        }
    }, false);

    if ("complete" === doc.readyState) {
        doc.body.style.fontSize = 12 * dpr + "px";
    } else {
        doc.addEventListener("DOMContentLoaded", function() {
            doc.body.style.fontSize = 12 * dpr + "px";
        }, false)
    }

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if ("string" == typeof d && d.match(/rem$/)) {
            val += "px";
        }
        return val;
    };
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if ("string" == typeof d && d.match(/px$/)) {
            val += "rem";
        }
        return val;
    }

}(window, window.lib || (window.lib = {}));