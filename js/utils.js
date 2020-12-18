/* 
    js工具库：封装一些比较常用的函数
*/


// 计算任意参数之和
function sum() {
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    // 把结果返回出去
    return sum;
}

// 计算任意参数的平均值
function average() {
    var sum = 0;
    var average;
    for (var i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    average = sum / arguments.length;
    // 把结果返回出去
    return average;
}

//计算最大值
function getMax() {
    // 假设第一个为最大值
    var max = arguments[0];
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] > max) {
            max = arguments[i]
        }
    }
    return max;
}

//计算最小值
function getMin() {
    // 假设第一个为最小值
    var min = arguments[0];
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] < min) {
            min = arguments[i]
        }
    }
    return min;
}

// 封装一个函数，求 n-m之间随机整数
function randomNumber(n, m) {
    if (n > m) {
        return parseInt(Math.random() * (n - m + 1) + m)
    } else {
        return parseInt(Math.random() * (m - n + 1) + n)
    }
}


// 封装一个随机颜色函数
function randomColor() {
    return "rgb(" + randomNumber(0, 255) + "," + randomNumber(0, 255) + "," + randomNumber(0, 255) + ")";
}

// 封装一个函数 把url的参数转化为 对象
function changeObj(str) {
    var arr = str.split("&");
    var obj = {}; //定义一个空对象用
    arr.forEach(function(item) {
        var newArr = item.split("=");
        obj[newArr[0]] = newArr[1];
    });
    return obj
}


// 封装一个时间格式的函数 2020-11-07  15:30:32  星期六 格式的时间
function formatTime(date, fuhao) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    var day = date.getDate();
    // 如果 日期是 10号之后的 直接写本身，如果日期小于 10 的是，需要在日期前面 +0
    day = day >= 10 ? day : "0" + day;
    var hours = date.getHours();
    hours = hours >= 10 ? hours : "0" + hours;
    var min = date.getMinutes();
    min = min >= 10 ? min : "0" + min;
    var sec = date.getSeconds();
    sec = sec >= 10 ? sec : "0" + sec;
    var week = date.getDay(); //返回值的是 数字

    var arr = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    week = arr[week];

    fuhao = fuhao ? fuhao : "/";
    // 如果不传递符号这个参数的时候  ，需要做一个处理
    return `${year}${fuhao}${month}${fuhao}${day}  ${hours}:${min}:${sec}  ${week}`
}


// 封装一个计算两个时间差的函数
function timeDifference(date1, date2) {
    // 先算两个时间对象到格林威治时间的时间差
    var time1 = date1.getTime();
    var time2 = date2.getTime();

    // 两个时间的时间差的时间戳
    var time = Math.abs(time1 - time2);

    // 计算两个时间差的天数
    var day = parseInt(time / 1000 / 60 / 60 / 24);
    day = day >= 10 ? day : "0" + day;
    // 计算小时 
    // var hours = time / 1000 / 60 / 60 / 24 - day;
    var hours = parseInt((time / 1000 / 60 / 60) % 24);

    hours = hours >= 10 ? hours : "0" + hours;
    // 计算 分钟
    var min = parseInt((time / 1000 / 60) % 60);
    min = min >= 10 ? min : "0" + min;
    // 计算秒数
    var sec = parseInt(time / 1000 % 60);
    sec = sec >= 10 ? sec : "0" + sec;
    // 昨天2020年 11月 8号 12:10:20
    // 今天2020年 11月 9号 13:10:10
    // 1天 0小时 59分50秒

    // 把计算的day hours min sec 当成函数的返回值
    var obj = {
        day: day,
        hours: hours,
        min: min,
        sec: sec
    }
    return obj;
    console.log(`两个时间相差${day}天${hours}小时${min}分${sec}秒`);
}

// 封装一个事件监听的函数
// 事件源ele，事件类型type, 事件处理函数callback 可变
function addEvent(ele, type, callback) {
    // 判断 如果ele.addEventListener 存在 就用 addEventListener 绑定事件
    if (ele.addEventListener) {
        ele.addEventListener(type, callback)
    } else {
        ele.attachEvent("on" + type, callback);
    }
}


// 获取样式的函数
function getStyle(ele, attr) {
    var style;
    if (window.getComputedStyle) {
        style = window.getComputedStyle(ele)[attr];
    } else {
        style = ele.currentStyle[attr];
    }
    return style;
}

