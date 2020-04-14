# Kubernetes

## 第 1 章 Kubernetes 概述

![](./img/k8s.png)

- 官网：https://kubernetes.io

- Github：https://github.com/kubernetes/kubernetes

- 由来：谷歌的Borg系统, 后经Go语言重写并捐献给CNCF基金会开源

- 含义：词根源于希腊语：舵手/飞行员，K8S -》K 8个字母 S

- 重要作用：开源的容器编排框架工具（生态极其丰富）

- 学习意义：解决跑裸docker 的若干痛点

  > 使用Docker容器话封装应用程序的缺点：
  >
  > - 单击使用, 无法有效集群
  > - 随着容器数量的上升, 管理成本攀升
  > - 没有有效的容灾/自愈机制
  > - 没有预设编排模板, 无法实现快速、大规模容器调度
  > - 没有统一的配置管理中心工具
  > - 没有容器生命周期管理工具
  > - 没有图形化运维管理工具
  > - ...
  
  

## 第 2 章 Kubernetes 优势

- 自动装箱, 水平扩展, 自我修复
- 服务发现和负载均衡
- 自动发布（默认滚动发布模式）和回滚
- 集中化配置管理和秘钥管理
- 存储编排
- 任务批处理运行
- ...



## 第 3 章 Kubernetes 快速入门

### 3.1 四组基本概念

- Pod/Pod控制器

- Name/Namespace

- Label/Label选择器

- Service/Ingress

  

#### 3.1.1 Pod/Pod控制器

- **Pod**

  - Pod是K8S里能够被运行的最小的逻辑单元（原子单元）；
  - 1个Pod里面可以运行多个容器, 它们共享UTS+NET+IPC名字空间；

  - 可以把Pod理解成豌豆荚, 而同一个Pod内的每个容器是一颗颗豌豆；

  - 一个Pod里运行多个容器, 又叫：边车（SideCar）模式。

- **Pod控制器**

  - Pod控制器是Pod启动的一种模板, 用来保证在 K8S 里启动的 Pod 应始终按照人们的预期运行 (副本数、生命周期、健康状态检查...)。

  - K8S 内提供了众多的 Pod 控制器，常用的有以下几种：

    - Deployment
    - DaemonSet
    - ReplicaSet
    - StatefulSet
    - Job
    - Cronjob

    

#### 3.1.2 Name/Namespace

- **Name**
  - 由于 K8S 内部, 使用“资源”来定义每一种逻辑概念（功能）故每种“资源”, 都应该有自己的“名称”。
  - “资源”有 api 版本（apiVersion）类别（kind）、元数据（metadata）、定义清单（spec）、状态（status）等配置信息。
  - “名称”通常定义在“资源”的“元数据“信息里。
- **Namespace**
  - 随着项目增多、人员增加、集群规模的扩大, 需要一种能够隔离 K8S 内各种“资源”的方法, 这就是名称空间。
  - 名称空间可以理解为 K8S 内部的虚拟集群组。
  - 不同名称空间内的“资源”, 名称可以相同, 相同名称空间内的同种“资源”, “名称” 不能相同。
  - 合理的使用 K8S 的名称空间使得集群管理员能够更好的对交付到 K8S 里的服务器进行分类管理和浏览。
  - K8S里默认存在的名称空间有：default、kube-system、kube-public。
  - 查询 K8S 里特定“资源”要带上相应的名称空间。



#### 3.1.3 Label/Label选择器

- **Label**
  - 标签是 K8S 特色的管理方式, 便于分类管理资源对象。
  - 一个标签可以对应多个资源, 一个资源也可以有多个标签, 它们是多对多的关系。
  - 一个资源拥有多个标签, 可以实现不同维度的管理。
  - 标签的组成: key=value。
  - 与标签类似的还有一种“注释”（annotations）。
