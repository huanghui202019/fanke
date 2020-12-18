<?php
# 链接数据库
$con=mysqli_connect("localhost","root","123456","fanke");
$user=$_GET['user'];
$goods_id=$_GET['goods_id'];
$cart_color=$_GET['cart_color'];
$cart_size=$_GET['cart_size'];

#删除数据
$sql="DELETE FROM `usertab` WHERE `goods_id` = '$goods_id' AND `user`='$user' AND `color` = '$cart_color' AND  `size` = '$cart_size' ";
$res= mysqli_query($con,$sql); 

if(!$res){
    die("数据库出错".mysqli_error($con));
}  
if($res){
    $arr=array("code"=>1,"msg"=>"数据删除成功");
    print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));
}
?>