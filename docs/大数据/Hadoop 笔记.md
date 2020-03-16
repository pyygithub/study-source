#  Hadoop 笔记


## 大数据概念
### 什么是大数据？

> KB - MB - GB - TB - PB - EB - ZB - YB - DB - NB

一般来说达到 TB ，或日增达到 GB 就属于大数据了
MySQL 单表超过 500万 条数据

### 大数据特点？

**大数据的 5V 特性：**

- **Volume：巨大的数据量**
  集中储存/集中计算已经无法处理巨大的数据量。
  数据量呈指数增长：地震、录井 、石油钻塔的传感器一个月产生的数据量比全球所有的电影加在一起还要多。
  新浪微博用户数2.5亿+，高峰每天几亿条。

- **Variety：非结构化数据多样性**
  文本/图片/视频/文档等，如诸如微地震，电磁以及光纤分布式温度监测（DTS） 。

- **Velocity：数据增长速度快**
  用户基数庞大/设备数量众多/实时海量/数据指数级别增长。

- **Valueless：数据价值密度低**
  每个钻井平台有 40,000 传感器,但是通常只有 10% 的数据使用到。
  每个深水钻井平台的投资可达到$150M,能有效利用所有的数据非常关键,关系到安全与优化运营 。

- **Veracity：数据质量**
  数据的准确性和可信赖度，即数据的质量。

  

### 面临了哪些问题,如何解决？

- 数据如何存储 - HDFS
- 数据如何计算 - MapReduce
- 资源如何管理（CPU 内存 网络资源）- YARN

### 大数据应用场景

- **个人推荐**
  根据用户喜好，推荐相关兴趣内容
  千人一面：范围广、精度粗
  一人一面：范围小、精度高
  一人千面：兴趣内容范围大、精度高

- **风控**
  金融系统、银行、互联网金融 - 实时流处理
  
- **成本预测**
  根据近期销售和市场数据，预测成本，做出规划
  
- **气候预测**
  根据以往气象信息，预测近期气象变化，和推测之后气候异常
  
- **人工智能**
  无人汽车：百度、特斯拉、Google
  智能助手：小爱、小度
  物流机器人

## Hadoop 的诞生

由 Apache 组织提供的一个开源的大数据解决方案。

###  Hadoop 的起源

- 2003-2004年，Google公布了部分GFS和MapReduce思想的细节，受此启发的Doug Cutting等人用2年的业余时间实现了DFS和MapReduce机制，使Nutch性能飙升。然后Yahoo招安Doug Gutting及其项目。
- 2005年，Hadoop作为Lucene的子项目Nutch的一部分正式引入Apache基金会。
- 2006年2月被分离出来，成为一套完整独立的软件，起名为Hadoop。Hadoop名字不是一个缩写，而是一个生造出来的词。是Hadoop之父Doug Cutting儿子毛绒玩具象命名的。
- Hadoop的成长过程
  Lucene–>Nutch—>Hadoop

- 总结起来，Hadoop起源于Google的三大论文
  - GFS：Google的分布式文件系统Google File System
  - MapReduce：Google的MapReduce开源分布式并行计算框架
  - BigTable：一个大型的分布式数据库

- 演变关系
  GFS—->HDFS
  Google MapReduce—->Hadoop MapReduce
  BigTable—->HBase

狭义上来说，hadoop就是单独指代hadoop这个软件， 
广义上来说，hadoop指代大数据的一个生态圈，包括很多其他的软件

### Hadoop 的历史版本

- **0.x系列版本**：hadoop当中最早的一个开源版本，在此基础上演变而来的1.x以及2.x的版本
- **1.x版本系列**：hadoop版本当中的第二代开源版本，主要修复0.x版本的一些bug等
- **2.x版本系列**：架构产生重大变化，引入了yarn平台等许多新特性

### Hadoop 生态圈

- **HDFS**：Hadoop Distribute FileSystem
- **MapReduce**：Hadoop中的分布式计算框架，实现对海量数据的并行分析和计算。
- **Hbase**：基于HDFS的列式存储的 NoSQL 数据库。
- **Hive**：简化大数据开发，可以将 SQL 语法翻译成 MR 任务。
- **Flume**：分布式的日志收集系统，用于收集海量数据，将其存储到 FS 中。
- **Kafka**：分布式的消息系统，实现分布式解耦和海量数据缓冲。
- **Zookeeper**：分布式协调服务，用于服务注册中心、配置中心、集群选举、状态监测、分布式锁等。


