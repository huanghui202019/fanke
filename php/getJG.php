<?php
//链接数据库
$con=mysqli_connect("localhost","root","123456","fanke");

$classify=$_GET['classify'];
// 分页获取数据 LIMIT num,length 
// num 就是从第几个数据开始获取，（第几页-1）*每页数据
$num = ($_GET['num']-1)*10;
$min=$_GET['min']*1;
$max=$_GET['max']*1;

//筛选从第num开始的20条数据
$sql = "SELECT * FROM `goods` WHERE `sale_price` BETWEEN $min AND $max AND `cat_id` LIKE '%$classify%' OR `goods_name` LIKE '%$classify%' AND `sale_price` BETWEEN $min AND $max LIMIT $num,10";

//执行
$res = mysqli_query($con,$sql);  

$arr = array();
//解析
$row = mysqli_fetch_assoc($res);

//循环解析数据放到一个数组里
while($row){
    array_push($arr,$row);
    $row = mysqli_fetch_assoc($res);
}
//将数组输出
print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));
?>