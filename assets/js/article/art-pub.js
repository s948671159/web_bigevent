$(function () {
    var layer = layui.layer
    var form = layui.form
    //请求数据渲染分类下拉菜单
    getCateList()

    function getCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) return layer.msg('获取文章分类数据失败!')
                var htmlStr = template('select_list', res)
                $('#select_cate').html(htmlStr)
                // 通知layui重新渲染下拉菜单UI结构
                form.render();
            }
        })
    }
    //调用富文本编辑器方法
    initEditor()



    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //4.为选择封面添加点击事件
    $('.select_cover').on('click', function () {
        $('#cover-file').click()
    })
    //5.监听隐藏的文件选择框的change事件  获取用户选择的文件列表
    $('#cover-file').on('change', function (e) {
        if (e.target.files.length <= 0) return layer.msg('请选择图片文件!')
        // 拿到用户选择的文件
        var file = e.target.files[0]
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })
    //定义文章的发布状态 当两个按钮点击时重新赋值
    var art_state = "已发布"
    //为存为草稿按钮 绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    //为表单添加submit事件
    $('#pub').on('submit', function (e) {
        e.preventDefault()
        //创建一个formdata对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到fd中
        fd.append('state', art_state)
        //将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象 存储到fd中
                fd.append('cover_img', blob)
                //发起请求
                publishArticle(fd)
            })
    })
    //定义发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            type: "post",
            url: '/my/article/add',
            data: fd,
            //如果向服务器提交Formdata格式的数据 必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status != 0) return layer.msg('发表文章失败!')
                layer.msg('发表文章成功!')
                // 发布成功之后 跳转到文章列表页面
                location.href='/article/art_list.html'
            }
            
        })
    }
})