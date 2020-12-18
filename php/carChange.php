<?php
# 链接数据库
$con=mysqli_connect("localhost","root","123456","fanke");
$goods_id=$_GET['goods_id'];
$user=$_GET['user'];
$goods_num = $_GET['goods_num'];
$cart_color=$_GET['cart_color'];
$cart_size=$_GET['cart_size'];

$sql = "UPDATE `usertab` SET `num` = '$goods_num' WHERE `goods_id` = '$goods_id' AND `user` = '$user' AND `color` = '$cart_color' AND `size` = '$cart_size'";
$res = mysqli_query($con,$sql);

    if(!$res){
        echo json_encode(array("code"=>0,"msg"=>"修改数据失败"));
    }else{
        echo json_encode(array("code"=>1,"msg"=>"修改数据成功"));
    }
?>
