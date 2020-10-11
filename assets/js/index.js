$(function () {
    
    getUserInfo()
    var layer = layui.layer
    // 点击按钮实现退出功能
    $('#btnLogOut').on('click', function () {
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //1.清空本地存储中的token
            localStorage.removeItem('token')
            //2.重新跳转到登录页
            location.href = '/login.html'
            
            //关闭confirm询问框
            layer.close(index);
          });
    })



})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // 携带身份验证的请求头配置到了 baseAPI
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status != 0) return layui.layer.msg('获取用户信息失败!')
            //调用渲染头像的函数
            renderAvatar(res.data)
        }
        //不论请求成功还是失败  最终都会调用complete回调函数 挂载到全局
        // complete: function (res) {
        //     console.log(res);
        //     //在complete回调函数 可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
        //          //1.清空本地存储中的token
        //     localStorage.removeItem('token')
        //             //2.重新跳转到登录页
        //     location.href = '/login.html'
            
        //     }
                
        // }
       
    })
}
// 渲染头像和用户名
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //按需渲染用户头像
    if (user.user_pic != null) {
        //渲染图片头像
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
        
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide();
        let text = name[0].toUpperCase()
        
        $('.text-avatar').html(text).show()
    }
}