"use strict";

jQuery(function ($) {
  $('#head').load('../html/head.html');
});
jQuery(function ($) {
  $('#foot').load('../html/foot.html');
}); // 秒杀时间

msTime();

function msTime() {
  // let startTime = new Date(new Date().setHours(0, 0, 0, 0)); //获取当天零点的时间
  var stopTime = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1); //获取当天23:59:59的时间;

  setInterval(function () {
    var nowTime = new Date();
    var difTime = timeDifference(nowTime, stopTime);
    $('.h').html(difTime.hours);
    $('.m').html(difTime.min);
    $('.s').html(difTime.sec);
  }, 1000);
} //获取轮播图
// $.ajax({
//     url: '../php/swiper.php',
//     success: function(res) {
//         // console.log(JSON.parse(res)[0].img);
//         res = JSON.parse(res);
//         let str = '';
//         res.forEach(item => {
//             str += `
//             <div class="swiper-slide" style="background-image:url(${item.img})">
//                 <a title="${item.title}" href="" class="track"></a>
//             </div>
//             `
//         });
//         $('.swiper-wrapper').html(str);
//         swiper();
//     }
// });
//轮播图


swiper();

function swiper() {
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    // 垂直切换选项
    effect: 'fade',
    //切换效果（淡入）
    loop: true,
    // 循环模式选项
    initialSlide: 0,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }); //鼠标滑过pagination控制swiper切换

  for (i = 0; i < mySwiper.pagination.bullets.length; i++) {
    mySwiper.pagination.bullets[i].onmouseover = function () {
      this.click();
    };
  }
} //秒杀商品


$.ajax({
  url: '../php/skillGoods.php',
  success: function success(res) {
    res = JSON.parse(res);
    var str = '';
    res.forEach(function (item) {
      if (item.is_promote == 1) {
        // console.log(item);
        str += "\n                        <li>\n                        <a href=\"../html/details.html?goods_id=".concat(item.goods_id, "\">\n\n                            <img src=\"").concat(item.goods_small_logo, "\" alt=\"").concat(item.goods_name, "\">\n                            <div class=\"productname\">\n                                <span>").concat(item.goods_name, "</span>\n                            </div>\n                            <div class=\"sell\">\n                                <span class=\"process\">\n                                    <em  class=\"progress\"></em>\n                                </span> \u552E\u51FA\n                                <span class=\"progress-display\">50%</span>\n                            </div>\n                            <div class=\"price clearfix\">\n                                <span class=\"oldprice\">\xA5").concat(item.goods_price, "</span>\n                                <span class=\"saleprice\">\xA5 <em>").concat(item.sale_price, "</em> </span>\n                                <span class=\"afterdeposit\">\u5145\u503C\u540E").concat(item.kill_price, "\u5143</span>\n                            </div>\n                            <div class=\"buynow\"><span>\u7ACB\u5373\u62A2\u8D2D</span></div>\n                        </a>\n                    </li>\n                        ");
      }
    });
    $('#msGoods').html(str);
  }
});