//封装一个动画的函数
function animation(ele, obj, callback) {
    // 记录定定时器的个数
    let timerLen = 0;
    for (let key in obj) {
        // 每for循环一次 timerLen 加一
        timerLen++;

        let attr = key; //属性
        let target = obj[key]; //属性值

        // 获取元素的当前值
        let style;
        let speed; //运动速度

        // 开启这次定时器之前 先清空定时器
        clearInterval(ele[attr]);

        // 定义一个定时器 来执行动画
        // 把定时器当成元素的属性存储起来
        // attr = width ele[attr] = ele.width
        // ele.height
        ele[attr] = setInterval(() => {
            // 每执行一次定时器的时候就需要获取元素的最新的当前值
            // opacity 的取值为 0-1 ===》0-100
            if (attr == "opacity") {
                // 不能取整， 因为透明度没有单位 而且透明度的取整为0-1 有小数
                style = getStyle(ele, attr) * 100;
            } else {
                style = parseInt(getStyle(ele, attr));
            }
            speed = (target - style) / 10;
            //Math.ceil向上取整
            // Math.floor向下取整
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            style += speed;
            if (target == style) {
                clearInterval(ele[attr]);
                // 没结束一个定时器，就让timerLen - 1
                timerLen--;
                // 如果在这个位置 去写动画结束 执行的代码，会执行多次，有几个定时就会执行几次
                //    ele.style.backgroundColor = "green";
            }

            // 如果属性为透明度的时候 ，样式是不需要单位的
            if (attr == "opacity") {
                // 因为上面获取的时候 *100
                ele.style[attr] = style / 100;
            } else {
                ele.style[attr] = style + 'px';
            }

            // 当timerLen = 0的时候说明所有动画都结束
            if (timerLen == 0) {
                //  当有callback的时候那么就执行callback
                // 如果没有callback 就不用 当callback没有传递参数的时候，callback = undefined
                callback && callback();
            }
        }, 30)
    }
}



//封装一个数组去重的函数
function noRepeat(oldArr) {
    var newArr = [];
    // 循环旧数组，取出数组中的每一个数据
    oldArr.forEach(function(item) {
        // 取出旧数组中的数据存入新数组
        // 存入新数组的时候需要一个条件，如果新数组中存在这个数据了，，那么久不需要存入
        // 如果不存储在的时候才会存入
        // 判断数组中是否存在某一个数据 newArr.indexOf(1)
        if (newArr.indexOf(item) == -1) {
            // 如果执行这里的d代码，表示该数据在新数组中不存在
            newArr.push(item)
        }
    })
    return newArr;
}

//封装一个利用js让元素居中的函数
function eleCenter(ele) {
    window.onresize = function() {
        ele.style.left = (innerWidth - ele.offsetWidth) / 2 + "px";
        ele.style.top = (innerHeight - ele.offsetHeight) / 2 + 'px';
    }
}

//封装拖拽
class Drag {
    constructor(ele) {
            this.ele = document.querySelector(ele);
            this.init();
        }
        //初始化
    init() {
            // 鼠标按下时候实现拖拽效果
            this.ele.onmousedown = () => {
                this.down();
            };
            // 鼠标抬起 停止拖拽
            document.onmouseup = this.up;
        }
        //鼠标按下
    down() {
            let e = window.event;
            let x = e.offsetX;
            let y = e.offsetY;
            document.onmousemove = () => {
                this.move(x, y);
            }
        }
        // 移动
    move(x, y) {
            let event = window.event;
            let left = event.clientX - x;
            let top = event.clientY - y;
            let wi = parseInt(getStyle(this.ele, "width"));
            let hei = parseInt(getStyle(this.ele, "height"));
            //判断边界值
            if (left <= 0) {
                left = 0;
            }
            if (top <= 0) {
                top = 0;
            }
            if (left >= window.innerWidth - wi) {
                left = window.innerWidth - wi;
            }
            if (top >= window.innerHeight - hei) {
                top = window.innerHeight - hei;
            }
            this.ele.style.left = left + 'px';
            this.ele.style.top = top + 'px';
        }
        // 鼠标抬起
    up() {
        document.onmousemove = null;
    }
}

