# Hive
## 什么是数仓

### 基本概念

数据仓库（英文：Data Warehouse，简称 DW 或 DWH），是一个用于存储、分析、报告的数据系统。

数据仓库的目的是构建**面向分析**的集成化数据环境，为企业提供决策支持（Decision Support）。

![image-20210814215649241](./img/image-20210814215649241.png)

数据仓库**本身并不 "生产" 任何数据**，其数据来源于不同的外部系统。

同时数据仓库自身也**不需要 "消费" 任何数据**，其结果开放给各个外部应用系统使用。

这也是为什么叫 "仓库", 而不叫 "工厂" 的原因。

![image-20210814220235191](./img/image-20210814220235191.png)

### 数仓为何而来 

先下结论：**为了分析数据而来**，分析结果为企业决策提供支撑。

企业中，信息总是用作两个目的：

1）操作型记录的保存

2）分析型决策的制定

以下一中国人寿保险公司（chinalife）发展为例，阐述数据仓库为何而来？

**操作型记录的保存**

- 中国人寿保险（集团）公司下多条业务线，包括：人寿险、财险、车险、养老险等。各个线的业务正常运营需要记录维护包括客户、保单、收付费、核保、理赔等信息。

- **联机事务处理系统（OLTP）**正好可以满足上述业务需求开展，其主要任务是执行联机事务处理。其基本特征是前台接收用户数据可以立即传送给后台进行处理，并在很短时间内给出处理结果。

  ![image-20210814221217249](./img/image-20210814221217249.png)

- **关系型数据库（RDBMS）就是OLTP典型应用**，比如：Oracle、MySQL、SQL Server等。

  ![image-20210814221338831](./img/image-20210814221338831.png)

**分析型决策的制定**

- 随着集团业务的持续运营，业务数据将会越来越多。由此也产生出许多运营相关的困惑：

  - 能够确定哪些险种正在恶化或已成为不良险种？
  - 能够用有效的方式制定新增和续保的政策吗？
  - 理赔过程有欺诈的可能吗？我们是否有欺诈识别能力？
  - 现在得到的报表是否只是某业务线的？集团整体侧面数据如何？

     ...

- 为了能够正确认识这些问题，制定相关的解决措施，瞎拍桌子肯定是不行的。

- 最稳妥的办法就是：**基于业务数据开展数据分析，基于分析的结果给决策提供支撑。**也就是所谓的数据驱动决策的制定。

  ![image-20210814221946683](./img/image-20210814221946683.png)

  > 问题：在哪里进行数据分析？数据库可以吗？

  **OLTP环境开展分析可行吗？**

  可以，但是没必要

  OLTP系统的核心是面向业务，支持业务，支持事务。所有的业务操作而言分为读、写两种操作，一般来说**读的压力明显大于写的压力**。如果在OLTP环境直接开展各种分析，有以下问题需要考虑：

  1）数据分析也是对数据进行读取操作，会让读取压力倍增；

  2）OLTP仅存储数周或数月的数据；

  3）数据分散存储在不同的表中，字段类型属性不统一；

  

  当分析所涉及数据规模较小的时候，在业务低峰期可以在OLTP系统上开展直接分析。但是**为了更好的进行各种规模的数据分析，同时也不影响OLTP系统运行，此时需要构建一个集成统一的数据分析平台。**

  该平台的目的很简单：**面向分析，支持分析，**并且和OLTP系统**解耦合**。

  基于这种需求，数据仓库的雏形开始在企业中出现了。

### 数仓的创建

如数仓定义所说，数仓是一个用于存储、分析、报告的数据系统，目的是构建面向分析的集成化数据环境。我们把这种**面向分析、支持分析**的系统称之为 **OLAP （联机分析处理）系统**。数据仓库就是OLAP的一种。

中国人寿保险公司就是基于分析决策的需求，构建数仓平台。

 ![image-20210814224140151](./img/image-20210814224140151.png)



### 主要特征

 ![image-20210814224746581](./img/image-20210814224746581.png)

- **面向主题性（Subject-Oriented）**

  - 数据库中，最大的特点是**面向应用**进行数据的组织，各个业务系统可能是相互分离的。

  - 而**数据仓库则是面向主题的**。主题是一个抽象的概念，是较高层次上企业信息系统中的**数据综合**、**归类**并进行分析利用的抽象。在逻辑意义上，它是对企业中某一宏观分析领域所涉及的分析对象。

  - 操作行处理（传统数据）对数据的划分并不适用于决策分析。而基于主题组织的数据则不同，它们被划分为各自独立的领域，各个领域有各自的逻辑内涵但互不交叉，在**抽象层次上对数据进行完整、一致和准确的描述**。

    ![image-20210814225358751](./img/image-20210814225358751.png)
  
- **集成性（Integrated）**

  - 确定主题之后，就需要获取和主题相关的数据。当下企业中主题相关的**数据通常会分布在多个操作系统中，彼此分散、独立、异构**。

  - 因此在数据进入数据仓库之前，必然要经过**统一与综合，对数据进行抽取、清洗、转换和汇总**，这一步是数据仓库建设中最关键、最复杂的一步，所要完成的工作有：

    1）要统一源数据中所有矛盾之处，如字段同名异义、异名同义、单位不统一、字长不统一，等等。

    2）进行数据综合和计算。数据仓库中的数据综合工作可以在从原有数据库抽取数据时生成，但许多是在数据仓库内部生成的，即进入数据仓库以后进行综合生成的。

    > 一句话总结来说：不论数据来源于哪里，只要它属于同一个主题，我就要把它集中到一起，且保障它们之间格式统一干净规整。
  
    下图说明了保险公司综合数据的简单处理过程，其中数据仓库中与 "承保" 主题有关的数据来自于不同操作性系统。这些系统内部数据命名可能不同，数据格式也可能不同。把不同来源的数据存储到数据仓库之前，需要去除这些不一致。

  ![image-20210814230700137](./img/image-20210814230700137.png)

