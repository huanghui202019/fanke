jQuery(function($) {
    $('#head').load('../html/head.html');
});
jQuery(function($) {
    $('#foot').load('../html/foot.html');
});

//获取元素
let locationdiv = document.querySelector(".locationdiv");
let pageBox = document.querySelector('.pageBox');
let goodlist = document.querySelector('#goodlist');
let filterForm = document.querySelector('.filterForm');
let pagBot = document.querySelector('#pagBot');
//刷新清空localStorage
localStorage.clear();

//吸顶
let shuj = document.querySelector('#shuj')
window.onscroll = function() {
    shuj.className = "";

    //定义滚动的距离，距离顶部的距离

    if (scrollY > 350) {
        shuj.style.position = "fixed";
        shuj.style.top = "0";
    } else {
        shuj.style.position = "static";
    }
}


//获取localStorage
let page = localStorage.getItem('page');
if (!page) {
    page = 1
}
let local = localStorage.getItem('order');
if (!local) {
    local = 'moren';
}
let min = localStorage.getItem('jgmin') * 1;
if (!min) {
    min = 0
}
let max = localStorage.getItem('jgmax') * 1;
if (!max) {
    max = 99999999999999
}
//获取地址栏的classify值
let reg = /(?<=%27).*?(?=%27)/;
let classify = decodeURI(reg.exec(location.search));
//如果类型为all的时候是所有类型，就是把所有数据都获取
if (classify == 'all' || classify == 'null') {
    classify = '';
} else {
    classify = decodeURI(reg.exec(location.search));
    //相关内容渲染
    $('.searchKey').html(classify);
    locationdiv.innerHTML += `<span>><a>${classify}</a></span>`
}


// 分类数据
let fl = [{
    fTitle: '服装',
    tTitle: ['男装', '女装', '运动户外', '内衣', '袜', '童装']
}, {
    fTitle: '百货',
    tTitle: ['家居']
}, {
    fTitle: '鞋包',
    tTitle: ['鞋', '箱包', '服饰']
}];

let arr = [];
fl.forEach(item => {
    item.tTitle.forEach(ele => {
        var num;
        $.ajax({
            url: '../php/getList.php',
            async: false,
            data: {
                classify: ele
            },
            success: function(res) {
                res = JSON.parse(res);
                num = res.length;
                arr.push(num);
            }
        });
    })
})

ren(arr)


//渲染分类
function ren(arr) {
    let str = '';
    fl.forEach((item) => {
        str += `
    <div class="selectareali clearfix">
                    <div class="selectareaLeft">
                        <em>${item.fTitle}</em>
                    </div>
                    <div class="selectareaRight">
                        <ul>`
        if (item.tTitle.length > 0) {
            item.tTitle.forEach((ele, index) => {
                str += `<li><a href="../html/list.html?classify='${ele}'">${ele}<span class="num">()</span></a></li>`
            })
        }
        str += `</ul>
              </div>
          </div>
    `
    })
    $('.typearea').html(str);
    $('.num').each((item, index) => {
        index.innerHTML = "(" + arr[item] + ")";
    })

}
//点击刷新页面
for (var i = 0; i < 10; i++) {
    // console.log($('li')[i]);
    $('li')[i].onclick = function() {
        window.location.reload();
    }
}




//先获取相关数然后将其进行渲染
$.ajax({
    url: '../php/getList.php',
    async: true,
    data: {
        classify: classify
    },
    success: function(res) {
        res = JSON.parse(res);
        $('.searchNum').html(res.length)
            //渲染相关的尺寸
        renSize(res);
        //清空原有的样式
        $('goodlist').html('');
        //排序
        reorder(res, '#goodlist')
            //渲染第一页
        let arr2 = [];
        if (res.length >= 10) {
            for (let i = 0; i < 10; i++) {
                arr2.push(res[i]);
            }
        } else {
            for (let i = 0; i < res.length; i++) {
                arr2.push(res[i]);
            }
        }
        renGoods(arr2, '#goodlist')
            //分页
        pag(res);
        pag2(res)
    }
});