## 大数据解决方案

- **MR**：代表基于**磁盘**的大数据离线批处理的解决方案 - 延迟较高
- **Spark**：代表基于**内存**的大数据静态批处理的解决方案 - 几乎是MR的10倍以上
- **Storm/Spark Streaming/Flink/Kafka Streaming**：实时流处理框架，达到对记录级别的数据显示和毫秒级处理

## HDFS 分布式系统配置
**核心配置参数：**

- 指定 hadoop 的默认文件系统为：hdfs
- 指定 hdfs 的 namenode 节点是哪台机器
- 指定 namenode 软件存储元数据的本地目录
- 指定 datanode 软件存储文件块的本地目录  

1. 环境配置文件hadoop-env.sh

   ```shell
   # The java implementation to use.
   export JAVA_HOME=/opt/soft/jdk1.8.0_211
   export HADOOP_CONF_DIR=${HADOOP_CONF_DIR:-$PWD} #Hadoop配置文件的存放目录
   ```

2. 核心配置文件 core-site.xml

   ```xml
   <configuration>
       <!-- fs.defaultFS: 默认文件系统 hdfs  -->
       <property>
           <name>fs.defaultFS</name>
           <value>hdfs://hdp-01:9000</value>
       </property> 
   </configuration>
   ```

3. HDFS配置文件hdfs-site.xml

   ```xml
   <configuration>
       <!-- namenode 地址 -->
       <property>
           <name>dfs.namenode.http-address</name>
           <value>hdp-01:50070</value>
       </property>
       <!-- secondary namenode 地址 -->
       <property>
           <name>dfs.namenode.http-address</name>
           <value>hdp-01:50090</value>
       </property>
       
       <!-- 指定 namenode 软件存储元数据的本地目录 格式化节点时会自动生成-->
       <property>
           <name>dfs.namenode.name.dir</name>
           <value>/root/hdpdata/name</value>
       </property>
       <!-- 指定 datanode 软件存储文件块的本地目录 格式化节点时会自动生成   -->
       <property>
           <name>dfs.datanode.data.dir</name>
           <value>/root/hdpdata/data</value>
       </property> 
   
   </configuration>
   ```

4. 配置datanode集群节点文件 slaves

   ```shell
   hdp-01
   hdp-02
   hdp-03
   ```

5. 配置好以上信息后，我们就可以将hadoop的包分发给其他的节点了

   ```shell
   scp -r hadoop-2.x.x root@hdp02:(目标路径)
   ```

6. 启动集群

   在主节点上运行

   ```
   hadoop namenode -format
   ```

   运行完成后，节点会自动生成刚刚配置的工作目录

   ```
   start-dfs.sh
   ```

7. 浏览器输入http://x.x.x.x:50070查看集群运行情况

   ![namenode](./img/namenode.png)

8. 最终服务器分布：

   | 服务器地址 | 端口             | 服务                                          |
   | ---------- | ---------------- | --------------------------------------------- |
   | hdp-01     | 50070<br />50090 | namenode<br />secondaryNamenode<br />datanode |
   | hdp-02     | 50010/50075      | datanode                                      |
   | hdp-03     | 50010/50075      | datanode                                      |

9. **问题总结**
   - 防火墙设置
     为了防止发生一些奇怪的错误，请务必关闭所有节点的防火墙，他可能会导致浏览器无法获取集群信息和文件上传集群失败
   - hosts文件配置和主机名
     因为这是完全分布式的集群，所以配置hosts文件至关重要，不然你的私钥配置和以后节点的格式化都会出错，他将会提示你无法解析主机名
   - 请在关闭所有HDFS服务后在执行`-format`格式化命令
     如果存在节点未关闭，而你运行了格式化命令，这可能导致该节点与其他节点的目录ID不一致，从而导致“网络分区”问题

## HDFS 体系架构

[官方文档](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html)

HDFS 是一种能够运行在商业硬件上的分布式文件系统，与目前市面上文件系统有很多相似之处，但是又是不同的软件系统。在HDFS中，使用的架构主从架构（Active|Standby），针对的是**NameNode**的高可用。

