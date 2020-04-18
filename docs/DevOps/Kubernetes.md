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

在 node-05 上

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



### 6.6 部署 master 节点

#### 6.6.1 部署 etch 集群

##### 1）集群架构

| 主机名  | 角色   | IP           |
| ------- | ------ | ------------ |
| node-02 | lead   | 10.10.50.20  |
| node-03 | follow | 10.10.50.233 |
| node-04 | follow | 10.10.50.99  |

##### 2）创建基于根证书的config配置文件

在 node-05 上

```shell
vi /opt/certs/ca-config.json
```

```
{
    "signing": {
        "default": {
            "expiry": "175200h"
        },
        "profiles": {
            "server": {
                "expiry": "175200h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth"
                ]
            },
            "client": {
                "expiry": "175200h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "client auth"
                ]
            },
            "peer": {
                "expiry": "175200h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth",
                    "client auth"
                ]
            }
        }
    }
} 
```

##### 3）创建生成自签发证书的csr的json配置文件

```shell
vi /opt/certs/etcd-peer-csr.json
```

```
{
    "CN": "k8s-etcd",
    "hosts": [
        "10.10.50.50",
        "10.10.50.20",
        "10.10.50.233",
        "10.10.50.99"
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
    ]
}
```

##### 4）生成 etch 证书文件

```shell
[root@node-05 ~]# cd /opt/certs/
[root@node-05 certs]# cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=peer etcd-peer-csr.json |cfssl-json -bare etcd-pee
```
##### 5）检查生成的证书

```shell
[root@node-05 certs]# ll
总用量 36
-rw-r--r-- 1 root root  837 4月  14 15:56 ca-config.json
-rw-r--r-- 1 root root  989 4月  14 15:54 ca.csr
-rw-r--r-- 1 root root  325 4月  14 15:54 ca-csr.json
-rw------- 1 root root 1679 4月  14 15:54 ca-key.pem
-rw-r--r-- 1 root root 1338 4月  14 15:54 ca.pem
-rw-r--r-- 1 root root 1066 4月  14 16:02 etcd-peer.csr
-rw-r--r-- 1 root root  374 4月  14 16:01 etcd-peer-csr.json
-rw------- 1 root root 1675 4月  14 16:02 etcd-peer-key.pem
-rw-r--r-- 1 root root 1428 4月  14 16:02 etcd-peer.pem
```

##### 6）创建 etch 用户

在 node-02 上

```shell
[root@node-02 opt]# useradd -s /sbin/nologin -M etcd
```

##### 7）下载 etcd 软件, 解压, 做软连接

下载地址：https://github.com/etcd-io/etcd/tags 这里选择 3.1.20 版本

```shell
[root@node-02 opt]# tar -zxvf etcd-v3.1.20-linux-amd64.tar.gz -C /opt
[root@node-02 opt]# mv etcd-v3.1.20-linux-amd64/ etcd-v3.1.20
[root@node-02 opt]# ln -s /opt/etcd-v3.1.20/ /opt/etcd
[root@node-02 opt]# ll
总用量 0
drwxr-xr-x 2 root   root   71 4月  14 10:53 certs
lrwxrwxrwx 1 root   root   18 4月  14 17:05 etcd -> /opt/etcd-v3.1.20/
drwxr-xr-x 3 478493 89939 123 10月 11 2018 etcd-v3.1.20
drwxr-xr-x 2 root   root    6 4月  14 10:32 soft
```

##### 8）创建目录, 拷贝证书文件

```shell
[root@node-02 opt]# mkdir -p /opt/etcd/certs /data/etcd /data/logs/etcd-server
```

```shell
[root@node-02 opt]# cd etcd/certs/
[root@node-02 certs]# scp node-05:/opt/certs/ca.pem .
[root@node-02 certs]# scp node-05:/opt/certs/etcd-peer.pem .
[root@node-02 certs]# scp node-05:/opt/certs/etcd-peer-key.pem .
```

##### 9）创建 etcd 服务启动脚本

```shell
vi /opt/etcd/etcd-server-startup.sh
```

```sh
#!/bin/sh
./etcd --name etcd-server-node-02 \
       --data-dir /data/etcd/etcd-server \
       --listen-peer-urls https://10.10.50.20:2380 \
       --listen-client-urls https://10.10.50.20:2379,http://127.0.0.1:2379 \
       --quota-backend-bytes 8000000000 \
       --initial-advertise-peer-urls https://10.10.50.20:2380 \
       --advertise-client-urls https://10.10.50.20:2379,http://127.0.0.1:2379 \
       --initial-cluster  etcd-server-node-02=https://10.10.50.20:2380,etcd-server-node-03=https://10.10.50.233:2380,etcd-server-node-04=https://10.10.50.99:2380 \
       --ca-file ./certs/ca.pem \
       --cert-file ./certs/etcd-peer.pem \
       --key-file ./certs/etcd-peer-key.pem \
       --client-cert-auth  \
       --trusted-ca-file ./certs/ca.pem \
       --peer-ca-file ./certs/ca.pem \
       --peer-cert-file ./certs/etcd-peer.pem \
       --peer-key-file ./certs/etcd-peer-key.pem \
       --peer-client-cert-auth \
       --peer-trusted-ca-file ./certs/ca.pem \
       --log-output stdout

```

```shell
[root@node-02 ~]# chmod +x /opt/etcd/etcd-server-startup.sh
```

##### 10）授权目录权限

```shell
[root@node-02 ~]# chown -R etcd.etcd /opt/etcd-v3.1.20/ /data/etcd/ /data/logs/etcd-server/
```

##### 11）安装 supervisor 软件

```shell
[root@node-02 ~]# yum install supervisor -y
[root@node-02 ~]# systemctl start supervisord
[root@node-02 ~]# systemctl enable supervisord
```

##### 12）创建 supervisor 配置

```shell
[root@node-02 ~]# vi /etc/supervisord.d/etcd-server.ini
```