- **Label 选择器**
  - 给资源打上标签后, 可以使用标签选择器过滤指定的标签。
  - 标签选择器目前有两个：基于等值关系（等于、不等于）和基于集合关系（属于、不属于、存在）。
  - 许多资源支持内嵌标签选择器字段
    - matchLabels
    - matchExpressions



#### 3.1.4 Service/Ingress

- **Service**
  - 在 K8S 的世界里, 虽然没个 Pod 都会被分配一个单独的 IP 地址, 但这个 IP 地址会随着 Pod 的销毁而消失。
  - Service（服务）就是用来解决这个问题的核心概念。
  - 一个 Service 可以看作一组提供相同服务的 Pod 的对外访问接口。
  - Service 作用于哪些 Pod 是通过标签选择器来定义的。
- **Ingress**
  - Ingress 是 K8S 集群里工作在 OSI 网络参考模型下, 第 7 层的应用, 对外暴露的接口。
  - Service 只能进行 L4 浏览调度, 表现形式是 ip+port。
  - Ingress 则可以调度不同的业务域、不同 URL 访问路径的业务流量。



## 第 4 章 Kubernetes 核心功能

### 4.1 调度

Kubernetes 可以把用户提交的容器放到 Kubernetes 管理的集群的某一台节点上去。Kubernetes 的调度器是执行这项能力的组件，它会观察正在被调度的这个容器的大小、规格。

比如说它所需要的 CPU 以及它所需要的 memory，然后在集群中找一台相对比较空闲的机器来进行一次 placement，也就是一次放置的操作。在这个例子中，它可能会把红颜色的这个容器放置到第二个空闲的机器上，来完成一次调度的工作。

![](./img/k8s_scheduler.png)



### 4.2 自动修复

Kubernetes 有一个节点健康检查的功能，它会监测这个集群中所有的宿主机，当宿主机本身出现故障，或者软件出现故障的时候，这个节点健康检查会自动对它进行发现。

下面 Kubernetes 会把运行在这些失败节点上的容器进行自动迁移，迁移到一个正在健康运行的宿主机上，来完成集群内容器的一个自动恢复。

![](./img/k8s_fix.png)

### 4.3 水平伸缩

Kubernetes 有业务负载检查的能力，它会监测业务上所承担的负载，如果这个业务本身的 CPU 利用率过高，或者响应时间过长，它可以对这个业务进行一次扩容。

比如说在下面的例子中，黄颜色的过度忙碌，Kubernetes 就可以把黄颜色负载从一份变为三份。接下来，它就可以通过负载均衡把原来打到第一个黄颜色上的负载平均分到三个黄颜色的负载上去，以此来提高响应的时间。

![](./img/k8s_expend.png)



## 第 5 章 Kubernetes 的架构

Kubernetes 架构是一个比较典型的二层架构和 server-client 架构。Master 作为中央的管控节点，会去与 Node 进行一个连接。

所有 UI 的、clients、这些 user 侧的组件，只会和 Master 进行连接，把希望的状态或者想执行的命令下发给 Master，Master 会把这些命令或者状态下发给相应的节点，进行最终的执行。

![](./img/k8s_schdule.png)



### 5.1 Master

Kubernetes 的 Master 包含四个主要的组件：API Server、Controller、Scheduler 以及 etcd。如下图所示：

![](./img/k8s_master.png)



- **API Server：**顾名思义是用来处理 API 操作的，Kubernetes 中所有的组件都会和 API Server 进行连接，组件与组件之间一般不进行独立的连接，都依赖于 API Server 进行消息的传送；
- **Controller：**是控制器，它用来完成对集群状态的一些管理。比如刚刚我们提到的两个例子之中，第一个自动对容器进行修复、第二个自动进行水平扩张，都是由 Kubernetes 中的 Controller 来进行完成的；
- **Scheduler：**是调度器，“调度器”顾名思义就是完成调度的操作，就是我们刚才介绍的第一个例子中，把一个用户提交的 Container，依据它对 CPU、对 memory 请求大小，找一台合适的节点，进行放置；
- **etcd：**是一个分布式的一个存储系统，API Server 中所需要的这些原信息都被放置在 etcd 中，etcd 本身是一个高可用系统，通过 etcd 保证整个 Kubernetes 的 Master 组件的高可用性。

