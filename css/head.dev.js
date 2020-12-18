"use strict";

// 导航栏内容
var data = [{
  fTitle: '首页',
  tTitle: []
}, {
  fTitle: '打底',
  tTitle: ['普通打底', '加绒打底']
}, {
  fTitle: '商务衬衫',
  tTitle: ['长袖免烫', '舒适商务', '高支衬衫', '短袖免烫', '短袖桑蚕丝']
}, {
  fTitle: '休闲衬衫',
  tTitle: ['牛津纺', '法兰绒', '灯芯绒', '水洗棉', '易打理', '麻棉系列', '复古风系列', '女款', '短袖休闲衬衫']
}, {
  fTitle: '卫衣',
  tTitle: ['时尚款', '开衫', '圆领', '连帽']
}, {
  fTitle: '外套',
  tTitle: ['羽绒服', '大衣', '夹克', '西服', '摇粒绒', '冲锋']
}, {
  fTitle: '针织衫',
  tTitle: ['圆领', 'V领开衫', 'polo领', '高领', '开衫']
}, {
  fTitle: '裤',
  tTitle: ['牛仔裤', '休闲裤', '针织裤', '运动系列', '沙滩裤', '短裤', '半裙']
}, {
  fTitle: '鞋',
  tTitle: ['帆布鞋', '休闲鞋', '运动鞋', '凉鞋', '皮鞋', '靴子', '女鞋']
}, {
  fTitle: '家居',
  tTitle: ['袜', '内衣', '家居服', '连裤袜', '家居鞋', '床品件套', '毯', '被', '围巾', '枕', '抱枕', '手机壳', '箱包', '裙装', '马甲']
}]; //获取导航栏

var list = document.querySelector(".list");
renderNav(data); //渲染导航

function renderNav(data) {
  var str = '';
  data.forEach(function (item, index) {
    var classify = encodeURI(item.fTitle);
    str += "<li><a href=\"../html/list.html?classify='".concat(classify, "'\">").concat(item.fTitle, "</a><span></span>");

    if (item.tTitle.length > 0) {
      str += '<em></em><ul class="subNav">';
      item.tTitle.forEach(function (ele) {
        str += "<li><a href=\"../html/list.html?classify='".concat(ele, "'\">").concat(ele, "</a></li>");
      });
      str += '</ul>';
    }

    str += '</li>';
  });
  list.innerHTML = str;
}

$('.list>li').children('a')[0].href = '../html/index.html'; //导航栏二级标题渐隐渐现

$(' .list>li').hover(function () {
  $(this).children('.subNav').slideDown().parent().siblings().children('.subNav').slideUp();
}, function () {
  $(this).children('.subNav').slideUp();
}); //点击回到顶部

$('.BlackTop').click(function () {
  $('html').animate({
    scrollTop: 0
  });
}); //点击搜索

$('#searchBtn').click(function () {
  var value = $('#skey').val();

  if (value) {
    location.href = "../html/list.html?classify='".concat(value, "'");
  }
}); //获取登录的用户名

var user = getCookie('user'); //如果用户名为空，跳到登录页面，并记录跳过去的地址
//获取数据

pAjax({
  url: '../php/carGet.php',
  data: {
    user: user
  }
}).then(function (res) {
  res = JSON.parse(res); // 先把数据存放到本地

  localStorage.setItem('goodsList', JSON.stringify(res));
  console.log(res);
  renCar(res);
});

function renCar(data) {
  // 计算选中商品的原价总价格
  var totalPrice = data.reduce(function (pre, item) {
    return pre + (item.goods_price - item.sale_price) * item.cart_number;
  }, 0);
  var totalNum = data.reduce(function (pre, item) {
    return pre + item.cart_number * 1;
  }, 0);

  if (data.length == 0) {
    $('.SCtotalpageno').css({
      display: 'block'
    });
    $('.SCtotalpageBottom').css({
      display: 'none'
    });
    return;
  }

  $('.SCtotalpageno').css({
    display: 'none'
  });
  $('.SCtotalpageBottom').css({
    display: 'block'
  });
  var str2 = " \n    <div class=\"msg clearfix\">\n    <div class=\"SCtotalpageno\">\u60A8\u6700\u8FD1\u6DFB\u52A0\u7684\u5546\u54C1</div>";
  data.forEach(function (item) {
    str2 += "<div>\n    <img src=\"".concat(item.goods_small_logo, "\" alt=\"\">\n    <div>\n        <a href=\"\">").concat(item.goods_name, "</a>\n        <p>\uFFE5").concat(item.goods_price, "x").concat(item.cart_number, "</p>\n    </div>\n    <button class=\"del\" goods_id=").concat(item.goods_id, " cart_color=").concat(item.cart_color, "\n    cart_size=").concat(item.cart_size, ">\u5220\u9664</button>\n    </div>");
  });
  str2 += "</div><div class=\"total\">\n<div class=\"clearfix\">\n    <p>\u5171\u8BA1\uFF08\u672A\u8BA1\u7B97\u4FC3\u9500\u6298\u6263\uFF09</p>\n    <a href=\"javascript:\">\uFFE5".concat(totalPrice.toFixed(2), "</a>\n</div>\n<a class=\"toCar\" href=\"../html/car.html\">\u67E5\u770B\u8D2D\u7269\u8F66\uFF08").concat(totalNum, "\u4EF6\uFF09</a>\n</div>");
  $('.SCtotalpageBottom').html(str2);
  $('.goodsnum').html(totalNum);
} //删除


var SCtotalpageBottom = document.querySelector('.SCtotalpageBottom');

SCtotalpageBottom.onclick = function () {
  var e = window.event;

  if (e.target.className == 'del') {
    //获取这行的id值
    var id = e.target.getAttribute('goods_id');
    var cart_color = e.target.getAttribute('cart_color');
    var cart_size = e.target.getAttribute('cart_size');
    var res = confirm("你确定要删除吗？");

    if (!res) {
      return;
    } // 删除数据库的数据


    pAjax({
      url: '../php/carDel.php',
      data: {
        user: user,
        goods_id: id,
        cart_color: cart_color,
        cart_size: cart_size
      }
    }).then(function (res) {
      res = JSON.parse(res);

      if (res.code == 1) {
        // 删除本地存储中对应的数据
        // 先获取本地存储中的数据
        alert('操作成功');

        var _data = JSON.parse(localStorage.getItem('goodsList')); //筛选（过滤出）与这行不一样的数据


        var _res = _data.filter(function (item) {
          return item.goods_id != id || item.cart_color != cart_color || item.cart_size != cart_size;
        }); //将过滤出的数据再次存入本地


        localStorage.setItem('goodsList', JSON.stringify(_res)); // 重新渲染

        renCar(_res);
      }
    });
  }
};

$('.register').click(function (item) {
  var url = window.location.href;
  localStorage.setItem('url', url);
  location.href = "../html/register.html";
});