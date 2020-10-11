$(function () {
    var form = layui.form
    var layer=layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return "新旧密码不能相同"
            }
        },
        rePwd: function (value) {
            let newPwd = $('[name=newPwd]').val()
            if (newPwd != value) {
            return '两次新密码不一致!'
            }
        }
        
    })


 //向服务器提交新密码
    $('#reset_pwd').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success:function (res) {
                if (res.status != 0) {
                    // console.log(res.message);
                    return layer.msg('更新密码失败！')
                    
                }
                // console.log(res.message);
                layer.msg('更新密码成功！')

            }
               
            
        })
    })
})