- **非易失性、非异变性（Non-Volatile）**

  - **数据仓库是分析数据的平台，而不是创造数据的平台**。我们通过数仓去分析数据中的规律，而不是去创造修改其中的规律。因此数据进入数据仓库后，它便稳定且不会改变。
  - 操作性数据库主要服务于日常的业务操作，使得数据库需要不断对数据进行实时更新，以便迅速获取当前最新数据，不至于影响业务正常的运作。在数仓中只要保存过去的业务数据，不需要每一笔业务都实时更新数据仓库，而是根据商业需要每隔一段时间把一批相对较新的数据导入到数据仓库。
  - **数据仓库的数据反映的是一段相对长时间内历史数据的内容**，而不同时间点数据库快照的集合，以及基于这些数据快照进行统计、综合和重组的导出数据。
  - 数据仓库的用户对数据的操作大多是数据查询或者比较复杂的挖掘，一旦数据进入数仓以后，一般情况下被较长时间保留。**数据仓库一般有大量的查询操作，但修改和删除操作很少。**
  
- **时变性（Time-Variant）**
  
  - 数据仓库包括各种粒度的历史数据，数据可能与某个特定日期、星期、月份、季度或年份有关。
    
  - 虽然数据仓库的用户不能修改数据，但并不是说数仓的数据就永远不变的。分析的结果只能反应过去的情况，当业务变化后，挖掘出的模式会失去时效性。因此数仓的数据**需要随着时间更新，以适应决策的需要**。从这个角度讲，数仓建设是一个项目，更是一个过程。
    
  - 数据仓库的数据随时间的变化表现在一下几个方面：
    
    1）数据仓库的数据时限一般要远远长于操作型数据的数据时限；
    
    2）操作型系统存储的是当前数据，而数据仓库存储的是历史数据；
    
    3）数据仓库中数据是按照时间顺序追加的，它们都带有时间属性。
  
  
  
### OLTP、OLAP

- 联机**事务**处理 OLTP （On-Line **Transaction** Processing）

  - 操作性处理，叫联机事务处理 OLTP （On-Line **Transaction** Processing），主要目标是做数据处理，它是针对具体业务在数据库联机的日常操作，通常对少数记录进行查询、修改。

  - 用户较为关心操作的响应时间、数据的安全性、完整性和并发支持用户数等问题。

  - 传统的**关系型数据库系统（RDBMS）作为数据管理的主要手段，主要用于操作型处理。**

    ![image-20210814233109413](./img/image-20210814233109413.png)



- 联机**分析**处理 OLAP（On-Line Analytical Processing)

  - 分析型处理，叫联机分析处理 OLAP（On-Line **Analytical** Processing），主要目标是做数据分析。
  - 一般针对某些主题的历史数据进行复杂的多维分析，支持管理决策。
  - **数据仓库是 OLAP 系统的一个典型示例**，主要用于数据分析。![image-20210814233356949](img/image-20210814233356949.png)

- 对比

  ![image-20210814233507062](./img/image-20210814233507062.png)

  


### 数据库与数据仓库的区别

数据库与数据仓库的区别实际讲的是 OLTP 与 OLAP 的区别。 

操作型处理，叫联机事务处理 OLTP（On-Line Transaction Processing，），也可以称面向交易的处理系统，它是针对具体业务在数据库联机的日常操作，通常对少数记录进行查询、修改。用户较为关心操作的响应时间、数据的安全性、完整性和并发支持的用户数等问题。传统的数据库系统作为数据管理的主要手段，主要用于操作型处理。 

分析型处理，叫联机分析处理 OLAP（On-Line Analytical Processing）一般针对某些主题的历史数据进行分析，支持管理决策

首先要明白，数据仓库的出现，并不是要取代数据库。 

- 数据库是面向事务的设计，数据仓库是面向主题设计的。 
- 数据库一般存储业务数据，数据仓库存储的一般是历史数据。 
- 数据库设计是尽量避免冗余，一般针对某一业务应用进行设计，比如一张简单的User表，记录用户名、密码等简单数据即可，符合业务应用，但是不符合分析。数据仓库在设计是有意引入冗余，依照分析需求，分析维度、分析指标进行设计。 

- 数据库是为**捕获**数据而设计，数据仓库是为**分析**数据而设计。 

以银行业务为例。数据库是事务系统的数据平台，客户在银行做的每笔交易都会写入数据库，被记录下来，这里，可以简单地理解为用数据库记账。数据仓库是分析系统的数据平台，它从事务系统获取数据，并做汇总、加工，为决策者提供决策的依据。比如，某银行某分行一个月发生多少交易，该分行当前存款余额是多少。如果存款又多，消费交易又多，那么该地区就有必要设立ATM了。 

显然，银行的交易量是巨大的，通常以百万甚至千万次来计算。事务系统是实时的，这就要求时效性，客户存一笔钱需要几十秒是无法忍受的，这就要求数据库只能存储很短一段时间的数据。而分析系统是事后的，它要提供关注时间段内所有的有效数据。这些数据是海量的，汇总计算起来也要慢一些，但是，只要能够提供有效的分析数据就达到目的了。

**数据仓库，是在数据库已经大量存在的情况下，为了进一步挖掘数据资源、为了决策需要而产生的，它决不是所谓的**“**大型数据库**”。



### 数仓的分层架构 

按照数据流入流出的过程，数据仓库架构可分为三层——源数据、数据仓库、数据应用。

![](./img/shucangfenceng.png)

数据仓库的数据来源于不同的源数据，并提供多样的数据应用，数据自下而上流入数据仓库后向上层开放应用，而数据仓库只是中间集成化数据管理的一个平台。 

- 源数据层（ODS） ：此层数据无任何更改，直接沿用外围系统数据结构和数据，不对外开放；为临时存储层，是接口数据的临时存储区域，为后一步的数据处理做准备。 
- 数据仓库层（DW） ：也称为细节层，DW层的数据应该是一致的、准确的、干净的数据，即对源系统数据进行了清洗（去除了杂质）后的数据。 
- 数据应用层（DA或APP） ：前端应用直接读取的数据源；根据报表、专题分析需求而计算生成的数据。

数据仓库从各数据源获取数据及在数据仓库内的数据转换和流动都可以认为是ETL（抽取Extra, 转化 Transfer, 装载Load）的过程，ETL是数据仓库的流水线，也可以认为是数据仓库的血液，它维系着数据仓库中数据的新陈代谢，而数据仓库日常的管理和维护工作的大部分精力就是保持ETL的正常和稳定。 

#### 为什么要对数据仓库分层？

