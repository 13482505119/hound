/**
 * Muse mall module
 *
 */

require(["hound", "pullLoad"], function(hound, pullLoad) {
    //document.ready
    $(function () {
        var request = $.extend({
                page: 1,
                pagesize: 12
            }, hound.getRequest()),
            header = {
                sID: "abc123",
                openid: "oijvYvvYh0F0kbjP_TCGO5frERLM",
                mobile: "",
                token: "",
                expiry: "",
                type: "json"
            };

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
                beforeSend: function(rq) {
                    $.each(header, function (key, val) {
                        rq.setRequestHeader(key, val);
                    });
                },
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

    });
});
