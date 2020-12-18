//获取元素
let car = document.querySelector('#car');
let carCon = document.querySelector('#carCon');

//获取登录的用户名
let user = getCookie('user');


//如果用户名为空，跳到登录页面，并记录跳过去的地址
if (!user) {
    window.location = "../html/register.html";
    localStorage.setItem('url', '../html/car.html');
}


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







//修改num
function numCahnge(ele) {
    let id = ele.getAttribute('goods_id');
    //获取本地数据
    let data = JSON.parse(localStorage.getItem('goodsList'));
    //data是数组，获取对象，num是对象的cart_number
    let obj = data.filter(item => {
        return item.goods_id == id
    })[0];
    //获取num值
    num = obj.cart_number * 1;
    if (ele.classList.contains('add')) {
        // 如果是加法商品数量增加
        num++;
    } else if (ele.classList.contains('reduce')) {
        //如果是减法，判断num是否大一1，大于1就--，否则就等于1
        num <= 1 ? num = 1 : num--
    }
    //获取数据库数据，修改用户表里的num数据
    pAjax({
        url: '../php/carChange.php',
        data: {
            goods_id: id,
            user: login,
            goods_num: num
        }
    }).then(res => {
        res = JSON.parse(res);
        if (res.code == 1) {
            //如果数据库数据修改成功，修改本地数据
            obj.cart_number = num;
            localStorage.setItem('goodsList', JSON.stringify(data));
            render(data);
        }
    })
}

//事件委托
carCon.onclick = function() {
    let e = window.event;

    //全选
    if (e.target.className == 'allCkbBt') {
        //获取本地存储数据，选中状态改变本地数据，不能直接改数据库数据
        let data = JSON.parse(localStorage.getItem('goodsList'));
        data.forEach(item => {
            //如果单选按钮状态与全选相同
            e.target.checked ? item.is_select = 1 : item.is_select = 0
        });
        //将改变的数据存入本地
        localStorage.setItem('goodsList', JSON.stringify(data));
        // //重新渲染数据
        renCar(data);
    }

    //单选
    if (e.target.className == "ckb") {
        //获取选中的这行的goods_id
        let id = e.target.getAttribute('goods_id');
        let cart_color = e.target.getAttribute('cart_color');
        let cart_size = e.target.getAttribute('cart_size');
        //改变本地数据
        let data = JSON.parse(localStorage.getItem('goodsList'));
        data.forEach(item => {
                //通过id将其的is_select值改为1或者0
                if (item.goods_id == id && item.cart_color == cart_color && item.cart_size == cart_size) {
                    item.is_select = e.target.checked ? 1 : 0;
                }
            })
            // 需要把 修改后的数据存储本地存储中
        localStorage.setItem('goodsList', JSON.stringify(data));
        renCar(data);


        // isSel(data)
    }

    //删除
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
        delGoods(id, cart_color, cart_size)
    }

    //加（修改商品数量）
    if (e.target.className == 'increase') {
        changeNum(e.target);
    }

    //减
    if (e.target.className == 'decrease') {
        changeNum(e.target);
    }

    //结算
    if (e.target.className == 'checkout') {
        let data = JSON.parse(localStorage.getItem('goodsList'));
        let res = data.filter(item => {
            return item.is_select == 1
        })
        res.forEach(function(item) {
            //获取这行的id值
            let id = item.goods_id;
            let cart_color = item.cart_color;
            let cart_size = item.cart_size;
            delGoods(id, cart_color, cart_size);
        })
    }

    // 删除选中商品
    if (e.target.className == 'batchDelCart') {
        let data = JSON.parse(localStorage.getItem('goodsList'));
        let res = data.filter(item => {
            return item.is_select == 1
        })
        res.forEach(function(item) {
            //获取这行的id值
            let id = item.goods_id;
            let cart_color = item.cart_color;
            let cart_size = item.cart_size;
            delGoods(id, cart_color, cart_size);
        })
    }
}

//修改数量
function changeNum(ele) {
    let id = ele.getAttribute('goods_id');
    let cart_color = ele.getAttribute('cart_color');
    let cart_size = ele.getAttribute('cart_size');
    //获取本地数据
    let data = JSON.parse(localStorage.getItem('goodsList'));

    //data是数组，获取对象，num是对象的cart_number
    let obj = data.filter(item => {
        return (item.goods_id == id && item.cart_color == cart_color && item.cart_size == cart_size)
    })[0];
    //获取num值
    num = obj.cart_number * 1;

    if (ele.className == 'increase') {
        // 如果是加法商品数量增加
        num++;
    } else if (ele.className == 'decrease') {
        //如果是减法，判断num是否大一1，大于1就--，否则就等于1
        num <= 1 ? num = 1 : num--
    }
    //获取数据库数据，修改用户表里的num数据
    pAjax({
        url: '../php/carChange.php',
        data: {
            goods_id: id,
            user: user,
            goods_num: num,
            cart_color: cart_color,
            cart_size: cart_size
        }
    }).then(res => {
        res = JSON.parse(res);

        if (res.code == 1) {
            //如果数据库数据修改成功，修改本地数据
            obj.cart_number = num;
            localStorage.setItem('goodsList', JSON.stringify(data));
            renCar(data);
        }
    })
}