我们刚刚提到的 API Server，它本身在部署结构上是一个可以水平扩展的一个部署组件；Controller 是一个可以进行热备的一个部署组件，它只有一个 active，它的调度器也是相应的，虽然只有一个 active，但是可以进行热备。



### 5.2 **Node**

Kubernetes 的 Node 是真正运行业务负载的，每个业务负载会以 Pod 的形式运行。一个 Pod 中运行的一个或者多个容器，真正去运行这些 Pod 的组件的是叫做 **kubelet**，也就是 Node 上最为关键的组件，它通过 API Server 接收到所需要 Pod 运行的状态，然后提交到我们下面画的这个 Container Runtime 组件中。

![](./img/k8s_node.png)



在 OS 上去创建容器所需要运行的环境，最终把容器或者 Pod 运行起来，也需要对存储跟网络进行管理。Kubernetes 并不会直接进行网络存储的操作，他们会靠 Storage Plugin 或者是网络的 Plugin 来进行操作。用户自己或者云厂商都会去写相应的 **Storage Plugin** 或者 **Network Plugin**，去完成存储操作或网络操作。

在 Kubernetes 自己的环境中，也会有 Kubernetes 的 Network，它是为了提供 Service network 来进行搭网组网的。真正完成 service 组网的组件的是 **Kube-proxy**，它是利用了 iptable 的能力来进行组建 Kubernetes 的 Network，就是 cluster network，以上就是 Node 上面的四个组件。

Kubernetes 的 Node 并不会直接和 user 进行 interaction，它的 interaction 只会通过 Master。而 User 是通过 Master 向节点下发这些信息的。Kubernetes 每个 Node 上，都会运行我们刚才提到的这几个组件。

下面我们以一个例子再去看一下 Kubernetes 架构中的这些组件，是如何互相进行 interaction 的。



## 第 6 章 环境搭建

### 6.1 准备环境

| 主机    | 服务 | 备注 |
| ------- | ---- | ---- |
| node-01 |      |      |
| node-02 |      |      |
| node-03 |      |      |
| node-04 |      |      |
| node-05 |      |      |

