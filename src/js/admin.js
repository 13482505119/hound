/**
 * Created by LiuSong on 2017/7/13.
 */

require.config({
    paths: {
        "jquery": "jquery-3.2.1.min",
        "bootstrap": "bootstrap.min",
        "metisMenu": "plugins/metismenu/metisMenu.min"
    },
    shim:{
        "bootstrap": {
            deps: ["jquery"],
            exports: "$"
        },
        "metisMenu": {
            deps: ["jquery"],
            exports: "$"
        }
    }
});

require(["hound", "bootstrap", "metisMenu"], function(hound) {
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
    var swiper = new Swiper('.swiper-container-upload', {
        pagination: '.swiper-pagination',
        paginationType: 'progress',
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 10,
        freeMode: true
    });

    //图片上传
    var $upfile = $("#upfile"),
        mode = 1,//1:缩略图;2:轮播图
        uploading = false;
    $(".upload-thumbnail").on("click", ".fa-plus", function () {
        mode = 1;
        $upfile.click();
    }).on("click", ".fa-remove", function () {
        $(this).parent().html('<i class="fa fa-plus fa-2x"></i>');
    });
    $(".swiper-container-upload").on("click", ".fa-plus", function () {
        mode = 2;
        $upfile.click();
    }).on("click", ".fa-remove", function () {
        swiper.removeSlide(swiper.clickedIndex);
    });
    $upfile.change(function () {
        if (!$(this).val()) {
            return;
        }

        if (mode == 2 && swiper.slides.length >= 31) {
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
        $upfile.upload5("upload.json", function (responseObj) {
            console.log(responseObj);
            if (responseObj.code == 200) {
                if (mode == 1) {
                    $(".upload-thumbnail").html('<img src="' + responseObj.data[0] + '"><i class="fa fa-remove"></i><input type="hidden" name="thumbnail" value="' + responseObj.data[0] + '">');
                } else {
                    $.each(responseObj.data, function (i, n) {
                        if (swiper.slides.length < 31) {
                            swiper.prependSlide('<div class="swiper-slide"><img src="' + n + '"><i class="fa fa-remove"></i><input type="hidden" name="swiper[]" value="' + n + '"></div>');
                        }
                    });
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

    //添加经销商
    $("#modalAdd").each(function () {
        var $this = $(this),
            $accountArea = $this.find(".accountArea"),
            index = $accountArea.children().length,
            account = $("#account").html();
        $this.on("click", ".btn-info", function () {
            index++;
            $accountArea.append($(account.replace(/##/g, index)));
        }).on("click", ".fa-remove", function () {
            $(this).closest(".panel").remove();
        });
    });
    $("#modalModify").each(function () {
        var $this = $(this),
            $accountArea = $this.find(".accountArea"),
            account = $("#account").html();
        $this.on("click", ".btn-info", function () {
            var index = $accountArea.children().length + 1;
            $accountArea.append($(account.replace(/##/g, index)));
        }).on("click", ".fa-remove", function () {
            $(this).closest(".panel").remove();
        });
    });

    //表格操作
    $('table[data-table]').each(function () {
        var $this = $(this),
            data = $this.data();

        $this.on("click", ".btn-default", function () {
            //查看
            var $this = $(this);
            hound.redirect(data.default + "?" + parseParam(data.param, $this));
        }).on("click", ".btn-primary", function () {
            //弹出编辑
            var $this = $(this);
            hound.post(data.primary, parseParam(data.param, $this), function (json) {
                var $modify = $('#modalModify'),
                    $accountArea = $modify.find(".accountArea").empty(),
                    account = $("#account").html();

                if ($modify.find('input[name="accountName"]').length == 1) {
                    $modify.find('input[name="accountName"]').val(json.data.accountName);
                    $modify.find('input[name="name"]').val(json.data.name);
                    $modify.find('input[name="password"]').val(json.data.password);
                    $modify.find('input[name="authority"][value="' + json.data.authority + '"]').prop("checked", true);
                    $modify.modal();
                    return;
                } else if ($modify.find('input[name="dealerName"]').length == 1) {
                    $modify.find('input[name="dealerName"]').val(json.data.dealerName);
                } else if ($modify.find('input[name="supplierName"]').length == 1) {
                    $modify.find('input[name="supplierName"]').val(json.data.supplierName);
                    $modify.find('input[name="workingStart"]').val(json.data.workingStart);
                    $modify.find('input[name="workingEnd"]').val(json.data.workingEnd);
                    $modify.find('input[name="restStart"]').val(json.data.restStart);
                    $modify.find('input[name="restEnd"]').val(json.data.restEnd);
                }
                $modify.find('input[name="address"]').val(json.data.address);
                $modify.find('input[name="linkman"]').val(json.data.linkman);
                $modify.find('input[name="mobile"]').val(json.data.mobile);

                $.each(json.data.accounts, function (i, n) {
                    var $account = $(account.replace(/##/g, i+1));
                    $account.find('input[name="accountName[]"]').val(n.name);
                    $account.find('input[name="accountPassword[]"]').val(n.password);
                    $account.find('input[name="accountMobile[]"]').val(n.mobile);
                    $accountArea.append($account);
                });

                $modify.modal();
            });
        }).on("click", ".btn-warning", function () {
            var $this = $(this);
            if ($this.hasClass("btn-sm")) {
                //批量关闭
                var $ids = $this.closest("table").find("tbody input:checkbox:checked");
                if ($ids.length == 0) {
                    hound.alert("请选择需要关闭的账号！", "");
                } else {
                    hound.hsa("确认要关闭已选择账号吗？", "", "info", function () {
                        var param = $.extend({"ids": []}, data.param);
                        $.each($ids.serializeArray(), function (i, n) {
                            param.ids.push(n.value);
                        });
                        hound.post(data.warning, param);
                    });
                }
            } else {
                //关闭
                hound.hsa("确认关闭吗？", "", "info", function () {
                    hound.post(data.primary, parseParam(data.param, $this));
                });
            }
        }).on("click", ".btn-success", function () {
            var $this = $(this);
            if ($this.hasClass("btn-sm")) {
                //批量启用
                var $ids = $this.closest("table").find("tbody input:checkbox:checked");
                if ($ids.length == 0) {
                    hound.alert("请选择需要启用的账号！", "");
                } else {
                    hound.hsa("确认要启用已选择账号吗？", "", "info", function () {
                        var param = $.extend({"ids": []}, data.param);
                        $.each($ids.serializeArray(), function (i, n) {
                            param.ids.push(n.value);
                        });
                        hound.post(data.success, param);
                    });
                }
            } else {
                //启用
                hound.hsa("确认启用吗？", "", "info", function () {
                    hound.post(data.success, parseParam(data.param, $this));
                });
            }
        }).on("click", ".btn-danger", function () {
            var $this = $(this);
            if ($this.hasClass("btn-sm")) {
                //批量删除
                var $ids = $this.closest("table").find("tbody input:checkbox:checked");
                if ($ids.length == 0) {
                    hound.alert("请选择需要删除的账号！", "");
                } else {
                    hound.hsa("确认要删除已选择账号吗？", "", "info", function () {
                        var param = $.extend({"ids": []}, data.param);
                        $.each($ids.serializeArray(), function (i, n) {
                            param.ids.push(n.value);
                        });
                        hound.post(data.danger, param);
                    });
                }
            } else {
                //关闭
                hound.hsa("确认删除吗？", "", "info", function () {
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

    //订单操作
    /*$(".alert-warning").on("click", ".btn", function () {

    })*/
});