//封装一个验证码函数
class GVerify {
    constructor(options) {
        this.options = {
            id: options.id,
            canvasId: options.canvasId || "verifyCanvas", // canvas的ID
            width: options.width || "100", // 默认canvas宽度
            height: options.height || "30", // 默认canvas高度
            type: options.type || "blend", // 图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母

            // length 验证码的长度，默认为4位数的验证码
            length: options.length || 4,
            code: "",
            numArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        };
        this.options.letterArr = this.getAllLetter();
        this.init();
        this.refresh();

    }
    init() {
            var con = document.getElementById(this.options.id);
            var canvas = document.createElement("canvas");
            // 如果元素有宽度p的元素有宽高就使用宽高，没有就使用传进来的宽高
            this.options.width = con.offsetWidth > 0 ? con.offsetWidth : this.options.width;
            this.options.height = con.offsetHeight > 0 ? con.offsetHeight : this.options.height;

            canvas.id = this.options.canvasId;
            canvas.width = this.options.width;
            canvas.height = this.options.height;
            canvas.style.cursor = "pointer";
            canvas.innerHTML = "您的浏览器版本不支持canvas";
            con.appendChild(canvas);
            canvas.onclick = () => {
                this.refresh();
            }
        }
        /** 生成验证码* */
    refresh() {
            this.options.code = "";
            var canvas = document.getElementById(this.options.canvasId);
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
            } else {
                return;
            }

            ctx.textBaseline = "middle";

            ctx.fillStyle = this.randomColor(180, 240);
            ctx.fillRect(0, 0, this.options.width, this.options.height);

            if (this.options.type == "blend") { // 判断验证码类型
                var txtArr = this.options.numArr.concat(this.options.letterArr);
            } else if (this.options.type == "number") {
                var txtArr = this.options.numArr;
            } else {
                var txtArr = this.options.letterArr;
            }