// 排序
function reorder(data, box) {
    filterForm.onclick = function() {
        let e = window.event;
        //改变样式
        //如果点击的是li标签
        if (e.target.tagName == 'LI') {
            if (e.target.children[0].children[1].className == 'upTrendBottom') {
                e.target.children[0].children[1].classList.add('active1');
                $(e.target).siblings().children().children('span').removeClass('active1');
                $(e.target).siblings().children().children('span').removeClass('active');
            } else if (e.target.children[0].children[1].className == 'BottomTrendUp') {
                e.target.children[0].children[1].classList.add('active');
                $(e.target).siblings().children().children('span').removeClass('active');
                $(e.target).siblings().children().children('span').removeClass('active1');
            }
        }

        //如果点击的是em标签
        if (e.target.tagName == 'EM') {
            if ($(e.target).siblings()[0].className == 'upTrendBottom') {
                $(e.target).siblings().addClass('active1');
                $(e.target).parent().parent().siblings().children().children('span').removeClass('active1');
                $(e.target).parent().parent().siblings().children().children('span').removeClass('active');
            } else if ($(e.target).siblings()[0].className == 'BottomTrendUp') {
                $(e.target).siblings().addClass('active');
                $(e.target).parent().parent().siblings().children().children('span').removeClass('active');
                $(e.target).parent().parent().siblings().children().children('span').removeClass('active1');
            }
        }

        //如果点击的是span标签
        if (e.target.tagName == 'SPAN') {
            if (e.target.className == 'upTrendBottom') {
                $(e.target).addClass('active1');
                $(e.target).parent().parent().siblings().children().children('span').removeClass('active1');
                $(e.target).parent().parent().siblings().children().children('span').removeClass('active');
            } else if (e.target.className == 'BottomTrendUp') {
                $(e.target).addClass('active');
                $(e.target).parent().parent().siblings().children().children('span').removeClass('active');
                $(e.target).parent().parent().siblings().children().children('span').removeClass('active1');
            }
        }

        //点击默认排序
        if (e.target.className == 'moren' || e.target.parentElement.parentElement.className == 'moren') {
            data.sort(function(a, b) {
                return a.goods_id - b.goods_id
            });

            if (localStorage.getItem('order')) {
                localStorage.removeItem('order');
            }
            localStorage.setItem('order', 'moren');
            renGoods(data, box)
        }
        //点击销量排序
        if (e.target.className == 'xiaoliang' || e.target.parentElement.parentElement.className == 'xiaoliang') {
            data.sort(function(a, b) {
                return b.cart_number - a.cart_number
            });
            if (localStorage.getItem('order')) {
                localStorage.removeItem('order');
            }
            localStorage.setItem('order', 'xiaoliang');
            renGoods(data, box)
        }
        //点击好评排序
        if (e.target.className == 'haoping' || e.target.parentElement.parentElement.className == 'haoping') {
            data.sort(function(a, b) {
                return b.assess - a.assess
            });
            if (localStorage.getItem('order')) {
                localStorage.removeItem('order');
            }
            localStorage.setItem('order', 'haoping');
            renGoods(data, box)
        }

        //点击最新排序
        if (e.target.className == 'zuixin' || e.target.parentElement.parentElement.className == 'zuixin') {
            data.sort(function(a, b) {
                return b.upd_time - a.upd_time
            });
            if (localStorage.getItem('order')) {
                localStorage.removeItem('order');
            }
            localStorage.setItem('order', 'zuixin');
            renGoods(data, box)
        }

        //点击价格升序排序
        if (e.target.className == 'shengJ' || e.target.parentElement.parentElement.className == 'shengJ') {
            e.target.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.children[1].classList.add('active');

            $(e.target).parent().parent().parent().parent().siblings().children().children('span').removeClass('active');

            $(e.target).parent().parent().parent().parent().siblings().children().children('span').removeClass('active1');

            data.sort(function(a, b) {
                return a.sale_price - b.sale_price
            });
            if (localStorage.getItem('order')) {
                localStorage.removeItem('order');
            }
            localStorage.setItem('order', 'shengJ');
            renGoods(data, box)
        }

        //价格降序
        if (e.target.className == 'jiangJ' || e.target.parentElement.parentElement.className == 'jiangJ') {
            e.target.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.children[1].classList.add('active1');

            $(e.target).parent().parent().parent().parent().siblings().children().children('span').removeClass('active');

            $(e.target).parent().parent().parent().parent().siblings().children().children('span').removeClass('active1');

            data.sort(function(a, b) {
                return b.sale_price - a.sale_price
            });
            if (localStorage.getItem('order')) {
                localStorage.removeItem('order');
            }
            localStorage.setItem('order', 'jiangJ');
            renGoods(data, box)
        }

        //合并同款
        if (e.target.className == 'hbDpBox' || e.target.parentElement.className == 'hbDpBox') {

            pAjax({
                url: '../php/hbtk.php',
                data: {
                    num: page,
                    min: min,
                    max: max,
                    classify: classify
                }
            }).then(res => {
                res = JSON.parse(res)
                console.log(res);
                // renGoods(res, box)
            })



        }


    }
}