1. **NameNode**
   - 存储文件的元数据如`文件名、文件目录结构、文件属性(生成时间、福本数、文件权限) ，以及每个文件的块列表和块所在的DataNode映射`
   - 负责管理 DataNode
   - 控制外界客户端对文件系统的访问。
   - NameNode会启动一个（或者说一个集群中，只有一个NameNode节点运行）

2. **DataNode **
   在本地文件系统存储文件块数据，以及块数据的校验和，负责响应客户端对块的读写请求。

3. **Block**
   数据块，是对文件拆分的最小单元（默认情况下一个块大小128MB，每个数据块有3个副本）

4. **rack**

   机架，使用机架对存储节点进行物理编排，用于优化存储和计算
   
   
   
   ![img](./img/HDFS.png)

### 什么是Block块

- 概述

  hadoop集群中文件的存储都是以块的形式存储在hdfs中，且一般默认都会有三个备份分别存储在集中中不同的datanode节点上。

- 默认值

  从2.7.3版本开始 block size 默认值大小为 128M，之前版本默认值为64M

- 如何修改 block 块的大小？

  可以通过修改 hdfs-site.xml中的 dfs.blocksize 对应的值

  注意: 在修改HDFS的数据块大小时，首先停掉集群hadoop的运行，修改完毕后重新启动。

- block块的大小设置规则

  在实际应用中，hdfs block块的大小设置为多少合适呢？为什么有的是64M，有个的是128M、256M、512M呢？

  首先我们先来了解几个概念：

  1. 寻址时间：HDFS 中找到目标文件block所花费的时间。
  2. 原理：文件块越大，寻址时间越短，但磁盘传输时间越长；文件块越小，寻址时间越长，但磁盘传输时间越短。

- block不能设置过大，也不能设置过小

  1. 如果设置过大，一方面从磁盘传输数据的时间会明显大于寻址时间，导致程序处理这块数据时，变得非常慢；另一方面，MapReduce 中map任务通常一次只处理一个块中的数据，如果过大运行速度也会很慢。
  2. 如果设置过小，一方面存放大小小文件会占用NameNode中大量内存来存储元数据，而NameNode的内存是有限的，不可取；另一方面块过小，寻址时间增长，导致程序一直在找block的开始位置。因此，块适当设置大一些，减少寻址时间，那么传输一个有多个块组成的文件时间**主要取决于磁盘的传输速度**。

- 设置多大合适？

  1. HDFS中平均寻址时间大概为 10ms；

  2. 经过大量的测试发现，寻址时间为传输时间的1%时，为最佳状态，所以最佳的传输时间为：

     10ms/0.01 = 1000s = 1s

  3. 目前磁盘的传输普遍为100MB/s，最佳block大小计算：

     100MB/s*1s=100MB

     所以我们设置block大小为 128MB。

  4. 实际中，磁盘的传输速率为 200MB/s时，一般设定block块大小为256MB；磁盘传输速率为400MB/s时，一般设定block大小为512MB.

  5. g

### 什么是机架感知？

- 背景

  分布式的集群通常包含非常多的机器，由于受到机架槽位和交换机网口的限制，通常大型的分布式集群都会跨好多个机架，由多个机架上的机器共同组成分布式集群。机架内的机器之间的网络速度通常都会高于跨机架机器之间的网络速度，并且机架之间机器的网络通信通常受到上层交换机网络带宽的限制。

