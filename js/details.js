jQuery(function($) {
    $('#head').load('../html/head.html');
});
jQuery(function($) {
    $('#foot').load('../html/foot.html');
});

//获取元素
let detail = document.querySelector('#detail')
let nowbuy = document.querySelector('#nowbuy');
let drawerTabs = document.querySelector('.drawerTabs');
let drawerWrapper = document.querySelector('.drawerWrapper')
let closeWrapper = document.querySelector('.closeWrapper');
let st = document.querySelector('.st');
let addCar = document.querySelector('#addCar');
let danpin_xuanzeGMm = document.querySelector('.danpin_xuanzeGMm');
let selectedAmount = document.querySelector('#selectedAmount')
let car = document.querySelector('.car')

//获取商品id
let reg = /id=(\d+)/;
let goods_id = reg.exec(location.search)[1] * 1;
if (!goods_id) {
    location.href = '../html/list.html'
}
//获取用户信息
// let user = getCookie('user');

//通过id获取数据
pAjax({
    url: '../php/getData.php',
    data: {
        goods_id
    }
}).then(res => {
    res = JSON.parse(res)[0];
    renData(res);
    $('.goodsName').html(res.goods_name)
});


//根据获取到的数据渲染细节
function renData(data) {
    //开头链接
    let str1 = `
        <a href="../html/index.html">首页</a>
        <span>></span>
        <a href="../html/list.html?classify='${data.cat_id}        '">${data.cat_id}</a>
        <span>></span>
        <a href="../html/list.html?classify='${data.           cat_one_id}'">${data.cat_one_id}</a>
        <span>></span>
        <a href="../html/list.html?classify='${data.           cat_three_id}'">${data.cat_three_id}</a>
        <span>></span>
        <b>${data.goods_name}</b>`
    $('.lj').html(str1);


    //放大镜内容
    let str2 = `
    <div class="list">
                <p class="active">
                    <img midelImg="${data.goods_small_logo}" bigImg="${data.goods_small_logo}"
                        src="${data.goods_small_logo}">
                </p>
                <p>
                    <img midelImg="${data.img1}" bigImg="${data.img1}"
                        src="${data.img1}">
                </p>
                <p>
                    <img midelImg="${data.img2}" bigImg="./${data.img2}"
                        src="${data.img2}">
                </p>
            </div>
            <div class="show">
                <img src="${data.goods_big_logo}">
                <div class="mask"></div>
            </div>
            
            <div class="enlarge"></div>
    `
    $('.box').html(str2);

    //如果没有img1和img2就移除元素
    let sImg = document.querySelectorAll('.list p')
    if (!data.img1) {
        sImg[1].style.display = "none"
    }
    if (!data.img2) {
        sImg[2].style.display = "none"
    }

    //放大镜
    let enlarge = document.querySelector('.enlarge');
    enlarge.style.backgroundImage = `url(${data.goods_big_logo})`
    new Enlarge(".box");



    detail.innerHTML += data.goods_introduce

    let str3 = `<span>特惠价：</span>
    <span>￥<strong>${data.goods_price}</strong>
    </span>
<span class="afterChargePrice">充值后相当于:&nbsp;&nbsp;¥${data.sale_price}</span>`
    $('.tehuiMoney').html(str3)
        //选中颜色
    sColor(data)

    //size
    sSize(data)
}

//吸顶

window.onscroll = function() {
    //定义滚动的距离，距离顶部的距离
    if (scrollY > 1000) {
        st.style.position = "fixed";
        st.style.top = 0;
        st.style.display = 'block';
    } else {
        st.style.position = 'static';
        st.style.display = 'none';
    }
}

let goodsAdd = document.querySelectorAll('.goodsAdd p')

//选中颜色
let selColor = document.querySelectorAll('.selColor li')
selColor.forEach((a) => {
    a.onclick = function() {
        selColor.forEach((b, i) => {
            b.className = '';
        })
        this.className = 'isSelect';
        localStorage.setItem('selColor', a.title);
        goodsAdd[0].innerHTML = a.title;
    }

})

