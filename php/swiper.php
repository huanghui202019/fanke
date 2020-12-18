<?php

    # 链接数据路
    $con = mysqli_connect('localhost','root','123456','fanke');

    # 设置SQL语句
    $sql = "SELECT * FROM `swiper`";

    # 执行SQL语句
    $res = mysqli_query($con,$sql);

    // 判断 数据是否 获取成功
    if(!$res){
        // 当PHP代码遇到die的时候 不会在往下执行了
       die('数据库报错:' . mysqli_error($con));
    }
     // 定义一个空数组 来存放每次解析的结果
     $array = array();

     // 解析为关系形式数组
     $arr = mysqli_fetch_assoc($res);

     // 循环的解析结果出来
     while($arr){
         array_push($array,$arr);
         $arr = mysqli_fetch_assoc($res);
     };
     print_r(json_encode($array,JSON_UNESCAPED_UNICODE));

     // 关闭数据库的链接
     mysqli_close($con);

?>