- 存储策略

  **Hadoop在设计时考虑到数据的安全和高效，数据文件默认在HDFS上存放三份，存储策略为：**

  第一个block副本放在客户端所在的数据节点上（如果客户端不在集群范围内，则从整个集群中随机选择一个合适的数据节点来存放）。

  第二个副本放置在与第一个副本所在节点相同的机架内的其它数据节点上

  第三个副本放置在不同机架节点上

  如果副本数  >= 4时：

  前三个副本按照上面原则存放，从第四个副本开始，随机选取dataNode节点存放（每个节点只保留一份副本，每个rack不超过两个副本）

  
  
  这样如果本地数据损坏，节点可以从同一机架内的相邻节点拿到数据，速度肯定比从跨机架节点上获取数据的速度快；
  
  同时，如果整个机架的网络出现异常，也能保障可以在其它机架节点上找到数据。
  
  为了降低整体的带宽消耗和读取延时，HDFS会尽量让读取程序读取离它最近的副本。
  
  如果在读取程序的同一个机架上有一个副本，那么就读取该副本。
  
  如果在一个HDFS集群跨越多个数据中心，那么客户端也将读取本地数据中心的副本。
  
  那么Hadoop是如何确定任意两个节点为于同一个机架，还是跨机架的呢？答案就是**机架感知**。
  
  
  
  默认情况下，hadoop的机架感知是没有被开启的。所有机器hadoop都默认同一个机架下，名为“、default-rack",这种情况下，任何一台 datanode 机器，不管物理上是否属于同一个机架，都会被认为在同一个机架下，此时，就很容易出现增添机架间网络负载的情况。因为此时hadoop集群的HDFS在选机器的时候，是随机选择的，也就是说，很可能在写数据的时候，hadoop将第一块数据的block1写在 rack1上，然后随机的选择将block2写入到rack2上。
  
  此时，两个rack之间产生了数据传输的流量，再接下来，在随机的情况下，又将block3重新又写回到rack2，此时，两个rack之间又产生了一次数据流量。
  
  
  
  在job处理的数据量非常大的时候，或者hadoop推送的数据量非常大的时候，这种情况会造成rack之间的网络流量成倍的上升，成为性能的瓶颈，进而影响作业的性能甚至于整个集群的服务。

- 配置

  具体配置可参考：https://blog.csdn.net/zhongqi2513/article/details/73695229



## HDFS 核心工作原理

### 元数据管理

NameNode对数据的管理采用三种存储形式：

- 内存元数据（NameSystem）
- 磁盘元数据镜像文件
- 数据操作日志文件（可通过日志运算出元数据）

### 元数据存储机制

- 内存中有个一份完整的元数据（内存meta.data）

- 磁盘有一个”准完整“的元数据镜像（fsimage）文件（在namenode的工作目录中）

- 用于衔接内存meta.data和持久化元数据镜像fsimage之间的操作日志（edits文件）注：当客户端对hdfs中的文件进行新增或修改操作，操作记录首先被记入edits日志文件中，当客户端操作成功后，相应的元数据会被更新到内存meta.data中

### SecondaryNameNode 检查点

