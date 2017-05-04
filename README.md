# 12306_left_ticket
使用node.js查询12306余票


一个使用node.js查询12306余票的小程序

## 使用 

<pre> 
>from   --  设置出发站: 输入from，敲击回车后，程序提示引导用户使用全拼输入法设置车票出发站
>to     --  设置到达站: 输入to，敲击回车后，程序提示引导用户使用全拼输入法设置车票到达站
>train  --  设置车次: 输入train，敲击回车后，程序提示引导用户设置车次
>date   --  设置时间: 输入date，敲击回车后，程序提示引导用户设置车票日期
>load   --  加载车票配置文件: 输入load，敲击回车后，程序提示引导用户设置车票配置文件,程序根据配置文件直接查询
                             配置文件内容为以json格式保存的车票配置，参见config.json.
>quit   --  退出: 输入load，敲击回车后，或者敲击Ctrl+C, 程序退出
>       --  查询: 直接敲击回车启动车次查询
</pre> 


<pre>  
D:\>node main.js
> from
请输入出发站(全拼，例如:beijingxi):beijingxi
出发站: beijingxi
> to
请输入到达站(全拼，例如beijingxi):shanghaihongqiao
到达站: shanghaihongqiao
> date
请输入时间(例如:2017-03-04):2017-05-08
> train
请输入车次(例如:D321):D321
>
{ time: '2017-05-08',
  from_station: 'BXP',
  end_station: 'AOH',
  train_num: 'D321',
  purpose_codes: 'ADULT' }
> Query Log PASS
undefined
Got response: 200
Query status:  true
车次    开车    到达    历时    商务    一等    二等    软卧    硬卧    软座
硬座    站票
G101    06:44   12:38   05:54           有      有      有
        0
G5      07:00   11:55   04:55           有      有      9
        0
G105    07:35   13:15   05:40           有      有      11
        0
...   
</pre> 


<pre> 
D:>node main.js
> load
请输入车票查询配置文件:./config.json
> Query Log PASS
undefined
Got response: 200
Query status:  true
车次    开车    到达    历时    商务    一等    二等    软卧    硬卧    软座
硬座    站票
G101    06:44   12:38   05:54   有      有      有
0
G5      07:00   11:55   04:55   8       有      有
0 
...   
</pre> 