//价格筛选请求

$('.searchbarInit input').focus(item => {
    $('.btn').css({ display: 'block ' });
    $('.searchbarFoused').css({ border: '1px solid #eee' });
})

//确定
$('#selectPrice').click(item => {
    if (!$('.minPrice').val() || !$('.maxPrice').val()) {
        alert("请输入筛选价格");
        return;
    }
    min = $('.minPrice').val();
    max = $('.maxPrice').val();

    jgData(classify, page, min, max);
    async function jgData(classify, page, min, max) {
        let res1 = await pAjax({
            url: '../php/getJGData.php',
            data: {
                classify: classify,
                min: min * 1,
                max: max * 1
            }
        })
        res1 = JSON.parse(res1);
        pag(res1);
        pag2(res1);
        $('.searchNum').html(res1.length);
        getJG(classify, page, min, max);
        async function getJG(classify, page, min, max) {
            let res2 = await pAjax({
                url: '../php/getJG.php',
                data: {
                    classify: classify,
                    num: page,
                    min: min * 1,
                    max: max * 1
                }
            });

            res2 = JSON.parse(res2);
            console.log(res2);
            // //商品
            renGoods(res2, '#goodlist');
            localStorage.setItem('jgmin', min);
            localStorage.setItem('jgmax', max);
            $('.btn').css({ display: 'none' });
            $('.searchbarFoused').css({ border: 0 });
        }
    }
})

//取消
$('#clearPrice').click(item => {
    let nr = $('.searchbarInit input').val()
    if (nr) {
        $('.searchbarInit input').val('');
        localStorage.removeItem('jgmin');
        localStorage.removeItem('jgmax');

    }
})




//渲染商品
function renGoods(data, box) {
    //判断是否有排序
    isshaix(data);
    jgsx();
    //判断是否有价格筛选
    // $('goodlist').html('');
    let str = '';
    data.forEach(item => {
        str += `
        <li class="scListArea">
                <div class="pic">
                    <a href="../html/details.html?goods_id=${item.goods_id}" title="${item.goods_name}">
                        <img class="productPhoto" alt="${item.goods_name}" src="${item.goods_big_logo}">
                    </a>
                    <div class="teshui">${item.sale_price}</div>
                </div>
                <p>
                    <a href="../html/details.html?goods_id=${item.goods_id}" title="${item.goods_name}">${item.goods_name}</a>
                </p>
                <p class="Mprice"><span class="Sprice">售价￥<strong>${item.goods_price}</strong></span></p>
                <div class="bigImg">
                    <img src="${item.goods_big_logo}">
                    <p>${item.goods_name}</p>
                    <p>产品编号：${item.goods_id}</p>
                    <div class="sj clearfix">
                        <span>售价：￥${item.sale_price}</span>
                        <div class="plun">
                            <p>暂无评论</p>
                            <p></p>
                        </div>
                    </div>
                </div>
            </li>
        `
    })
    $(box).html(str);
    renAssess(data);
    ren5();
    reorder(data, box)

}

//给第五个li的定位
function ren5() {
    let scListArea = document.querySelectorAll('.scListArea');
    let bigImg = document.querySelectorAll('.bigImg');
    scListArea.forEach((item, index) => {
        if ((index + 1) % 5 == 0) {
            bigImg[index].classList.add('more')
        }
    })
}