```ini
[program:etcd-server-node-02]
command=/opt/etcd/etcd-server-startup.sh                        ; the program (relative uses PATH, can take args)
numprocs=1                                                      ; number of processes copies to start (def 1)
directory=/opt/etcd                                             ; directory to cwd to before exec (def no cwd)
autostart=true                                                  ; start at supervisord start (default: true)
autorestart=true                                                ; retstart at unexpected quit (default: true)
startsecs=30                                                    ; number of secs prog must stay running (def. 1)
startretries=3                                                  ; max # of serial start failures (default 3)
exitcodes=0,2                                                   ; 'expected' exit codes for process (default 0,2)
stopsignal=QUIT                                                 ; signal used to kill process (default TERM)
stopwaitsecs=10                                                 ; max num secs to wait b4 SIGKILL (default 10)
user=etcd                                                       ; setuid to this UNIX account to run the program
redirect_stderr=true                                            ; redirect proc stderr to stdout (default false)
stdout_logfile=/data/logs/etcd-server/etcd.stdout.log           ; stdout log path, NONE for none; default AUTO
stdout_logfile_maxbytes=64MB                                    ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=4                                        ; # of stdout logfile backups (default 10)
stdout_capture_maxbytes=1MB                                     ; number of bytes in 'capturemode' (default 0)
stdout_events_enabled=false                                     ; emit events on stdout writes (default false)
```

##### 13）启动 etcd 服务

```shell
[root@node-02 certs]# supervisorctl update
[root@node-02 certs]# supervisorctl status
etcd-server-node-02              RUNNING   pid 5488, uptime 0:01:03
```

```shell
[root@node-02 certs]# netstat -lntup|grep etcd
tcp        0      0 10.10.50.99:2379        0.0.0.0:*               LISTEN      27058/./etcd        
tcp        0      0 127.0.0.1:2379          0.0.0.0:*               LISTEN      27058/./etcd        
tcp        0      0 10.10.50.99:2380        0.0.0.0:*               LISTEN      27058/./etcd
```



##### 同理：在 node-03 node-04 上安装 etcd

重复 6~ 13 步骤。

不同的地方：

```shell
opt/etcd/etcd-server-startup.sh
##########
--name
--listen-peer-urls
--listen-client-urls
--initial-advertise-peer-urls
--advertise-client-urls
##########
/etc/supervisord.d/etcd-server.ini
[program:etcd-server-node-xx]
```



##### 检查集群状态

```shell
[root@node-03 etcd]# ./etcdctl  cluster-health
member 7d027ad4e297952d is healthy: got healthy result from http://127.0.0.1:2379
member 804d7a56c0ba452b is healthy: got healthy result from http://127.0.0.1:2379
member a9bfb00ec3d05a41 is healthy: got healthy result from http://127.0.0.1:2379
cluster is healthy
[root@node-03 etcd]# ./etcdctl member list
7d027ad4e297952d: name=etcd-server-node-02 peerURLs=https://10.10.50.20:2380 clientURLs=http://127.0.0.1:2379,https://10.10.50.20:2379 isLeader=false
804d7a56c0ba452b: name=etcd-server-node-03 peerURLs=https://10.10.50.233:2380 clientURLs=http://127.0.0.1:2379,https://10.10.50.233:2379 isLeader=false
a9bfb00ec3d05a41: name=etcd-server-node-04 peerURLs=https://10.10.50.99:2380 clientURLs=http://127.0.0.1:2379,https://10.10.50.99:2379 isLeader=true
```



#### 6.6.2 部署 kube-apiserver 集群

##### 1）集群架构

| 主机名  | 角色           | IP           |
| ------- | -------------- | ------------ |
| node-03 | kube-apiserver | 10.10.50.233 |
| node-04 | kube-apiserver | 10.10.50.99  |

##### 2）下载 kube-apiserver 软件, 解压, 做软连接

下载地址：https://github.com/kubernetes/kubernetes/releases/tag/v1.15.2

备用地址：https://storage.googleapis.com/kubernetes-release/release/v1.15.2/kubernetes-server-linux-amd64.tar.gzclear

```shell
[root@node-03 ~]# tar -zxvf kubernetes-server-linux-amd64.tar.gz -C /opt
[root@node-03 ~]# cd /opt/
[root@node-03 opt]# mv kubernetes/ kubernetes-v1.15.2
[root@node-03 opt]# ln -s /opt/kubernetes-v1.15.2/ /opt/kubernetes
[root@node-03 opt]# cd kubernetes
[root@node-03 kubernetes]# rm -rf kubernetes-src.tar.gz 
[root@node-03 kubernetes]# cd server/bin/
[root@node-03 bin]# rm -rf *.tar
[root@node-03 bin]# rm -rf *_tag
```

##### 3）签发 client 证书

在 node-05 上

1. 创建生成证书 csr 的 json 配置文件

```shell
vi /opt/certs/client-csr.json
```

```json
{
    "CN": "k8s-node",
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
    ]
}
```

2. 生成 client 证书文件

   ```shell
   [root@node-05 certs]# cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=client client-csr.json |cfssl-json -bare client
   ```

3. 检查生成的证书文件

   ```shell
   [root@node-05 certs]# ll
   -rw-r--r-- 1 root root  997 4月  14 19:00 client.csr
   -rw-r--r-- 1 root root  282 4月  14 18:59 client-csr.json
   -rw------- 1 root root 1679 4月  14 19:00 client-key.pem
   -rw-r--r-- 1 root root 1363 4月  14 19:00 client.pem
   ```

##### 4）签发 kube-apiserver 证书

在 node-05 上

1. 创建生成证书 csr 的 json 配置文件

   ```shell
   vi /opt/certs/apiserver-csr.json
   ```

   ```json
   {
       "CN": "k8s-apiserver",
       "hosts": [
           "127.0.0.1",
           "192.168.0.1",
           "kubernetes.default",
           "kubernetes.default.svc",
           "kubernetes.default.svc.cluster",
           "kubernetes.default.svc.cluster.local",
           "10.10.50.50",
           "10.10.50.233",
           "10.10.50.99",
           "10.10.50.10"
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
       ]
   }
```
   
2. 生成 kube-apiserver 证书文件
   
      ```shell
      [root@node-05 certs]# cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=server apiserver-csr.json |cfssl-json -bare apiserver
   ```
   