1. 关闭 SELinux 和 firewalld

   ```shell
   systemctl stop firewalld               #临时关闭
   
   systemctl disable firewalld            #永久关闭,即设置开机的时候不自动启动
   ```

   ```
   永久关闭selinux可以使用vi命令打开/etc/sysconfig/selinux 文件将SELINUXTYPE=(disable或permissive）
   ```

   永久关闭selinux可以使用vi命令打开/etc/sysconfig/selinux 文件将SELINUXTYPE=(disable或permissive）

2. 为全部服务器安装 epel-release 源

   ```shell
   yum install epel-release -y
   ```

3. 为全部服务器安装常用工具

   ```shell
   yum install wget telnet net-tools tree nmap sysstat lrzsz dos2unix bind-utils -y
   ```



### 6.2 DNS 服务初始化

#### 6.2.1 安装 bind9 软件

在 node-01 上执行命令

```shell
yum install bind -y
```

```shell
[root@node-01 ~]# rpm -qa bind
bind-9.11.4-9.P2.el7.x86_64
```



#### 6.2.2 配置 bind9

- 主配置文件

	```shell
	vi /etc/named.conf
	```

	```shell
	listen-on port 53 { 10.10.50.50; };
	allow-query     { any; };
	forwarders      { 10.10.50.1; };
	dnssec-enable no;
	dnssec-validation no;
	```

	​	检查配置, 没有保存就是 OK

	```shell
	name-checkconf
	```

- 区域配置文件

  ```shell
  vi /etc/named.rfc1912.zones 
  ```

  ```
  zone "host.com" IN {
          type master;
          file "host.com.zone";
          allow-update { 10.10.50.50; };
  };
  
  zone "thtf.com" IN {
          type master;
          file "thtf.com.zone";
          allow-update { 10.10.50.50; };
  };
  ```

- 区域数据文件

  ```shell
  vi  /var/named/host.com.zone
  ```

  ```
  $ORIGIN host.com.
  $TTL 600    ; 10 minutes
  @       IN SOA  dns.host.com. dnsadmin.host.com. (
                  2020032001 ; serial
                  10800      ; refresh (3 hours)
                  900        ; retry (15 minutes)
                  604800     ; expire (1 week)
                  86400      ; minimum (1 day)
                  )
              NS   dns.host.com.
  $TTL 60 ; 1 minute
  dns                A    10.10.50.50
  node-01            A    10.10.50.50           
  node-02            A    10.10.50.20
  node-03            A    10.10.50.233
  node-04            A    10.10.50.99
  node-05            A    10.10.50.40
  ```

  ```shell
  vi  /var/named/thtf.com.zone
  ```

  ```
  $ORIGIN thtf.com.
  $TTL 600    ; 10 minutes
  @           IN SOA  dns.thtf.com. dnsadmin.thtf.com. (
                  2020032001 ; serial
                  10800      ; refresh (3 hours)
                  900        ; retry (15 minutes)
                  604800     ; expire (1 week)
                  86400      ; minimum (1 day)
                  )
                  NS   dns.thtf.com.
  $TTL 60 ; 1 minute
  dns                A    10.10.50.50
  ```

  检查配置, 没有保存就是 OK

  ```shell
  named-checkconf
  ```

#### 6.2.3 启动 bind9

```shell
[root@node-01 ~]# systemctl start named
[root@node-01 ~]# netstat -lntup|grep 53
tcp        0      0 10.10.50.50:53          0.0.0.0:*               LISTEN      26226/named         
tcp        0      0 127.0.0.1:953           0.0.0.0:*               LISTEN      26226/named         
tcp6       0      0 :::53                   :::*                    LISTEN      26226/named         
tcp6       0      0 ::1:953                 :::*                    LISTEN      26226/named         
udp        0      0 10.10.50.50:53          0.0.0.0:*                           26226/named         
udp6       0      0 :::53                   :::*                                26226/named 
```



#### 6.2.4 检查 DNS 服务

```shell
[root@node-01 ~]# dig -t A node-01.host.com @10.10.50.50 +short
10.10.50.50
[root@node-01 ~]# dig -t A node-02.host.com @10.10.50.50 +short
10.10.50.20
[root@node-01 ~]# dig -t A node-03.host.com @10.10.50.50 +short
10.10.50.233
[root@node-01 ~]# dig -t A node-04.host.com @10.10.50.50 +short
10.10.50.99
[root@node-01 ~]# dig -t A node-05.host.com @10.10.50.50 +short
10.10.50.40
```



#### 6.2.5 配置 DNS 客户端

全部主机执行下面操作

```shell
vi /etc/sysconfig/network-scripts/ifcfg-eth0
DNS1=10.10.50.50
```
```shell
vi /etc/resolv.conf
search host.com
nameserver 10.10.50.50
```
```
systemctl restart network
```



### 6.3 准备签发证书环境

在 node-02 上

#### 6.3.1 安装 cfssl

```shell
wget https://pkg.cfssl.org/R1.2/cfssl_linux-amd64 -O /usr/bin/cfssl
wget https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64 -O /usr/bin/cfssl-json
wget https://pkg.cfssl.org/R1.2/cfssl-certinfo_linux-amd64 -O /usr/bin/cfssl-certinfo
chmod +x /usr/bin/cfssl*
```

#### 6.3.2 创建生成ca证书csr的json配置文件

```shell
mkdir /opt/certs
vi  /opt/certs/ca-csr.json
```

```json
{
    "CN": "thtf",
    "hosts": [
    ],
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "ST": "beijing",
            "L": "beijing",
            "O": "thtf",
            "OU": "ops"
        }
    ],
    "ca": {
        "expiry": "175200h"
    }
}
```

> CN：Common Name, 浏览器使用该字段验证网站是否合法, 一般写的是域名。非常重要。
>
> C：Country, 国家
>
> ST：State, 州, 省
>
> L：Locality 地区 城市
>
> O： Organization Name 组织名称 公司名称
>
> OU：Organization Unit Name 组织单位名称 公司部门



#### 6.3.3 生成ca证书文件

```shell
[root@node-02 ~]# cd /opt/certs

[root@node-02 certs]# cfssl gencert -initca ca-csr.json | cfssl-json -bare ca
2020/04/14 10:53:46 [INFO] generating a new CA key and certificate from CSR
2020/04/14 10:53:46 [INFO] generate received request
2020/04/14 10:53:46 [INFO] received CSR
2020/04/14 10:53:46 [INFO] generating key: rsa-2048
2020/04/14 10:53:46 [INFO] encoded CSR
2020/04/14 10:53:46 [INFO] signed certificate with serial number 35390055852589240424773939585539235500209661940
[root@node-02 certs]# ll
总用量 16
-rw-r--r-- 1 root root  989 4月  14 10:53 ca.csr
-rw-r--r-- 1 root root  325 4月  14 10:53 ca-csr.json
-rw------- 1 root root 1675 4月  14 10:53 ca-key.pem
-rw-r--r-- 1 root root 1338 4月  14 10:53 ca.pem
```



### 6.4 部署 docker

node-03 node-04 node-05上

#### 6.4.1 安装

```shell
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

#### 6.4.2 配置

```shell
mkdir  /etc/docker
vi  /etc/docker/daemon.json
```

```json
{
  "graph": "/data/docker",
  "storage-driver": "overlay2",
  "insecure-registries": ["registry.access.redhat.com","quay.io","harbor.thtf.com"],
  "registry-mirrors": ["https://q2gr04ke.mirror.aliyuncs.com"],
  "bip": "172.7.21.1/24",
  "exec-opts": ["native.cgroupdriver=systemd"],
  "live-restore": true
}
##########
bip要根据宿主机ip变化 
```

#### 6.4.3 启动

```shell
mkdir -p /data/docker
systemctl start docker
systemctl enable docker
docker --version
```



### 6.5 部署私有仓库 harbor

在 node-05 上

#### 6.5.1 下载软件并解压



harbor官网github地址 https://github.com/goharbor/harbor

```shell
tar xf harbor-offline-installer-v1.8.3.tgz -C /opt/
mv harbor/ harbor-v1.8.3
ln -s /opt/harbor-v1.8.3/ /opt/harbor
```

```
lrwxrwxrwx 1 root root  19 4月  14 12:13 harbor -> /opt/harbor-v1.8.3/
drwxr-xr-x 2 root root 100 4月  14 12:12 harbor-v1.8.3
drwxr-xr-x 2 root root  49 4月  14 12:13 install_package
```



#### 6.5.2 配置

```shell
mkdir -p /data/harbor/logs
vi /opt/harbor/harbor.yml
```

修改配置：

```yml
hostname: harbor.thtf.com
http:
  port: 180
 harbor_admin_password:Harbor12345
data_volume: /data/harbor
log:
    level:  info
    rotate_count:  50
    rotate_size:200M
    location: /data/harbor/logs
```

#### 6.5.3 安装 docker-compose

```shell
yum install docker-compose -y
```

#### 6.5.4 安装 harbor

```shell
# 进入 harbor 根目录
[root@node-05 harbor]# ll
总用量 569632
-rw-r--r-- 1 root root 583269670 9月  16 2019 harbor.v1.8.3.tar.gz
-rw-r--r-- 1 root root      4528 4月  14 12:19 harbor.yml
-rwxr-xr-x 1 root root      5088 9月  16 2019 install.sh
-rw-r--r-- 1 root root     11347 9月  16 2019 LICENSE
-rwxr-xr-x 1 root root      1654 9月  16 2019 prepare
[root@node-05 harbor]# ./install.sh 
```

#### 6.5.5 检查 harbor 启动情况

```shell
[root@node-05 harbor]# docker-compose ps
      Name                     Command               State             Ports          
--------------------------------------------------------------------------------------
harbor-core         /harbor/start.sh                 Up                               
harbor-db           /entrypoint.sh postgres          Up      5432/tcp                 
harbor-jobservice   /harbor/start.sh                 Up                               
harbor-log          /bin/sh -c /usr/local/bin/ ...   Up      127.0.0.1:1514->10514/tcp
harbor-portal       nginx -g daemon off;             Up      80/tcp                   
nginx               nginx -g daemon off;             Up      0.0.0.0:180->80/tcp      
redis               docker-entrypoint.sh redis ...   Up      6379/tcp                 
registry            /entrypoint.sh /etc/regist ...   Up      5000/tcp                 
registryctl         /harbor/start.sh                 Up                               
[root@node-05 harbor]# docker ps -a
CONTAINER ID        IMAGE                                               COMMAND                  CREATED             STATUS                             PORTS                       NAMES
118479faae3c        goharbor/nginx-photon:v1.8.3                        "nginx -g 'daemon of…"   27 seconds ago      Up 25 seconds (health: starting)   0.0.0.0:180->80/tcp         nginx
a01be83050a8        goharbor/harbor-portal:v1.8.3                       "nginx -g 'daemon of…"   28 seconds ago      Up 26 seconds (health: starting)   80/tcp                      harbor-portal
bd00d3fa85cc        goharbor/harbor-jobservice:v1.8.3                   "/harbor/start.sh"       28 seconds ago      Up 26 seconds                                                  harbor-jobservice
30e39e116f97        goharbor/harbor-core:v1.8.3                         "/harbor/start.sh"       29 seconds ago      Up 27 seconds (health: starting)                               harbor-core
3ecf74bd9a7b        goharbor/redis-photon:v1.8.3                        "docker-entrypoint.s…"   30 seconds ago      Up 28 seconds                      6379/tcp                    redis
9acf04233a0d        goharbor/harbor-db:v1.8.3                           "/entrypoint.sh post…"   30 seconds ago      Up 28 seconds (health: starting)   5432/tcp                    harbor-db
0795ebef5a5d        goharbor/harbor-registryctl:v1.8.3                  "/harbor/start.sh"       30 seconds ago      Up 28 seconds (health: starting)                               registryctl
e36367cf43e8        goharbor/registry-photon:v2.7.1-patch-2819-v1.8.3   "/entrypoint.sh /etc…"   30 seconds ago      Up 28 seconds (health: starting)   5000/tcp                    registry
33d5234e3edf        goharbor/harbor-log:v1.8.3                          "/bin/sh -c /usr/loc…"   31 seconds ago      Up 29 seconds (health: starting)   127.0.0.1:1514->10514/tcp   harbor-log

```



#### 6.5.6 配置 harbor 的 dns 内网解析

在 node-01 上

```shell
vi /var/named/thtf.com.zone
```

```
$ORIGIN thtf.com.
$TTL 600    ; 10 minutes
@           IN SOA  dns.thtf.com. dnsadmin.thtf.com. (
                2020032002 ; serial
                10800      ; refresh (3 hours)
                900        ; retry (15 minutes)
                604800     ; expire (1 week)
                86400      ; minimum (1 day)
                )
                NS   dns.thtf.com.
$TTL 60 ; 1 minute
dns                A    10.10.50.50
harbor             A    10.10.50.40
```

> 2020032002 ; serial 前滚一个序号
>
> harbor             A    10.10.50.40

重启 named

```shell
systemctl restart named
```

检查

```shell
[root@node-01 ~]# dig -t A harbor.thtf.com +short
10.10.50.40
```

#### 6.5.6 安装 Nginx 并配置

在 node-05 上

```shell
yum install nginx -y
```

修改配置文件

 ```shell
vi /etc/nginx/conf.d/harbor.thtf.com.conf
 ```

```
server {
    listen       80;
    server_name  harbor.thtf.com;

    client_max_body_size 1000m;

    location / {
        proxy_pass http://127.0.0.1:180;
    }
}
```

```shell
[root@node-05 harbor]# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
[root@node-05 harbor]# systemctl start nginx
[root@node-05 harbor]# systemctl enable nginx
Created symlink from /etc/systemd/system/multi-user.target.wants/nginx.service to /usr/lib/systemd/system/nginx.service.
```



#### 6.5.7 测试



1. 浏览器输入：harbor.thtf.com 

![](./img/harbor.png)



2. 输入用户名：admin 密码：Harbor12345

   ![](./img/harbor_admin.png)

   

3. 新建项目：public 访问级别：公开

   ![](./img/harbor_public.png)

   ![](./img/harbor_public_list.png)

   

4. 下载镜像并给镜像打 tag

   ```shell
   [root@node-05 harbor]# docker pull nginx:1.7.9
   1.7.9: Pulling from library/nginx
   Image docker.io/library/nginx:1.7.9 uses outdated schema1 manifest format. Please upgrade to a schema2 image for better future compatibility. More information at https://docs.docker.com/registry/spec/deprecated-schema-v1/
   a3ed95caeb02: Pull complete 
   6f5424ebd796: Pull complete 
   d15444df170a: Pull complete 
   e83f073daa67: Pull complete 
   a4d93e421023: Pull complete 
   084adbca2647: Pull complete 
   c9cec474c523: Pull complete 
   Digest: sha256:e3456c851a152494c3e4ff5fcc26f240206abac0c9d794affb40e0714846c451
   Status: Downloaded newer image for nginx:1.7.9
   docker.io/library/nginx:1.7.9
   [root@node-05 harbor]# docker images|grep nginx
   goharbor/nginx-photon           v1.8.3                     3a016e0dc7de        7 months ago        37MB
   nginx                           1.7.9                      84581e99d807        5 years ago         91.7MB
   [root@node-05 harbor]# docker tag 84581e99d807 harbor.thtf.com/public/nginx:v1.7.9
   [root@node-05 harbor]# docker images|grep nginx
   goharbor/nginx-photon           v1.8.3           vi vi           3a016e0dc7de        7 months ago        37MB
   nginx                           1.7.9                      84581e99d807        5 years ago         91.7MB
   harbor.thtf.com/public/nginx     v1.7.9                     84581e99d807        5 years ago         91.7MB
   
   ```

   

5. 登录 harbor 并上传仓库

   ```shell
   [root@node-05 harbor]# docker login harbor.thtf.com
   Authenticating with existing credentials...
   WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
   Configure a credential helper to remove this warning. See
   https://docs.docker.com/engine/reference/commandline/login/#credentials-store
   
   Login Succeeded
   
   [root@node-05 harbor]# docker push harbor.thtf.com/public/nginx:v1.7.9
   The push refers to repository [harbor.thtf.com/public/nginx]
   5f70bf18a086: Pushed 
   4b26ab29a475: Pushed 
   ccb1d68e3fb7: Pushed 
   e387107e2065: Pushed 
   63bf84221cce: Pushed 
   e02dce553481: Pushed 
   dea2e4984e29: Pushed 
   v1.7.9: digest: sha256:b1f5935eb2e9e2ae89c0b3e2e148c19068d91ca502e857052f14db230443e4c2 size: 3012
   
   ```

   可以看到NGINX镜像已经上传到public下

   ![](./img/harbor_push.png)