用空间换时间，通过大量的预处理来提升应用系统的用户体验（效率），因此数据仓库会存在大量冗余的数据；不分层的话，如果源业务系统的业务规则发生变化将会影响整个数据清洗过程，工作量巨大。 

通过数据分层管理可以简化数据清洗的过程，因为把原来一步的工作分到了多个步骤去完成，相当于把一个复杂的工作拆成了多个简单的工作，把一个大的黑盒变成了一个白盒，每一层的处理逻辑都相对简单和容易理解，这样我们比较容易保证每一个步骤的正确性，当数据发生错误的时候，往往我们只需要局部调整某个步骤即可。



### 数仓的元数据管理

元数据（Meta Date），主要记录数据仓库中模型的定义、各层级间的映射关系、监控数据仓库的数据状态及ETL的任务运行状态。一般会通过元数据资料库（Metadata Repository）来统一地存储和管理元数据，其主要目的是使数据仓库的设计、部署、操作和管理能达成协同和一致。 

元数据是数据仓库管理系统的重要组成部分，元数据管理是企业级数据仓库中的关键组件，贯穿数据仓库构建的整个过程，直接影响着数据仓库的构建、使用和维护。 

- 构建数据仓库的主要步骤之一是ETL。这时元数据将发挥重要的作用，它定义了源数据系统到数据仓库的映射、数据转换的规则、数据仓库的逻辑结构、数据更新的规则、数据导入历史记录以及装载周期等相关内容。数据抽取和转换的专家以及数据仓库管理员正是通过元数据高效地构建数据仓库。

- 用户在使用数据仓库时，通过元数据访问数据，明确数据项的含义以及定制报表。 
- 数据仓库的规模及其复杂性离不开正确的元数据管理，包括增加或移除外部数据源，改变数据清洗方法，控制出错的查询以及安排备份等。 

![](./img/dm.png)

元数据可分为**技术元数据**和**业务元数据**。

技术元数据为开发和管理数据仓库的IT 人员使用，它描述了与数据仓库开发、管理和维护相关的数据，包括数据源信息、数据转换描述、数据仓库模型、数据清洗与更新规则、数据映射和访问权限等。

而业务元数据为管理层和业务分析人员服务，从业务角度描述数 据，包括商务术语、数据仓库中有什么数据、数据的位置和数据的可用性等，帮助业务人员更好地理解数据仓库中哪些数据是可用的以及如何使用。 

由上可见，元数据不仅定义了数据仓库中数据的模式、来源、抽取和转换规则等，而且是整个数据仓库系统运行的基础，元数据把数据仓库系统中各个松散的组件联系起来，组成了一个有机的整体。

## **Hive** 的基本概念

### Hive 简介

#### 什么是 **Hive** ？

Hive是基于Hadoop的一个数据仓库工具，可以将结构化的数据文件映射为一张数据库表，并提供类SQL查询功能。

其本质是将SQL转换为MapReduce的任务进行运算，底层由HDFS来提供数据的存储，说白了hive可以 理解为一个将SQL转换为MapReduce的任务的工具，甚至更进一步可以说hive就是一个MapReduce的 客户端。

![](./img/hive1.png)

#### 为什么使用 Hive ？

- 直接使用hadoop所面临的问题
  - 人员学习成本太高 
  - 项目周期要求太短 
  - MapReduce实现复杂查询逻辑开发难度太大

- 为什么要使用Hive
  - 操作接口采用类SQL语法，提供快速开发的能力。 
  - 避免了去写MapReduce，减少开发人员的学习成本。 
  - 功能扩展很方便。

#### Hive的特点

- 可扩展

  Hive 可以自由的扩展集群的规模，一般情况下不需要重启服务。 

- 延展性 

  Hive 支持用户自定义函数，用户可以根据自己的需求来实现自己的函数。 

- 容错

  良好的容错性，节点出现问题SQL仍可完成执行。 

### Hive 架构

![](./img/hive_jiagou.png)

- **用户接口**： 包括CLI、JDBC/ODBC。其中，CLI(command line interface)为shell命令行；JDBC/ODBC是Hive的JAVA实现，与传统数据库JDBC类似； 
- **元数据存储**： 通常是存储在关系数据库如mysql/derby中。Hive 将元数据存储在数据库中。Hive中的元数据包括表的名字，表的列和分区及其属性，表的属性（是否为外部表等），表的数据所在目录等。 
- **解释器、编译器、优化器、执行器**: 完成HQL 查询语句从词法分析、语法分析、编译、优化以及查询计划的生成。生成的查询计划存储在HDFS 中，并在随后有MapReduce 调用执行。 

**工作原理**：

1.  用户创建数据库、表信息，存储在hive的元数据库中；

2.  向表中加载数据，元数据记录hdfs文件路径与表之间的映射关系；

3.  执行查询语句，首先经过解析器、编译器、优化器、执行器，将指令翻译成MapReduce，提交到Yarn上执行，最后将执行返回的结果输出到用户交互接口。

   

### Hive 与 Hadoop 的关系

Hive利用HDFS存储数据，利用MapReduce查询分析数据

![](./img/hive_hadoop.png)



### **Hive **与传统数据库对比 

hive 用于海量数据的离线数据分析 

![](./img/hive_sql.png)

总结：hive具有sql数据库的外表，但应用场景完全不同，hive只适合用来做批量数据统计分析 。

## Hive 安装和环境配置

1. 手动安装：自行Google
2. CDH安装：自行Google



### Hive 的三种连接方式

1. 第一种交互方式 **bin/hive**

   ```shell
   #/bin/hive
   ```

   通过hive shell来操作hive，但是至多只能存在一个hive shell，启动第二个会被阻塞，也就是说hive shell不支持并发操作。

2. 第二种交互方式 **HiveServer2** 

   基于JDBC等协议：启动hiveserver2，通过jdbc协议可以访问hive，hiveserver2支持高并发。

   简而言之，hiveserver2是Hive启动了一个server，客户端可以使用JDBC协议，通过IP+ Port的方式对其进行访问，达到并发访问的目的。

   ```shell
   #启动服务端（前台启动命令如下）
   #/bin/hive --service hiveserver2
   ```
   在装了相同版本Hive的其他主机(启动hiveserver2的主机也可以)上启动beeline，可以连接到Hive的server上。执行命令：

   ```shell
   #/bin/beeline -u jdbc:hive2://node-00:10000
   ```

