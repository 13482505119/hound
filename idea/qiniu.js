//require Qiniu
function getUploader(browse_button, container, options) {
    var initFunctions = {
        'FilesAdded': function(up, files) {
            $('table').show();
            $('#success').hide();
            plupload.each(files, function(file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setStatus("�ȴ�...");
            });
        },
        'BeforeUpload': function(up, file) {
            var progress = new FileProgress(file, 'fsUploadProgress');
            var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
            if (up.runtime === 'html5' && chunk_size) {
                progress.setChunkProgess(chunk_size);
            }
        },
        'UploadProgress': function(up, file) {
            var progress = new FileProgress(file, 'fsUploadProgress');
            var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
            progress.setProgress(file.percent + "%", file.speed, chunk_size);
        },
        'UploadComplete': function() {
            $('#success').show();
        },
        'FileUploaded': function(up, file, info) {
            var progress = new FileProgress(file, 'fsUploadProgress');
            progress.setComplete(up, info);
        },
        'Error': function(up, err, errTip) {
            $('table').show();
            var progress = new FileProgress(err.file, 'fsUploadProgress');
            progress.setError();
            progress.setStatus(errTip);
        }
    };

    if (!$.isPlainObject(options)) {
        options = {};
    }

    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: browse_button,
        container: container,
        drop_element: container,
        max_file_size: '100mb',
        flash_swf_url: 'js/plupload/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        uptoken:'um6IEH7mtwnwkGpjImD08JdxlvViuELhI4mFfoeL:79ApUIePTtKIdVGDHJ9D9BfBnhE=:eyJzY29wZSI6ImphdmFkZW1vIiwiZGVhZGxpbmUiOjE0NTk4ODMyMzV9Cg==',
        // uptoken_url: $('#uptoken_url').val(),  //��Ȼ��������ͨ��url�ķ�ʽ��ȡtoken
        domain: $('#domain').val(),
        auto_start: false,
        init: $.extend({}, initFunctions, options)
    });

    return uploader;
}

var up1 = getUploader('browse_button', 'container');
var up2 = getUploader('browse_button2', 'container2', {
    FileUploaded: function() {
        var progress = new FileProgress(file, 'fsUploadProgress');
        progress.setComplete(up, info);
    }
});
