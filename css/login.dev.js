"use strict";

var agree = document.querySelector("#agree"); //验证码

var verifyCode = new GVerify({
  id: "picyzm",
  length: 6
});
$('#btnLogin').click(function (i) {
  console.log(1);
}); // 给validate自定验证规则
//  jQuery.validator.addMethod(规则名字,函数,'验证错误的提示信息')
//验证码验证

jQuery.validator.addMethod('testCode', function (value) {
  var res = verifyCode.validate(value);

  if (res) {
    return true;
  } else {
    return false;
  }
}, '验证码错误'); //用户名验证

jQuery.validator.addMethod('testUse', function (value) {
  var reg = /^[a-z][0-9A-Za-z]{5,11}$/;

  if (reg.test(value)) {
    return true;
  } else {
    return false;
  }
}, '用户名错误'); // 密码验证

jQuery.validator.addMethod('testPass', function (value) {
  var reg = /^[^\s]{6,18}$/;

  if (reg.test(value)) {
    return true;
  } else {
    return false;
  }
}, '密码错误');
$('#content_right').validate({
  // 填写的 输入框验证的规则
  rules: {
    code_input: {
      // required: true,
      testCode: true
    },
    username: {
      required: true,
      testUse: true
    },
    password: {
      required: true,
      testPass: true
    },
    pass: {
      equalTo: "#password"
    }
  },
  // 当不满足规则的是 编写的提示信息
  messages: {
    code_input: {
      // required: '验证码必填',
      testCode: '请输入正确的图片验证码'
    },
    username: {
      required: '用户名必填',
      testUse: '请输入以字母开头的6-12位的用户名'
    },
    password: {
      required: '密码必填',
      testPass: '请输入6-18位非空的密码'
    },
    pass: {
      equalTo: '密码不同'
    }
  },
  submitHandler: function submitHandler() {
    // console.log(this.successList);
    // 当界面中所有的表单验证都成功的时候 就会执行这个 方法
    // 一般用跟后端进行数据交互 
    // 发送ajax请求
    $.ajax({
      url: '../php/login.php',
      method: 'post',
      data: {
        username: this.successList[1].value,
        password: this.successList[3].value
      },
      // dataType: 'json',
      success: function success(res) {
        if (res === '注册成功' && agree.checked) {
          //选中同意协议才可以点击注册按钮
          $('#btnLogin').removeAttr('disabled');
          alert("注册成功");
          location.href = '../html/register.html';
        }

        if (res == '注册失败') {
          alert("注册失败");
        }

        if (res == '用户已存在') {
          alert("用户已存在");
          location.href = '../html/login.html';
        }
      },
      error: function error(err) {
        console.log(err);
        alert('请求失败');
      },
      // 请求的超时（当1000毫秒请求不到数据 就会执行error函数）
      timeout: 5000
    });
  }
});