3. 检查证书文件
   
      ```shell
      [root@node-05 certs]# ll
      总用量 68
      -rw-r--r-- 1 root root 1245 4月  14 19:13 apiserver.csr
      -rw-r--r-- 1 root root  554 4月  14 19:12 apiserver-csr.json
      -rw------- 1 root root 1675 4月  14 19:13 apiserver-key.pem
      -rw-r--r-- 1 root root 1590 4月  14 19:13 apiserver.pem
      ```


##### 5）拷贝证书文件到各个节点, 并创建配置

   1. 拷贝证书文件到 /opt/kubernetes/server/bin/certs 目录下

      ```shell
      [root@node-04 bin]# mkdir certs
      [root@node-04 certs]# scp node-05:/opt/certs/ca.pem .
      [root@node-04 certs]# scp node-05:/opt/certs/ca-key.pem .
      [root@node-04 certs]# scp node-05:/opt/certs/client.pem .
      [root@node-04 certs]# scp node-05:/opt/certs/client-key.pem .
      [root@node-04 certs]# scp node-05:/opt/certs/apiserver.pem .
      [root@node-04 certs]# scp node-05:/opt/certs/apiserver-key.pem .
      
      ```

   2. 创建配置

      ```shell
      [root@node-04 bin]# mkdir conf
      [root@node-04 bin]# cd conf/
      [root@node-04 conf]# vi audit.yaml
      ```

      ```yaml
      apiVersion: audit.k8s.io/v1beta1 # This is required.
      kind: Policy
      # Don't generate audit events for all requests in RequestReceived stage.
      omitStages:
        - "RequestReceived"
      rules:
        # Log pod changes at RequestResponse level
        - level: RequestResponse
          resources:
          - group: ""
            # Resource "pods" doesn't match requests to any subresource of pods,
            # which is consistent with the RBAC policy.
            resources: ["pods"]
        # Log "pods/log", "pods/status" at Metadata level
        - level: Metadata
          resources:
          - group: ""
            resources: ["pods/log", "pods/status"]
      
        # Don't log requests to a configmap called "controller-leader"
        - level: None
          resources:
          - group: ""
            resources: ["configmaps"]
            resourceNames: ["controller-leader"]
      
        # Don't log watch requests by the "system:kube-proxy" on endpoints or services
        - level: None
          users: ["system:kube-proxy"]
          verbs: ["watch"]
          resources:
          - group: "" # core API group
            resources: ["endpoints", "services"]
      
        # Don't log authenticated requests to certain non-resource URL paths.
        - level: None
          userGroups: ["system:authenticated"]
          nonResourceURLs:
          - "/api*" # Wildcard matching.
          - "/version"
      
        # Log the request body of configmap changes in kube-system.
        - level: Request
          resources:
          - group: "" # core API group
            resources: ["configmaps"]
          # This rule only applies to resources in the "kube-system" namespace.
          # The empty string "" can be used to select non-namespaced resources.
          namespaces: ["kube-system"]
      
        # Log configmap and secret changes in all other namespaces at the Metadata level.
        - level: Metadata
          resources:
          - group: "" # core API group
            resources: ["secrets", "configmaps"]
      
        # Log all other resources in core and extensions at the Request level.
        - level: Request
          resources:
          - group: "" # core API group
          - group: "extensions" # Version of group should NOT be included.
      
        # A catch-all rule to log all other requests at the Metadata level.
        - level: Metadata
          # Long-running requests like watches that fall under this rule will not
          # generate an audit event in RequestReceived.
          omitStages:
            - "RequestReceived"
      ```

      ##### 5）创建 apiserver 启动脚本

      ```shell
      [root@node-04 bin]# vi /opt/kubernetes/server/bin/kube-apiserver.sh
      ```

      ```shell
      #!/bin/bash
      ./kube-apiserver \
        --apiserver-count 2 \
        --audit-log-path /data/logs/kubernetes/kube-apiserver/audit-log \
        --audit-policy-file ./conf/audit.yaml \
        --authorization-mode RBAC \
        --client-ca-file ./certs/ca.pem \
        --requestheader-client-ca-file ./cert/ca.pem \
        --enable-admission-plugins NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota \
        --etcd-cafile ./certs/ca.pem \
        --etcd-certfile ./certs/client.pem \
        --etcd-keyfile ./certs/client-key.pem \
        --etcd-servers https://10.10.50.20:2379,https://10.10.50.233:2379,https://10.10.50.99:2379 \
        --service-account-key-file ./certs/ca-key.pem \
        --service-cluster-ip-range 192.168.0.0/16 \
        --service-node-port-range 3000-29999 \
        --target-ram-mb=1024 \
        --kubelet-client-certificate ./certs/client.pem \
        --kubelet-client-key ./certs/client-key.pem \
        --log-dir  /data/logs/kubernetes/kube-apiserver \
        --tls-cert-file ./certs/apiserver.pem \
        --tls-private-key-file ./certs/apiserver-key.pem \
        --v 2
      ```

##### 6）授权和创建目录

      ```shell
      [root@node-04 bin]# chmod +x kube-apiserver.sh
      [root@node-04 bin]# mkdir -p /data/logs/kubernetes/kube-apiserver
      ```

##### 7）创建 supervisor 配置

      ```shell
vi /etc/supervisord.d/kube-apiserver.ini
      ```

```ini
[program:kube-apiserver-7-21]
command=/opt/kubernetes/server/bin/kube-apiserver.sh            ; the program (relative uses PATH, can take args)
numprocs=1                                                      ; number of processes copies to start (def 1)
directory=/opt/kubernetes/server/bin                            ; directory to cwd to before exec (def no cwd)
autostart=true                                                  ; start at supervisord start (default: true)
autorestart=true                                                ; retstart at unexpected quit (default: true)
startsecs=30                                                    ; number of secs prog must stay running (def. 1)
startretries=3                                                  ; max # of serial start failures (default 3)
exitcodes=0,2                                                   ; 'expected' exit codes for process (default 0,2)
stopsignal=QUIT                                                 ; signal used to kill process (default TERM)
stopwaitsecs=10                                                 ; max num secs to wait b4 SIGKILL (default 10)
user=root                                                       ; setuid to this UNIX account to run the program
redirect_stderr=true                                            ; redirect proc stderr to stdout (default false)
stdout_logfile=/data/logs/kubernetes/kube-apiserver/apiserver.stdout.log        ; stderr log path, NONE for none; default AUTO
stdout_logfile_maxbytes=64MB                                    ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=4                                        ; # of stdout logfile backups (default 10)
stdout_capture_maxbytes=1MB                                     ; number of bytes in 'capturemode' (default 0)
stdout_events_enabled=false                                     ; emit events on stdout writes (default false)
```

