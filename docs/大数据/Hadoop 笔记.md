# Hadoop 笔记


## 大数据概念
### 1. 什么是大数据？

> **(KB - MB - GB - TB - PB - EB - ZB - YB - DB - NB)：**
>
> (bit).Byte (B).KiloByte (KB).MegaByte (MB).GigaByte (GB).TeraByte (TB).PetaByte (PB).ExaByte (EB).ZetaByte (ZB).YottaByte (YB).NonaByte (NB).DoggaByte (DB)1 Byte = 8 Bit
>
> 1 KB = 1,024 Bytes
> 1 MB = 1,024 KB = 1,048,576 Bytes
> 1 GB = 1,024 MB = 1,048,576 KB = 1,073,741,824 Bytes
> 1 TB = 1,024 GB = 1,048,576 MB = 1,073,741,824 KB = 1,099,511,627,776 Bytes
> 1 PB = 1,024 TB = 1,048,576 GB =1,125,899,906,842,624 Bytes （13107.2个80G的
> 1 EB = 1,024 PB = 1,048,576 TB = 1,152,921,504,606,846,976 Bytes
> 1 ZB = 1,024 EB = 1,180,591,620,717,411,303,424 Bytes
> 1 YB = 1,024 ZB = 1,208,925,819,614,629,174,706,176 Bytes
> 1 DB = 1,024 YB＝ 1,237,940,039,285,380,274,899,124,224 Bytes
> 1 NB = 1,024 DB＝ 1,267,650,600,228,229,401,496,703,205,376 Bytes

一般来说达到 TB ，或日增达到 GB 就属于大数据了

MySQL 单表超过 500万 条数据

### 2. 大数据特点？

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

  

### 3. 面临了哪些问题、如何解决？

- 数据如何存储 - HDFS

- 数据如何计算 - MapReduce

- 资源如何管理（CPU 内存 网络资源）- YARN

  
  
### 4. 大数据应用场景

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

1. **Hadoop 的起源**

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

2. **Hadoop 的历史版本**

   - **0.x系列版本**：hadoop当中最早的一个开源版本，在此基础上演变而来的1.x以及2.x的版本
   - **1.x版本系列**：hadoop版本当中的第二代开源版本，主要修复0.x版本的一些bug等
   - **2.x版本系列**：架构产生重大变化，引入了yarn平台等许多新特性

3. **Hadoop 生态圈**

   - **HDFS**：Hadoop Distribute FileSystem

   - **MapReduce**：Hadoop中的分布式计算框架，实现对海量数据的并行分析和计算。
   - **Hbase**：基于HDFS的列式存储的 NoSQL 数据库。
   - **Hive**：简化大数据开发，可以将 SQL 语法翻译成 MR 任务。
   - **Flume**：分布式的日志收集系统，用于收集海量数据，将其存储到 FS 中。
   - **Kafka**：分布式的消息系统，实现分布式解耦和海量数据缓冲。
   - **Zookeeper**：分布式协调服务，用于服务注册中心、配置中心、集群选举、状态监测、分布式锁等。


4. **Hadoop 核心组成（commons、hdfs、mr、yarn 4 配置文件模板）**
   - Hadoop-Commons  	  core-site.xml （工具模块 底层）

   - Hadoop-HDFS				 hdfs-site.xml

   - MapReduce 框架			mapRed-site.xml

   - Yarn								  yarn-site.mxl


4. **核心组成（commons、hdfs、mr、yarn 4 配置文件模板）**

   - Hadoop-Commons  	  core-site.xml （工具模块 底层）

   - Hadoop-HDFS				 hdfs-site.xml

   - MapReduce 框架			mapRed-site.xml

   - Yarn								  yarn-site.mxl

   



## 大数据解决方案

- MR：代表基于**磁盘**的大数据离线批处理的解决方案 - 延迟较高
- Spark：代表基于**内存**的大数据静态批处理的解决方案 - 几乎是MR的10倍

## HDFS 体系架构

1. **NameNode**

   是主节点，**存储文件的元数据**如`文件名、文件目录结构、文件属性(生成时间、福本数、文件权限)` ，以及每个文件的块列表和块所在的 **DateNode** 等。

2. **DataNode **

   在本地文件系统**存储文件块数据，以及块数据的校验和**

3. **Block（128M）**

   ![img](https://images2015.cnblogs.com/blog/855959/201512/855959-20151228090818245-251475105.png)

4. 

5. 








