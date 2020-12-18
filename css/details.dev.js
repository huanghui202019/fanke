"use strict";

jQuery(function ($) {
  $('#head').load('../html/head.html');
});
jQuery(function ($) {
  $('#foot').load('../html/foot.html');
}); //获取元素

var detail = document.querySelector('#detail');
var nowbuy = document.querySelector('#nowbuy');
var drawerTabs = document.querySelector('.drawerTabs');
var drawerWrapper = document.querySelector('.drawerWrapper');
var closeWrapper = document.querySelector('.closeWrapper');
var st = document.querySelector('.st');
var addCar = document.querySelector('#addCar');
var danpin_xuanzeGMm = document.querySelector('.danpin_xuanzeGMm');
var selectedAmount = document.querySelector('#selectedAmount');
var car = document.querySelector('.car'); //获取商品id

var reg = /id=(\d+)/;
var goods_id = reg.exec(location.search)[1] * 1;

if (!goods_id) {
  location.href = '../html/list.html';
} //获取用户信息
// let user = getCookie('user');
//通过id获取数据


pAjax({
  url: '../php/getData.php',
  data: {
    goods_id: goods_id
  }
}).then(function (res) {
  res = JSON.parse(res)[0];
  renData(res);
  $('.goodsName').html(res.goods_name);
}); //根据获取到的数据渲染细节

function renData(data) {
  //开头链接
  var str1 = "\n        <a href=\"../html/index.html\">\u9996\u9875</a>\n        <span>></span>\n        <a href=\"../html/list.html?classify='".concat(data.cat_id, "        '\">").concat(data.cat_id, "</a>\n        <span>></span>\n        <a href=\"../html/list.html?classify='").concat(data.cat_one_id, "'\">").concat(data.cat_one_id, "</a>\n        <span>></span>\n        <a href=\"../html/list.html?classify='").concat(data.cat_three_id, "'\">").concat(data.cat_three_id, "</a>\n        <span>></span>\n        <b>").concat(data.goods_name, "</b>");
  $('.lj').html(str1); //放大镜内容

  var str2 = "\n    <div class=\"list\">\n                <p class=\"active\">\n                    <img midelImg=\"".concat(data.goods_small_logo, "\" bigImg=\"").concat(data.goods_small_logo, "\"\n                        src=\"").concat(data.goods_small_logo, "\">\n                </p>\n                <p>\n                    <img midelImg=\"").concat(data.img1, "\" bigImg=\"").concat(data.img1, "\"\n                        src=\"").concat(data.img1, "\">\n                </p>\n                <p>\n                    <img midelImg=\"").concat(data.img2, "\" bigImg=\"./").concat(data.img2, "\"\n                        src=\"").concat(data.img2, "\">\n                </p>\n            </div>\n            <div class=\"show\">\n                <img src=\"").concat(data.goods_big_logo, "\">\n                <div class=\"mask\"></div>\n            </div>\n            \n            <div class=\"enlarge\"></div>\n    ");
  $('.box').html(str2); //如果没有img1和img2就移除元素

  var sImg = document.querySelectorAll('.list p');

  if (!data.img1) {
    sImg[1].style.display = "none";
  }

  if (!data.img2) {
    sImg[2].style.display = "none";
  } //放大镜


  var enlarge = document.querySelector('.enlarge');
  enlarge.style.backgroundImage = "url(".concat(data.goods_big_logo, ")");
  new Enlarge(".box");
  detail.innerHTML += data.goods_introduce;
  var str3 = "<span>\u7279\u60E0\u4EF7\uFF1A</span>\n    <span>\uFFE5<strong>".concat(data.goods_price, "</strong>\n    </span>\n<span class=\"afterChargePrice\">\u5145\u503C\u540E\u76F8\u5F53\u4E8E:&nbsp;&nbsp;\xA5").concat(data.sale_price, "</span>");
  $('.tehuiMoney').html(str3); //选中颜色

  sColor(data); //size

  sSize(data);
} //吸顶


window.onscroll = function () {
  //定义滚动的距离，距离顶部的距离
  if (scrollY > 1000) {
    st.style.position = "fixed";
    st.style.top = 0;
    st.style.display = 'block';
  } else {
    st.style.position = 'static';
    st.style.display = 'none';
  }
};

var goodsAdd = document.querySelectorAll('.goodsAdd p'); //选中颜色

var selColor = document.querySelectorAll('.selColor li');
selColor.forEach(function (a) {
  a.onclick = function () {
    selColor.forEach(function (b, i) {
      b.className = '';
    });
    this.className = 'isSelect';
    localStorage.setItem('selColor', a.title);
    goodsAdd[0].innerHTML = a.title;
  };
});