            for (var i = 1; i <= this.options.length; i++) {
                var txt = txtArr[this.randomNum(0, txtArr.length)];
                this.options.code += txt;
                ctx.font = this.randomNum(this.options.height / 2, this.options.height) + 'px SimHei'; // 随机生成字体大小
                ctx.fillStyle = this.randomColor(50, 160); // 随机生成字体颜色
                ctx.shadowOffsetX = this.randomNum(-3, 3);
                ctx.shadowOffsetY = this.randomNum(-3, 3);
                ctx.shadowBlur = this.randomNum(-3, 3);
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                var x = this.options.width / (this.options.length + 1) * i;
                // i = 1  100 / 5*1 = 20
                // i = 2  100 / 5*2 = 40
                // i = 3  100 / 5*3 = 60
                // i = 4  100 / 5*4 = 80
                // i = 5  100 / 5*5 = 100
                var y = this.options.height / 2;
                var deg = this.randomNum(-30, 30);
                /** 设置坐标原点 位移 设置字母之间的距离* */
                ctx.translate(x, y);
                ctx.rotate(deg * Math.PI / 180);
                ctx.fillText(txt, 0, 0);
                /** 恢复旋转角度和坐标原点* */
                ctx.rotate(-deg * Math.PI / 180);
                ctx.translate(-x, -y);
            }
            /** 绘制干扰线* */
            for (var i = 0; i < this.options.length; i++) {
                ctx.strokeStyle = this.randomColor(40, 180);
                ctx.beginPath();
                ctx.moveTo(this.randomNum(0, this.options.width), this.randomNum(0, this.options.height));
                ctx.lineTo(this.randomNum(0, this.options.width), this.randomNum(0, this.options.height));
                ctx.stroke();
            }
            /** 绘制干扰点* */
            for (var i = 0; i < this.options.width / this.options.length; i++) {
                ctx.fillStyle = this.randomColor(0, 255);
                ctx.beginPath();
                ctx.arc(this.randomNum(0, this.options.width), this.randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
        /** 验证验证码* */
    validate(code) {
        var code = code.toLowerCase();
        var v_code = this.options.code.toLowerCase();
        if (code == v_code) {
            return true;
        } else {
            return false;
        }
    }
    getAllLetter() {
        var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        return letterStr.split(",");
    }
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    randomColor(min, max) {
        var r = this.randomNum(min, max);
        var g = this.randomNum(min, max);
        var b = this.randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

}

//封装一个放大镜函数
class Enlarge {
    constructor(ele) {
        this.ele = document.querySelector(ele);
        this.show = this.ele.querySelector(".show");
        this.showImg = this.show.querySelector("img");
        this.mask = this.show.querySelector(".mask");

        this.btn = this.ele.querySelectorAll(".list p");
        this.enlarge = this.ele.querySelector(".enlarge");

        this.init();
    }

    init() {
        // 如果不想使用箭头函数 ，那么可以在这个位置用一个变量把this存起来
        // let _this = this;
        this.show.onmouseover = () => {
            // _this.setStyle()
            this.mask.style.display = this.enlarge.style.display = 'block';
            this.setStyle();
        }

        this.show.onmouseout = () => {
            this.mask.style.display = this.enlarge.style.display = 'none';
        }

        this.show.onmousemove = () => {
                this.maskMove();
            }
            // 循环的给btn元素绑定点击事件
        this.btn.forEach((item, index) => {
            item.onclick = () => {
                let e = window.event;

                // item就是当前点击的元素
                this.changeImage(item, e.target)
            }
        })
    }

    setStyle() {
        /* 
            【1】放大镜的盒子的大小需要动态设置的，根据show盒子 show中mask遮罩层 和 放大镜的背景图来决定
                show       放大镜的背景图
                ----- === -----------------
                mask        放大镜盒子的宽度

            因为mask 和放大镜都是隐藏的，隐藏的时候是获取不到元素的宽高
            必须在鼠标滑过show盒子的时候显示mask和放大镜的时候在调用setStyle
        */
        this.showWidth = this.show.offsetWidth;
        this.showHeight = this.show.offsetHeight;

        this.maskWidth = this.mask.offsetWidth;
        this.maskHeight = this.mask.offsetHeight;

        let style = getStyle(this.enlarge, 'backgroundSize');
        // style = 750px 1000px
        // 获取背景图的宽高
        this.styleX = parseInt(style.split(" ")[0]);
        this.styleY = parseInt(style.split(" ")[1]);

        this.enlargeWidth = this.maskWidth * this.styleX / this.showWidth;
        this.enlargeHeight = this.maskHeight * this.styleY / this.showHeight;

        // 设置放大镜盒子的宽高
        this.enlarge.style.width = this.enlargeWidth + 'px';
        this.enlarge.style.height = this.enlargeHeight + 'px';

    }

    maskMove() {
        let e = window.event;
        // 求光标在show盒子中left 和 top值

        // 求鼠标在页面中 x 和 y  pageX pageY
        // 求大盒子的左边和上边的距离（偏移量） offsetLeft offsetTop
        let x = e.pageX - this.ele.offsetLeft;
        let y = e.pageY - this.ele.offsetTop;
        let left = x - this.maskWidth / 2;
        let top = y - this.maskHeight / 2;

        // 边界值的判断
        if (left <= 0) {
            left = 0
        }
        if (top <= 0) {
            top = 0;
        }
        if (left >= this.showWidth - this.maskWidth) {
            left = this.showWidth - this.maskWidth
        }
        if (top >= this.showHeight - this.maskHeight) {
            top = this.showHeight - this.maskHeight
        }

        this.mask.style.left = left + 'px';
        this.mask.style.top = top + 'px';

        //放大镜的背景图也跟着移动
        this.enlargeMove(left, top)
    }

    enlargeMove(x, y) {
        /* 
            mask在show盒子移动的距离      背景图移动的距离
            -----------------------  =  ------------------
               show盒子的宽度             背景图的宽度
            
           背景图移动X = x *背景图的宽度 / show盒子宽度
           背景图移动Y = y *背景图的高度 / show盒子高度

            背景图移动X = x *this.enlargeWidth / this.showWidth
            背景图移动Y = y *this.enlargeHeight / this.showHeight

            背景图的定位 background-position:x y
        */
        let bgX = x * this.styleX / this.showWidth;
        let bgY = y * this.styleY / this.showHeight;

        this.enlarge.style.backgroundPosition = `${-bgX}px ${-bgY}px`;

    }

    changeImage(curItem, target) {
        this.btn.forEach(item => {
            item.classList.remove('active')
        });
        // curItem 绑定点击事件的这元素
        curItem.classList.add('active');

        // target就是当前点击的这个元素
        let midelImg = target.getAttribute('midelimg');
        this.showImg.src = midelImg;

        let bigImg = target.getAttribute('bigimg');
        this.enlarge.style.backgroundImage = `url(${bigImg})`;
    }
}


/* 
    设置cookie，删除，修改
    如果cookie中没有key就添加，如果有这个可以 就是修改
    删除，直接设置cookie的过期时间为负数
*/
function setCookie(key, value, expires) { //属性、属性值、过期时间
    // 当没有传递过期时间的时候，那么默认为会话时间，不设置 expires=${date}
    if (expires) {
        //获取当前时间
        let date = new Date();

        //过期时间为0时区的时间，为当前时间减去8小时
        let time = date.getTime() - 8 * 60 * 60 * 1000 + expires * 1000; //过期时间为秒

        date.setTime(time); //把date设置为时间戳为time的时间对象

        document.cookie = `${key}=${value};expires=${date}`;
        return
    }
    document.cookie = `${key}=${value}`;
}


//获取cookie，需要传递一个参数，为key

function getCookie(key) {
    //获取所有cookie
    let cookie = document.cookie;
    // a=1;b=2;c=3;
    // 先把字符串分割为数组，然后再把数组转化为对象
    let arr = cookie.split("; ");
    //将数组转成对象
    let obj = {};
    arr.forEach((item) => {
        let newArr = item.split("=");
        obj[newArr[0]] = newArr[1];
    });
    return obj[key]
}

//封装Ajax
function ajax(option) {
    // 【1】判断url是否传递参数
    if (!option.url) {
        // 手动抛出一个错误，
        throw new Error('url的参数时必填的');
    }


    // 设置默认值
    let defOption = {
        type: 'get',
        async: true
    }

    // 把传递过去来的参数写入默认值当中
    for (let key in option) {
        defOption[key] = option[key]
    }

    //【1】如果传递的type不是 get 或者post的时候，抛出错误提示使用者，type的值只能为get 或者 post
    if (!(defOption.type == 'get' || defOption.type == 'post')) {
        throw new Error('type参数只能为get 或者 post');
    }

    // 【3】判断async 是否布尔值
    // console.log(Object.prototype.toString.call(defOption.async));
    if (Object.prototype.toString.call(defOption.async) != '[object Boolean]') {
        throw new Error('async 的值只能为布尔值');
    }

    if (defOption.data) {
        // 【4】判断参数 data 是否是对象 和字符串的数据类型
        let dataType = Object.prototype.toString.call(defOption.data);
        if (!(dataType == '[object String]' || dataType == '[object Object]')) {
            throw new Error('data的格式只能为key=value&key=value 或者 {key:value}');
        }

        // 判断data参数是否 是对象，如果是对象需要把参数处理为 key=value&key=value
        if (dataType == '[object Object]') {
            let str = '';
            for (let key in defOption.data) {
                str += key + '=' + defOption.data[key] + '&';
            }
            defOption.data = str.substr(0, str.length - 1);
        }
        // 当参数为字符串的时候，判断是否有=号
        if (dataType == '[object String]' && !defOption.data.includes('=')) {
            throw new Error('data格式只能为key=value')
        }
    }


    // 【5】判断callback回调函数 
    if (!defOption.success) {
        throw new Error('success是必须存在的参数')
    }

    // 判断callback 是否是函数
    if (Object.prototype.toString.call(defOption.success) != '[object Function]') {
        throw new Error('success必须是函数')
    }

    // try  catch
    // try 尝试执行 try代码，如果try中灭有错误的时候不执行catch方法中代码
    // try 有逻辑错误的时候 就会执行 catch中代码
    try {
        let xhr = new XMLHttpRequest();
        // 判断请求的是类型 来写请求携带参数
        if (defOption.type == 'get') {
            xhr.open(defOption.type, defOption.url + (defOption.data ? '?' + defOption.data : ''), defOption.async);
            xhr.send()
        } else if (defOption.type == 'post') {
            xhr.open(defOption.type, defOption.url, defOption.async);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(defOption.data);
        }

        // 判断请求异步还是同步
        if (defOption.async) {
            xhr.onload = function() {
                defOption.success(xhr.responseText);
            }
        } else {
            defOption.success(JSON.parse(xhr.responseText));
        }
    } catch (err) {
        defOption.error(err)
    }
}

//封装promiseAjax
function pAjax(params) {
    return new Promise(function(resolve, reject) {
        ajax({
            url: params.url,
            data: params.data,
            type: params.type || 'get',
            async: params.async || true,
            success: function(res) {
                resolve(res);
            },
            // error当执行请求数据出错的时候执行方法
            error: function(res) {
                reject(res)
            }
        })
    });
}