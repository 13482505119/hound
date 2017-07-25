/**
 * Created by LiuSong on 2017/7/13.
 */

require.config({
    paths: {
        "jquery": "jquery-3.2.1.min",
        "bootstrap": "bootstrap.min",
        //"datetimepicker": "plugins/datetimepicker/bootstrap-datetimepicker.min",
        //"datetimepickerLanguage": "plugins/datetimepicker/bootstrap-datetimepicker.zh-CN",
        "metisMenu": "plugins/metismenu/metisMenu.min"
    },
    shim:{
        "bootstrap": {
            deps: ["jquery"],
            exports: "$"
        },
        /*"datetimepicker": {
            deps: ["jquery", "bootstrap"],
            exports: "$"
        },
        "datetimepickerLanguage": {
            deps: ["jquery", "datetimepicker"],
            exports: "$"
        },*/
        "metisMenu": {
            deps: ["jquery"],
            exports: "$"
        }
    }
});

require(["hound", "bootstrap"/*, "datetimepicker", "datetimepickerLanguage"*/, "metisMenu"], function(hound) {
    //MetsiMenu
    $('.metismenu').metisMenu();

    $("thead :checkbox, tfoot :checkbox").on("click", function () {
        $(this).closest("table").find(":checkbox").prop("checked", $(this).prop("checked"));
    });

    /*
     * multiple-files upload supported.
     * Default file-field will be "file{n} if they are not set."
     */
    $.fn.upload5 = function(url, onSuccess, onFailure, onProgress) {
        if (typeof FormData === 'undefined') {
            return;
        }
        var inputs = this,
            form = new FormData(),
            count = 0;
        inputs.each(function(index) {
            var el = this;
            if (el.files && el.files.length > 0) {
                if (el.files[0].size > 2 * 1024 * 1024) {
                    onFailure("图片大小超过2M");
                } else {
                    form.append(el.name || 'file' + index, el.files[0]);
                    count++;
                }
            }
        });
        if (count > 0) {
            var xhr = new XMLHttpRequest();
            xhr.open("post", url, true);
            if (typeof onProgress === "function") {
                xhr.upload.onprogress = onProgress;
            }
            xhr.onreadystatechange = function() {
                var me = this;
                if (me.readyState == 4) {
                    if (me.status >= 200 && me.status < 300) {
                        onSuccess($.parseJSON(me.responseText));
                    } else {
                        onFailure(me.responseText);
                    }
                }
            };
            xhr.send(form);

        }
    };

    //图片轮播
    /*var swiper = new Swiper('.swiper-container-upload', {
        pagination: '.swiper-pagination',
        paginationType: 'progress',
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 10,
        freeMode: true
    });*/

    //图片上传
    var $upfile = $("#upfile"),
        $swiper = $(".upload-swiper"),
        $swiperPlus = $swiper.find("li:last"),
        uploadUrl = $upfile.data("url"),
        mode = 1,//1:缩略图;2:轮播图
        uploading = false;
    $(".upload-thumbnail").on("click", ".fa-plus", function () {
        mode = 1;
        $upfile.click();
    }).on("click", ".fa-remove", function () {
        $(this).parent().html('<i class="fa fa-plus fa-2x"></i>');
    });
    /*$(".swiper-container-upload").on("click", ".fa-plus", function () {
        mode = 2;
        $upfile.click();
    }).on("click", ".fa-remove", function () {
        swiper.removeSlide(swiper.clickedIndex);
        if ($(swiper.slides[swiper.slides.length-1]).find(".fa-plus").length != 1) {
            swiper.appendSlide('<div class="swiper-slide"><i class="fa fa-plus fa-2x"></i></div>');
            swiper.slideTo(swiper.slides.length-1);
        }
    });*/
    if ($swiper.children().length >= 31) {
        $swiperPlus.hide();
    }
    $swiper.on("click", ".fa-plus", function() {
        mode = 2;
        $upfile.click();
    }).on("click", ".fa-remove", function() {
        $(this).closest("li").remove();
        if ($swiper.children().length < 31) {
            $swiperPlus.show();
        }
    });
    $upfile.change(function () {
        if (!$(this).val()) {
            return;
        }

        /*if (mode == 2 && swiper.slides.length >= 31) {
            hound.alert("轮播图最多只能上传30张图片", "");
            return;
        }*/
        if (mode == 2 && $swiper.children().length >= 31) {
            hound.alert("轮播图最多只能上传30张图片", "");
            return;
        }
        if (uploading) {
            hound.alert("已经有图片正在上传", "");
            return;
        } else {
            hound.loading();
            uploading = true;
        }
        $upfile.upload5(uploadUrl, function (responseObj) {
            //console.log(responseObj);
            if (responseObj.code == 200) {
                if (mode == 1) {
                    $(".upload-thumbnail").html('<img src="' + responseObj.data[0] + '"><i class="fa fa-remove"></i><input type="hidden" name="thumbnail" value="' + responseObj.data[0] + '">');
                } else {
                    /*$.each(responseObj.data, function (i, n) {
                        if (swiper.slides.length < 31) {
                            swiper.prependSlide('<div class="swiper-slide"><img src="' + n + '"><i class="fa fa-remove"></i><input type="hidden" name="swiper[]" value="' + n + '"></div>');
                            swiper.slideTo(swiper.slides.length-1);
                        }
                    });
                    if (swiper.slides.length >= 31) {
                        swiper.removeSlide(swiper.slides.length-1);
                        swiper.slideTo(swiper.slides.length-1);
                    }*/
                    $.each(responseObj.data, function (i, n) {
                        if ($swiper.children().length < 31) {
                            $swiperPlus.before('<li><img src="' + n + '"><i class="fa fa-remove"></i><input type="hidden" name="swiper[]" value="' + n + '"></li>');
                        }
                    });
                    if ($swiper.children().length >= 31) {
                        $swiperPlus.hide();
                    }
                }
                hound.success("上传完成", "", 2000);
            } else {
                hound.error(responseObj.msg, "");
            }
            uploading = false;
        }, function (errorMsg) {
            uploading = false;
            hound.error(errorMsg, "");
        });
    });

    //添加&编辑账号操作
    $("#modalModify, #modalAdd").each(function () {
        var $this = $(this),
            $accountArea = $this.find(".accountArea"),
            account = $("#account").html();
        $this.on("click", ".btn-info", function () {
            var index = $accountArea.children().length + 1;
            $accountArea.append($(account.replace(/##/g, index)));
        }).on("click", ".fa-remove", function () {
            $(this).closest(".panel").remove();
            $this.find(".panel").each(function (i) {
                $(this).find(".number").text(i + 1);
            });
        });
    });

    //表格操作
    $('table[data-table]').each(function () {
        var $this = $(this),
            data = $this.data();

        $this.on("click", "button.btn-default", function () {
            //查看
            var $this = $(this);
            hound.redirect(data.default + "?" + parseParam(data.param, $this));
        }).on("click", "button.btn-primary", function () {
            //弹出编辑
            var $this = $(this);
            hound.post(data.primary, parseParam(data.param, $this), function (json) {
                var $modify = $('#modalModify'),
                    $accountArea = $modify.find(".accountArea").empty(),
                    account = $("#account").html();

                if ($modify.find('input[name="accountName"]').length == 1) {//编辑管理账号
                    $modify.find('input[name="accountName"]').val(json.data.accountName);
                    $modify.find('input[name="name"]').val(json.data.name);
                    $modify.find('input[name="password"]').val(json.data.password);
                    $modify.find('input[name="authority"][value="' + json.data.authority + '"]').prop("checked", true);
                    $modify.modal();
                    return;
                } else if ($modify.find('input[name="dealerName"]').length == 1) {//编辑经销商
                    $modify.find('input[name="dealerName"]').val(json.data.dealerName);
                } else if ($modify.find('input[name="supplierName"]').length == 1) {//编辑供应商
                    $modify.find('input[name="supplierName"]').val(json.data.supplierName);
                    $modify.find('input[name="workingStart"]').val(json.data.workingStart);
                    $modify.find('input[name="workingEnd"]').val(json.data.workingEnd);
                    $modify.find('input[name="restStart"]').val(json.data.restStart);
                    $modify.find('input[name="restEnd"]').val(json.data.restEnd);
                }
                $modify.find('input[name="address"]').val(json.data.address);
                $modify.find('input[name="linkman"]').val(json.data.linkman);
                //$modify.find('input[name="mobile"]').val(json.data.mobile);

                $.each(json.data.accounts, function (i, n) {
                    var $account = $(account.replace(/##/g, i+1));
                    $account.find('input[name="accountName[]"]').val(n.name).prop("readonly", true);
                    $account.find('input[name="accountMember[]"]').val(n.member).prop("readonly", true);
                    $account.find('input[name="accountPassword[]"]').val(n.password);
                    $accountArea.append($account);
                });

                $modify.modal();
            });
        }).on("click", "button.btn-warning", function () {
            var $this = $(this),
                text = $this.text();
            if ($this.hasClass("btn-sm")) {
                //批量关闭
                var $ids = $this.closest("table").find("tbody input:checkbox:checked");
                if ($ids.length == 0) {
                    hound.alert("请选择需要" + text + "的行！", "");
                } else {
                    hound.hsa("确认要" + text + "吗？", "", "info", function () {
                        var param = $.extend({"ids": []}, data.param);
                        $.each($ids.serializeArray(), function (i, n) {
                            param.ids.push(n.value);
                        });
                        hound.post(data.warning, param);
                    });
                }
            } else {
                //关闭
                hound.hsa("确认" + text + "吗？", "", "info", function () {
                    hound.post(data.primary, parseParam(data.param, $this));
                });
            }
        }).on("click", "button.btn-success", function () {
            var $this = $(this),
                text = $this.text();
            if ($this.hasClass("btn-sm")) {
                //批量启用
                var $ids = $this.closest("table").find("tbody input:checkbox:checked");
                if ($ids.length == 0) {
                    hound.alert("请选择需要" + text + "的行！", "");
                } else {
                    hound.hsa("确认要" + text + "吗？", "", "info", function () {
                        var param = $.extend({"ids": []}, data.param);
                        $.each($ids.serializeArray(), function (i, n) {
                            param.ids.push(n.value);
                        });
                        hound.post(data.success, param);
                    });
                }
            } else {
                //启用
                hound.hsa("确认" + text + "吗？", "", "info", function () {
                    hound.post(data.success, parseParam(data.param, $this));
                });
            }
        }).on("click", "button.btn-danger", function () {
            var $this = $(this),
                text = $this.text();
            if ($this.hasClass("btn-sm")) {
                //批量删除
                var $ids = $this.closest("table").find("tbody input:checkbox:checked");
                if ($ids.length == 0) {
                    hound.alert("请选择需要" + text + "的行！", "");
                } else {
                    hound.hsa("确认要" + text + "吗？", "", "info", function () {
                        var param = $.extend({"ids": []}, data.param);
                        $.each($ids.serializeArray(), function (i, n) {
                            param.ids.push(n.value);
                        });
                        hound.post(data.danger, param);
                    });
                }
            } else {
                //关闭
                hound.hsa("确认" + text + "吗？", "", "info", function () {
                    hound.post(data.danger, parseParam(data.param, $this));
                });
            }
        });
    });

    function parseParam(param, $e) {
        return $.param($.extend({
            id: $e.closest("tr").data("id")
        }, param));
    }

    //自动完成
    $(".autocomplete").each(function () {
        var $this = $(this),
            $input = $this.find("input"),
            $ul = $this.find("ul"),
            url = $this.data("url"),
            xhr = {status: 200},
            $form = $this.closest("form"),
            $inputId = $form.find('input[name="' + $this.data("id") + '"]'),
            $inputAddress = $form.find('input[name="' + $this.data("address") + '"]');

        $input.on("keyup", function () {
            var data = {
                key: $input.val()
            };
            if (hound.isBlank(data.key)) {
                xhr.abort();
                $ul.empty().hide();
            } else {
                if (xhr.status == 200) {
                    xhr = hound.ajax("POST", url, data, function (json) {
                        $ul.empty().show();
                        if (json.data.length ==0) {
                            $ul.append('<li>无记录</li>');
                        }
                        $.each(json.data, function(i, n) {
                            $ul.append('<li data-id="' + n.id + '" data-address="' + n.address + '">' + n.name + '</li>');
                        });
                    });
                }
            }
        }).on("blur", function () {
            setTimeout(function () {
                $ul.hide();
            }, 300);
        });

        $ul.on("click", "li[data-id]", function () {
            var $li = $(this);
            $input.val($li.text());
            $inputId.val($li.data("id"));
            $inputAddress.val($li.data("address"));
            $ul.hide();
        });
    });

    //日期选择器
    /*$("#goodsExpires").datetimepicker({
        autoclose: true,
        startView: 2,
        minView: 2,
        todayBtn: true,
        todayHighlight: true,
        //viewSelect: "day",
        fontAwesome: true,
        format: 'yyyy-mm-dd'
    });*/
});