function sColor(data) {
  var SpriteColors = document.querySelectorAll('.SpriteColors');

  if (data.黑色 == '1') {
    SpriteColors[0].style.background = "url(".concat(data.goods_small_logo, ") no-repeat scroll");
    SpriteColors[0].style.backgroundSize = '100% 100%';
  } else if (data.黑色 == '0') {
    SpriteColors[0].style.display = 'none';
  }

  if (data.白色 == '1') {
    SpriteColors[1].style.background = "url(".concat(data.img1, ") no-repeat scroll");
    SpriteColors[1].style.backgroundSize = '100% 100%';
  } else if (data.白色 == '0') {
    SpriteColors[1].style.display = 'none';
  }

  if (data.红色 == '1') {
    SpriteColors[2].style.background = "url(".concat(data.img2, ") no-repeat scroll");
    SpriteColors[2].style.backgroundSize = '100% 100%';
  } else if (data.红色 == '0') {
    SpriteColors[2].parentElement.parentElement.parentElement.style.display = 'none';
  }
} //选中size


var selSize = document.querySelectorAll('.selSize li');
selSize.forEach(function (a) {
  a.onclick = function () {
    selSize.forEach(function (b, i) {
      b.className = '';
    });
    this.className = 'active';
    localStorage.setItem('selSize', a.title);
    goodsAdd[1].innerHTML = "，" + a.title;
  };
});

function sSize(data) {
  var selSize = document.querySelectorAll('.selSize li');

  if (data.S == '0') {
    selSize[0].style.display = 'none';
  }

  if (data.M == '0') {
    selSize[1].style.display = 'none';
  }

  if (data.L == '0') {
    selSize[2].style.display = 'none';
  }

  if (data.XL == '0') {
    selSize[3].style.display = 'none';
  }

  if (data.XXL == '0') {
    selSize[4].style.display = 'none';
  }

  if (data.均码 == '0') {
    selSize[5].style.display = 'none';
  }
} //侧边框的事件


var clickNum = 0;

drawerTabs.onclick = function () {
  clickNum++;

  if (clickNum % 2 != 0) {
    animation(drawerWrapper, {
      right: 0
    });
  }

  if (clickNum % 2 == 0) {
    animation(drawerWrapper, {
      right: -264
    });
  }
};

closeWrapper.onclick = function () {
  animation(drawerWrapper, {
    right: -264
  });
}; //添加购物车


addCar.onclick = function () {
  var selColor = localStorage.getItem('selColor');
  var selSize = localStorage.getItem('selSize');
  var num = selectedAmount.value * 1;

  if (!selColor || !selSize) {
    danpin_xuanzeGMm.classList.add('seleSize');
    return;
  } else {
    if (!user) {
      //如果cookie为空，跳到登录页面
      alert("您还没有登录，确定登录吗？");
      window.location = "../html/register.html";
      localStorage.setItem('url', '../html/details.html?id=' + goods_id);
      return;
    } else {
      //如果已经登录就将id传给这个用户的表，
      setData(goods_id, user, selColor, selSize, num);
      alert('加入成功');
      window.location = window.location.href;
    }
  }
};

car.onclick = function () {
  scrollTo(0, 0);
}; //立即购买


nowbuy.onclick = function () {
  var selColor = localStorage.getItem('selColor');
  var selSize = localStorage.getItem('selSize');
  var num = selectedAmount.value * 1;

  if (!selColor || !selSize) {
    danpin_xuanzeGMm.classList.add('seleSize');
    return;
  } else {
    //获取cookie值
    if (!user) {
      //如果cookie为空，跳到登录页面
      localStorage.setItem('url', '../html/details.html?id=' + goods_id);
      window.location = "../html/register.html";
    } else {
      //如果cookie不为空
      //重新设置cookie
      setCookie('user', user, 7 * 24 * 60 * 60);
      setData(goods_id, user, selColor, selSize, num); // 跳到购物车页面

      window.location = "../html/car.html";
    }
  }
}; // 将数据写入数据表


function setData(goods_id, user, selColor, selSize, num) {
  var res1;
  return regeneratorRuntime.async(function setData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(pAjax({
            url: '../php/detailSet.php',
            data: {
              goods_id: goods_id,
              user: user,
              color: selColor,
              size: selSize,
              num: num
            }
          }));

        case 2:
          res1 = _context.sent;
          res1 = JSON.parse(res1);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

window.onload = function () {
  localStorage.removeItem('selColor');
  localStorage.removeItem('selSize');
  goodsAdd[0].innerHTML = '';
  goodsAdd[1].innerHTML = '';
  selectedAmount.value = '1';
};