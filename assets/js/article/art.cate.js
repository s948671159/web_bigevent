$(function () {
    //获取文章分类列表
    // 调用 
    var layer = layui.layer
    var form=layui.form
    initArticleList()
    function initArticleList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tb_tpl', res)
                $('#tb').html(htmlStr)
            }
            
        })
    }
    // 为添加类别绑定点击事件 弹出层
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd=  layer.open({

            type: 1,
            area:['500px','300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //为添加类别绑定提交事件 动态创建的内容需要代理之后才能添加事件
    $('body').on('submit', '#form_dialog_add',function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败!')
                }
                layer.msg('添加分类成功!')
                initArticleList()
                // 新增成功后 根据返回值索引关闭弹出层 
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null;
    // 通过代理的方式为编辑按钮添加点击事件 弹出修改框
    $('tbody').on('click','#editCate',function () {
        indexEdit=  layer.open({
            type: 1,
            area:['500px','300px'],
            title: '修改文章分类',
            content: $('#editCateHtml').html()
        })

        var id = $(this).attr('data-id')
    //    发起请求 获取对应的数据渲染到弹出框内
        $.ajax({
            type: 'get',
            url: '/my/article/cates/'+id,
            
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                // layer.msg('获取文章分类数据成功！')
                console.log(res);
                form.val('form-edit',res.data)
            }
        })
    })
    //通过代理的形式为修改分类的表单绑定submit事件
$('body').on('submit','#form_dialog_Edit',function (e) {
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success:function (res) {
            if (res.status != 0) {
                return layer.msg('修改分类失败!')
            }
            layer.msg('更新分类成功!')
            layer.close(indexEdit)
            initArticleList()
            // 新增成功后 根据返回值索引关闭弹出层 
            
        }
    })
})
    //通过代理的形式为删除按钮添加点击事件
  
    $('tbody').on('click', '#btnDelCate', function () {
        let id = $(this).attr('data-id')
        //删除确认提示框
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index);
                    initArticleList()
                }
                
            })
            
           
        });
        
    })
    
    
})