//验证码
let verifyCode = new GVerify({
    id: "code",
    length: 6
});

$('li').click(function() {
    $(this).addClass('active').siblings().removeClass('active')
    let index = $(this).index();
    $('.in').eq(index).removeClass('move').siblings().addClass('move');
})


// 用户名验证
jQuery.validator.addMethod('testUse', function(value) {
    let reg = /^[a-z][0-9A-Za-z]{5,11}$/;
    if (reg.test(value)) {
        return true
    } else {
        return false
    }
}, '用户名错误');

// 密码验证
jQuery.validator.addMethod('testPass', function(value) {
    let reg = /^[^\s]{6,18}$/;
    if (reg.test(value)) {
        return true
    } else {
        return false
    }
}, '密码错误');

$('#content_right').validate({
    // 填写的 输入框验证的规则
    rules: {
        username: {
            required: true,
            testUse: true
        },
        password: {
            required: true,
            testPass: true
        }
    },
    // 当不满足规则的是 编写的提示信息
    messages: {
        username: {
            required: '用户名必填',
            testUse: '请输入以字母开头的6-12位的用户名'
        },
        password: {
            required: '密码必填',
            testPass: '请输入6-18位非空的密码'
        }

    },
    submitHandler: function() {
        // 当界面中所有的表单验证都成功的时候 就会执行这个 方法
        // 一般用跟后端进行数据交互 
        // 发送ajax请求
        $.ajax({
            url: '../php/register.php',
            method: 'post',
            data: {
                username: this.successList[0].value,
                password: this.successList[1].value
            },
            // dataType: 'json',
            success: function(res) {
                console.log(res);
                if (res == '用户名或密码错误') {
                    alert("用户名或密码错误");
                    location.href = './register.html';
                }
                if (res == '登录成功') {
                    setCookie('user', $('#username').val(), 7 * 24 * 60 * 60);
                    let url = localStorage.getItem('url');
                    if (url) {
                        location.href = url;
                        // 登录成功的时候把url的这个cookie值清除
                        localStorage.removeItem('url');
                    } else {
                        location.href = './index.html';
                    }

                }

            },
            error: function(err) {
                alert("请求超时")
                console.log(err);
            },
            // 请求的超时（当1000毫秒请求不到数据 就会执行error函数）
            timeout: 5000
        })


    }
});