//渲染评论
function renAssess(data) {
    let p1 = document.querySelectorAll('.plun p:nth-of-type(1)')
    let p2 = document.querySelectorAll('.plun p:nth-of-type(2)')
        // console.log(p1);
    data.forEach((item, index) => {
        if (item.assess != 0) {

            p1[index].innerHTML = '好评率';
            p1[index].style.color = 'red';
            p2[index].innerHTML = item.assess * 100 + "%";
            p2[index].style.color = 'red';
        }
    })
}

//渲染尺寸

function renSize(data) {
    let size = document.querySelectorAll('.sizeForm li')
    let arr = [];
    data.forEach(item => {
        let obj = {};
        if (item.X == '1') {
            obj.X = 'X'
        }
        if (item.M == '1') {
            obj.M = 'M'
        }
        if (item.L == '1') {
            obj.L = 'L'
        }
        if (item.XL == '1') {
            obj.XL = 'XL'
        }
        if (item.XXL == '1') {
            obj.XXL = 'XXL'
        }
        if (item.均码 == '1') {
            obj.均码 = '均码'
        }
        arr.push(obj);
    })
    arr = noRepeat(arr);
}

//分页
//分页上
function pag(res) {
    $('.pageBox').pagination({
        totalData: res.length,
        showData: 10,
        count: 0,
        current: page,
        keepShowPN: true,
        nextContent: '下一页>',
        callback: function(api) {
            // api 得到是 pagination 的对象
            page = api.getCurrent();
            pagNum(classify, page);
            pageBox.innerHTML += `<span class="totNum">/${Math.ceil(res.length / 10)}</span>`;
            pag2(res)
        }
    });
    pageBox.innerHTML += `<span class="totNum">/${Math.ceil(res.length / 10)}</span>`;
}
//分页下
function pag2(res) {
    $('#pagBot').pagination({
        totalData: res.length,
        showData: 10,
        count: 4,
        current: page,
        keepShowPN: true,
        prevContent: '<上一页',
        nextContent: '下一页>',
        callback: function(api) {
            // api 得到是 pagination 的对象
            page = api.getCurrent();
            pagNum(classify, page);
            pagBot.innerHTML += `<span>共${Math.ceil(res.length / 10)}页</span>`;
            pag(res);
        }
    });
    pagBot.innerHTML += `<span>共${Math.ceil(res.length / 10)}页</span>`;
}

//获取分页的数据
function pagNum(classify, page) {
    $.ajax({
        url: '../php/getNumData.php',
        async: true,
        data: {
            classify: classify,
            num: page
        },
        success: function(res1) {
            res1 = JSON.parse(res1);
            console.log(res1);
            reorder(res1, '#goodlist')
                //商品
            renGoods(res1, '#goodlist');
            scrollTo({ //将滚动条置于顶部
                top: 0
            });
            //设置页码
            localStorage.setItem('page', page);
        }
    });
}

//判断是否有价格筛选
function jgsx() {
    if (min && max) {
        pAjax({
            url: '../php/getJG.php',
            data: {
                classify: classify,
                num: page,
                min: min * 1,
                max: max * 1
            }
        }).then(res => {
            res = JSON.parse(res);
            //商品
            renGoods(res, '#goodlist');
        })
        return
    }
}

//判断是否有排序
function isshaix(data) {
    local = localStorage.getItem('order')
    if (!local) {
        local = 'moren';
    }
    if (local == 'moren') {
        data.sort(function(a, b) {
            return a.goods_id - b.goods_id
        });
    } else if (local == 'xiaoliang') {
        data.sort(function(a, b) {
            return b.cart_number - a.cart_number
        });
    } else if (local == 'haoping') {
        data.sort(function(a, b) {
            return b.assess - a.assess
        });
    } else if (local == 'zuixin') {
        data.sort(function(a, b) {
            return b.upd_time - a.upd_time
        });
    } else if (local == 'shengJ') {
        data.sort(function(a, b) {
            return a.sale_price - b.sale_price
        });
    } else if (local == 'jiangJ') {
        data.sort(function(a, b) {
            return b.sale_price - a.sale_price
        });
    }
}