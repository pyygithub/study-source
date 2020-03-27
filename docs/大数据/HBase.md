# 一、HBase

官网：http://hbase.apache.org

![](./img/hbase.png)

HDFS：Hadoop分布式文件系统，适合非结构化数据的存储以及读取。

Apache HBase建立在HDFS之上的分布式、基于列存储的非关系型数据库；具有可靠、稳定、自动容错、多版本特性。

HBase实际上是Google BigTable项目的开源实现，它适合于海量的大规模（数十亿行、数百万列）的结构化数据存储。

当需要随机、实时读写访问大数据时,使用HBase。

## 1. 概念特性

HBASE是一个**数据库**----可以提供数据的实时**随机读写**

HBASE与mysql、oralce、db2、sqlserver等关系型数据库不同，它是一个NoSQL数据库（非关系型数据库）

- Hbase的表模型与关系型数据库的表模型不同：

- Hbase的表没有固定的字段定义；

- Hbase的表中每行存储的都是一些key-value对

- Hbase的表中有列族的划分，用户可以指定将哪些kv插入哪个列族

- Hbase的表在物理存储上，是按照列族来分割的，不同列族的数据一定存储在不同的文件中

- Hbase的表中的每一行都固定有一个行键，而且每一行的行键在表中不能重复

- Hbase中的数据，包含行键，包含key，包含value，HBase中的数据都是字符串（底层存储采用的是byte[]），没有类型，hbase不负责为用户维护数据类型
- HBASE对事务的支持很差

HBASE相比于其他nosql数据库(mongodb、redis、cassendra、hazelcast)的特点：

**Hbase的表数据存储在HDFS文件系统中**

从而，hbase具备如下特性：存储容量可以线性扩展； 数据存储的安全性可靠性极高！



## 2. 各种数据库之间的差别比较

![](./img/hbase_sql.png)

### 2.1 HBase和Hive区别

#### 2.1.1 Hive 数据仓库的理解

1. 仓库就是存放历史数据存的地方，反复对历史数据进行读操作，统计分析操作，历史数据不需要修改。

2. Hive严格意义上来讲不能算是数据库。

   Hive与Hbase巨大的区别在于，Hive底层依赖的文件系统HDFS中的数据是用户提交的，没有固定的格式，可以理解成按照分隔符分割的简单文本，而不是精心设计的文件（如Mysql那样精心设计的文件加上mysql中共的软件系统，可以对数据进行随机的访问和修改操作），Hive只能对这些数据进行读取，分析，不能对修改和跟新数据。

3. mysql也当然具备做为数据仓库的功能和能力，但是数据量太大是，mysql不适合，mysql适于联机事务处理（在线实时交互）。

#### 2.1.2 HBase

1. 同msyql一样，底层的文件系统的精心设计的，Hbase的底层文件系统也是HDFS。

2. 具有联机事务处理数据库的特性（**快速** **实时**操作数据库，增删改查）。

3. Hbase本身的特性：
   - 文件系统：HDFS（表可以很大很大）
   - 分布式系统
   - nosql表结构

## 3. HBase 特性与表结构

![Hbase的逻辑结构](./img/hbase_table.png)

**列族**：KV分为若干的大类：，如上表所示。

1. 每个列族中的kv数据可以随意存放，key可以不同，没有严格要求，完全有用户决定，当然一般使用情况下，数据是规整的；

　　如：下表是可以的，但是为了数据的规整，一般不建议随意为key起名字，最好保持一致。

| rowkey | base_info                |
| ------ | ------------------------ |
| 001    | name:jj, age:12, sex:mal |
| 002    | nick:ls, age:15, xb:male |

2. 同一个列祖中的kv的个数也是灵活的，可以省略某些kv

   **cell：**同一个数据可以保存多个值

   - 一个kv就是一个cell

   - 一个key可有有多个版本的值
   - 时间戳作为版本

## 4. HBase 整体工作机制示意图

![](./img/hbase_jz.png)

Hbase集群中有两个角色

　　**region server**

　　**master**

