/**
 * Muse mall module
 *
 */

require(["hound", "pullLoad"], function(hound, pullLoad) {
    //document.ready
    $(function () {
        //IScroll
        if ($("#wrapper").length == 1) {
            var myIScroll = pullLoad("#wrapper", {
                pullDownAction: function () {
                    setTimeout(function () {
                        //todo refresh page

                        myIScroll.refresh();
                    }, 3000);
                },
                pullUpAction: function () {
                    setTimeout(function () {
                        //todo load next page

                        myIScroll.refresh();
                    }, 3000);
                }
            });
        }

        //商品图片轮播
        if ($(".swiper-wrapper", ".swiper-goods").children().length > 1) {
            new Swiper ('.swiper-goods', {
                loop: true,
                pagination: '.swiper-pagination'
            });
        }

        //收藏及取消收藏
        $(".btn-favorite").click(function () {

        });

        //radio
        $(".fa-circle-o").click(function () {
            checkRadio();
        });
        checkRadio();
        function checkRadio() {
            $(".fa-circle-o").each(function () {
                var $this = $(this);
                if ($this.find(":radio").prop("checked")) {
                    $this.addClass("checked");
                } else {
                    $this.removeClass("checked");
                }
            });

        }

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
                dotIndex = -1;

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