3. 第三种交互方式：使用**sql**语句或者**sql**脚本进行交互

   不进入hive的客户端直接执行hive的hql语句 

   ```shell
   #/bin/hive -e "create database if not exists mytest;"
   ```

   或者我们可以将我们的hql语句写成一个sql脚本然后执行

   ```shell
   #vim hive.sql
   ```

   ```sql
   create database if not exists mytest; 
   use mytest; 
   create table stu(id int,name string);
   ```

   通过hive -f 来执行我们的sql脚本

   ```shell
   #/bin/hive -f hive.sql
   ```




## **Hive** 数据库操作
### 创建数据库 

```sql
create database if not exists myhive; 
use myhive;
```
hive的表存放位置模式是由hive-site.xml当中的一个属性指定的

```xml
  <property>
	<name>hive.metastore.warehouse.dir</name
    <value>/user/hive/warehouse</value>
  </property>
```

### 创建数据库并指定位置

```sql
create database myhive2 location '/myhive2'
```

### 修改数据库 

可以使用alter database 命令来修改数据库的一些属性。但是数据库的元数据信息是不可更改的，包括

数据库的名称以及数据库所在的位置 

```sql
alter database myhive2 set dbproperties('createtime'='20180611');
```

### 查看数据库详细信息 

查看数据库基本信息

```sql
desc database myhive2;
```

查看数据库更多详细信息

```sql
desc database extended myhive2;
```

### 删除数据库 

删除一个空数据库，如果数据库下面有数据表，那么就会报错

```sql
drop database myhive2;
```

强制删除数据库，包含数据库下面的表一起删除

```sql
drop database myhive cascade; # 不要执行了
```



## Hive表操作



### Hive表创建语法 

```sql
create [external] table [if not exists] table_name (
    col_name data_type [comment '字段描述信息']
    col_name data_type [comment '字段描述信息'])
    [comment '表的描述信息']
    [location '指定表的路径']
    [partitioned by (col_name data_type,...)]
    [clustered by (col_name,col_name,...)]
    [sorted by (col_name [asc|desc],...) into num_buckets buckets]
    [row format row_format]
    [location location_path]
```

说明：

1. CREATE TABLE 创建一个指定名字的表。如果相同名字的表已经存在，则抛出异常；用户可以用IF NOT EXISTS 选项来忽略这个异常。 

2. EXTERNAL 关键字可以让用户创建一个外部表，在建表的同时指定一个指向实际数据的路径 （LOCATION），Hive 创建内部表时，会将数据移动到数据仓库指向的路径；若创建外部表，仅记录数据所在的路径，不对数据的位置做任何改变。在删除表的时候，内部表的元数据和数据会被一起删除，而外部表只删除元数据，不删除数据。 

3. LIKE 允许用户复制现有的表结构，但是不复制数据。 

4. ROW FORMAT DELIMITED [FIELDS TERMINATED BY char] [COLLECTION ITEMS TERMINATED BY char] [MAP KEYS TERMINATED BY char] [LINES TERMINATED BY char] | SERDE serde_name [WITH SERDEPROPERTIES (property_name=property_value, property_name=property_value, ...)] 

   用户在建表的时候可以自定义 SerDe 或者使用自带的 SerDe。如果没有指定 ROW FORMAT 或者 ROW FORMAT DELIMITED，将会使用自带的 SerDe。在建表的时候，用户还需要为表指定列，用户在指定表的列的同时也会指定自定义的 SerDe，Hive通过 SerDe 确定表的具体的列的数据。 

   hive 默认的字段分隔符为ascii码的控制符\001,建表的时候用fields terminated by '\001',如果要测试的话，造数据在vi 打开文件里面，用ctrl+v然后再ctrl+a可以输入这个控制符\001。按顺序，\002的输入方式为ctrl+v,ctrl+b。以此类推。

5. STORED AS 

   SEQUENCEFILE|TEXTFILE|RCFILE 

   如果文件数据是纯文本，可以使用 STORED AS TEXTFILE。如果数据需要压缩，使用 STORED AS SEQUENCEFILE。 

6. PARTITIONED BY

   分区，一个表可以拥有一个或者多个分区，每个分区以文件夹的形式单独存在表文件夹的目录下。

7. CLUSTERED BY

   对于每一个表（table）或者分区， Hive可以进一步组织成桶，也就是说桶是更为细粒度的数据范 

   围划分。Hive也是 针对某一列进行桶的组织。Hive采用对列值哈希，然后除以桶的个数求余的方 

   式决定该条记录存放在哪个桶当中。 

   把表（或者分区）组织成桶（Bucket）有两个理由： 

   1. 获得更高的查询处理效率。桶为表加上了额外的结构，Hive 在处理有些查询时能利用这个结构。具体而言，连接两个在（包含连接列的）相同列上划分了桶的表，可以使用 Map 端连接 （Map-side join）高效的实现。比如JOIN操作。对于JOIN操作两个表有一个相同的列，如果对这两个表都进行了桶操作。那么将保存相同列值的桶进行JOIN操作就可以，可以大大较少JOIN的数据量。 

   2. 使取样（sampling）更高效。在处理大规模数据集时，在开发和修改查询的阶段，如果能在数据集的一小部分数据上试运行查询，会带来很多方便。 

### 管理表的操作

#### 建表初体验

```sql
use myhive; 
create table stu(id int,name string); insert into stu values (1,"zhangsan"); 
select * from stu;
```

**Hive**建表时候的字段类型

https://cwiki.apache.org/conflfluence/display/Hive/LanguageManual+Types

基本数据类型

| Hive数据类型 | Java数据类型 | 长度   | 例子         |
| ------------ | --------  | ------- |--------- |
| TINYINT      | byte         | 1byte有符号整数                                      | 20                                   |
| SMALINT      | short        | 2byte有符号整数                                      | 20                                   |
| INT          | int          | 4byte有符号整数                                      | 20                                   |
| BIGINT       | long         | 8byte有符号整数                                      | 20                                   |
| BOOLEAN      | boolean      | 布尔类型，true或者false                              | TRUE FALSE                           |
| FLOAT        | float        | 单精度浮点数                                         | 3.14159                              |
| DOUBLE       | double       | 双精度浮点数                                         | 3.14159                              |
| STRING       | string       | 字符系列。可以指定字符集。可以使用单引号或者双引号。 | ‘now is the time’ “for all good men” |
| TIMESTAMP    |              | 时间类型                                             |                                      |
| BINARY       |              | 字节数组                                             |                                      |