![img](https://img2018.cnblogs.com/blog/1800342/201909/1800342-20190914210628269-226786838.png)

NameNode 职责是管理元数据信息，DataNode的职责是负责数据具体存储，那么 SecondaryNameNode 的作用是什么？它为什么会出现在 HDFS 中。从它的名字上看，它给人的感觉就像是 NameNode的备份。但实际上却不是。

**HDFS 集群运行一段时间后，可能会出现的问题：**

- edits 文件会变的很大，怎么去管理这个文件是一个挑战。
- NameNode 重启会花费很长时间，因为有很多改动要合并到 fsimage 文件上。
- 如果 NameNode 挂掉了，那就丢失了一些改动。因为此时的 fsimage 文件非常旧。

因此为了克服这个问题，我们需要一个易于管理的机制来帮助我们`减少 edits 文件的大小和得到一个最新的fsimage文件`，这样也会减少在 NameNode 上的压力。这跟windows的恢复点是非常像的，windows的恢复点机制允许我们对OS进行快照，这样当系统发生问题时，我们能够回滚到最新的一次恢复点上。

SecondaryNameNode 就是来帮助我们解决上述问题的，它的职责是合并 NameNode 的 edits 到 fsimage文件中。



**Checkpoint**

每达到触发条件，会由 SecondaryNameNode 将 NameNode 上积累的所有 edits 和一个最新的 fsimage 下载到本地，并加载到内存进行 merge，而这个过程就称为：**checkpoint**

![img](https://img2018.cnblogs.com/blog/1800342/201909/1800342-20190914210629780-8637981.png)

**详细步骤**

- NameNode 管理着元数据信息，其中有两类持久化元数据文件：edits 操作日志文件和 fsImage 元数据镜像文件。新的操作日志不会立即与 fsimage 进行合并，也不会刷到 NameNode 内存中，而是会先写到 edits 中（因为合并需要消耗大量的资源）。

- 有dfs.namenode.checkpoint.period和dfs.namenode.checkpoint.txns 两个配置，只要达到这两个条件任何一个，secondarynamenode就会执行checkpoint的操作。

- 当触发 checkpoint 操作时，NameNode 会生成一个新的 edits 即上图中的 edits.new 文件，同时 SecondaryNameNode 会将 edits 文件和 fsimage 复制到本地（HTTP GET方式）

- SecondaryNameNode 将下载下来的 fsimage 载入到内存，然后一条一条的执行 edits 文件中的各项操作，使得内存中的 fsimage 保持最新，这个过程就是 edits和fsimage文件合并，生成一个新的 fsimage文件，即上图的 fsimage.ckpt 文件。

- SecondaryNameNode 将新生成的 fsimage.ckpt文件复制到NameNode节点。

- 在 NameNode 节点的 edits.new 文件和 fsimage.ckpt文件会替换掉原来的 edits 文件 和 fsimage 文件，至此刚好是一个轮回。

- 等待下一次checkpoint触发SecondaryNameNode进行工作，一直这样循环操作。

  

**补充：**

NameNode 和 Secondary NameNode 的工作目录存储结构是完全相同的，所以，当NameNode故障退出需要重新恢复时，可以从Secondary NameNode的工作目录中将fsimage拷贝到NameNode的工作目录，以恢复NameNode的元数据。

  chepoint检查时间参数设置：

  （1）通常情况下，SecondaryNameNode每个一小时执行一次。

  ```xml
  # hdfs-default.xml
  <property>
    <name>dfs.namenode.checkpoint.period</name>
    <value>3600</value>
  </property>
  ```

  （2）一分钟检查一次操作次数，当操作次数达到一百万时，SecondaryNameNode执行一次。

  ```xml
  <property>
    <name>dfs.namenode.checkpoint.txns</name>
    <value>1000000</value>
  	<description>操作动作次数</description>
  </property>
  <property>
    <name>dfs.namenode.checkpoint.check.period</name>
    <value>60</value>
  	<description> 1分钟检查一次操作次数</description>
  </property>
  ```

 

从上面的描述我们可以看出，SecondaryNameNode 根本不是 NameNode 的一个热备，其只是将 fsimage 和 edits 合并。其拥有的 fsimage 不会最新的，因为它从 NameNode 下载 fsimage 和 edits 文件时候，新的更新操作已经写到 edit.new 文件中去了。而这些更新在 SecondaryNameNode 是没有同步到的。当然，如果 NameNode 中的 fsimage 真的出问题了，还是可以用 SecondaryNameNode 中的 fsimage 替换一下 NameNode 上的 fimage，虽然已经不是最新的 fsimage，但是我们可以将损失减少到最小！

 

## HDFS 命令行客户端基本操作

### 客户端理解

HDFS 的客户端有多种形式：

- 网页形式
- 命令行形式

客户端在哪里运行，没有约束，只要运行客户端的机器能够跟 HDFS 集群联网。

> 注意：文件的切块大小和存储的福本数量，都是由客户端决定的！

所谓客户端决定，是通过配置参数类定的。HDFS 的客户端会读取以下两个参数，来决定切块大小和副本数量：

- 切块大小参数：dfs.blocksize
- 副本数量的参数：dfs.replication

上面两个参数在 hdfs-site.xml 中配置：

```xml
<property>
	<name>dfs.blocksize</name>
	<value>128m</value>
</property>
<property>
	<name>dfs.replication</name>
	<value>3</value>
</property>
```



### HDFS 命令行客户端的常用操作命令

1. 查看 HDFS 目录信息

   ```shell
   hadoop fs -ls /hdfs目录
   ```

2. 在 HDFS 中创建文件夹

   ```sh
   hadoop fs -mkdir -p /aa/bb/cc
   ```

3. 移动 HDFS 中的文件（改名）

   ```sh
   hadoop fs -mv /hdfs路径	/hdfs另一个路径
   ```

4. 上传文件到 HDFS 中

   ```sh
   hadoop fs -put /本地文件 /hdfs目录
   hadoop fs -copyFromLocal/本地文件	/hdfs目录   ## copyFromLocak == put
   hadoop fs -moveFromLocal/本地文件	/hdfs目录		## 从本地移动到hdfs
   ```

5. 下载文件到客户端本地

   ```sh
   hadoop fs -get /hdfs中的文件	/本地目录
   hadoop fs -copyToLocal/hdfs中的文件	/本地目录	## copyToLocal == get
   hadoop fs -moveToLocal/hdfs中的文件 /本地目录	## 从 hdfs 中移动到本地
   ```

6. 删除 HDFS 中的文件或文件夹

   ```sh
   hadoop fs rm -r /hdfs目录或文件
   ```

7. 修改文件的权限

   ```sh
   hadoop fs -chown user:group /hdfs文件
   hadoop fs -chmod 777 /hdfs文件
   ```

8. 追加内容到已有文件

   ```sh
   hadoop fs -appendToFile /本地文件	/hdfs文件
   ```

9. 显示文本文件内容

   ```sh
   hadoop fs -cat /hdfs文件
   hadoop fs -tail /hdfs文件 
   ```



## HDFS 的 JavaAPI

### 开发环境准备

1. 在本地解决Hadoop安装包
2. 在环境变量中配置：HADOOP_HOME
3. 创建 SpringBoot 工程,引入 Hadoop 依赖包

```xml
<!-- hadoop-hdfs -->
<dependency>
    <groupId>org.apache.hadoop</groupId>
    <artifactId>hadoop-hdfs</artifactId>
    <version>2.10.0</version>
</dependency>
<!-- hadoop-common -->
<dependency>
    <groupId>org.apache.hadoop</groupId>
    <artifactId>hadoop-common</artifactId>
    <version>2.10.0</version>
</dependency>
```

### 文件上传

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class App {
    Configuration configuration;
    FileSystem fs;
    @Before
    public void getClient() throws IOException {
        System.setProperty("HADOOP_USER_NAME", "root");

        configuration = new Configuration();
        // 手动设置连接信息
        //configuration.set("fs.defaultFS", "")
        configuration.addResource("core-site.xml");
        configuration.addResource("hdfs-site.xml ");

        fs = FileSystem.newInstance(configuration);
    }

    @After
    public void close() throws IOException {
        fs.close();
    }

    @Test
    public void upload1() throws IOException {
        fs.copyFromLocalFile(new Path("/本地文件"), new Path("/"));
    }

    @Test
    public void upload2() throws Exception {
        FileInputStream inputStream = new FileInputStream(new File("/本地文件"));
        FSDataOutputStream outputStream = fs.create(new Path("/a.txt"));
        IOUtils.copyBytes(inputStream, outputStream, 1024, true);
    }
}
```

**权限不足解决方案**

```java
org.apache.hadoop.security.AccessControlException: Permission denied: user=wolf, access=WRITE, inode="/":root:supergroup:drwxr-xr-x
...
```

- 方案一：

  ```java
  System.setProperty("HADOOP_USER_NAME", "root");
  ```

- 方案二：

  ```shell
  java -jar xxxx -DHADOOP_USER_NAME=root
  ```

- 方案三：

  > 将权限检查机制关闭：ect/hadoop/hdfs-site.xml:

  ```xml
  <property>
  	<name>dfs.permissions.enabled</name
  	<value>false</value>
  </property>
  ```

### 下载文件

```java
    @Test
    public void download1() throws IOException {
        fs.copyToLocalFile(new Path("/hdfs文件"), new Path("/本地目录"));
    }

    @Test
    public void download2() throws IOException {
        FileInputStream inputStream = new FileInputStream(new File("hdfs文件"));
        FSDataOutputStream outputStream = fs.create(new Path("/本地目录"));
        IOUtils.copyBytes(inputStream, outputStream, 1024, true);
    }
```

### 创建文件夹

```java
		@Test
    public void create() throws IOException {
        fs.mkdirs(new Path("/a/b"));
    }
```

### 删除文件

```java
		@Test
    public void delete() throws IOException {
        // 递归删除
        boolean delete = fs.delete(new Path("/a"), true);
    }
```

### 递归查询目录下所有文件列表

```java
    @Test
    public void listFile() throws IOException {
        RemoteIterator<LocatedFileStatus> remoteIterator = fs.listFiles(new Path("/"), true);
        while(remoteIterator.hasNext()) {
            LocatedFileStatus fileStatus = remoteIterator.next();
            String name = fileStatus.getPath().getName();
            System.out.println(name);
        }
    }
```

### 判断文件是否存在

```java
		@Test
    public void exist() throws IOException {
        boolean exists = fs.exists(new Path("/a.txt"));
        System.out.println(exists);
    }
```

### 回收站

```java
		@Test
    public void trash() throws IOException {
        Trash trash = new Trash(fs, configuration);
        boolean b = trash.moveToTrash(new Path("/a.txt"));
        System.out.println(b);
    }
```



·