##### 8）启动服务并检测

```shell
[root@node-04 bin]# supervisorctl update
kube-apiserver-node-04: added process group
[root@node-04 bin]# supervisorctl status
etcd-server-node-04              RUNNING   pid 27057, uptime 1:34:08
kube-apiserver-node-04           STARTING  
[root@node-04 bin]# netstat -nltup|grep kube-api
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN      32456/./kube-apiser 
tcp6       0      0 :::6443                 :::*                    LISTEN      32456/./kube-apiser 

```

##### 同理, 在 node-03 上完成 2~8 步骤

不同的地方：

```shell
vi /etc/supervisord.d/kube-apiserver.ini
[program:kube-apiserver-node-03]
```



#### 6.6.3 部署四层反向代理

##### 1）集群架构

| 主机名  | 角色 | IP 地址     | VIP 地址    |
| ------- | ---- | ----------- | ----------- |
| node-01 | L4   | 10.10.50.50 | 10.50.50.xx |
| node-02 | L4   | 10.10.50.20 | 10.10.50.xx |

##### 2）安装 Nginx 和 Keepalived

在 node-01 和 node-02 上都安装 Nginx 和 Keepalived

```shell
yum install nginx keepalived -y
```

在 node-01 和 node-02 上配置 Nginx 

```shell
vi /etc/nginx/nginx.conf
```

```
# 加在配置文件末尾
stream {
    upstream kube-apiserver {
        server 10.10.50.233:6443     max_fails=3 fail_timeout=30s;
        server 10.10.50.99:6443     max_fails=3 fail_timeout=30s;
    }
    server {
        listen 7443;
        proxy_connect_timeout 2s;
        proxy_timeout 900s;
        proxy_pass kube-apiserver;
    }
}
```

在 node-01 和 node-02 上配置 keepalived

```shell
# 检测脚本
vi /etc/keepalived/check_port.sh
```

```shell
#!/bin/bash
#keepalived 监控端口脚本
#使用方法：
#在keepalived的配置文件中
#vrrp_script check_port {#创建一个vrrp_script脚本,检查配置
#    script "/etc/keepalived/check_port.sh 6379" #配置监听的端口
#    interval 2 #检查脚本的频率,单位（秒）
#}
CHK_PORT=$1
if [ -n "$CHK_PORT" ];then
        PORT_PROCESS=`ss -lnt|grep $CHK_PORT|wc -l`
        if [ $PORT_PROCESS -eq 0 ];then
                echo "Port $CHK_PORT Is Not Used,End."
                exit 1
        fi
else
        echo "Check Port Cant Be Empty!"
fi
```

修改执行权限

```shell
chmod +x /etc/keepalived/check_port.sh
```

keepalived 主配置 node-01

```shell
[root@node-01 ~]# vi /etc/keepalived/keepalived.conf
```

```
! Configuration File for keepalived

global_defs {
   router_id 10.10.50.50

}

vrrp_script chk_nginx {
    script "/etc/keepalived/check_port.sh 7443"
    interval 2
    weight -20
}

vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 251
    priority 100
    advert_int 1
    mcast_src_ip 10.10.50.50
    nopreempt

    authentication {
        auth_type PASS
        auth_pass 11111111
    }
    track_script {
         chk_nginx
    }
    virtual_ipaddress {
        10.10.50.10
    }
}
```

keepalived 从配置 node-02

```shell
[root@node-02 ~]# vi /etc/keepalived/keepalived.conf 
```

```
! Configuration File for keepalived
global_defs {
    router_id 10.10.50.20
}
vrrp_script chk_nginx {
    script "/etc/keepalived/check_port.sh 7443"
    interval 2
    weight -20
}
vrrp_instance VI_1 {
    state BACKUP
    interface eth0 #### 这里的网卡名称需要和主机保持一致
    virtual_router_id 251
    mcast_src_ip 10.10.50.20
    priority 90
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 11111111
    }
    track_script {
        chk_nginx
    }
    virtual_ipaddress {
        10.10.50.10
    }
}
```

##### 3）启动代理并检查

```shell
systemctl start nginx keepalived
systemctl enable nginx keepalived
netstat -lntup|grep nginx
```

```shell
[root@node-01 ~]# ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:1c:87:23 brd ff:ff:ff:ff:ff:ff
    inet 10.10.50.50/24 brd 10.10.50.255 scope global noprefixroute dynamic enp0s3
       valid_lft 83981sec preferred_lft 83981sec
    inet 10.10.50.10/32 scope global enp0s3
       valid_lft forever preferred_lft forever
    inet6 fe80::311e:9caf:bb5:e825/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
```



#### 6.6.4 部署 controller-manager 集群

##### 1）集群架构

| 主机名  | 角色               | IP地址       |
| ------- | ------------------ | ------------ |
| node-03 | controller-manager | 10.10.50.233 |
| node-04 | controller-manager | 10.10.50.99  |

接下来, 以 node-03 为例

##### 2）创建启动脚本

```shell
[root@node-03 ~]# vi /opt/kubernetes/server/bin/kube-controller-manager.sh
```

```shell
#!/bin/sh
./kube-controller-manager \
  --cluster-cidr 172.7.0.0/16 \
  --leader-elect true \
  --log-dir /data/logs/kubernetes/kube-controller-manager \
  --master http://127.0.0.1:8080 \
  --service-account-private-key-file ./certs/ca-key.pem \
  --service-cluster-ip-range 192.168.0.0/16 \
  --root-ca-file ./certs/ca.pem \
  --v 2 
```

##### 3）授权文件权限, 创建目录

```shell
[root@node-03 ~]# chmod +x /opt/kubernetes/server/bin/kube-controller-manager.sh 
[root@node-03 ~]# mkdir -p /data/logs/kubernetes/kube-controller-manager
```

