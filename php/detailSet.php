<?php
# 链接数据库
$con=mysqli_connect("localhost","root","123456","fanke");
$color=$_GET['color'];
$size=$_GET['size'];
$num=$_GET['num'];
$goods_id= $_GET['goods_id'];
$user=$_GET['user'];

#通过id和用户名查询这个id的物品
$sql = "SELECT * FROM `usertab` WHERE `user`='$user' AND `goods_id`='$goods_id' AND `color`='$color' AND`size`='$size'";
    
$res = mysqli_query($con,$sql); 

if(!$res){
    die('error for mysql' . mysqli_error());
}

$row = mysqli_fetch_assoc($res);

//  # 如果购物车表中存在该条数据，让这个条数据中的goods_num 值加 1
if($row){
$num = $row['num']+$num;
   $res2= mysqli_query($con,"UPDATE `usertab` SET `num` = '$num' WHERE `user`='$user' AND `goods_id`='$goods_id' AND `color`='$color' AND`size`='$size'");
}else{
    # 如果不存在，就往car表中 添加数据
    $res2= mysqli_query($con,"INSERT INTO `usertab` (`goods_id`, `user`, `color`,`size`,`num`) VALUES ('$goods_id', '$user','$color','$size', '$num')");
}
if($res2){
    echo json_encode(array("code"=>1,"msg"=>"添加数据成功"));
}


?>