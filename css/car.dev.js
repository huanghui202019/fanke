"use strict";

//获取元素
var car = document.querySelector('#car');
var carCon = document.querySelector('#carCon'); //获取登录的用户名

var user = getCookie('user'); //如果用户名为空，跳到登录页面，并记录跳过去的地址

if (!user) {
  window.location = "../html/register.html";
  localStorage.setItem('url', '../html/car.html');
} //获取数据


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
}); //修改num

function numCahnge(ele) {
  var id = ele.getAttribute('goods_id'); //获取本地数据

  var data = JSON.parse(localStorage.getItem('goodsList')); //data是数组，获取对象，num是对象的cart_number

  var obj = data.filter(function (item) {
    return item.goods_id == id;
  })[0]; //获取num值

  num = obj.cart_number * 1;

  if (ele.classList.contains('add')) {
    // 如果是加法商品数量增加
    num++;
  } else if (ele.classList.contains('reduce')) {
    //如果是减法，判断num是否大一1，大于1就--，否则就等于1
    num <= 1 ? num = 1 : num--;
  } //获取数据库数据，修改用户表里的num数据


  pAjax({
    url: '../php/carChange.php',
    data: {
      goods_id: id,
      user: login,
      goods_num: num
    }
  }).then(function (res) {
    res = JSON.parse(res);

    if (res.code == 1) {
      //如果数据库数据修改成功，修改本地数据
      obj.cart_number = num;
      localStorage.setItem('goodsList', JSON.stringify(data));
      render(data);
    }
  });
} //事件委托


carCon.onclick = function () {
  var e = window.event; //全选

  if (e.target.className == 'allCkbBt') {
    //获取本地存储数据，选中状态改变本地数据，不能直接改数据库数据
    var data = JSON.parse(localStorage.getItem('goodsList'));
    data.forEach(function (item) {
      //如果单选按钮状态与全选相同
      e.target.checked ? item.is_select = 1 : item.is_select = 0;
    }); //将改变的数据存入本地

    localStorage.setItem('goodsList', JSON.stringify(data)); // //重新渲染数据

    renCar(data);
  } //单选


  if (e.target.className == "ckb") {
    //获取选中的这行的goods_id
    var id = e.target.getAttribute('goods_id');
    var cart_color = e.target.getAttribute('cart_color');
    var cart_size = e.target.getAttribute('cart_size'); //改变本地数据

    var _data = JSON.parse(localStorage.getItem('goodsList'));

    _data.forEach(function (item) {
      //通过id将其的is_select值改为1或者0
      if (item.goods_id == id && item.cart_color == cart_color && item.cart_size == cart_size) {
        item.is_select = e.target.checked ? 1 : 0;
      }
    }); // 需要把 修改后的数据存储本地存储中


    localStorage.setItem('goodsList', JSON.stringify(_data));
    renCar(_data); // isSel(data)
  } //删除


  if (e.target.className == 'del') {
    //获取这行的id值
    var _id = e.target.getAttribute('goods_id');

    var _cart_color = e.target.getAttribute('cart_color');

    var _cart_size = e.target.getAttribute('cart_size');

    var res = confirm("你确定要删除吗？");

    if (!res) {
      return;
    } // 删除数据库的数据


    delGoods(_id, _cart_color, _cart_size);
  } //加（修改商品数量）


  if (e.target.className == 'increase') {
    changeNum(e.target);
  } //减


  if (e.target.className == 'decrease') {
    changeNum(e.target);
  } //结算


  if (e.target.className == 'checkout') {
    var _data2 = JSON.parse(localStorage.getItem('goodsList'));

    var _res = _data2.filter(function (item) {
      return item.is_select == 1;
    });

    _res.forEach(function (item) {
      //获取这行的id值
      var id = item.goods_id;
      var cart_color = item.cart_color;
      var cart_size = item.cart_size;
      delGoods(id, cart_color, cart_size);
    });
  } // 删除选中商品


  if (e.target.className == 'batchDelCart') {
    var _data3 = JSON.parse(localStorage.getItem('goodsList'));

    var _res2 = _data3.filter(function (item) {
      return item.is_select == 1;
    });

    _res2.forEach(function (item) {
      //获取这行的id值
      var id = item.goods_id;
      var cart_color = item.cart_color;
      var cart_size = item.cart_size;
      delGoods(id, cart_color, cart_size);
    });
  }
}; //修改数量