##### 4）创建 supervisor 配置

```shell
[root@node-03 ~]# vi /etc/supervisord.d/kube-conntroller-manager.ini
```

```shell
[program:kube-controller-manager-node-03]
command=/opt/kubernetes/server/bin/kube-controller-manager.sh                     ; the program (relative uses PATH, can take args)
numprocs=1                                                                        ; number of processes copies to start (def 1)
directory=/opt/kubernetes/server/bin                                              ; directory to cwd to before exec (def no cwd)
autostart=true                                                                    ; start at supervisord start (default: true)
autorestart=true                                                                  ; retstart at unexpected quit (default: true)
startsecs=30                                                                      ; number of secs prog must stay running (def. 1)
startretries=3                                                                    ; max # of serial start failures (default 3)
exitcodes=0,2                                                                     ; 'expected' exit codes for process (default 0,2)
stopsignal=QUIT                                                                   ; signal used to kill process (default TERM)
stopwaitsecs=10                                                                   ; max num secs to wait b4 SIGKILL (default 10)
user=root                                                                         ; setuid to this UNIX account to run the program
redirect_stderr=true                                                              ; redirect proc stderr to stdout (default false)
stdout_logfile=/data/logs/kubernetes/kube-controller-manager/controller.stdout.log  ; stderr log path, NONE for none; default AUTO
stdout_logfile_maxbytes=64MB                                                      ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=4                                                          ; # of stdout logfile backups (default 10)
stdout_capture_maxbytes=1MB                                                       ; number of bytes in 'capturemode' (default 0)
stdout_events_enabled=false                                                       ; emit events on stdout writes (default false)
```

##### 5）启动服务并检查

```shell
[root@node-03 ~]# supervisorctl update
kube-controller-manager-node-03: added process group
[root@node-03 ~]# supervisorctl status
etcd-server-node-03               RUNNING   pid 4912, uptime 2:33:03
kube-apiserver-node-03            RUNNING   pid 4913, uptime 2:33:03
kube-controller-manager-node-03   STARTING 
```

##### 同理, 另一台按照 2~5 步骤执行

不同的地方

```shell
vi /etc/supervisord.d/kube-conntroller-manager.ini
[program:kube-controller-manager-node-04]
```



#### 6.6.5 部署 kube-scheduler 集群

##### 1）集群架构

| 主机名  | 角色           | IP地址       |
| ------- | -------------- | ------------ |
| node-03 | kube-scheduler | 10.10.50.233 |
| node-04 | kube-scheduler | 10.10.50.99  |

接下来, 以 node-03 为例

##### 2）创建启动脚本

```shell
[root@node-03 ~]#vi /opt/kubernetes/server/bin/kube-scheduler.sh
```

```shell
#!/bin/sh
./kube-scheduler \
  --leader-elect  \
  --log-dir /data/logs/kubernetes/kube-scheduler \
  --master http://127.0.0.1:8080 \
  --v 2
```

##### 3）授权文件权限, 创建目录

```shell
[root@node-03 ~]# chmod +x  /opt/kubernetes/server/bin/kube-scheduler.sh
[root@node-03 ~]# mkdir -p /data/logs/kubernetes/kube-scheduler
```

##### 4）创建 supervisor 配置

```shell
[root@node-03 ~]# vi /etc/supervisord.d/kube-scheduler.ini
```

```ini
[program:kube-scheduler-node-03]
command=/opt/kubernetes/server/bin/kube-scheduler.sh                     ; the program (relative uses PATH, can take args)
numprocs=1                                                               ; number of processes copies to start (def 1)
directory=/opt/kubernetes/server/bin                                     ; directory to cwd to before exec (def no cwd)
autostart=true                                                           ; start at supervisord start (default: true)
autorestart=true                                                         ; retstart at unexpected quit (default: true)
startsecs=30                                                             ; number of secs prog must stay running (def. 1)
startretries=3                                                           ; max # of serial start failures (default 3)
exitcodes=0,2                                                            ; 'expected' exit codes for process (default 0,2)
stopsignal=QUIT                                                          ; signal used to kill process (default TERM)
stopwaitsecs=10                                                          ; max num secs to wait b4 SIGKILL (default 10)
user=root                                                                ; setuid to this UNIX account to run the program
redirect_stderr=true                                                     ; redirect proc stderr to stdout (default false)
stdout_logfile=/data/logs/kubernetes/kube-scheduler/scheduler.stdout.log ; stderr log path, NONE for none; default AUTO
stdout_logfile_maxbytes=64MB                                             ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=4                                                 ; # of stdout logfile backups (default 10)
stdout_capture_maxbytes=1MB                                              ; number of bytes in 'capturemode' (default 0)
stdout_events_enabled=false                                              ; emit events on stdout writes (default false)
```

##### 5）启动服务并检查

```shell
[root@node-03 ~]# supervisorctl update
kube-scheduler-node-03: added process group
[root@node-03 ~]# supervisorctl status
etcd-server-node-03               RUNNING   pid 4912, uptime 2:43:36
kube-apiserver-node-03            RUNNING   pid 4913, uptime 2:43:36
kube-controller-manager-node-03   STARTING  
kube-scheduler-node-03            STARTING 
```

##### 同理, 另一台按照 2~5 步骤执行

不同的地方

```shell
/etc/supervisord.d/kube-scheduler.ini
[program:kube-scheduler-node-04]
```

#### 6.6.6 检查 master节点

##### 建立 kubectl 软连接

```shell
[root@node-03 ~]# ln -s /opt/kubernetes/server/bin/kubectl /usr/bin/kubectl
```

##### 检查 master 节点

```shell
[root@node-03 ~]# kubectl get cs
NAME                 STATUS    MESSAGE              ERROR
scheduler            Healthy   ok                   
controller-manager   Healthy   ok                   
etcd-0               Healthy   {"health": "true"}   
etcd-2               Healthy   {"health": "true"}   
etcd-1               Healthy   {"health": "true"} 
```



### 6.7 部署 node 节点

#### 6.7.1 部署 kubelet

##### 1）集群架构

| 主机名  | 角色    | IP地址       |
| ------- | ------- | ------------ |
| node-03 | kubelet | 10.10.50.233 |
| node-04 | kubelet | 10.10.50.99  |