region server负责数据的逻辑处理（增删改查），**region server对数据的操作是不经过master**。某一个瞬间master挂了，regionserver还是可以正常服务的，但是一定时间之后，万一某一个regionserver挂了，该regionserver负责的任务得不到重新分配，就会出问题。

### 4.1 存储问题（分散存储）

按照region划分范围存储（region目录还细分为列族目录，列族目录下才存放具体的文件）

### 4.2 查询问题（分布式：分任务查询）

HBase底层文件系统是HDFS，HBase中的表最终也会落地HDFS，那么Hbase的一张表可以很大很大，表中的数据不断的增加增加存储也是可以的，但是怎么查询呢？

当请求特别多的时候，一台HBase服务器（region server）是不行的，HBase是一个分布式的系统，当有多个Hbase提供服务的时候，某一次客户端的请求具体由那个服务器来处理呢？

- 当某一台服务器挂了，谁来接替它的工作，如何接替？

  ​	**解决：**服务器需要分任务（分布式系统里肯定是要分任务的）

  ​	一台服务器，负责Hbase中某个表的某一个部分。

- 如何界定部分？

  ​	需要**划分范围：**按照**行健范围**

这样通过分任务之后就是一个**分布式系统。**不同的regionServer可以**并行**的去访问hdfs中的数据（表数据）**，**这样还有一个问题，若某一张表中的所有数据都存在同一个HDFS中的文件中，即使是负责同一张表的不同范围regionserver，大量的并行请求也会同时访问同一个hdfs文件，这会造成性能上的瓶颈，所以表中的数据在HDFS中是按照**region划分范围存储（region目录还细分为列族目录，列族目录下才存放具体的文件）**, 这样**同一个表的不同region范围的数据落地HDFS中不同的文件中**。否则会造成即是分了任务一个dataNode被频繁的访问。



#### 4.2.1 客户端读写数据时的路由流程

**问题描述**：客户端怎么知道他要访问的某个region在那一台regionserver上呢？

master是不会保存哪些region在哪些regionserver上的，否则就是有状态的节点了，一旦master挂了，regionserver立刻无法提供服务，而事实不是这样。

上述信息就是所谓的索引信息，master是不会保存索引信息的，索引信息是保存在系统索引表中的。

1. 索引表当然也存在于hdfs中，且只有一个region；

2. 谁来负责查询索引表

下图所示，索引表数据的查询由hdp-02机器上的regionserver负责，那么客户端怎样知道meta数据由hdp-02负责

![](./img/hbase_regin.png)

**zookeeper上会记录元数据索引表，有哪一台regionserver负责管理。**　客户单端，每次访问数据之前，先查询zookeeper。

![](./img/hbase_zk.png)

下图为Zookeeper节点**meta-region-server的信息**

**访问流程：**

1. 客户端去Zookeeper上查询，负责索引表数据的regionserver；

2. 找该台regionserver服务器，查询出客户端要访问的region数据由哪一台regionserver负责；

3. 客户端找具体的regionserver要数据.

**总结：**

1. Hbase表中的数据是存放在hdfs中的。

2. regionserver只负责逻辑功能，对数据进行增删改查，不存储它负责的region的数据。

3. 一个regionserver可以负责多个表的多个region。

4. region是regionServer管理数据的基本单元。

5. 客户端查找数据不经过master。

6. 客观端查找数据一定经过Zookeeper。



### 4.3 服务器宕机问题（借助Zookeeper实现HA）

**master对regionserver的监管，状态协调**

1. 所有的状态信息记录在Zookeeper里。

2. master**负责监管**region server的状态，知道每一个regionserver负责哪些表的哪些region，不负责帮用户查数据，一旦发现某个region server发生故障，会找另外的一台机器来接替该region server负责的region区域。

3. master通过Zookeeper来获取regionserver的状态。

4. master通过Zookeeper监听region server，maste是没有状态的节点，master存在单点故障的风险；通过主备容灾实现HA机制。

**master HA**

**状态信息记录在Zookeeper里。**master是无状态节点，standby 切换为 active状态，查看Zookeeper后，立马知道现在的集群是什么样子。