【注】：对于Hive的string类型就相当于数据库中的varchar类型，该类型是一个可变的字符串，但是它不能声明存储字符长度的限制，理论上它可以存储2GB的字符数。

集合数据类型

| 数据类型 | 描述                                                         | 语法示例 |
| -------- | ------------------------------------------------------------ | -------- |
| STRUCT   | 和c语言中的struct类似，都可以通过“点”符号访问元素内容。例如，如果某个列的数据类型是STRUCT{first STRING, last STRING},那么第1个元素可以通过字段.first来引用。 | struct() |
| MAP      | MAP是一组键-值对元组集合，使用数组表示法可以访问数据。例如，如果某个列的数据类型是MAP，其中键->值对是’first’->’John’和’last’->’Doe’，那么可以通过字段名[‘last’]获取最后一个元素 | map()    |
| ARRAY    | 数组是一组具有相同类型和名称的变量的集合。这些变量称为数组的元素，每个数组元素都有一个编号，编号从零开始。例如，数组值为[‘John’, ‘Doe’]，那么第2个元素可以通过数组名[1]进行引用。 | Array()  |

【注】：Array、Map和Java中的Array、Map类似；Struct和C语言中的Struct类似，它封装了一个命名字段集合，复杂数据类型允许任意层次 的嵌套。

【案例】：

假设某表有如下一行，我们用JSON格式来表示其数据结构。在Hive下访问的格式为

```json
{
    "name": "songsong",
    "friends": ["bingbing" , "lili"] ,       //列表Array,
    "children": {                      //键值Map,
        "xiao song": 18 ,
        "xiaoxiao song": 19
    }
    "address": {                      //结构Struct,
        "street": "hui long guan" ,
        "city": "beijing"
    }
}
```

#### 创建表并指定字段之间的分隔符 

```sql
create table if not exists stu2(id int ,name string) 
row format delimited fields terminated by '\t'
```

#### 根据查询结果创建表 

```sql
create table stu3 as select * from stu2; # 通过复制表结构和表内容创建新表
```

#### 根据已经存在的表结构创建表 

```sql
create table stu4 like stu2;
```

#### 查询表的类型

```sql
desc formatted stu2;
```

### 外部表的操作

#### 外部表说明

外部表因为是指定其他的hdfs路径的数据加载到表当中来，所以hive表会认为自己不完全独占这份数据，所以删除hive表的时候，数据仍然存放在hdfs当中，不会删掉

#### 管理表和外部表的使用场景 

每天将收集到的网站日志定期流入HDFS文本文件。在外部表（原始日志表）的基础上做大量的统计分析，用到的中间表、结果表使用内部表存储，数据通过SELECT+INSERT进入内部表

#### 操作案例

分别创建老师与学生表外部表，并向表中加载数据

- 创建老师表

  ```sql
  create external table teacher (t_id string,t_name string) row format delimited fields terminated by '\t'
  ```

- 创建学生表 

  ```sql
  create external table student (s_id string,s_name string,s_birth string , s_sex string ) row format delimited fields terminated by '\t'
  ```

- 加载数据(本地)

  ```sql
  load data local inpath '/export/servers/hivedatas/student.csv' into table student;
  ```

  student.csv

  ```
  01	赵雷	1990-01-01	男
  02	钱电	1990-12-21	男
  03	孙风	1990-05-20	男
  04	李云	1990-08-06	男
  05	周梅	1991-12-01	女
  06	吴兰	1992-03-01	女
  07	郑竹	1989-07-01	女
  08	王菊	1990-01-20	女
  ```

- 加载数据并覆盖已有数据

  ```sql
  load data local inpath '/export/servers/hivedatas/student.csv' overwrite into table student;
  ```

  注：执行完load 后，本地 的/hivedatas/teacher.csv文件会被复制到hive数据库目录中。

- 从**hdfs**文件系统向表中加载数据（需要提前将数据上传到**hdfs**文件系统）

  ```sql
  #cd /export/servers/hivedatas 
  #hdfs dfs -mkdir -p /hivedatas 
  #hdfs dfs -put techer.csv /hivedatas/ 
  #hive> load data inpath '/hivedatas/techer.csv' into table teacher; 
  ```

  注：执行完load 后，hdfs 的/hivedatas/teacher.csv文件会被移动（剪切）到hive数据库目录中。

  teacher.csv

  ```
  01	张三
  02	李四
  03	王五
  ```

### 分区表

在大数据中，最常用的一种思想就是分治，我们可以把大的文件切割划分成一个个的小的文件，这样每次操作一个小的文件就会很容易了，同样的道理，在hive当中也是支持这种思想的，就是我们可以把大的数据，按照每天，或者每小时进行切分成一个个的小的文件，这样去操作小的文件就会容易得多了 。

#### 创建分区表语法

```sql
create table score(s_id string,c_id string, s_score int) partitioned by (month string) row format delimited fields terminated by '\t'
```

#### 创建一个表带多个分区 

```sql
create table score2 (s_id string,c_id string, s_score int) partitioned by (year string,month string,day string) row format delimited fields terminated by '\t'
```

#### 加载数据到分区表中 

```sql
load data local inpath '/export/servers/hivedatas/score.csv' into table score partition (month='202003');
```

注：上面操作会将表文件数据加载到hive数据库目录 `month=202003`文件夹中

score.csv

```
01	01	80
01	02	90
01	03	99
02	01	70
02	02	60
02	03	80
03	01	80
03	02	80
03	03	80
04	01	50
04	02	30
04	03	20
05	01	76
05	02	87
06	01	31
06	03	34
07	02	89
07	03	98
```

#### 加载数据到多分区表中

```sql
load data local inpath '/export/servers/hivedatas/score.csv' into table score2 partition(year='2020',month='03',day='01');
```

注：上面操作会将表文件数据加载  `/year=2020/month=03/day=01 `文件夹中

多分区表联合查询(使用 union all ) 

#### 多分区表联合查询(使用 union all ) 

```sql
select * from score where month = '202002' union all select * from score where month = '202003';
```