以 node-03 为例

##### 2）签发 kubelet 证书

在 node-05 上

1. 创建生成证书 crs 的 json 配置文件

   ```shell
   [root@node-05 ~]# vi /opt/certs/kubelet-csr.json
   ```

   ```json
   {
       "CN": "k8s-kubelet",
       "hosts": [
       "127.0.0.1",
       "10.10.50.50",
       "10.10.50.20",
       "10.10.50.40",
       "10.10.50.233",
       "10.10.50.99"
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
       ]
   }
   ```

   2. 生成 kubelet 证书

   ```shell
   [root@node-05 certs]# cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=server kubelet-csr.json | cfssl-json -bare kubelet
   2020/04/15 09:38:02 [INFO] generate received request
   2020/04/15 09:38:02 [INFO] received CSR
   2020/04/15 09:38:02 [INFO] generating key: rsa-2048
   2020/04/15 09:38:02 [INFO] encoded CSR
   2020/04/15 09:38:02 [INFO] signed certificate with serial number 602300016453030103556289231370796933909552612578
   2020/04/15 09:38:02 [WARNING] This certificate lacks a "hosts" field. This makes it unsuitable for
   websites. For more information see the Baseline Requirements for the Issuance and Management
   of Publicly-Trusted Certificates, v.1.1.6, from the CA/Browser Forum (https://cabforum.org);
   specifically, section 10.2.3 ("Information Requirements").
   ```

   3. 检查生成的证书文件

   ```shell
   [root@node-05 certs]# ll
   -rw-r--r-- 1 root root 1086 4月  15 09:38 kubelet.csr
   -rw-r--r-- 1 root root  397 4月  15 09:33 kubelet-csr.json
   -rw------- 1 root root 1679 4月  15 09:38 kubelet-key.pem
   -rw-r--r-- 1 root root 1432 4月  15 09:38 kubelet.pem
   ```

##### 3）拷贝证书文件到各个节点, 并创建配置

在 node-03 上

1. 拷贝文件

	```shell
	[root@node-03 ~ ]# cd /opt/kubernetes/server/bin/certs/
	[root@node-03 certs]# scp node-05:/opt/certs/kubelet.pem .
	[root@node-03 certs]# scp node-05:/opt/certs/kubelet-key.pem .
	```

2. 创建配置

   注意：在 conf 目录下, 没有就创建

   ```shell
   mkdir /opt/kubernetes/server/bin/conf
   ```

   **set-cluster**

   ```shell
   [root@node-03 conf]# kubectl config set-cluster myk8s \
   --certificate-authority=/opt/kubernetes/server/bin/certs/ca.pem \
   --embed-certs=true \
   --server=https://10.10.50.10:7443 \
   --kubeconfig=kubelet.kubeconfig
   ```

   **set-credentials**

   ```shell
   [root@node-03 conf]# kubectl config set-credentials k8s-node \
   --client-certificate=/opt/kubernetes/server/bin/certs/client.pem \
   --client-key=/opt/kubernetes/server/bin/certs/client-key.pem \
   --embed-certs=true \
   --kubeconfig=kubelet.kubeconfig
   ```

   **set-context**

   ```shell
   [root@node-03 conf]# kubectl config set-context myk8s-context \
   --cluster=myk8s \
   --user=k8s-node \
   --kubeconfig=kubelet.kubeconfig
   ```

   **use-context**

   ```shell
   [root@node-03 conf]# kubectl config use-context myk8s-context --kubeconfig=kubelet.kubeconfig
   ```

   **查看生成的kubelet.kubeconfig**

   ```shell
   [root@node-03 conf]# ll
   总用量 8
   -rw------- 1 root root 6189 4月  15 15:17 kubelet.kubeconfig
   ```

   **k8s-node.yaml**

   a. 创建配置文件

   ```shell
   [root@node-03 conf]# vi k8s-node.yaml
   ```

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: k8s-node
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: system:node
   subjects:
   - apiGroup: rbac.authorization.k8s.io
     kind: User
     name: k8s-node
   ```

   b. 应用资源配置

   ```shell
   [root@node-03 conf]# kubectl create -f k8s-node.yaml
   ```

   c. 查看集群角色和角色属性

   ```shell
   [root@node-03 conf]# kubectl get clusterrolebinding k8s-node
   NAME       AGE
   k8s-node   32s
   [root@node-03 conf]# kubectl get clusterrolebinding k8s-node -o yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     creationTimestamp: "2020-04-15T07:22:34Z"
     name: k8s-node
     resourceVersion: "55622"
     selfLink: /apis/rbac.authorization.k8s.io/v1/clusterrolebindings/k8s-node
     uid: f98c058b-e544-43e2-b926-6bda476a39fb
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: system:node
   subjects:
   - apiGroup: rbac.authorization.k8s.io
     kind: User
     name: k8s-node
   ```

   **将 node-03 上生成的 kubelet.kubeconfig 拷贝到 node-04 的 conf 中**

   在 node-04 上创建 conf 目录, 把 node-03 生成的kubelet.kubeconfig直接拷贝到目标服务器

   ```shell
   [root@node-04 ~]# mkdir /opt/kubernetes/server/bin/conf
   [root@node-04 ~]# cd /opt/kubernetes/server/bin/conf/
   [root@node-04 conf]# scp node-03:/opt/kubernetes/server/bin/conf/kubelet.kubeconfig .
   ```

   同时, 将从 node-05 上 kubelet 对应的证书文件拷贝到目标服务器 /opt/kubernetes/server/bin/certs 目录下

   ```shell
   [root@node-04 certs]# scp node-05:/opt/certs/kubelet.pem .
   [root@node-04 certs]# scp node-05:/opt/certs/kubelet-key.pem .
   ```

   

   查看集群角色和角色属性

   ```shell
   [root@node-04 conf]# kubectl get clusterrolebinding k8s-node
   NAME       AGE
   k8s-node   35m
   [root@node-04 conf]# kubectl get clusterrolebinding k8s-node -o yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     creationTimestamp: "2020-04-15T07:22:34Z"
     name: k8s-node
     resourceVersion: "55622"
     selfLink: /apis/rbac.authorization.k8s.io/v1/clusterrolebindings/k8s-node
     uid: f98c058b-e544-43e2-b926-6bda476a39fb
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: system:node
   subjects:
   - apiGroup: rbac.authorization.k8s.io
     kind: User
     name: k8s-node
   ```

   

##### 4）准备 pause 基础镜像

在 node-05 上

a. 下载 pause 镜像

```shell
[root@node-05 ~]# docker pull kubernetes/pause
```

b. 上传到 docker 私有仓库 harbor 中

```shell
[root@node-05 ~]# docker images -a | grep pause
kubernetes/pause                latest                     f9d5de079539        5 years ago         240kB
[root@node-05 ~]# docker tag f9d5de079539 harbor.thtf.com/public/pause:latest
[root@node-05 ~]# docker images -a | grep pause
kubernetes/pause                latest                     f9d5de079539        5 years ago         240kB
harbor.thtf.com/public/pause    latest                     f9d5de079539        5 years ago         240kB
[root@node-05 ~]# docker push harbor.thtf.com/public/pause:latest
```



##### 5）创建 kubelet 启动脚本

在 node-03 上

```shell
[root@node-03 ~]# vi /opt/kubernetes/server/bin/kubelet.sh
```

```shell
#!/bin/sh
./kubelet \
  --anonymous-auth=false \
  --cgroup-driver systemd \
  --cluster-dns 192.168.0.2 \
  --cluster-domain cluster.local \
  --runtime-cgroups=/systemd/system.slice \
  --kubelet-cgroups=/systemd/system.slice \
  --fail-swap-on="false" \
  --client-ca-file ./certs/ca.pem \
  --tls-cert-file ./certs/kubelet.pem \
  --tls-private-key-file ./certs/kubelet-key.pem \
  --hostname-override node-03 \
  --image-gc-high-threshold 20 \
  --image-gc-low-threshold 10 \
  --kubeconfig ./conf/kubelet.kubeconfig \
  --log-dir /data/logs/kubernetes/kube-kubelet \
  --pod-infra-container-image harbor.thtf.com/public/pause:latest \
  --root-dir /data/kubelet
