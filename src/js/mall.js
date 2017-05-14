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
        
        var myChart = echarts.init(document.getElementById('chart'));
        var fontSize = parseInt(document.documentElement.getAttribute("data-dpr")) * 12;

        // 指定图表的配置项和数据
        var option = {
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
                data: ["一月","二月","三月","四月","五月","六月"]
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
                data: [899, 1500, 3856, 4822, 3000, 5500]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    });
});
