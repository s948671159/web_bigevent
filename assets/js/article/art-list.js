$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
  
    // 时间补零函数
    function addZero(n) {
       return n>9 ? n : '0'+n
    }
    //定义一个模板时间美化过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = addZero(dt.getMonth()+1)
        var d = addZero(dt.getDate())
        var hh =addZero(dt.getHours()) 
        var mm = addZero(dt.getMinutes())
        var ss = addZero(dt.getSeconds())
        return y+'-'+m+'-'+d+'-'+hh+':'+mm+':'+ss
    }


    // 定义一个全局的请求参数对象
    var q = {
        pagenum:1,//页码值 默认请求第一页的数据
        pagesize: 2, //每页显示几条数据 默认每页显示2条
        cate_id: '',//文章分类的Id
        state:''    //文章的发布状态
    }
    initArticleList() 
    initCate()
    //请求文章数据渲染到tbody
    function initArticleList() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data:q,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败!')
                }
                //使用模板引擎渲染页面的数据
                // console.log(res);
                var htmlStr = template('tbList-tpl', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
   
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {     
                if (res.status != 0) {
                    return layer.msg('获取文章分类列表失败!')
                }
                var htmlStr = template('artCate-tpl', res)
                $('#cateList').html(htmlStr) 
                // 通知layui重新渲染下拉菜单UI结构
                form.render();
            }
            
        })
    }
     
    //为筛选表单绑定submit事件  这个地方不太懂
    $('#layui-form').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        console.log(cate_id);
        var state=$('[name=state]').val()
        console.log(state);
        //为查询参数q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件重新渲染表格 
        initArticleList() 
    })
  
    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage渲染分页
        laypage.render({
            elem: 'pageBox' //分页容器的 ID，不用加 # 号
            , count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//自定义排版
            limits:[2,3,5,10],//自定义limit下拉选择框每页显示的数据
            //1.分页发生切换的时候 触发jump回调函数    
            //2.只要调用了laypage.render()方法就会触发 jump回调    
            jump: function (obj,first) {
            //可以通过first的值 判断是通过哪种方式触发的Jump回调
                //如果first的值是true 证明是方式2触发的 要禁用掉
                //否则就是1方式触发的  所以条件为 !first
                q.pagenum = obj.curr// 把最新的页码值赋值到q这个查询参数对象
                //这里如果直接调用重新渲染列表会发生死循环
                if (!first) {
                    initArticleList() 
               }
            }
          })
    }

    //定义删除文章的方法 通过代理的方式为删除按钮添加方法
    $('tbody').on('click', '#btnDelList', function () {
        var id = $(this).attr('data-id').val()
        //当点击事件发生的时候获取当前页面删除按钮的数量 
        var len=$('#btnDelList').length
        //弹出询问框

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
         $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: (res) => {
                    if (res.status != 0) {
                        return layer.msg('删除失败！')
                    }   
                    layer.msg('删除成功！')
                    layer.close(index)
                    //当数据删除完成之后 需要判断当前这一页是否还有剩余数据  如果没有剩余数据 则页码值-1 之后再调用方法重新渲染数据
                    if (len == 1) {
                        // 如果len等于1 说明删除完毕之后 该页面上面就没有任何数据
                        // 页码值最小必须是1 
                     q.pagenum=q.pagenum >1? q.pagenum-1 : q.pagenum
                    }
                    initArticleList() 
                }
            })
         });
  
  

    })
})