```

授权, 创建目录

```shell
[root@node-03 ~]# chmod +x /opt/kubernetes/server/bin/kubelet.sh 
[root@node-03 ~]# mkdir -p /data/logs/kubernetes/kube-kubelet   /data/kubelet
```

##### 6）创建 supervisor 配置

```shell
[root@node-03 ~]# vi /etc/supervisord.d/kube-kubelet.ini
```

```ini
[program:kube-kubelet-node-03]
command=/opt/kubernetes/server/bin/kubelet.sh     ; the program (relative uses PATH, can take args)
numprocs=1                                        ; number of processes copies to start (def 1)
directory=/opt/kubernetes/server/bin              ; directory to cwd to before exec (def no cwd)
autostart=true                                    ; start at supervisord start (default: true)
autorestart=true                                  ; retstart at unexpected quit (default: true)
startsecs=30                                      ; number of secs prog must stay running (def. 1)
startretries=3                                    ; max # of serial start failures (default 3)
exitcodes=0,2                                     ; 'expected' exit codes for process (default 0,2)
stopsignal=QUIT                                   ; signal used to kill process (default TERM)
stopwaitsecs=10                                   ; max num secs to wait b4 SIGKILL (default 10)
user=root                                         ; setuid to this UNIX account to run the program
redirect_stderr=true                              ; redirect proc stderr to stdout (default false)
stdout_logfile=/data/logs/kubernetes/kube-kubelet/kubelet.stdout.log   ; stderr log path, NONE for none; default AUTO
stdout_logfile_maxbytes=64MB                      ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=4                          ; # of stdout logfile backups (default 10)
stdout_capture_maxbytes=1MB                       ; number of bytes in 'capturemode' (default 0)
stdout_events_enabled=false                       ; emit events on stdout writes (default false)
```

##### 7）启动服务并检查

```shell
[root@node-03 ~]# supervisorctl  update
[root@node-03 ~]# supervisorctl  status
```

##### 同理, node-04 上按 5~7 步骤执行

不同的地方

```shell
/opt/kubernetes/server/bin/kubelet.sh
--hostname-override node-04
##########
/etc/supervisord.d/kube-kubelet.ini
[program:kube-kubelet-node-04]
```



#### 6.7.2 部署 kube-proxy

##### 1）集群架构

| 主机名  | 角色    | IP地址       |
| ------- | ------- | ------------ |
| node-03 | kubelet | 10.10.50.233 |
| node-04 | kubelet | 10.10.50.99  |

以 node-03 为例

##### 2）签发 kube-proxy 证书

在 node-05 上

a. 创建生成证书 csr 的 json 配置文件

```shell
[root@node-05 certs]# vi kube-proxy-csr.json
```

```json
{
    "CN": "system:kube-proxy",
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
    ]
}
```

b. 生成 kube-proxy 证书文件

```shell
[root@node-05 certs]# cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=client kube-proxy-csr.json |cfssl-json -bare kube-proxy-client
```

c. 检查生成的证书文件

```shell
-rw-r--r-- 1 root root 1009 4月  17 15:35 kube-proxy-client.csr
-rw------- 1 root root 1679 4月  17 15:35 kube-proxy-client-key.pem
-rw-r--r-- 1 root root 1375 4月  17 15:35 kube-proxy-client.pem
-rw-r--r-- 1 root root  269 4月  17 15:35 kube-proxy-csr.json
```



##### 3）拷贝证书文件到各个节点, 并创建配置

在 node-03 上

1. 拷贝证书文件

   ```shell
   [root@node-03 ~]# cd /opt/kubernetes/server/bin/certs/
   [root@node-03 certs]# scp node-05:/opt/certs/kube-proxy-client.pem .
   [root@node-03 certs]# scp node-05:/opt/certs/kube-proxy-client-key.pem .
   ```

2. 创建配置

   进入：/opt/kubernetes/server/bin/conf

   **set-cluster**

   ```shell
   [root@node-03 conf]# kubectl config set-cluster myk8s \
   --certificate-authority=/opt/kubernetes/server/bin/certs/ca.pem \
   --embed-certs=true \
   --server=https://10.10.50.10:7443 \
   --kubeconfig=kube-proxy.kubeconfig
   ```

   **set-credentials**

   ```shell
   [root@node-03 certs]# kubectl config set-credentials kube-proxy \
   --client-certificate=/opt/kubernetes/server/bin/certs/kube-proxy-client.pem \
   --client-key=/opt/kubernetes/server/bin/certs/kube-proxy-client-key.pem \
   --embed-certs=true \
   --kubeconfig=kube-proxy.kubeconfig
   ```

   **set-context**

   ```shell
   [root@node-03 certs]# kubectl config set-context myk8s-context \
   --cluster=myk8s \
   --user=kube-proxy \
   --kubeconfig=kube-proxy.kubeconfig
   ```

   **use-context**

   ```shell
   [root@node-03 certs]# kubectl config use-context myk8s-context --kubeconfig=kube-proxy.kubeconfig
   ```

   

   **将 node-03 上生成的 kube-proxy.kubeconfig 到 node-04 的conf目录下**

   ```shell
   [root@node-04 ~]# cd /opt/kubernetes/server/bin/conf/
   [root@node-04 conf]# scp node-03:/opt/kubernetes/server/bin/conf/kube-proxy.kubeconfig .
   ```

   同时, 将从 node-05 上 kubelet 对应的证书文件拷贝到目标服务器 /opt/kubernetes/server/bin/certs 目录下

   ```shell
   [root@node-04 ~]# cd /opt/kubernetes/server/bin/certs/
   [root@node-04 certs]# scp node-05:/opt/certs/kube-proxy-client.pem .
   [root@node-04 certs]# scp node-05:/opt/certs/kube-proxy-client-key.pem .
   ```


##### 4）创建 kube-proxy 启动脚本

   在 node-03 上

   a. 加载 ipvs 模块

   ```shell
   [root@node-03 ~]# lsmod | grep ip_vs
   [root@node-03 ~]# vi /root/ipvs.sh
   ```

   ```shell
   #!/bin/bash
   ipvs_mods_dir="/usr/lib/modules/$(uname -r)/kernel/net/netfilter/ipvs"
   for i in $(ls $ipvs_mods_dir|grep -o "^[^.]*")
   do
     /sbin/modinfo -F filename $i &>/dev/null
     if [ $? -eq 0 ];then
       /sbin/modprobe $i
     fi
   done    
   ```

   ```shell
   [root@node-03 ~]# chmod +x /root/ipvs.sh 
   [root@node-03 ~]# sh /root/ipvs.sh 
   [root@node-03 ~]# lsmod | grep ip_vs
   ```

   b. 创建启动脚本

   ```shell
   [root@node-03 ~]# vi /opt/kubernetes/server/bin/kube-proxy.sh
   ```

   ```shell