//删除数据（用户表和本地数据）
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
    }).then(res => {
        console.log(res);
        res = JSON.parse(res);
        if (res.code == 1) {
            // 删除本地存储中对应的数据
            // 先获取本地存储中的数据
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





//渲染数据
function renCar(data) {
    if (data.length == 0) {
        $('#cartEmpty').css({ display: 'block' });
        $('#car').css({ display: 'none' });
        return;
    }
    $('#cartEmpty').css({ display: 'none' });
    $('#car').css({ display: 'block' });

    // 定义选中时将is_select值改为1（选中状态）
    let allChecked = data.every(item => {
        return item.is_select == 1;
    });

    //获取选中商品数量与价格
    let total = goodsNum(data);


    let str = '';
    str = `<table>
        <thead>
            <th>
                &nbsp;
            </th>
            <th class="barTitle ">
                <input type="checkbox" class="allCkbBt" ${allChecked?'checked' :''}>
                <label>全选</label>
            </th>
            <th class="image">
                &nbsp;
            </th>
            <th class="name">
                商品名称
            </th>
            <th class="size">
                尺寸
            </th>
            <th class="price">
                单价
            </th>
            <th class="qty">
                数量
            </th>
            <th class="discount">
                优惠
            </th>
            <th class="subtotal">
                小计
            </th>
            <th class="operate ">
                操作
            </th>

        </thead>
        <tbody id="supplierGeneralTb">
        <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>`

    data.forEach((item, index) => {

        str += `
            <tr index='${index+1}'>
                <td class="white bd-left">
                    &nbsp;
                </td>
                <td class="bar" rowspan="1">
                    <input type="checkbox" class="ckb"${item.is_select==1 ?'checked':''} goods_id="${item.goods_id}" cart_color="${item.cart_color}"
                    cart_size="${item.cart_size}">
                </td>
                <td class="image" rowspan="1">
                    <a target="../html/details.html?goods_id=${item.goods_id} ">
                        <img alt="${item.goods_name}" src="${item.goods_small_logo}">
                    </a>
                </td>
                    <td class="name">
                        <a href="../html/details.html?goods_id=${item.goods_id}" title="${item.goods_name}">${item.goods_name}
                        </a>
                    </td>
                    <td class="size">
                        <a title="L">${item.cart_size}</a>
                    </td>
                    <td class="price">￥${item.goods_price}</td>
                    <td class="qty">
                        <button class="decrease" goods_id='${item.goods_id}'cart_color='${item.cart_color}'
                        cart_size='${item.cart_size}'>-</button>
                        <input name="qty" type="text" class="modifyProductQty" value="${item.cart_number}" maxlength="3">
                        <button class="increase" goods_id='${item.goods_id}'cart_color='${item.cart_color}'
                        cart_size='${item.cart_size}'>+</button>
                    </td>
                    <td class="sub">-<span class="sub">${((item.goods_price-item.sale_price)*item.cart_number).toFixed(2)}</span></td>
                    <td class="subtotal">￥<span class="old">${(item.goods_price*item.cart_number).toFixed(2)}</span><span class="new">${(item.sale_price*item.cart_number).toFixed(2)}</span></td>
                    <td class="operate">
                        <a href="javascript:" class="del" goods_id=${item.goods_id} cart_color=${item.cart_color}
                        cart_size=${item.cart_size}>删除</a>
                    </td>
                </tr> 
            `
    });

    str += `
    <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
</tr>
</tbody>
    </table>
    <div id="barSummary" class="barSummary clearfix">
        <div class="bar">
        <input id="allCkbBt" type="checkbox" class="allCkbBt" ${allChecked?'checked' :''}>
        <label>全选</label>
            <a href="#" class="batchDelCart">删除</a>
            <span>数量总计：<em>${total.totalNum}</em>件</span>
            <span>
                <em>您目前可享受全场购物免运费</em>
            </span>
        </div>
        <div class="suball">活动优惠：<a href='javascript:'>-￥${total.totaloldPrice.toFixed(2)}<a></div>
        <div class="summary">产品金额总计(不含运费)：
            <span class="amount">￥<em>${total.totalPrice.toFixed(2)}</em></span>
            <a href="#">点击领取优惠券</a>
        </div>
        <div class="btnPanel">
            <a href="../html/list.html" class="goBuy">
            &lt;&lt;继续购物</a>
            <a class="checkout" href="#">去结算&gt;&gt;</a>
        </div>
    </div>
    `
    carCon.innerHTML = str;

    let sele = document.querySelectorAll('.ckb');
    let suball = document.querySelector('.suball')
    sele.forEach(item => {
        if (item.checked == true) {
            item.parentElement.parentElement.className = 'selected';
            $(item).parent().siblings('.sub').children('span').css({ display: 'inline' });
            $(item).parent().siblings('.subtotal').children('.old').css({ display: 'none' });
            $(item).parent().siblings('.subtotal').children('.new').css({ display: 'inline' });
            suball.style.display = "block";
        }
    })

    let allCkbBt = document.querySelectorAll('.allCkbBt')
}

//计算选中商品数量与价格
function goodsNum(goods) {
    //筛选选中的
    let res = goods.filter(item => {
        return item.is_select == 1;
    });

    // 计算选中商品的数量
    let totalNum = res.reduce((pre, item) => {
        return pre + item.cart_number * 1
    }, 0);

    // 计算选中商品的总价格
    let totalPrice = res.reduce((pre, item) => {
        return pre + item.sale_price * item.cart_number
    }, 0);

    // 计算选中商品的原价总价格
    let totaloldPrice = res.reduce((pre, item) => {
        return pre + (item.goods_price - item.sale_price) * item.cart_number
    }, 0);
    return {
        totalNum,
        totalPrice,
        totaloldPrice
    }
}

$('.register').click(item => {
    let url = window.location.href;
    localStorage.setItem('url', url);
    location.href = "../html/register.html";
})