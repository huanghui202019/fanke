<?php
$con=mysqli_connect("localhost","root","123456","fanke");
$user = $_GET['user'];
//通过用户名查询改用户的商品id
$sql = "SELECT * FROM `usertab` WHERE `user`='$user'";
$res = mysqli_query($con,$sql);
if(!$res){
    die('error for mysql' . mysqli_error());
}
$arr = array();

while($row = mysqli_fetch_assoc($res)){
    # 拿出该用户的购物车的上商品id
    array_push($arr,$row);
}

$dataArr = array();
    foreach($arr as $key => $value){
        $id = $value['goods_id'];
        $sql2 = "SELECT * FROM `goods` WHERE `goods_id` = '$id'";
        $res2 = mysqli_query($con,$sql2);
        $row2 = mysqli_fetch_assoc($res2);
        # 把购物车中商品数量的值 添加给商品中的cart_number
        $row2['cart_number'] = $value['num'];
        $row2['cart_size']=$value['size'];
        $row2['cart_color']=$value['color'];
        array_push($dataArr,$row2);
    }

    print_r(json_encode($dataArr));
?>