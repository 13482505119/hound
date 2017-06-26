/**
 * Muse mall module
 *
 */

require(["hound", "pullLoad", "plugins/echarts/echarts.min"], function(hound, pullLoad, echarts) {
    //接口配置
    var api = {
            notify: "/public/home/member/notify.html",
            orderDetail: "/public/home/order/detail.html?orderno=",
            data: {
                orderno: 0
            }
        },
        request = $.extend({
            page: 1,
            pagesize: 12
        }, hound.getRequest()),
        jsonContent,
        myIScroll,
        swipers = [];

    //document.ready
    $(function () {
        jsonContent = $.parseJSON($("#jsonContent").text() || "{}");

        if ($("#wrapper").length == 1) {
            initPullLoad();
        }
        if ($(".swiper-slide", ".swiper-goods").length > 1) {
            initSwiperGoods();
        }
        if ($(".input-group-quantity").length == 1) {
            initQuantity();
        }

        setSwiperControl();
        initPay();
        initCharts();

        if ($(".keyboard").length == 1) {
            initKeyboard();
        }
        if ($(".record-date").length == 1) {
            initCalendar();
        }
    });

    //新增气泡操作
    /*$(document).on('click', '[data-click="toggle2"]', function (e) {
        e.preventDefault();

        var $this = $(this),
            $target = $this.children().eq($this.hasClass("toggled") ? 1 : 0),
            url = $this.data("url") || $target.data("url"),
            data = $.extend({}, $target.data("data"));

        $.hound.post(url, data, function () {
            $this.toggleClass("toggled");
        });
    });*/

    //init pullLoad
    function initPullLoad() {
        var $wrapper = $("#wrapper"),
            $pullList = $wrapper.find(".pullList:visible"),
            url = $wrapper.data("url"),
            data = $.extend({}, request);
        if ($pullList.length == 1) {
            myIScroll = pullLoad("#wrapper", {
                pullDownText: ["", "", ""],
                pullUpText: ["", "", ""],
                pullDownAction: function () {
                    data.page = 1;
                    getHtml(myIScroll, $pullList, url, data);
                },
                pullUpAction: function () {
                    data.page++;
                    getHtml(myIScroll, $pullList, url, data);
                }
            });
        }
    }
    function getHtml(iScroll, $target, url, data) {
        $.ajax({
            url: url,
            data: data,
            success: function (html) {
                if (data.page == 1) {
                    $target.empty();
                }
                var size = $(html).length;
                if (size == 0) {
                    //错误信息
                    //hound.alert(html);
                    $target.append('<div class="text-center">' + html + '</div>');
                    iScroll.lockPullUp(true);
                } else {
                    $target.append(html);
                    myIScroll.refresh();
                    setSwiperControl();
                    iScroll.lockPullUp(size < data.pagesize);
                }
            },
            error: function () {
                hound.alert(hound.messages.fail);
                myIScroll.refresh();
            },
            dataType: "html"
        });
    }

    //商品大图轮播
    function initSwiperGoods() {
        new Swiper ('.swiper-goods', {
            loop: true,
            pagination: '.swiper-pagination'
        });
    }

    //侧滑删除
    function setSwiperControl() {
        $(".swiper-control").each(function () {
            var $this = $(this);
            if (!$this.hasClass("swiper-container-horizontal")) {
                swipers.push(
                    new Swiper($this[0], {
                        slidesPerView: 'auto',
                        resistanceRatio: .00000000000001,
                        slideToClickedSlide: true,
                        onReachEnd: function (swiper) {
                            var index = $(swiper.container).index();
                            $.each(swipers, function (i, n) {
                                //console.log(i + ":" + n.isEnd);
                                if (i != index && n.isEnd) {
                                    n.slideTo(0);
                                }
                            });
                        }
                    })
                );
            }
        });
    }

    //商品数量加减
    function initQuantity() {
        $(".input-group-quantity").on("click", ".input-group-addon", function () {
            var $this = $(this),
                $quantity = $this.parent().find("input"),
                $total = $($quantity.data("total")),
                $count = $($quantity.data("count")),
                quantity = parseInt($quantity.val()),
                price = parseFloat($quantity.data("price")),
                min = $quantity.attr("min"),
                max = $quantity.attr("max"),
                total,
                dotIndex;

            if ($this.index() == 0) {
                quantity = quantity > min ? --quantity : min;
                $quantity.val(quantity);
            } else {
                quantity = quantity < max ? ++quantity : max;
                $quantity.val(quantity);
            }

            total = (price * quantity).toFixed(2).toString();
            dotIndex = total.indexOf(".");

            $count.html(quantity);
            $total.html('<span class="text-big">' + total.substr(0, dotIndex) + '.</span>' + total.substr(dotIndex + 1));
        }).on("keyup mouseup", "#quantity", function (e) {
            var $quantity = $(this),
                $total = $($quantity.data("total")),
                $count = $($quantity.data("count")),
                quantity = parseInt($quantity.val()),
                price = parseFloat($quantity.data("price")),
                min = $quantity.attr("min"),
                max = $quantity.attr("max"),
                total,
                dotIndex;

            //删除键判断
            if (e.keyCode == 8) {
                return;
            }

            if (isNaN(quantity) || quantity < min) {
                quantity = min;
            } else if (quantity > max) {
                quantity = max;
            }
            $quantity.val(quantity);

            total = (price * quantity).toFixed(2).toString();
            dotIndex = total.indexOf(".");

            $count.html(quantity);
            $total.html('<span class="text-big">' + total.substr(0, dotIndex) + '.</span>' + total.substr(dotIndex + 1));
        });
    }

    //支付
    function initPay() {
        $(document).on("click", ".jBuy", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $this = $(this),
                url = $this.data("url"),
                data = $.extend({}, jsonContent, {
                    quantity: $("#quantity").val(),
                    notes: $("#notes").val()
                });

            if ($this.data("notify")) {
                api.notify = $this.data("notify");
            }

            if (!hound.mobile.test(data.receiver_mobile)) {
                hound.alert("请选择一个有效的接收手机号码！");
                return;
            }

            hound.post(url, data, function (json) {
                if (json.data.orderno == "") {
                    hound.post(url, data, function (json) {
                        if (json.data.orderno == "") {
                            hound.alert("提交订单失败！");
                        } else {
                            api.data.orderno = json.data.orderno;
                            weixinPay($.parseJSON(json.data.jsApiParameters));
                        }
                    });
                } else {
                    api.data.orderno = json.data.orderno;
                    weixinPay($.parseJSON(json.data.jsApiParameters));
                }
            });
        });
        //继续支付
        $(document).on("click", ".jPay", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $this = $(this),
                url = $this.data("url"),//获得支付数据接口地址
                data = $.extend({}, $this.data("data"));

            hound.post(url, data, function (json) {
                api.data.orderno = json.data.orderno;
                weixinPay($.parseJSON(json.data.jsApiParameters));
            });
        });
    }
    function weixinPay(data) {
        //调用微信JS api 支付
        function jsApiCall() {
            WeixinJSBridge.invoke('getBrandWCPayRequest', data, function(res){
                    //"get_brand_wcpay_request:ok"
                    //"get_brand_wcpay_request:cancel"
                    //"get_brand_wcpay_request:fail"
                    if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        hound.redirect(api.orderDetail + api.data.orderno);
                    } else {
                        hound.post(api.notify, api.data);
                    }
                }
            );
        }
        function callpay() {
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                    document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                }
            } else {
                jsApiCall();
            }
        }
        callpay();
    }

    //经销商图表
    function initCharts() {
        var fontSize = parseInt(document.documentElement.getAttribute("data-dpr")) * 12;
        // 指定图表的配置项和数据
        if (document.getElementById('chart-commission')) {
            var chartCommission = echarts.init(document.getElementById('chart-commission'));
            var optionCommission = {
                title: {
                    show: false,
                    text: '历史收入'
                },
                legend: {
                    show: false,
                    data:['销量']
                },
                xAxis: {
                    axisLabel: {
                        textStyle: {
                            fontSize: fontSize
                        }
                    },
                    data: jsonContent.xAxis
                },
                yAxis: {
                    axisLabel: {
                        textStyle: {
                            fontSize: fontSize
                        }
                    }
                },
                series: [{
                    name: '收入',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    fontFamily: '"Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif',
                                    fontSize: fontSize
                                }
                            }
                        }
                    },
                    data: jsonContent.data
                }]
            };
            chartCommission.setOption(optionCommission);
        }
        if (document.getElementById('chart-order')) {
            var chartOrder = echarts.init(document.getElementById('chart-order'));
            var optionOrder = {
                title: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                legend: {
                    show: false
                },
                calculable: true,
                series: [
                    {
                        name: '订单统计',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        fontFamily: '"Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif',
                                        fontSize: fontSize
                                    },
                                    formatter: '{b}\n{c} ({d}%)'
                                },
                                labelLine: {
                                    show: true
                                }
                            }
                        },
                        data: jsonContent.order
                    }
                ]
            };
            chartOrder.setOption(optionOrder);
        }
        if (document.getElementById('chart-order-history')) {
            var chartOrderHistory = echarts.init(document.getElementById('chart-order-history'));
            var optionOrderHistory = {
                title: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                legend: {
                    show: false
                },
                calculable: true,
                series: [
                    {
                        name: '订单统计',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        fontFamily: '"Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif',
                                        fontSize: fontSize
                                    },
                                    formatter: '{b}\n{c} ({d}%)'
                                },
                                labelLine: {
                                    show: true
                                }
                            }
                        },
                        data: jsonContent.orderHistory
                    }
                ]
            };
            chartOrderHistory.setOption(optionOrderHistory);
        }
    }

    //供应商核销
    function initKeyboard() {
        var $keyboard = $(".keyboard"),
            $keyLi = $(".cav-input > li"),
            $input = $("#input"),
            $output = $("#output"),
            cavUrl = $input.data("url"),
            code = [],
            cavTimeout = 0,
            cavInterval = 0;

        $(".cav-input").click(function () {
            resetCav();
        });
        $keyboard.on('click', '[data-key]', function () {
            var key = $(this).data("key");
            switch (key) {
                case "backspace":
                    //keyVal.pop();
                    break;
                case "submit":
                    if (code.length == 9) {
                        hound.loadHTML($output, cavUrl, {code: code.join('')});
                        $input.hide();
                    } else {
                        hound.alert("消费券码不正确");
                    }
                    break;
                default :
                    if (code.length < 9) {
                        code.push(key);
                    }
                    break;
            }
            showKeys();
        });
        $keyboard.find('[data-key="backspace"]').on({
            touchstart: function (e) {
                $(this).addClass("active");
                code.pop();
                showKeys();
                cavTimeout = setTimeout(function () {
                    cavInterval = setInterval(function () {
                        code.pop();
                        showKeys();
                    }, 200);
                }, 1000);
                e.preventDefault();
            },
            touchmove: function () {
                resetTouch();
            },
            touchend: function () {
                $(this).removeClass("active");
                resetTouch();
                return false;
            }
        });
        $output.on("click", ".btn-attract-o", function () {
            resetCav();
        });
        $output.on("click", ".btn-attract", function () {
            hound.post($(this).data("url"), {code: code.join('')}, function () {
                resetCav();
            });
        });

        function showKeys() {
            var len = code.length;
            $keyLi.each(function (i) {
                if (i >= len) {
                    $keyLi.eq(i).text("");
                } else {
                    $keyLi.eq(i).text(code[i]);
                }
            });
        }
        function resetTouch() {
            clearTimeout(cavTimeout);
            cavTimeout = 0;
            if (cavInterval != 0) {
                clearInterval(cavInterval);
                cavInterval = 0;
            }
        }
        function resetCav() {
            $output.empty();
            $input.show();
            code = [];
            showKeys();
        }
    }

    function initCalendar() {
        var $date = $(".record-date"),
            $add = $date.find(".fa-chevron-left"),
            $sub = $date.find(".fa-chevron-right"),
            $input = $date.find(".form-control"),
            $text = $date.find("span"),
            $count = $(".record-text span"),
            date = new Date();

        var $wrapper = $("#wrapper"),
            $pullList = $wrapper.find(".pullList"),
            url = $wrapper.data("url"),
            urlCount = $wrapper.data("count"),
            data = $.extend({}, request);

        //setVal();
        $input.change(function () {
            date = new Date($(this).val());
            if (date > new Date()) {
                date = new Date();
            }
            setVal();
        });
        $add.click(function () {
            date.addDays(-1);
            setVal();
        });
        $sub.click(function () {
            date.addDays(1);
            if (date > new Date()) {
                date = new Date();
            }
            setVal();
        });

        function setVal() {
            var v = date.Format("yyyy-MM-dd");
            $input.val(v);
            if (v == (new Date()).Format("yyyy-MM-dd")) {
                $text.text('今天');
                $sub.css("visibility", "hidden");
            } else {
                $text.text(v);
                $sub.css("visibility", "visible");
            }

            data.date = v;
            data.page = 1;
            hound.post(urlCount, data, function (json) {
                $count.text(json.data);
            });
            getHtml(myIScroll, $pullList, url, data);
        }
    }
    //js格式化时间 "yyyy-MM-dd hh:mm:ss"
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    Date.prototype.addDays = function (d) {
        this.setDate(this.getDate() + d);
    };
    Date.prototype.addWeeks = function (w) {
        this.addDays(w * 7);
    };
    Date.prototype.addMonths = function (m) {
        var d = this.getDate();
        this.setMonth(this.getMonth() + m);
        if (this.getDate() < d)
            this.setDate(0);
    };
    Date.prototype.addYears = function (y) {
        var m = this.getMonth();
        this.setFullYear(this.getFullYear() + y);
        if (m < this.getMonth()) {
            this.setDate(0);
        }
    };
});
