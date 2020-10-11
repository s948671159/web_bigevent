$(function () {
    // 点击'去注册'链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击'去登录'的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
//从layui获取form对象
    var form = layui.form
    var layer=layui.layer
    //通过form.verify()自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致
        repwd: function (value) {
            //通过形参拿到的是确认密码框的内容
            //拿到密码框中的内容之后进行一次等于的判断 
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })
    //  监听注册表单的提交事件    
    $("#form_reg").on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: $(this).serialize(),
            success:function (res) {
                if (res.status != 0) {
                    $('#form_reg [name=username]').focus().css('color','red')
                    return layer.msg(res.message)
                    
                }
                layer.msg('注册成功,请登录')
                //注册成功之后 模拟点击去登录按钮
                setTimeout(function () {
                    $('#link_login').click()
                },1000)
            }
        })
    })
    //监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    $('#form_login [name=username]').focus()
                    $('#form_login [name=password]').val('')
                    return layer.msg(res.message)
                }
                layer.msg('登录成功!')
                // 将登录成功得到的token字符串 保存到localstorage
                localStorage.setItem('token',res.token)
                // console.log(res.token);
                // 跳转到后台主页
                location.href='/index.html'
            }
            
        })
    })
})