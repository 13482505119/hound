/**
 * Muse mall module
 *
 */

require(["hound", "pullLoad", "plugins/echarts/echarts.min"], function(hound, pullLoad, echarts) {
    //document.ready
    $(function () {
        var request = $.extend({
                page: 1,
                pagesize: 12
            }, hound.getRequest()),
            jsonContent = $.parseJSON($("#jsonContent").text() || "{}");

        //IScroll
        var $wrapper = $("#wrapper");
        if ($wrapper.find("#scroller").length == 1) {
            var $pullList = $wrapper.find(".pullList"),
                url = $wrapper.data("url"),
                data = $.extend({}, request);

            var myIScroll = pullLoad("#wrapper", {
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
                        hound.alert(html);
                        iScroll.lockPullUp(true);
                    } else {
                        $target.append(html);
                        myIScroll.refresh();
                        setSWControl();
                        iScroll.lockPullUp(size < data.pagesize);
                    }
                },
                error: function () {
                    hound.alert(hound.messages.fail);
                },
                dataType: "html"
            });
        }

        //商品图片轮播
        var swGoods = {
                loop: true,
                pagination: '.swiper-pagination'
            },
            swControl = {
                slidesPerView: 'auto',
                resistanceRatio: .00000000000001,
                slideToClickedSlide: true
            };
        if ($(".swiper-wrapper", ".swiper-goods").children().length > 1) {
            new Swiper ('.swiper-goods', swGoods);
        }
        function setSWControl() {
            if ($(".swiper-control").length > 1) {
                new Swiper('.swiper-control', swControl);
            }
        }
        setSWControl();

        //商品数量
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
        });

        //接口配置
        var api = {
            notify: "/public/home/member/notify.html",
            orderDetail: "/public/home/order/detail.html?orderno=",
            data: {
                orderno: 0
            }
        };
        //提及订单并支付
        $(document).on("click", ".jBuy", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $this = $(this),
                url = $this.data("url"),
                data = {
                    spid: jsonContent.spid,
                    receiver_mobile: jsonContent.receiver_mobile,
                    quantity: $("#quantity").val(),
                    payment: jsonContent.payment,/*$('input:radio[name="payment"]:checked').val()*/
                    notes: $("#notes").val()
                };

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
        function weixinPay(data) {
            //调用微信JS api 支付
            function jsApiCall() {
                WeixinJSBridge.invoke('getBrandWCPayRequest', data, function(res){
                        //"get_brand_wcpay_request:ok"
                        //"get_brand_wcpay_request:cancel"
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

        var fontSize = parseInt(document.documentElement.getAttribute("data-dpr")) * 12;
        // 指定图表的配置项和数据
        if (document.getElementById('chart-commission')) {
            console.log(jsonContent);
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

        //消费券核销
        var $keyboard = $(".keyboard"),
            $keyLi = $(".cav-input > li"),
            keyVal = [];
        if ($keyboard.length == 1) {
            $keyboard.on('click', '[data-key]', function () {
                var key = $(this).data("key");
                switch (key) {
                    case "backspace":
                        keyVal.pop();
                        break;
                    case "submit":
                        if (keyVal.length == 9) {
                            hound.post("", {}, function () {

                            });
                        } else {
                            hound.alert("消费券码不正确");
                        }
                        break;
                    default :
                        if (keyVal.length < 9) {
                            keyVal.push(key);
                        }
                        break;
                }
                showKeys(keyVal);
            });
        }

        function showKeys() {
            var len = keyVal.length;
            $keyLi.each(function (i) {
                if (i >= len) {
                    $keyLi.eq(i).text("");
                } else {
                    $keyLi.eq(i).text(keyVal[i]);
                }
            });
        }
    });
});