#### 查看分区 

```sql
show partitions score;
```

#### 添加一个分区 

``` sql
alter table score add partition(month='202003'); 
```

#### 删除分区 

```sql
alter table score drop partition(month = '202003')
```



### 分桶表 

将数据按照指定的字段进行分成多个桶中去，说白了就是将数据按照字段进行划分，可以将数据按照字段划分到多个文件当中去 。

#### 开启 Hive 的分桶功能 

```shell
set hive.enforce.bucketing=true; 
```

#### 设置 Reduce 个数

```shell
set mapreduce.job.reduces=3; # 默认-1：不限制
```

#### 创建桶表 

```sql
create table course (c_id string,c_name string,t_id string) clustered by(c_id) into 3 buckets row format delimited fields terminated by '\t'
```

桶表的数据加载，由于通标的数据加载通过 hdfs dfs -put 文件或者通过 load data 均不好使，只能通过 insert overwrite 

创建普通表，并通过insert overwrite的方式将普通表的数据通过查询的方式加载到桶表当中去 

创建普通表（中间表）

```sql
create table course_common (c_id string,c_name string,t_id string) row format delimited fields terminated by '\t'
```

普通表中加载数据

```sql
load data local inpath '/export/servers/hivedatas/course.csv' into table course_common;
```

course.csv

```
01	语文	02
02	数学	01
03	英语	03
```

通过insert overwrite给桶表中加载数据

```sql
insert overwrite table course select * from course_common cluster by(c_id);
```

注：最终在hive数据库目录中文件会被分割为三份

![](./img/cluste.jpg)

### 修改表 

#### 重命名

基本语法： 

```sql
alter table old_table_name rename to new_table_name; 
```

把表score4修改成score5 

```sql
alter table score4 rename to score5
```

#### 增加**/**修改列信息 

- 查询表结构

  ```sql
  desc score5; 
  ```

- 添加列

  ```sql
  alter table score5 add columns (mycol string, mysco string);
  ```

- 更新列 

  ```sql
  alter table score5 change column mysco mysconew int;
  ```

  

### 删除表 

```sql
drop table score5;
```



### **hive **表中加载数据

#### 直接向分区表中插入数据

```sql
create table score3 like score;
insert into table score3 partition(month ='202003') values ('001','002','100');
```

#### 通过查询插入数据

通过load方式加载数据

```sql
load data local inpath '/export/servers/hivedatas/score.csv' overwrite into table score partition(month ='202003');
```

通过查询方式加载数据

```sql
create table score4 like score; insert overwrite table score4 partition(month = '202003') select s_id,c_id,s_score from score;
```



## **Hive** 查询语法 

### **SELECT** 

```sql
SELECT [ALL | DISTINCT] select_expr, select_expr, ... 
    FROM table_reference 
    [WHERE where_condition] 
    [GROUP BY col_list [HAVING condition]] 
    [CLUSTER BY col_list | [DISTRIBUTE BY col_list] 
    [SORT BY| ORDER BY col_list] 
    LIMIT number]
```

1. order by 会对输入做**全局排序**，因此只有一个reducer，会导致当输入规模较大时，需要较长的计算时间。 

2. sort by **不是全局排序**，其在数据进入reducer前完成排序。因此，如果用sort by进行排序，并且设置 mapred.reduce.tasks>1，则sort by只保证每个reducer的输出有序，不保证全局有序。 

3. distribute by(字段)根据指定的字段将数据分到不同的reducer，且分发算法是hash散列。 

4. cluster by(字段) 除了具有distribute by的功能外，还会对该字段进行排序。 ---> distribute by + sort by 因此，如果分桶和sort字段是同一个时，此时， cluster by = distribute by + sort b



分桶表的作用：最大的作用是用来提高join操作的效率； 

思考这个问题： select a.id,a.name,b.addr from a join b on a.id = b.id; 

如果a表和b表已经是分桶表，而且分桶的字段是id字段 做这个join操作时，还需要全表做笛卡尔积吗? 



### 查询语法

#### 全表查询 

```sql
select * from score; 
```

#### 选择特定列 

```sql
select s_id ,c_id from score;
```

#### 列别名 

1）重命名一个列。 

2）便于计算。 

3）紧跟列名，也可以在列名和别名之间加入关键字‘AS

```sql
select s_id as myid ,c_id from score;
```

### 常用函数 

#### 求总行数（count）

```sql
select count(1) from score; 
```

#### 求分数的最大值（max） 

```sql
select max(s_score) from score; 
```

#### 求分数的最小值（min） 

```sql
select min(s_score) from score; 
```

#### 求分数的总和（sum） 

```sql
select sum(s_score) from score; 
```

#### 求分数的平均值（avg） 

```sql
select avg(s_score) from score; 
```



### LIMIT 语句 

典型的查询会返回多行数据。LIMIT子句用于限制返回的行数。 

```sql
select * from score limit 3;
```



### WHERE 语句 

1. 使用WHERE 子句，将不满足条件的行过滤掉。 

2. WHERE 子句紧随 FROM 子句。 

3. 案例实操 

   查询出分数大于60的数据

   ```sql
   select * from score where s_score > 60;
   ```

#### 关系运算符

| 运算符        | 操作         | 描述                                                         |
| :------------ | :----------- | :----------------------------------------------------------- |
| A = B         | 所有基本类型 | 如果表达A等于表达B，结果TRUE ，否则FALSE。                   |
| A != B        | 所有基本类型 | 如果A不等于表达式B表达返回TRUE ，否则FALSE。                 |
| A < B         | 所有基本类型 | TRUE，如果表达式A小于表达式B，否则FALSE。                    |
| A <= B        | 所有基本类型 | TRUE，如果表达式A小于或等于表达式B，否则FALSE。              |
| A > B         | 所有基本类型 | TRUE，如果表达式A大于表达式B，否则FALSE。                    |
| A >= B        | 所有基本类型 | TRUE，如果表达式A大于或等于表达式B，否则FALSE。              |
| A IS NULL     | 所有类型     | TRUE，如果表达式的计算结果为NULL，否则FALSE。                |
| A IS NOT NULL | 所有类型     | FALSE，如果表达式A的计算结果为NULL，否则TRUE。               |
| A LIKE B      | 字符串       | TRUE，如果字符串模式A匹配到B，否则FALSE。                    |
| A RLIKE B     | 字符串       | NULL，如果A或B为NULL；TRUE，如果A任何子字符串匹配Java正则表达式B；否则FALSE。 |
| A REGEXP B    | 字符串       | 等同于RLIKE.                                                 |

