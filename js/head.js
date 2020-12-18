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
    }]
    //获取导航栏
let list = document.querySelector(".list")

renderNav(data);
//渲染导航
function renderNav(data) {
    let str = '';
    data.forEach((item, index) => {

        let classify = encodeURI(item.fTitle);

        str += `<li><a href="../html/list.html?classify='${classify}'">${item.fTitle}</a><span></span>`
        if (item.tTitle.length > 0) {
            str += '<em></em><ul class="subNav">'
            item.tTitle.forEach(function(ele) {

                str += `<li><a href="../html/list.html?classify='${ele}'">${ele}</a></li>`
            })
            str += '</ul>'
        }
        str += '</li>'
    });
    list.innerHTML = str;
}
$('.list>li').children('a')[0].href = '../html/index.html';

//导航栏二级标题渐隐渐现
$(' .list>li').hover(function() {
    $(this).children('.subNav').slideDown().parent().siblings().children('.subNav').slideUp();
}, function() {
    $(this).children('.subNav').slideUp()
});




//点击回到顶部
$('.BlackTop').click(function() {
    $('html').animate({
        scrollTop: 0
    })
})


//点击搜索
$('#searchBtn').click(function() {
    let value = $('#skey').val();
    if (value) {
        location.href = `../html/list.html?classify='${value}'`;
    }

})


//获取登录的用户名
let user = getCookie('user');
//如果用户名为空，跳到登录页面，并记录跳过去的地址
//获取数据
pAjax({
    url: '../php/carGet.php',
    data: {
        user: user
    }
}).then(res => {
    res = JSON.parse(res);
    // 先把数据存放到本地
    localStorage.setItem('goodsList', JSON.stringify(res));
    console.log(res);
    renCar(res);
})

function renCar(data) {
    // 计算选中商品的原价总价格
    let totalPrice = data.reduce((pre, item) => {
        return pre + (item.goods_price - item.sale_price) * item.cart_number
    }, 0);
    let totalNum = data.reduce((pre, item) => {
        return pre + item.cart_number * 1
    }, 0);

    if (data.length == 0) {
        $('.SCtotalpageno').css({ display: 'block' });
        $('.SCtotalpageBottom').css({ display: 'none' });
        return;
    }
    $('.SCtotalpageno').css({ display: 'none' });
    $('.SCtotalpageBottom').css({ display: 'block' });

    let str2 = ` 
    <div class="msg clearfix">
    <div class="SCtotalpageno">您最近添加的商品</div>`

    data.forEach(item => {
        str2 += `<div>
    <img src="${item.goods_small_logo}" alt="">
    <div>
        <a href="">${item.goods_name}</a>
        <p>￥${item.goods_price}x${item.cart_number}</p>
    </div>
    <button class="del" goods_id=${item.goods_id} cart_color=${item.cart_color}
    cart_size=${item.cart_size}>删除</button>
    </div>`
    });
    str2 += `</div><div class="total">
<div class="clearfix">
    <p>共计（未计算促销折扣）</p>
    <a href="javascript:">￥${totalPrice.toFixed(2)}</a>
</div>
<a class="toCar" href="../html/car.html">查看购物车（${totalNum}件）</a>
</div>`
    $('.SCtotalpageBottom').html(str2);
    $('.goodsnum').html(totalNum);
}

//删除
let SCtotalpageBottom = document.querySelector('.SCtotalpageBottom');
SCtotalpageBottom.onclick = function() {
    let e = window.event;
    if (e.target.className == 'del') {
        //获取这行的id值
        let id = e.target.getAttribute('goods_id');
        let cart_color = e.target.getAttribute('cart_color');
        let cart_size = e.target.getAttribute('cart_size');
        let res = confirm("你确定要删除吗？")
        if (!res) {
            return
        }
        // 删除数据库的数据
        pAjax({
            url: '../php/carDel.php',
            data: {
                user: user,
                goods_id: id,
                cart_color: cart_color,
                cart_size: cart_size
            }
        }).then(res => {
            res = JSON.parse(res);
            if (res.code == 1) {
                // 删除本地存储中对应的数据
                // 先获取本地存储中的数据
                alert('操作成功')
                let data = JSON.parse(localStorage.getItem('goodsList'));
                //筛选（过滤出）与这行不一样的数据
                let res = data.filter(item => {
                    return (item.goods_id != id || item.cart_color != cart_color || item.cart_size != cart_size)
                });
                //将过滤出的数据再次存入本地
                localStorage.setItem('goodsList', JSON.stringify(res));
                // 重新渲染
                renCar(res);
            }
        })

    }
}

$('.register').click(item => {
    let url = window.location.href;
    localStorage.setItem('url', url);
    location.href = "../html/register.html";
})