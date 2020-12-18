<?php
# 链接数据库
$con=mysqli_connect("localhost","root","123456","fanke");

//获取前端传过来的参数
$username=$_POST['username'];
$password=$_POST['password'];

/* 
获取用户名和密码之后先判断这个用户名是否存在，
如果存在直接返回用户已存在，
如果不存在，就把这个用户和密码插入
*/

#查看用户名是否已存在SQL语句
$sel="SELECT * FROM `login` WHERE `username`='$username'";
#执行SQL语句判断
$res=mysqli_query($con,$sel);
#解析第一条数据看是否存在
$row=mysqli_fetch_assoc($res);

#如果为空表示用户名不存在
if(!$row){
#如果不存在用户名，SQL语句，插入是数据
$sql="INSERT INTO `login` (`id`, `username`, `password`) VALUES (NULL, '$username', '$password');";

#执行SQL语句
$res=mysqli_query($con,$sql);
if(!$res){
    print_r("注册失败");
}else{
    print_r("注册成功");
}
}
else{
    print_r("用户已存在");
    // die("用户已存在");
}
?>