- 查询分数等于80的所有的数据

  ```sql
  select * from score where s_score = 80; 
  ```

- 查询分数在80到100的所有数据

  ```sql
  select * from score where s_score between 80 and 100; 
  ```

- 查询成绩为空的所有数据

  ```sql
  select * from score where s_score is null;
  ```

- 查询成绩是80和90的数据

  ```sql
  select * from score where s_score in(80,90);
  ```

#### **LIKE** 和 **RLIKE** 

- 使用LIKE运算选择类似的值 

- 选择条件可以包含字符或数字:

  % 代表零个或多个字符(任意个字符)。 

  _ 代表一个字符。 

- RLIKE 子句是Hive中这个功能的一个扩展，其可以通过Java的正则表达式这个更强大的语言来指定匹配条件。

案例实操 :

1. 查找以8开头的所有成绩 

   ```sql
   select * from score where s_score like '8%'; 
   ```

2. 查找第二个数值为9的所有成绩数据

   ```sql
   select * from score where s_score like '_9%'; 
   ```

3. 查找成绩中含9的所有成绩数据

   ```sql
   select * from score where s_score rlike '[9]'; #等价于like '%9%'
   ```

   

#### 逻辑运算符

| 运算符   | 操作    | 描述                                      |
| :------- | :------ | :---------------------------------------- |
| A AND B  | boolean | TRUE，如果A和B都是TRUE，否则FALSE。       |
| A && B   | boolean | 类似于 A AND B.                           |
| A OR B   | boolean | TRUE，如果A或B或两者都是TRUE，否则FALSE。 |
| A \|\| B | boolean | 类似于 A OR B.                            |
| NOT A    | boolean | TRUE，如果A是FALSE，否则FALSE。           |
| !A       | boolean | 类似于 NOT A.                             |

- 查询成绩大于80，并且s_id是01的数据

  ```sql
  select * from score where s_score >80 and s_id = '01'; 
  ```

- 查询成绩大于80，或者s_id 是01的数 

  ```sql
  select * from score where s_score > 80 or s_id = '01'; 
  ```

- 查询s_id 不是 01和02的学生 

  ```sql
  select * from score where s_id not in ('01','02')
  ```

### 分组 

#### **GROUP BY** 语句

GROUP BY语句通常会和聚合函数一起使用，按照一个或者多个列队结果进行分组，然后对每个组执行聚合操作。 

案例实操： 

- 计算每个学生的平均分数 

  ```sql
  select s_id ,avg(s_score) from score group by s_id; 
  ```

- 计算每个学生最高成绩 

  ```sql
  select s_id ,max(s_score) from score group by s_id; 
  ```

#### **HAVING** 语句 

- having 与 where不同点 

  1. where针对表中的列发挥作用，查询数据；having针对查询结果中的列发挥作用，筛选数据。 

  2. where后面不能写分组函数，而having后面可以使用分组函数。 

  3. having只用于group by分组统计语句。 

- 案例实操：

  - 求每个学生的平均分数 

    ```sql
    select s_id ,avg(s_score) from score group by s_id;
    ```

  - 求每个学生平均分数大于85的人 

    ```sql
    select s_id ,avg(s_score) avgscore from score group by s_id having avgscore > 85;
    ```

    

### **JOIN** 语句 

#### 等值 **JOIN** 

Hive支持通常的SQL JOIN语句，但是只支持等值连接，不支持非等值连接。 

案例操作: 查询分数对应的姓名 

```sql
SELECT s.s_id,s.s_score,stu.s_name,stu.s_birth FROM score s LEFT JOIN student stu ON s.s_id = stu.s_id;
```

#### 内连接 

内连接：只有进行连接的两个表中都存在与连接条件相匹配的数据才会被保留下来。 

```sql
select * from techer t inner join course c on t.t_id = c.t_id;
```

#### 左外连接

左外连接：JOIN操作符左边表中符合WHERE子句的所有记录将会被返回。 查询老师对应的课程 

```sql
select * from techer t left join course c on t.t_id = c.t_id;
```

#### 右外连接 

右外连接：JOIN操作符右边表中符合WHERE子句的所有记录将会被返回。 

````sql
select * from teacher t right join course c on t.t_id = c.t_id; 
````

#### 多表连接 

注意：连接 n个表，至少需要n-1个连接条件。例如：连接三个表，至少需要两个连接条件。 

多表连接查询，查询老师对应的课程，以及对应的分数，对应的学生 

```sql
select * from teacher t 
left join course c on t.t_id = c.t_id 
left join score s on s.c_id = c.c_id 
left join student stu on s.s_id = stu.s_id;
```

大多数情况下，Hive会对每对JOIN连接对象启动一个MapReduce任务。本例中会首先启动一个MapReduce job对表 techer和表course进行连接操作，然后会再启动一个MapReduce job将第一个MapReduce job的输出和score;进行连接操作。 



### 排序 

#### 全局排序 

Order By：全局排序，只能有一个reduce 

1. 使用 ORDER BY 子句排序 

   ASC（ascend）: 升序（默认） 

   DESC（descend）: 降序 

2. ORDER BY 子句在SELECT语句的结尾。 

案例实操 

1. 查询学生的成绩，并按照分数降序排列 

   ```sql
   SELECT * FROM student s LEFT JOIN score sco ON s.s_id = sco.s_id ORDER BY sco.s_score DESC; 
   ```

2. 查询学生的成绩，并按照分数升序排列 

   ```sql
   SELECT * FROM student s LEFT JOIN score sco ON s.s_id = sco.s_id ORDER BY sco.s_score asc; 
   ```

#### 按照别名排序 

按照分数的平均值排序

```sql
select s_id ,avg(s_score) avg from score group by s_id order by avg;
```

#### 多个列排序

按照学生id和平均成绩进行排序 

```sql
select s_id ,avg(s_score) avg from score group by s_id order by s_id,avg; 
```

#### 每个**MapReduce**内部排序（**Sort By**）局部排序 

Sort By：每个MapReduce内部进行排序，对全局结果集来说不是排序。 