function changeNum(ele) {
  var id = ele.getAttribute('goods_id');
  var cart_color = ele.getAttribute('cart_color');
  var cart_size = ele.getAttribute('cart_size'); //获取本地数据

  var data = JSON.parse(localStorage.getItem('goodsList')); //data是数组，获取对象，num是对象的cart_number

  var obj = data.filter(function (item) {
    return item.goods_id == id && item.cart_color == cart_color && item.cart_size == cart_size;
  })[0]; //获取num值

  num = obj.cart_number * 1;

  if (ele.className == 'increase') {
    // 如果是加法商品数量增加
    num++;
  } else if (ele.className == 'decrease') {
    //如果是减法，判断num是否大一1，大于1就--，否则就等于1
    num <= 1 ? num = 1 : num--;
  } //获取数据库数据，修改用户表里的num数据


  pAjax({
    url: '../php/carChange.php',
    data: {
      goods_id: id,
      user: user,
      goods_num: num,
      cart_color: cart_color,
      cart_size: cart_size
    }
  }).then(function (res) {
    res = JSON.parse(res);

    if (res.code == 1) {
      //如果数据库数据修改成功，修改本地数据
      obj.cart_number = num;
      localStorage.setItem('goodsList', JSON.stringify(data));
      renCar(data);
    }
  });
} //删除数据（用户表和本地数据）


function delGoods(id, cart_color, cart_size) {
  //删除这个id的商品（用户表与本地存储）
  pAjax({
    url: '../php/carDel.php',
    data: {
      user: user,
      goods_id: id,
      cart_color: cart_color,
      cart_size: cart_size
    }
  }).then(function (res) {
    console.log(res);
    res = JSON.parse(res);

    if (res.code == 1) {
      // 删除本地存储中对应的数据
      // 先获取本地存储中的数据
      var data = JSON.parse(localStorage.getItem('goodsList')); //筛选（过滤出）与这行不一样的数据

      var _res3 = data.filter(function (item) {
        return item.goods_id != id || item.cart_color != cart_color || item.cart_size != cart_size;
      }); //将过滤出的数据再次存入本地


      localStorage.setItem('goodsList', JSON.stringify(_res3)); // 重新渲染

      renCar(_res3);
    }
  });
} //渲染数据