function sColor(data) {
    let SpriteColors = document.querySelectorAll('.SpriteColors');
    if (data.黑色 == '1') {
        SpriteColors[0].style.background = `url(${data.goods_small_logo}) no-repeat scroll`
        SpriteColors[0].style.backgroundSize = '100% 100%'
    } else if (data.黑色 == '0') {
        SpriteColors[0].style.display = 'none'
    }
    if (data.白色 == '1') {
        SpriteColors[1].style.background = `url(${data.img1}) no-repeat scroll`
        SpriteColors[1].style.backgroundSize = '100% 100%'
    } else if (data.白色 == '0') {
        SpriteColors[1].style.display = 'none'
    }
    if (data.红色 == '1') {
        SpriteColors[2].style.background = `url(${data.img2}) no-repeat scroll`
        SpriteColors[2].style.backgroundSize = '100% 100%'
    } else if (data.红色 == '0') {
        SpriteColors[2].parentElement.parentElement.parentElement.style.display = 'none'
    }

}

//选中size
let selSize = document.querySelectorAll('.selSize li')
selSize.forEach((a) => {
    a.onclick = function() {
        selSize.forEach((b, i) => {
            b.className = '';
        })
        this.className = 'active';
        localStorage.setItem('selSize', a.title);
        goodsAdd[1].innerHTML = "，" + a.title;
    }

})

function sSize(data) {
    let selSize = document.querySelectorAll('.selSize li');
    if (data.S == '0') {
        selSize[0].style.display = 'none'
    }
    if (data.M == '0') {
        selSize[1].style.display = 'none'
    }
    if (data.L == '0') {
        selSize[2].style.display = 'none'
    }
    if (data.XL == '0') {
        selSize[3].style.display = 'none'
    }
    if (data.XXL == '0') {
        selSize[4].style.display = 'none'
    }
    if (data.均码 == '0') {
        selSize[5].style.display = 'none'
    }
}

//侧边框的事件

let clickNum = 0;
drawerTabs.onclick = function() {
    clickNum++;
    if (clickNum % 2 != 0) {
        animation(drawerWrapper, { right: 0 })
    }
    if (clickNum % 2 == 0) {
        animation(drawerWrapper, { right: -264 })
    }
}
closeWrapper.onclick = function() {
    animation(drawerWrapper, { right: -264 })
}

//添加购物车

addCar.onclick = function() {
    let selColor = localStorage.getItem('selColor');
    let selSize = localStorage.getItem('selSize');
    let num = selectedAmount.value * 1;
    if (!selColor || !selSize) {
        danpin_xuanzeGMm.classList.add('seleSize')
        return
    } else {
        if (!user) {
            //如果cookie为空，跳到登录页面
            alert("您还没有登录，确定登录吗？")
            window.location = "../html/register.html";
            localStorage.setItem('url', '../html/details.html?id=' + goods_id);
            return
        } else {
            //如果已经登录就将id传给这个用户的表，
            setData(goods_id, user, selColor, selSize, num);

            alert('加入成功');
            window.location = window.location.href;
        }
    }
}

car.onclick = function() {
    scrollTo(0, 0)
}

//立即购买
nowbuy.onclick = function() {
    let selColor = localStorage.getItem('selColor');
    let selSize = localStorage.getItem('selSize');
    let num = selectedAmount.value * 1;
    if (!selColor || !selSize) {
        danpin_xuanzeGMm.classList.add('seleSize');
        return
    } else {
        //获取cookie值
        if (!user) { //如果cookie为空，跳到登录页面
            localStorage.setItem('url', '../html/details.html?id=' + goods_id);
            window.location = "../html/register.html";

        } else {
            //如果cookie不为空
            //重新设置cookie
            setCookie('user', user, 7 * 24 * 60 * 60);
            setData(goods_id, user, selColor, selSize, num)
                // 跳到购物车页面
            window.location = "../html/car.html";
        }
    }
}

// 将数据写入数据表
async function setData(goods_id, user, selColor, selSize, num) {
    let res1 = await pAjax({
        url: '../php/detailSet.php',
        data: {
            goods_id: goods_id,
            user: user,
            color: selColor,
            size: selSize,
            num: num
        }
    })
    res1 = JSON.parse(res1);
}


window.onload = function() {
    localStorage.removeItem('selColor');
    localStorage.removeItem('selSize');
    goodsAdd[0].innerHTML = '';
    goodsAdd[1].innerHTML = '';
    selectedAmount.value = '1';
}