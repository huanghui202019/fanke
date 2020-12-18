jQuery(function($) {
    $('#head').load('../html/head.html');
})
jQuery(function($) {
    $('#foot').load('../html/foot.html');
})


// 秒杀时间
msTime()

function msTime() {
    // let startTime = new Date(new Date().setHours(0, 0, 0, 0)); //获取当天零点的时间
    let stopTime = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1); //获取当天23:59:59的时间;
    setInterval(() => {
        let nowTime = new Date();
        let difTime = timeDifference(nowTime, stopTime)

        $('.h').html(difTime.hours);
        $('.m').html(difTime.min);
        $('.s').html(difTime.sec)
    }, 1000);
}
//获取轮播图
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
        direction: 'horizontal', // 垂直切换选项
        effect: 'fade', //切换效果（淡入）
        loop: true, // 循环模式选项
        initialSlide: 0,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    //鼠标滑过pagination控制swiper切换
    for (i = 0; i < mySwiper.pagination.bullets.length; i++) {
        mySwiper.pagination.bullets[i].onmouseover = function() {
            this.click();
        };
    }
}

//秒杀商品
$.ajax({
    url: '../php/skillGoods.php',
    success: function(res) {
        res = JSON.parse(res);
        let str = '';
        res.forEach(item => {
            if (item.is_promote == 1) {
                // console.log(item);
                str += `
                        <li>
                        <a href="../html/details.html?goods_id=${item.goods_id}">

                            <img src="${item.goods_small_logo}" alt="${item.goods_name}">
                            <div class="productname">
                                <span>${item.goods_name}</span>
                            </div>
                            <div class="sell">
                                <span class="process">
                                    <em  class="progress"></em>
                                </span> 售出
                                <span class="progress-display">50%</span>
                            </div>
                            <div class="price clearfix">
                                <span class="oldprice">¥${item.goods_price}</span>
                                <span class="saleprice">¥ <em>${item.sale_price}</em> </span>
                                <span class="afterdeposit">充值后${item.kill_price}元</span>
                            </div>
                            <div class="buynow"><span>立即抢购</span></div>
                        </a>
                    </li>
                        `
            }
        });
        $('#msGoods').html(str);

    }
});