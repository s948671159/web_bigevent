//Ajax请求之前会默认调用这个方法
$.ajaxPrefilter(function (options) {
    options.url=' http://ajax.frontend.itheima.net'+options.url
})