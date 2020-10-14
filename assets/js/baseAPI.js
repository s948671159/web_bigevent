//Ajax请求之前会默认调用这个方法
$.ajaxPrefilter(function (options) {
    options.url = ' http://ajax.frontend.itheima.net' + options.url
     // 统一为有权限的接口，设置 headers 请求头
    //indexof()检查字符串是否包含 要检索的字符串 如果没有则返回-1
  if (options.url.indexOf('/my/') !== -1)
  {
    options.headers = {   
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 全局统一挂载 complete 回调函数
  options.complete=function (res) {
    // console.log(res);
    //在complete回调函数 可以使用res.responseJSON拿到服务器响应回来的数据
    if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
         //1.清空本地存储中的token
    localStorage.removeItem('token')
            //2.重新跳转到登录页
    location.href = '/login.html'
    
    }
        
  }
   
})
 