1. 设置reduce个数 

   ```shell
   #hive> set mapreduce.job.reduces=3; 
   ```

2. 查看设置reduce个数 

   ``` shell
   #hive> set mapreduce.job.reduces;
   ```

3. 查询成绩按照成绩降序排列 

   ```sql
   select * from score sort by s_score; 
   ```

4. 将查询结果导入到文件中（按照成绩降序排列） 

   ```sql
   insert overwrite local directory '/export/servers/hivedatas/sort' select * from score sort by s_score;
   ```



#### 分区排序（**DISTRIBUTE BY**）

Distribute By：类似MR中partition，进行分区，结合sort by使用。 

注意，Hive要求DISTRIBUTE BY语句要写在SORT BY语句之前。 

对于distribute by进行测试，一定要分配多reduce进行处理，否则无法看到distribute by的效果。 

案例实操：先按照学生id进行分区，再按照学生成绩进行排序。 

1. 设置reduce的个数，将我们对应的s_id划分到对应的reduce当中去 

   ```shell
   #hive> set mapreduce.job.reduces=7; 
   ```

2. 通过distribute by 进行数据的分区 

   ```sql
   insert overwrite local directory '/export/servers/hivedatas/sort' select * from score distribute by s_id sort by s_score;
   ```

   


#### 分桶排序（**CLUSTER BY** ）

当distribute by和sort by字段相同时，可以使用cluster by方式。cluster by除了具有distribute by的功能外还兼具sort by的功能。但是排序只能是倒序排序，不能指定排序规则为ASC 或者DESC。 

以下两种写法等价 

```sql
select * from score cluster by s_id; 
select * from score distribute by s_id sort by s_id; 
```



## **Hive** 函数

### 内置函数

内容较多，见《Hive官方文档》 https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF 

#### 查看系统自带的函数 

```shell
#hive> show functions; 
```

#### 显示自带的函数的用法 

```shell
#hive> desc function upper; 
```

#### 详细显示自带的函数的用法 

```shell
#hive> desc function extended upper; 
```

#### 常用内置函数 

- 字符串连接函数： concat 

  ```sql
  select concat('abc','def’,'gh'); 
  ```

- 带分隔符字符串连接函数： concat_ws 

  ```sql
  select concat_ws(',','abc','def','gh');
  ```

-  cast类型转换

  ```sql
  select cast(1.5 as int);
  ```

- get_json_object(json 解析函数，用来处理json，必须是json格式) 

  ```sql
  select get_json_object('{"name":"jack","age":"20"}','$.name');
  ```

-  URL解析函数 

  ```sql
  select parse_url('http://facebook.com/path1/p.php?k1=v1&k2=v2#Ref1', 'HOST'); 
  #结果：facebook.com
  ```

  ```sql
  select parse_url('http://facebook.com/path1/p.php?k1=v1&k2=v2#Ref1', 'PATH'); 
  #结果：/path1/p.php
  ```

  ```sql
  select parse_url('http://facebook.com/path1/p.php?k1=v1&k2=v2#Ref1', 'QUERY'); 
  #结果：K1=V1&K2=V2
  ```

  ```sql
  select parse_url('http://facebook.com/path1/p.php?k1=v1&k2=v2#Ref1', 'QUERY','k1'); 
  #结果：V1
  ```

  

### 自定义函数

1. Hive 自带了一些函数，比如：max/min等，但是数量有限，自己可以通过自定义UDF来方便的扩展。 

2. 当Hive提供的内置函数无法满足你的业务处理需要时，此时就可以考虑使用用户自定义函数（UDF：user-defifined function）。 

3. 根据用户自定义函数类别分为以下三种：upper -->my_upper 
   - UDF（User-Defifined-Function）
     - 一进一出 

   - UDAF（User-Defifined Aggregation Function） 

     - 聚集函数，多进一出 

     - 类似于： count / max / min 

   - UDTF（User-Defifined Table-Generating Functions） 

     - 一进多出 

     - 如 lateral view explore() 

4. 官方文档地址 https://cwiki.apache.org/confluence/display/Hive/HivePlugins 

5. 编程步骤： 
   1）继承org.apache.hadoop.hive.ql.UDF 

   2）需要实现evaluate函数；evaluate函数支持重载； 

6. 注意事项 

   1）UDF必须要有返回类型，可以返回null，但是返回类型不能为void； 

   2）UDF中常用Text/LongWritable等类型，不推荐使用java类型； 

### **UDF** 开发实例

#### **Step 1** 创建 **Maven** 工程

```xml
    <!-- https://mvnrepository.com/artifact/org.apache.hive/hive-exec --> 
    <dependency> 
        <groupId>org.apache.hive</groupId> 
        <artifactId>hive-exec</artifactId> 
        <version>3.1.1</version> 
    </dependency> 
    <!-- https://mvnrepository.com/artifact/org.apache.hadoop/hadoop-common --> 	
    <dependency> 
        <groupId>org.apache.hadoop</groupId> 
        <artifactId>hadoop-common</artifactId> 
        <version>3.1.1</version> 
        </dependency> 
    </dependencies> 
```

#### **Step 2** 开发 **Java** 类集成 **UDF** 

```java
public class MyUDF extends UDF{ 
    public Text evaluate(final Text str){ 
        String tmp_str = str.toString(); 
        if(str != null && !tmp_str.equals("")){ 
            String str_ret = tmp_str.substring(0, 1).toUpperCase()+tmp_str.substring(1); 
            return new Text(str_ret); 
        }
        return new Text(""); 
    } 
}
```

#### **Step 3** 项目打包，并上传到**hive**的**lib**目录下

![](./img/udf.png)

#### Step 4添加**jar**包 

重命名我们的jar包名称

```shell
#cd /export/servers/apache-hive-3.1.1-bin/lib 
#mv original-day_05_hive_udf-1.0-SNAPSHOT.jar myudf.jar 
```

hive的客户端添加我们的jar包 

```shell
#hive> add jar /export/servers/apache-hive-3.1.1-bin/lib/udf.jar;
```

#### **Step 5** 设置函数与我们的自定义函数关联 

```sql
create temporary function my_upper as 'cn.itcast.udf.ItcastUDF';
```

#### **Step 6** 使用自定义函数

```shell
select my_upper('abc');
```