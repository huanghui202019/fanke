<?php
# 链接数据库
$con=mysqli_connect("localhost","root","123456","fanke");

//获取前端传过来的参数
$username=$_POST['username'];
$password=$_POST['password'];

# 设置SQL语句
$sql="SELECT * FROM `login` WHERE `username`='$username' AND `password`='$password'";

//执行SQL语句
$res=mysqli_query($con,$sql);
#需要解析第一条数据看是否存在
$row=mysqli_fetch_assoc($res);

if(!$row){
    print_r("用户名或密码错误");
}else{
    print_r("登录成功");
}
mysqli_close($con);
?>