function renCar(data) {
  if (data.length == 0) {
    $('#cartEmpty').css({
      display: 'block'
    });
    $('#car').css({
      display: 'none'
    });
    return;
  }

  $('#cartEmpty').css({
    display: 'none'
  });
  $('#car').css({
    display: 'block'
  }); // 定义选中时将is_select值改为1（选中状态）

  var allChecked = data.every(function (item) {
    return item.is_select == 1;
  }); //获取选中商品数量与价格

  var total = goodsNum(data);
  var str = '';
  str = "<table>\n        <thead>\n            <th>\n                &nbsp;\n            </th>\n            <th class=\"barTitle \">\n                <input type=\"checkbox\" class=\"allCkbBt\" ".concat(allChecked ? 'checked' : '', ">\n                <label>\u5168\u9009</label>\n            </th>\n            <th class=\"image\">\n                &nbsp;\n            </th>\n            <th class=\"name\">\n                \u5546\u54C1\u540D\u79F0\n            </th>\n            <th class=\"size\">\n                \u5C3A\u5BF8\n            </th>\n            <th class=\"price\">\n                \u5355\u4EF7\n            </th>\n            <th class=\"qty\">\n                \u6570\u91CF\n            </th>\n            <th class=\"discount\">\n                \u4F18\u60E0\n            </th>\n            <th class=\"subtotal\">\n                \u5C0F\u8BA1\n            </th>\n            <th class=\"operate \">\n                \u64CD\u4F5C\n            </th>\n\n        </thead>\n        <tbody id=\"supplierGeneralTb\">\n        <tr>\n                <td></td>\n                <td></td>\n                <td></td>\n                <td></td>\n                <td></td>\n                <td></td>\n                <td></td>\n                <td></td>\n                <td></td>\n                <td></td>\n            </tr>");
  data.forEach(function (item, index) {
    str += "\n            <tr index='".concat(index + 1, "'>\n                <td class=\"white bd-left\">\n                    &nbsp;\n                </td>\n                <td class=\"bar\" rowspan=\"1\">\n                    <input type=\"checkbox\" class=\"ckb\"").concat(item.is_select == 1 ? 'checked' : '', " goods_id=\"").concat(item.goods_id, "\" cart_color=\"").concat(item.cart_color, "\"\n                    cart_size=\"").concat(item.cart_size, "\">\n                </td>\n                <td class=\"image\" rowspan=\"1\">\n                    <a target=\"../html/details.html?goods_id=").concat(item.goods_id, " \">\n                        <img alt=\"").concat(item.goods_name, "\" src=\"").concat(item.goods_small_logo, "\">\n                    </a>\n                </td>\n                    <td class=\"name\">\n                        <a href=\"../html/details.html?goods_id=").concat(item.goods_id, "\" title=\"").concat(item.goods_name, "\">").concat(item.goods_name, "\n                        </a>\n                    </td>\n                    <td class=\"size\">\n                        <a title=\"L\">").concat(item.cart_size, "</a>\n                    </td>\n                    <td class=\"price\">\uFFE5").concat(item.goods_price, "</td>\n                    <td class=\"qty\">\n                        <button class=\"decrease\" goods_id='").concat(item.goods_id, "'cart_color='").concat(item.cart_color, "'\n                        cart_size='").concat(item.cart_size, "'>-</button>\n                        <input name=\"qty\" type=\"text\" class=\"modifyProductQty\" value=\"").concat(item.cart_number, "\" maxlength=\"3\">\n                        <button class=\"increase\" goods_id='").concat(item.goods_id, "'cart_color='").concat(item.cart_color, "'\n                        cart_size='").concat(item.cart_size, "'>+</button>\n                    </td>\n                    <td class=\"sub\">-<span class=\"sub\">").concat(((item.goods_price - item.sale_price) * item.cart_number).toFixed(2), "</span></td>\n                    <td class=\"subtotal\">\uFFE5<span class=\"old\">").concat((item.goods_price * item.cart_number).toFixed(2), "</span><span class=\"new\">").concat((item.sale_price * item.cart_number).toFixed(2), "</span></td>\n                    <td class=\"operate\">\n                        <a href=\"javascript:\" class=\"del\" goods_id=").concat(item.goods_id, " cart_color=").concat(item.cart_color, "\n                        cart_size=").concat(item.cart_size, ">\u5220\u9664</a>\n                    </td>\n                </tr> \n            ");
  });
  str += "\n    <tr>\n    <td></td>\n    <td></td>\n    <td></td>\n    <td></td>\n    <td></td>\n    <td></td>\n    <td></td>\n    <td></td>\n    <td></td>\n    <td></td>\n</tr>\n</tbody>\n    </table>\n    <div id=\"barSummary\" class=\"barSummary clearfix\">\n        <div class=\"bar\">\n        <input id=\"allCkbBt\" type=\"checkbox\" class=\"allCkbBt\" ".concat(allChecked ? 'checked' : '', ">\n        <label>\u5168\u9009</label>\n            <a href=\"#\" class=\"batchDelCart\">\u5220\u9664</a>\n            <span>\u6570\u91CF\u603B\u8BA1\uFF1A<em>").concat(total.totalNum, "</em>\u4EF6</span>\n            <span>\n                <em>\u60A8\u76EE\u524D\u53EF\u4EAB\u53D7\u5168\u573A\u8D2D\u7269\u514D\u8FD0\u8D39</em>\n            </span>\n        </div>\n        <div class=\"suball\">\u6D3B\u52A8\u4F18\u60E0\uFF1A<a href='javascript:'>-\uFFE5").concat(total.totaloldPrice.toFixed(2), "<a></div>\n        <div class=\"summary\">\u4EA7\u54C1\u91D1\u989D\u603B\u8BA1(\u4E0D\u542B\u8FD0\u8D39)\uFF1A\n            <span class=\"amount\">\uFFE5<em>").concat(total.totalPrice.toFixed(2), "</em></span>\n            <a href=\"#\">\u70B9\u51FB\u9886\u53D6\u4F18\u60E0\u5238</a>\n        </div>\n        <div class=\"btnPanel\">\n            <a href=\"../html/list.html\" class=\"goBuy\">\n            &lt;&lt;\u7EE7\u7EED\u8D2D\u7269</a>\n            <a class=\"checkout\" href=\"#\">\u53BB\u7ED3\u7B97&gt;&gt;</a>\n        </div>\n    </div>\n    ");
  carCon.innerHTML = str;
  var sele = document.querySelectorAll('.ckb');
  var suball = document.querySelector('.suball');
  sele.forEach(function (item) {
    if (item.checked == true) {
      item.parentElement.parentElement.className = 'selected';
      $(item).parent().siblings('.sub').children('span').css({
        display: 'inline'
      });
      $(item).parent().siblings('.subtotal').children('.old').css({
        display: 'none'
      });
      $(item).parent().siblings('.subtotal').children('.new').css({
        display: 'inline'
      });
      suball.style.display = "block";
    }
  });
  var allCkbBt = document.querySelectorAll('.allCkbBt');
} //计算选中商品数量与价格


function goodsNum(goods) {
  //筛选选中的
  var res = goods.filter(function (item) {
    return item.is_select == 1;
  }); // 计算选中商品的数量

  var totalNum = res.reduce(function (pre, item) {
    return pre + item.cart_number * 1;
  }, 0); // 计算选中商品的总价格

  var totalPrice = res.reduce(function (pre, item) {
    return pre + item.sale_price * item.cart_number;
  }, 0); // 计算选中商品的原价总价格

  var totaloldPrice = res.reduce(function (pre, item) {
    return pre + (item.goods_price - item.sale_price) * item.cart_number;
  }, 0);
  return {
    totalNum: totalNum,
    totalPrice: totalPrice,
    totaloldPrice: totaloldPrice
  };
}

$('.register').click(function (item) {
  var url = window.location.href;
  localStorage.setItem('url', url);
  location.href = "../html/register.html";
});