#!/bin/sh
./kube-proxy \
--cluster-cidr 172.7.0.0/16 \
--hostname-override node-03\
--proxy-mode=ipvs \
--ipvs-scheduler=nq \
--kubeconfig ./conf/kube-proxy.kubeconfig	
   ```

   c. 授权, 创建目录

```shell
[root@node-03 ~]# ls -l /opt/kubernetes/server/bin/conf/|grep kube-proxy
[root@node-03 ~]# chmod +x /opt/kubernetes/server/bin/kube-proxy.sh 
[root@node-03 ~]# mkdir -p /data/logs/kubernetes/kube-proxy
```



##### 5）创建 supervisor 配置

```shell
[root@node-03 ~]# vi /etc/supervisord.d/kube-proxy.ini
```

```ini
[program:kube-proxy-node-03]
command=/opt/kubernetes/server/bin/kube-proxy.sh                     ; the program (relative uses PATH, can take args)
numprocs=1                                                           ; number of processes copies to start (def 1)
directory=/opt/kubernetes/server/bin                                 ; directory to cwd to before exec (def no cwd)
autostart=true                                                       ; start at supervisord start (default: true)
autorestart=true                                                     ; retstart at unexpected quit (default: true)
startsecs=30                                                         ; number of secs prog must stay running (def. 1)
startretries=3                                                       ; max # of serial start failures (default 3)
exitcodes=0,2                                                        ; 'expected' exit codes for process (default 0,2)
stopsignal=QUIT                                                      ; signal used to kill process (default TERM)
stopwaitsecs=10                                                      ; max num secs to wait b4 SIGKILL (default 10)
user=root                                                            ; setuid to this UNIX account to run the program
redirect_stderr=true                                                 ; redirect proc stderr to stdout (default false)
stdout_logfile=/data/logs/kubernetes/kube-proxy/proxy.stdout.log     ; stderr log path, NONE for none; default AUTO
stdout_logfile_maxbytes=64MB                                         ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=4                                             ; # of stdout logfile backups (default 10)
stdout_capture_maxbytes=1MB                                          ; number of bytes in 'capturemode' (default 0)
stdout_events_enabled=false                                          ; emit events on stdout writes (default false)
```



##### 6）启动服务并检查

```shell
[root@node-03 ~]# supervisorctl update
[root@node-03 ~]# supervisorctl status
[root@node-03 ~]# yum install ipvsadm -y
[root@node-03 ~]# ipvsadm -Ln
[root@node-03 ~]# kubectl get svc
```

##### 同理, 在 node-04 上按照 4~5 步骤执行

不同的地方

```shell
/opt/kubernetes/server/bin/kube-proxy.sh
--hostname-override node-04
##########
/etc/supervisord.d/kube-proxy.ini
[program:kube-proxy-node-04]
```

### 6.8 验证 kubernetes 集群

#### 6.8.1 **在任意一个节点上创建一个资源配置清单**

```shell
vi /root/nginx-ds.yaml
```

```shell
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: nginx-ds
spec:
  template:
    metadata:
      labels:
        app: nginx-ds
    spec:
      containers:
      - name: my-nginx
        image: harbor.thtf.com/public/nginx:v1.7.9
        ports:
        - containerPort: 80
```

#### 6.8.2 **应用资源配置，并检查**

```shell
kubectl create -f /root/nginx-ds.yaml
kubectl get pods
kubectl get pods -o wide
curl 172.7.21.2
```





