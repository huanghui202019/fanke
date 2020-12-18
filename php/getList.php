<?php
# 链接数据库
$con=mysqli_connect("localhost","root","123456","fanke");

$classify=$_GET['classify'];
$sql="SELECT * FROM `goods` WHERE `cat_id` LIKE '%$classify%' OR `goods_name` LIKE '%$classify%'";
#执行SQL语句判断
$res=mysqli_query($con,$sql);

// 判断 数据是否 获取成功
if(!$res){
    // 当PHP代码遇到die的时候 不会在往下执行了
   die('数据库报错:' . mysqli_error($con));
}
 // 定义一个空数组 来存放每次解析的结果
 $array = array();

#解析第一条数据看是否存在
$row=mysqli_fetch_assoc($res);
// 循环的解析结果出来
while($row){
    array_push($array,$row);
    $row=mysqli_fetch_assoc($res);
};
print_r(json_encode($array,JSON_UNESCAPED_UNICODE));
// print_r($array)
// 关闭数据库的链接
mysqli_close($con);
?>