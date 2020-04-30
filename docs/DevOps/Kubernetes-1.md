# Kubernetes-1

## 第 1 章 概述

![](./img/k8s.png)

官网：https://kubernetes.io

Github：https://github.com/kubernetes/kubernetes

由来：谷歌的Borg系统, 后经Go语言重写并捐献给CNCF基金会开源

含义：词根源于希腊语：舵手/飞行员，K8S -》K 8个字母 S

Kubernetes 是 **Google 2014 年创建管理的**，是 Google 10 多年大规模容器管理技术 Borg 的开源版本。

Kubernetes 是容器集群管理系统，是一个开源的平台，可以实现容器集群的自动化部署、自动扩缩容、维护等功能。使用 Kubernetes 我们可以：

- 快速部署应用
- 快速扩展应用
- 无缝对接新的应用功能
- 节省资源，优化硬件资源的使用

Kubernetes 的目标是促进完善组件和工具的生态系统，以减轻应用程序在公有云或私有云中运行的负担。



## 第 2 章 从传统到容器化部署

![](./img/why_containers.svg)

### 2.1 传统的部署方式

传统的应用部署方式是通过插件或脚本来安装应用。这样做的缺点是应用的运行、配置、管理、所有生存周期将与当前操作系统绑定，这样做并不利于应用的升级更新/回滚等操作，当然也可以通过创建虚机的方式来实现某些功能，但是虚拟机非常重，并不利于可移植性。



### 2.2 容器化部署的优势

- **快速创建/部署应用：** 与虚拟机相比，容器镜像的创建更加容易。

- **持续开发、集成和部署：** 提供可靠且频繁的容器镜像构建/部署，并使用快速和简单的回滚(由于镜像不可变性)。

- **开发和运行相分离：** 在 build 或者 release 阶段创建容器镜像，使得应用和基础设施解耦。

- **开发，测试和生产环境一致性：** 在本地或外网（生产环境）运行的一致性。

- **云平台或其他操作系统：** 可以在 Ubuntu、RHEL、CoreOS、on-prem、Google Container Engine 或其它任何环境中运行。

- **分布式，弹性，微服务化：** 应用程序分为更小的、独立的部件，可以动态部署和管理。

- **资源隔离**

- **资源利用更高效**

  

### 2.3 为什么需要 Kubernetes

可以在物理或虚拟机的 Kubernetes 集群上运行容器化应用，Kubernetes 能提供一个以 **“容器为中心的基础架构”**，满足在生产环境中运行应用的一些常见需求，如：

- **自动化装箱**：在不牺牲可用性的条件下，基于容器对资源的要求和约束自动部署容器。同时，为了提高利用率和节省更多资源，将关键和最佳工作量结合在一起。
- **自愈能力**：当容器失败时，会对容器进行重启；当所部署的Node节点有问题时，会对容器进行重新部署和重新调度；当容器未通过监控检查时，会关闭此容器；直到容器正常运行时，才会对外提供服务。
- **水平扩容**：通过简单的命令、用户界面或基于CPU 的使用情况，能够对应用进行扩容和缩容。
- **服务发现和负载均衡**：开发者不需要使用额外的服务发现机制，就能够基于Kubernetes 进行服务发现和负载均衡。
- **自动发布和回滚**：Kubernetes 能够程序化的发布应用和相关的配置。如果发布有问题，Kubernetes 将能够回归发生的变更。
- **保密和配置管理**：在不需要重新构建镜像的情况下，可以部署和更新保密和应用配置。
- **存储编排**：自动挂接存储系统，这些存储系统可以来自于本地、公共云提供商（例如：GCP和AWS）、网络存储(例如：NFS、iSCSI、Gluster、Ceph、Cinder和Floker等)。



## 第 3 章 Kubernetes 快速入门

### 3.1 Kubernetes 安装前准备

#### 概述

本次安装采用 Ubuntu Server X64 18.04 LTS 版本安装 kubernetes 集群环境，集群节点为 1 主 2 从模式，此次对虚拟机会有些基本要求，如下：

- OS：Ubuntu Server X64 18.04 LTS
- CPU：最低要求，1 CPU 2 核
- 内存：最低要求，2GB
- 磁盘：最低要求，20GB

####  节点配置

创建三台虚拟机，节点配置如下：

| 主机名      | IP   | 角色   | 系统                | CUP/内存 | 磁盘 |
| ----------- | ---- | ------ | ------------------- | -------- | ---- |
| k8s-master  |      | Master | Ubuntu Server 18.04 | 2 核 2G  | 20G  |
| k8s-node-01 |      | Node   | Ubuntu Server 18.04 | 2 核 2G  | 20G  |
| k8s-node-02 |      | Node   | Ubuntu Server 18.04 | 2 核 2G  | 20G  |



### 3.2 统一环境配置

> 注意：以下步骤请在制作 VMWare 镜像时一并完成, 避免逐台安装的麻烦。

#### 关闭交互空间

```shell
swapoff -a
```

#### 避免开机启动交换空间

 ```shell
# 注释 /etc/fstab 中的 swap
 vi /etc/fstab
 ```

```shell
# /etc/fstab: static file system information.
# 
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/ubuntu-vg/ubuntu-lv during curtin installation
/dev/disk/by-id/dm-uuid-LVM-rcRcdAdAApoq0jWHr6b2lt7nzFCwTHvsdjqttVuxIlK6RMu4kQbZVprrsZ0H7yvf / ext4 defaults 0 0
# /boot was on /dev/sda2 during curtin installation
/dev/disk/by-uuid/87384c47-a26e-4950-8352-ad8b3c7dacfb /boot ext4 defaults 0 0
#/swap.img      none    swap    sw      0       0
```

#### 关闭防火墙

```shell
ufw disable
```

#### 使用 apt 安装 Docker

```shell
# 更新软件源
sudo apt-get update
# 安装所需依赖
sudo apt-get -y install apt-transport-https ca-certificates curl software-properties-common
# 安装 GPG 证书
curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
# 新增软件源信息
sudo add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
# 再次更新软件源
sudo apt-get -y update
# 安装 Docker CE 版
sudo apt-get -y install docker-ce
```

#### 验证

```shell
# docker version
```

```shell
Client: Docker Engine - Community
 Version:           19.03.8
 API version:       1.40
 Go version:        go1.12.17
 Git commit:        afacb8b7f0
 Built:             Wed Mar 11 01:25:46 2020
 OS/Arch:           linux/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          19.03.8
  API version:      1.40 (minimum version 1.12)
  Go version:       go1.12.17
  Git commit:       afacb8b7f0
  Built:            Wed Mar 11 01:24:19 2020
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.2.13
  GitCommit:        7ad184331fa3e55e52b890ea95e65ba581ae3429
 runc:
  Version:          1.0.0-rc10
  GitCommit:        dc9208a3303feef5b3839f4323d9beb36df0a9dd
 docker-init:
  Version:          0.18.0
  GitCommit:        fec3683
```

#### 配置 Docker 加速器

对于使用 **systemd** 的系统，请在 `/etc/docker/daemon.json` 中写入如下内容（如果文件不存在请新建该文件）

```json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com"
  ]
}
```

> 注意，一定要保证该文件符合 JSON 规范，否则 Docker 将不能启动。

验证加速器是否配置成功：

```shell
sudo systemctl restart docker
docker info
...
# 出现如下语句即表示配置成功
Registry Mirrors:
 https://registry.docker-cn.com/
...
```

#### 安装 kubeadm，kubelet，kubectl

kubeadm 是 kubernetes 的集群安装工具，能够快速安装 kubernetes 集群。

- 配置软件源

  ```shell
  # 安装系统工具
  apt-get update && apt-get install -y apt-transport-https
  # 安装 GPG 证书
  curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -
  # 写入软件源；注意：我们用系统代号为 bionic，但目前阿里云不支持，所以沿用 16.04 的 xenial
  cat << EOF >/etc/apt/sources.list.d/kubernetes.list
  deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
  EOF
  ```

- 安装kubeadm，kubelet，kubectl

  ```shell
  # 安装
  apt-get update  
  apt-get install -y kubelet kubeadm kubectl
  ```

- 设置 kubelet 自启动， 并启动 kubelet

  ```shell
  systemctl enable kubelet && systemctl start kubelet
  ```

  > **kubeadm**：用于初始化 Kubernetes 集群
  >
  > **kubectl**：Kubernetes 的命令行工具，主要作用是部署和管理应用，查看各种资源，创建，删除和更新组件
  >
  > **kubelet**：主要负责启动 Pod 和容器

#### 同步时间

- 设定时区

  ```shell
  dpkg-reconfigure tzdata
  ```

  ![](./img/ubuntu_clock.png)

  选择 Asia -> 再选择 Shanghai -> OK

  ![](./img/ubuntu_clock1.png)

- 时间同步

  ```shell
  # 安装ntpdate工具
  apt-get install ntpdate
  
  # 将系统时间与网络同步
  ntpdate cn.pool.ntp.org
  
  # 将时间写入硬件
  hwclock --systohc
  ```

- 查看时间是否已同步

  ```shell
  date
  ```

#### 修改 cloud.cfg

主要作用是防止重启后主机名修改还原问题

```shell
vi /etc/cloud/cloud.cfg

# 该配置默认为 false，修改为 true 即可
preserve_hostname: true
```

#### 克隆虚拟机环境

在完成上面统一配置后，我们将虚拟机重启下。重启完毕后, 就可以将这台基础服务器关机, 并用此虚拟机作为 k8s 基础服务器镜像, 然后分表克隆出三台服务器节点, 并为它们单独配置 **IP** 和 **主机名**



### 3.3 单独节点配置

在同一局域网中主机名不应该相同，所以我们需要做修改，下列操作步骤为修改 **18.04** 版本的 Hostname，如果是 16.04 或以下版本则直接修改 `/etc/hostname` 里的名称即可

#### 修改主机名（各个节点分别修改）

```shell
# 使用 hostnamectl 命令修改，其中 kubernetes-master 为新的主机名
hostnamectl set-hostname kubernetes-master

# 配置 hosts
cat >> /etc/hosts << EOF
10.10.50.50 kubernetes-node-02
EOF
```

#### 重启

```shell
reboot
```



### 3.4 Kubernetes 集群安装



#### 概述

安装 kubernetes 主要是安装它的各个镜像，而 kubeadm 已经为我们集成好了运行 kubernetes 所需的基本镜像。但由于国内的网络原因，在搭建环境时，无法拉取到这些镜像。此时我们只需要修改为阿里云提供的镜像服务即可解决该问题。

#### 创建并修改配置

在 kubernetes-master 节点上

```shell
# 创建工作目录
mkdir -p /usr/local/kubernetes/cluster
cd /usr/local/kubernetes/cluster/

# 导出配置文件
kubeadm config print init-defaults --kubeconfig ClusterConfiguration > kubeadm.yml

```

```yaml
# 修改配置文件内容
apiVersion: kubeadm.k8s.io/v1beta2
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: abcdef.0123456789abcdef
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
kind: InitConfiguration
localAPIEndpoint:
	# 修改主节点 IP 地址
  advertiseAddress: 10.10.50.38
  bindPort: 6443
nodeRegistration:
  criSocket: /var/run/dockershim.sock
  name: kubernetes-master
  taints:
  - effect: NoSchedule
    key: node-role.kubernetes.io/master
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta2
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controllerManager: {}
dns:
  type: CoreDNS
etcd:
  local:
    dataDir: /var/lib/etcd
# 国内不能访问 Google, 修改镜像为阿里云
imageRepository: registry.aliyuncs.com/google_containers
kind: ClusterConfiguration
kubernetesVersion: v1.18.0
networking:
  dnsDomain: cluster.local
  # 配置 Pod 所在网段为我们虚拟机不重叠的网段（这里用的是 flannel 默认网段）
  podSubnet: "10.244.0.0/16"
  serviceSubnet: 10.96.0.0/12
scheduler: {}
```

#### 查看和拉取镜像

```shell
# 查看所需镜像列表
kubeadm config images list --config kubeadm.yml

# 拉取镜像
kubeadm config images pull --config kubeadm.yml
```

```shell
root@kubernetes-master:/usr/local/kubernetes/cluster# kubeadm config images list --config kubeadm.yml
registry.aliyuncs.com/google_containers/kube-apiserver:v1.18.0
registry.aliyuncs.com/google_containers/kube-controller-manager:v1.18.0
registry.aliyuncs.com/google_containers/kube-scheduler:v1.18.0
registry.aliyuncs.com/google_containers/kube-proxy:v1.18.0
registry.aliyuncs.com/google_containers/pause:3.2
registry.aliyuncs.com/google_containers/etcd:3.4.3-0
registry.aliyuncs.com/google_containers/coredns:1.6.7
```

```shell
root@kubernetes-master:/usr/local/kubernetes/cluster# kubeadm config images pull --config kubeadm.yml
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-apiserver:v1.18.0
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-controller-manager:v1.18.0
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-scheduler:v1.18.0
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-proxy:v1.18.0
[config/images] Pulled registry.aliyuncs.com/google_containers/pause:3.2
[config/images] Pulled registry.aliyuncs.com/google_containers/etcd:3.4.3-0
[config/images] Pulled registry.aliyuncs.com/google_containers/coredns:1.6.7
```

#### 安装 kubernetes master主节点

执行以下命令初始化主节点，该命令指定了初始化时需要使用的配置文件，其中添加 `--upload-certs` 参数可以在后续执行加入节点时自动分发证书文件。追加的 `tee kubeadm-init.log` 用以输出日志。

```shell
root@kubernetes-master:/usr/local/kubernetes/cluster# kubeadm init --config=kubeadm.yml --upload-certs | tee kubeadm-init.log

# 安装信息如下：
W0422 18:39:10.202126   64944 configset.go:202] WARNING: kubeadm cannot validate component configs for API groups [kubelet.config.k8s.io kubeproxy.config.k8s.io]
[init] Using Kubernetes version: v1.18.0
[preflight] Running pre-flight checks
        [WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [kubernetes-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.10.50.38]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [kubernetes-master localhost] and IPs [10.10.50.38 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [kubernetes-master localhost] and IPs [10.10.50.38 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
W0422 18:39:13.732379   64944 manifests.go:225] the default kube-apiserver authorization-mode is "Node,RBAC"; using "Node,RBAC"
W0422 18:39:13.733814   64944 manifests.go:225] the default kube-apiserver authorization-mode is "Node,RBAC"; using "Node,RBAC"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 26.003179 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-1.18" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
e2ae2e0a251263e68ee121fff04c8b4605d1cd50224a4085817f4375f6bb7273
[mark-control-plane] Marking the node kubernetes-master as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node kubernetes-master as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: abcdef.0123456789abcdef
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.10.50.38:6443 --token abcdef.0123456789abcdef \
    --discovery-token-ca-cert-hash sha256:433b194618efc80f0cf6cdc5fa2fd8930c428c9bfb9e61b931a9cfe062b9c3b8 
```

#### 配置 kubectl

```shell
# 参考上面输出
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

# 非 ROOT 用户执行
chown $(id -u):$(id -g) $HOME/.kube/config
```

#### 验证是否成功

```shell
kubectl get node

# 能够打印出节点信息即表示成功
NAME                STATUS     ROLES    AGE     VERSION
kubernetes-master   NotReady   master   4m12s   v1.18.2
```

至此主节点配置完成。

#### 使用 kubeadm 配置 slave 节点

将 slave 节点加入到集群中很简单，只需要在 slave 服务器上安装 kubeadm，kubectl，kubelet 三个工具，然后使用 `kubeadm join` 命令加入即可。准备工作如下：

- 修改主机名
- 配置软件源
- 安装三个工具

由于之前章节已经操作完成，此处不再赘述。

这里我们只需要借助于上面 master 节点 kubeadm 生成的命令将 slave 加入集群即可。

分别在 kubernetes-node-01 和 kubernetes-node-02 节点上执行下面命令。

#### 将 slave 加入到集群

```shell
# kubeadm join 10.10.50.38:6443 --token abcdef.0123456789abcdef --discovery-token-ca-cert-hash sha256:433b194618efc80f0cf6cdc5fa2fd8930c428c9bfb9e61b931a9cfe062b9c3b8 

# 成功信息如下：
W0422 18:54:12.792739   68348 join.go:346] [preflight] WARNING: JoinControlPane.controlPlane settings will be ignored when control-plane flag is not set.
[preflight] Running pre-flight checks
        [WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.18" ConfigMap in the kube-system namespace
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.

```

说明：

- token
  - 可以通过安装 master 时的日志查看 token 信息
  - 可以通过 `kubeadm token list` 命令打印出 token 信息
  - 如果 token 过期，可以使用 `kubeadm token create` 命令创建新的 token
- discovery-token-ca-cert-hash
  - 可以通过安装 master 时的日志查看 sha256 信息
  - 可以通过 `openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'` 命令查看 sha256 信息



#### 验证是否成功

回到 master 服务器

```shell
kubectl get nodes

# 可以看到如下信息证明 slave 加入 master 成功
NAME                 STATUS     ROLES    AGE     VERSION
kubernetes-master    NotReady   master   18m     v1.18.2
kubernetes-node-01   NotReady   <none>   3m31s   v1.18.2
kubernetes-node-02   NotReady   <none>   35s     v1.18.2
```

>如果 slave 节点加入 master 时配置有问题可以在 slave 节点上使用 `kubeadm reset` 重置配置再使用 `kubeadm join` 命令重新加入即可。希望在 master 节点删除 node ，可以使用 `kubeadm delete nodes ` 删除。



##### 查看 pod 状态

```shell
kubectl get pod -n kube-system -o wide

# 信息如下：
NAME                                        READY   STATUS    RESTARTS   AGE     IP             NODE                 NOMINATED NODE   READINESS GATES
coredns-7ff77c879f-8xfdq                    0/1     Pending   0          19m     <none>         <none>               <none>           <none>
coredns-7ff77c879f-vfvtq                    0/1     Pending   0          19m     <none>         <none>               <none>           <none>
etcd-kubernetes-master                      1/1     Running   0          19m     10.10.50.38    kubernetes-master    <none>           <none>
kube-apiserver-kubernetes-master            1/1     Running   0          19m     10.10.50.38    kubernetes-master    <none>           <none>
kube-controller-manager-kubernetes-master   1/1     Running   0          19m     10.10.50.38    kubernetes-master    <none>           <none>
kube-proxy-p7qsf                            1/1     Running   0          19m     10.10.50.38    kubernetes-master    <none>           <none>
kube-proxy-v4c4s                            1/1     Running   0          5m7s    10.10.50.221   kubernetes-node-01   <none>           <none>
kube-proxy-v7cxf                            1/1     Running   0          2m11s   10.10.50.135   kubernetes-node-02   <none>           <none>
kube-scheduler-kubernetes-master            1/1     Running   0          19m     10.10.50.38    kubernetes-master    <none>           <none>

```

可以看出 coredns 尚未运行，此时我们还需要安装网络插件。



### 3.5 Kubernetes 网络配置

#### 概述

容器网络是容器选择连接到其他容器、主机和外部网络的机制。容器的 runtime 提供了各种网络模式，每种模式都会产生不同的体验。例如，Docker 默认情况下可以为容器配置以下网络：

- **none：** 将容器添加到一个容器专门的网络堆栈中，没有对外连接。
- **host：** 将容器添加到主机的网络堆栈中，没有隔离。
- **default bridge：** 默认网络模式。每个容器可以通过 IP 地址相互连接。
- **自定义网桥：** 用户定义的网桥，具有更多的灵活性、隔离性和其他便利功能。

#### 什么是 CNI

CNI(Container Network Interface) 是一个标准的，通用的接口。在容器平台，Docker，Kubernetes，Mesos 容器网络解决方案 flannel，calico，weave。只要提供一个标准的接口，就能为同样满足该协议的所有容器平台提供网络功能，而 CNI 正是这样的一个标准接口协议。

#### Kubernetes 中的 CNI 插件

CNI 的初衷是创建一个框架，用于在配置或销毁容器时动态配置适当的网络配置和资源。插件负责为接口配置和管理 IP 地址，并且通常提供与 IP 管理、每个容器的 IP 分配、以及多主机连接相关的功能。容器运行时会调用网络插件，从而在容器启动时分配 IP 地址并配置网络，并在删除容器时再次调用它以清理这些资源。

运行时或协调器决定了容器应该加入哪个网络以及它需要调用哪个插件。然后，插件会将接口添加到容器网络命名空间中，作为一个 veth 对的一侧。接着，它会在主机上进行更改，包括将 veth 的其他部分连接到网桥。再之后，它会通过调用单独的 IPAM（IP地址管理）插件来分配 IP 地址并设置路由。

在 Kubernetes 中，kubelet 可以在适当的时间调用它找到的插件，为通过 kubelet 启动的 pod进行自动的网络配置。

Kubernetes 中可选的 CNI 插件如下：

- Flannel
- Calico
- Canal
- Weave

#### 什么是 Calico

Calico 为容器和虚拟机提供了安全的网络连接解决方案，并经过了大规模生产验证（在公有云和跨数千个集群节点中），可与 Kubernetes，OpenShift，Docker，Mesos，DC / OS 和 OpenStack 集成。

Calico 还提供网络安全规则的动态实施。使用 Calico 的简单策略语言，您可以实现对容器，虚拟机工作负载和裸机主机端点之间通信的细粒度控制。

#### 安装网络插件 Calico

参考官方文档安装：https://docs.projectcalico.org/getting-started/kubernetes/quickstart

```shell
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

#### 确定安装是否成功

```shell
watch kubectl get pods --all-namespaces

# 需要等待所有状态为 Running，注意时间可能较久，3 - 5 分钟的样子
NAMESPACE     NAME                                        READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-555fc8cc5c-2m6xd    1/1     Running   0          3m55s
kube-system   calico-node-d6lnp                           1/1     Running   0          3m55s
kube-system   calico-node-gtgpk                           1/1     Running   0          3m55s
kube-system   calico-node-wpw8r                           1/1     Running   0          3m55s
kube-system   coredns-7ff77c879f-8xfdq                    1/1     Running   0          42m
kube-system   coredns-7ff77c879f-vfvtq                    1/1     Running   0          42m
kube-system   etcd-kubernetes-master                      1/1     Running   0          42m
kube-system   kube-apiserver-kubernetes-master            1/1     Running   0          42m
kube-system   kube-controller-manager-kubernetes-master   1/1     Running   0          42m
kube-system   kube-proxy-p7qsf                            1/1     Running   0          42m
kube-system   kube-proxy-v4c4s                            1/1     Running   0          28m
kube-system   kube-proxy-v7cxf                            1/1     Running   0          25m
kube-system   kube-scheduler-kubernetes-master            1/1     Running   0          42m
```

#### 解决 ImagePullBackOff

在使用 `watch kubectl get pods --all-namespaces` 命令观察 Pods 状态时如果出现 `ImagePullBackOff` 无法 Running 的情况，请尝试使用如下步骤处理：

- Master 中删除 Nodes：`kubectl delete nodes `
- Slave 中重置配置：`kubeadm reset`
- Slave 重启计算机：`reboot`
- Slave 重新加入集群：`kubeadm join`

至此基本集群环境已部署完毕。



### 3.6 第一个 Kubernetes 容器

#### 检查组件运行状态

```shell
# 在 master 节点执行
kubectl get cs

# 输出如下
NAME                 STATUS    MESSAGE             ERROR
# 调度服务，主要作用是将 POD 调度到 Node
scheduler            Healthy   ok                  
# 自动化修复服务，主要作用是 Node 宕机后自动修复 Node 回到正常的工作状态
controller-manager   Healthy   ok                  
# 服务注册与发现
etcd-0               Healthy   {"health":"true"} 
```

#### 检查 Master 状态

```shell
# kubectl cluster-info

# 主节点状态
Kubernetes master is running at https://10.10.50.38:6443
# DNS 状态
KubeDNS is running at https://10.10.50.38:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

#### 检查 Nodes 状态

```shell
# kubectl get nodes

# 输出如下，STATUS 为 Ready 即为正常状态
NAME                 STATUS   ROLES    AGE   VERSION
kubernetes-master    Ready    master   49m   v1.18.2
kubernetes-node-01   Ready    <none>   34m   v1.18.2
kubernetes-node-02   Ready    <none>   31m   v1.18.2
```

#### 运行第一个容器实例

下面是 Deployment 示例, 使用 yaml 声明式方式。创建一个 ReplicaSet 展开两个 `nginx` Pods：

```yaml
# vi nginx-deployment.yaml

# 内容如下
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

```shell
# kubectl apply -f nginx-deployment.yaml
```

#### 查看全部 Pods 的状态

```shell
# kubectl get pods -o wide

# 输出如下，需要等待一小段实践，STATUS 为 Running 即为运行成功
NAME                                READY   STATUS    RESTARTS   AGE    IP               NODE                 NOMINATED NODE   READINESS GATES
nginx-deployment-6b474476c4-tpsdt   1/1     Running   0          104s   10.244.140.69    kubernetes-node-02   <none>           <none>
nginx-deployment-6b474476c4-wkvm2   1/1     Running   0          104s   10.244.141.195   kubernetes-node-01   <none>           <none>
```

#### 查看已部署的服务

```shell
# kubectl get deployment
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           6m4s

```

#### 映射服务，让用户可以访问

```shell
# kubectl expose deployment nginx-deployment --port=80 --type=LoadBalancer
service/nginx-deployment exposed
```

#### 创建已发布服务

```shell
root@kubernetes-master:~# kubectl get services
NAME               TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes         ClusterIP      10.96.0.1       <none>        443/TCP        124m
# 由此可见，Nginx 服务已成功发布并将 80 端口映射为 32211
nginx-deployment   LoadBalancer   10.99.226.196   <pending>     80:32211/TCP   9s
```

#### 查看服务详情

```shell
# kubectl describe service nginx-deployment
Name:                     nginx-deployment
Namespace:                default
Labels:                   app=nginx
Annotations:              <none>
Selector:                 app=nginx
Type:                     LoadBalancer
IP:                       10.99.226.196
Port:                     <unset>  80/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  32211/TCP
Endpoints:                10.244.140.68:80,10.244.140.69:80,10.244.141.195:80
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

#### 验证是否成功

通过浏览器访问 Master 服务器:http://10.10.50.38:32211/

![](./img/nginx.png)

此时 Kubernetes 会以负载均衡的方式访问部署的 Nginx 服务，能够正常看到 Nginx 的欢迎页即表示成功。容器实际部署在其它 Node 节点上，通过访问 Node 节点的 IP:Port 也是可以的。

#### 停止服务

- 删除已部署的服务

```shell
# kubectl delete deployment nginx-deployment
# 输出如下
deployment.extensions "nginx-deployment" deleted
```

- 删除已发布的服务

```shell
# kubectl delete service nginx
# 输出如下
service "nginx-deployment" deleted
```





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



## 第 5 章 Kubernetes 架构

Kubernetes 是一个开源的 **Docker 容器编排系统**，它可以调度计算集群的节点，动态管理上面的作业，保证它们按用户期望的状态运行。通过使用「labels」和「pods」的概念，Kubernetes 将应用按逻辑单元进行分组，方便管理和服务发现。

![](./img/k8s_m_n.png)

Kubernetes 架构是一个比较典型的二层架构和 server-client 架构。Master 作为**中央的管控节点**，会去与 **Node** 进行一个连接。

所有 UI 的、clients、这些 user 侧的组件，只会和 Master 进行连接，把希望的状态或者想执行的命令下发给 Master，Master 会把这些命令或者状态下发给相应的节点，进行最终的执行。

![](./img/k8s_schedule1.png)

- **pods：** 是一组紧密关联的容器集合，它们共享 IPC(进程间通信)、Network(网络) 和 UTS namespace(UTS 命名空间是 Linux 命名空间的一个子系统，主要作用是完成对容器 Hostname 和 Domain 的隔离，同时保存内核名称、版本、以及底层体系结构类型等信息)，是 Kubernetes 调度的基本单位。
- **labels：** 键值对(key/value)标签，可以被关联到如 Pod 这样的对象上，主要作用是给用户一个直观的感受，比如这个 Pod 是用来放置数据库的。
- **GUI：** 用户图形界面，可以是 Web 用户界面，比如使用 `kubernetes-dashboard` 组件，用户可以通过 Dashboard 在 Kubernetes 集群中部署容器化的应用，可以查看集群中应用的运行情况，同时也能够基于 Dashboard 创建或修改部署、任务、服务等 Kubernetes 的资源。通过部署向导，用户能够对部署进行扩缩容，进行滚动更新、重启 Pod 和部署新应用。当然，通过 Dashboard 也能够查看 Kubernetes 资源的状态。
- **kubectl：** 用于管理 Kubernetes 集群的命令行工具。
- **kube-apiserver：** 提供了资源操作的唯一入口，并提供认证、授权、访问控制、API 注册和发现等机制
- **Kubernetes Master：** Kubernetes 集群主节点，主要由 `kube-apiserver`、`kube-scheduler`、`kube-controller-manager`、`etcd` 四个模块组成。
- **Kubernetes Node：** Kubernetes 集群子节点，主要由 `kubelet`、`kube-proxy`、`runtime` 三个模块组成。
- **Image Registry：** 镜像仓库，比如：Ducker HUB 或 Docker 私服。



### 5.1 Master

Master 是 Cluster 的大脑，它的主要职责是调度，即决定将应用放在哪里运行。Master 运行 Linux 操作系统，可以是物理机或者虚拟机。为了实现高可用，可以运行多个 Master。

Kubernetes 的 Master 包含四个主要的组件：API Server、Controller、Scheduler 以及 etcd。

![](./img/k8s_m.png)

- **kube-apiserver**

  顾名思义是用来处理 API 操作的，Kubernetes 中所有的组件都会和 API Server 进行连接，组件与组件之间一般不进行独立的连接，都依赖于 API Server 进行消息的传送；

- **kube-controller-manager**

  用于执行大部分的集群层次的功能，它既执行生命周期功能(例如：命名空间创建和生命周期、事件垃圾收集、已终止垃圾收集、级联删除垃圾收集、node垃圾收集)，也执行API业务逻辑（例如：pod的弹性扩容）。控制管理提供自愈能力、扩容、应用生命周期管理、服务发现、路由、服务绑定和提供。Kubernetes默认提供Replication Controller、Node Controller、Namespace Controller、Service Controller、Endpoints Controller、Persistent Controller、DaemonSet Controller等控制器。

- **kube-scheduler**

  scheduler组件为容器自动选择运行的主机。依据请求资源的可用性，服务请求的质量等约束条件，scheduler监控未绑定的pod，并将其绑定至特定的node节点。Kubernetes也支持用户自己提供的调度器，Scheduler负责根据调度策略自动将Pod部署到合适Node中，调度策略分为预选策略和优选策略，Pod的整个调度过程分为两步：

  1）预选Node：遍历集群中所有的Node，按照具体的预选策略筛选出符合要求的Node列表。如没有Node符合预选策略规则，该Pod就会被挂起，直到集群中出现符合要求的Node。

  2）优选Node：预选Node列表的基础上，按照优选策略为待选的Node进行打分和排序，从中获取最优Node。

- **etcd：** CoreOS 基于 Raft 开发的分布式 key-value 存储，可用于服务发现、共享配置以及一致性保障（如数据库选主、分布式锁等）

### 5.2 **Node**

Node 的职责是运行容器应用。Node 由 Master 管理，Node 负责监控并汇报容器的状态，并根据 Master 的要求管理容器的生命周期。Node 运行在 Linux 操作系统，可以是物理机或者是虚拟机。

![](./img/k8s_n.png)

- **Kubelet**

  Kubelet是Kubernetes中最主要的控制器，它是Pod和Node API的主要实现者，Kubelet负责驱动容器执行层。在Kubernetes中，应用容器彼此是隔离的，并且与运行其的主机也是隔离的，这是对应用进行独立解耦管理的关键点。

  在Kubernets中，Pod作为基本的执行单元，它可以拥有多个容器和存储数据卷，能够方便在每个容器中打包一个单一的应用，从而解耦了应用构建时和部署时的所关心的事项，已经能够方便在物理机/虚拟机之间进行迁移。API准入控制可以拒绝或者Pod，或者为Pod添加额外的调度约束，但是Kubelet才是Pod是否能够运行在特定Node上的最终裁决者，而不是scheduler或者DaemonSet。kubelet默认情况使用cAdvisor进行资源监控。**负责管理Pod、容器、镜像、数据卷等，实现集群对节点的管理，并将容器的运行状态汇报给Kubernetes API Server**。

- **Container Runtime**

  每一个Node都会运行一个Container Runtime，其负责下载镜像和运行容器。Kubernetes本身并不提供容器运行时环境，但提供了接口，可以插入所选择的容器运行时环境。kubelet使用Unix socket之上的gRPC框架与容器运行时进行通信，kubelet作为客户端，而CRI shim作为服务器。

  ![](./img/kube_cr.png)

  protocol buffers API提供两个gRPC服务，ImageService和RuntimeService。ImageService提供拉取、查看、和移除镜像的RPC。RuntimeSerivce则提供管理Pods和容器生命周期管理的RPC，以及与容器进行交互(exec/attach/port-forward)。容器运行时能够同时管理镜像和容器（例如：Docker和Rkt），并且可以通过同一个套接字提供这两种服务。在Kubelet中，这个套接字通过*–container-runtime-endpoint*和*–image-service-endpoint*字段进行设置。Kubernetes CRI支持的容器运行时包括docker、rkt、cri-o、frankti、kata-containers和clear-containers等, 默认的容器运行时为 Docker。

- **Kube proxy**

  基于一种公共访问策略（例如：负载均衡），服务提供了一种访问一群pod的途径。此方式通过创建一个虚拟的IP来实现，客户端能够访问此IP，并能够将服务透明的代理至Pod。每一个Node都会运行一个kube-proxy，kube proxy通过iptables规则引导访问至服务IP，并将重定向至正确的后端应用，通过这种方式kube-proxy提供了一个高可用的负载均衡解决方案。服务发现主要通过DNS实现。

  在Kubernetes中，kube proxy负责为Pod创建代理服务；引到访问至服务；并实现服务到Pod的路由和转发，以及通过应用的负载均衡。

  

## 第 6 章 Kubernetes 实战

### 6.1 Nginx 部署

#### 概述

我们知道通过 `run` 命令启动容器非常麻烦，Docker 提供了 Compose 为我们解决了这个问题。那 Kubernetes 是如何解决这个问题的呢？其实很简单，使用 `kubectl create` 命令就可以做到和 Compose 一样的效果了，该命令可以通过配置文件快速创建一个集群资源对象。

#### 部署 Deployment

以 部署 nginx 为例

创建一个名为`nginx-deployment.yml` 配置文件

v1.16.0 之后

```yaml
# API 版本号：由 extensions/v1beta1 修改为 apps/v1
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-app
spec:
  # 增加了选择器配置
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        # 设置标签由 name 修改为 app
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```

部署&删除

```sh
# kubectl create -f nginx-deployment.yml
# kubecel delete -f nginx-deployment.yml
```

#### 镜像拉取策略

支持三中 ImagePullPolicy

- Always：不管镜像是否存在都会进行一次拉取
- Never：不管镜像是否存在都不会进行拉取
- IfNotPresent：如果镜像不存在，才会进行拉取

注意：

- 默认为 `IfNotPresent`, 但 `:latest` 标签的镜像默认为：`Always`
- 拉取镜像时 Docker 会进行校验, 如果镜像中的 MD5 码没有变, 则不会拉取镜像数据
- 生产环境中应该尽可能避免使用：`latest` 标签, 而开发环境中可以借助 `:latest` 自动拉取最新的镜像。

#### 发布 Service

创建一个名为 `nginx-service.yml` 的配置文件

v1.16.0 之后

```yaml
# API 版本号
apiVersion: v1
# 类型，如：Pod/ReplicationController/Deployment/Service/Ingress
kind: Service
# 元数据
metadata:
  # Kind 的名称
  name: nginx-http
spec:
	# 暴露端口
  ports:
  	## Service 暴露的端口
    - port: 80
    	## Pod 上的端口，这里是将 Service 暴露的端口转发到 Pod 端口上
      targetPort: 80
  # 类型
  type: LoadBalancer
   # 标签选择器
  selector:
    # 需要和上面部署的 Deployment 标签名对应
    app: nginx
```

部署&删除

```sh
# 部署
kubectl create -f nginx-service.yml
# 删除
kubectl delete -f nginx-service.yml
```

#### 验证是否生效

- 查看 POD 列表

  ```sh
  root@kubernetes-master:~# kubectl get pods
  NAME                        READY   STATUS              RESTARTS   AGE
  nginx-app-d46f5678b-xkknk   0/1     ContainerCreating   0          29s
  nginx-app-d46f5678b-zhs5c   0/1     ContainerCreating   0          29s
  ```

- 查看 Deployment 列表

  ```sh
  root@kubernetes-master:~# kubectl get deployment
  NAME        READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-app   2/2     2            2           91s
  ```

- 查看 Service 列表

  ```sh
  root@kubernetes-master:~# kubectl get services
  NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
  kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP        62m
  nginx-http   LoadBalancer   10.106.102.66   <pending>     80:32511/TCP   8s
  ```

- 查看 Service 详情

  ```sh
  root@kubernetes-master:~# kubectl describe service nginx-http
  Name:                     nginx-http
  Namespace:                default
  Labels:                   <none>
  Annotations:              <none>
  Selector:                 app=nginx
  Type:                     LoadBalancer
  IP:                       10.106.102.66
  Port:                     <unset>  80/TCP
  TargetPort:               80/TCP
  NodePort:                 <unset>  32511/TCP
  Endpoints:                10.244.140.65:80,10.244.140.66:80
  Session Affinity:         None
  External Traffic Policy:  Cluster
  Events:                   <none>
  ```

- 通过浏览器访问

  通过浏览器访问 http://masterip:32511/ ，出现 Nginx 欢迎页即表示成功

  

#### 集成环境部署

也可以不区分配置文件，一次性部署 Deployment 和 Service，创建一个名为 `nginx.yml` 的配置文件，配置内容如下：

```sh
vi nginx.yml
```

```yaml
# API 版本号：由 extensions/v1beta1 修改为 apps/v1
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-app
spec:
  # 增加了选择器配置
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        # 设置标签由 name 修改为 app
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
---
# API 版本号
apiVersion: v1
# 类型，如：Pod/ReplicationController/Deployment/Service/Ingress
kind: Service
# 元数据
metadata:
  # Kind 的名称
  name: nginx-http
spec:
  # 暴露端口
  ports:
    ## Service 暴露的端口
    - port: 80
      ## Pod 上的端口，这里是将 Service 暴露的端口转发到 Pod 端口上
      targetPort: 80
  # 类型
  type: LoadBalancer
   # 标签选择器
  selector:
    # 需要和上面部署的 Deployment 标签名对应
    app: nginx       
```

部署&删除

```sh
# 部署
kubectl create -f nginx.yml
# 删除
kubectl delete -f nginx.yml
```



#### 修改默认的端口范围

Kubernetes 服务的 NodePort 默认端口范围是 30000-32767，在某些场合下，这个限制不太适用，我们可以自定义它的端口范围，操作步骤如下：

编辑 `vi /etc/kubernetes/manifests/kube-apiserver.yaml` 配置文件，增加配置 `--service-node-port-range=2-65535`

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    component: kube-apiserver
    tier: control-plane
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - command:
    - kube-apiserver
    # 在这里增加配置即可
    - --service-node-port-range=2-65535
    - --advertise-address=192.168.141.150
    - --allow-privileged=true
    - --authorization-mode=Node,RBAC
    - --client-ca-file=/etc/kubernetes/pki/ca.crt
    - --enable-admission-plugins=NodeRestriction
    - --enable-bootstrap-token-auth=true
    - --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt
    - --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt
// 以下配置省略...
```

使用 `docker ps` 命令找到 `kube-apiserver` 容器，再使用 `docker restart ` 即可生效。



### 6.2 Ingress 统一访问入门

#### 术语

- **节点：** Kubernetes 集群中的服务器
- **集群：** Kubernetes 管理的一组服务器集合
- **边界路由器：** 为局域网和 Internet 路由数据包的路由器，执行防火墙保护局域网络
- **集群网络：** 遵循 Kubernetes 网络模型实现集群内的通信的具体实现，比如 Flannel 和 Calico
- **服务：** Kubernetes 的服务 (Service) 是使用标签选择器标识的一组 Pod Service (Deployment)。 **除非另有说明，否则服务的虚拟 IP 仅可在集群内部访问**



#### 内部访问方式 ClusterIP

ClusterIP 服务是 Kubernetes 的默认服务。它给你一个集群内的服务，集群内的其它应用都可以访问该服务。集群外部无法访问它。在某些场景下我们可以使用 Kubernetes 的 Proxy 模式来访问服务，比如调试服务时。

![](./img/clusterIp.png)

#### 三种外部访问方式

##### NodePort

NodePort 服务是引导外部流量到你的服务的最原始方式。NodePort，正如这个名字所示，**在所有节点（虚拟机）上开放一个特定端口**，任何发送到该端口的流量都被转发到对应服务。

NodePort 服务特征如下：

- 每个端口只能是一种服务
- 端口范围只能是 30000-32767（可调）
- 不在 YAML 配置文件中指定则会分配一个默认端口

> **建议：** 不要在生产环境中使用这种方式暴露服务，大多数时候我们应该让 Kubernetes 来选择端口

![](./img/nodeport.png)

##### LoadBalancer

LoadBalancer 服务是暴露服务到 Internet 的标准方式。所有通往你指定的端口的流量都会被转发到对应的服务。它没有过滤条件，没有路由等。这意味着你几乎可以发送任何种类的流量到该服务，像 HTTP，TCP，UDP，WebSocket，gRPC 或其它任意种类。

![](./img/loadbalancer.png)

##### Ingress

Ingress 事实上不是一种服务类型。相反，它处于多个服务的前端，扮演着 “智能路由” 或者集群入口的角色。你可以用 Ingress 来做许多不同的事情，各种不同类型的 Ingress 控制器也有不同的能力。它允许你基于路径或者子域名来路由流量到后端服务。

Ingress 可能是暴露服务的最强大方式，但同时也是最复杂的。Ingress 控制器有各种类型，包括 Google Cloud Load Balancer， Nginx，Contour，Istio，等等。它还有各种插件，比如 cert-manager (它可以为你的服务自动提供 SSL 证书)/

如果你想要使用同一个 IP 暴露多个服务，这些服务都是使用相同的七层协议（典型如 HTTP），你还可以获取各种开箱即用的特性（比如 SSL、认证、路由等等）

![](./img/ingress.png)



#### 什么是 Ingress

通常情况下，Service 和 Pod 的 IP 仅可在集群内部访问。集群外部的请求需要通过负载均衡转发到 Service 在 Node 上暴露的 NodePort 上，然后再由 kube-proxy 通过边缘路由器 (edge router) 将其转发给相关的 Pod 或者丢弃。而 Ingress 就是为进入集群的请求提供路由规则的集合

Ingress 可以给 Service 提供集群外部访问的 URL、负载均衡、SSL 终止、HTTP 路由等。为了配置这些 Ingress 规则，集群管理员需要部署一个 Ingress Controller，它监听 Ingress 和 Service 的变化，并根据规则配置负载均衡并提供访问入口。

#### 使用 Nginx Ingress Controller

本次实践的主要目的就是将入口统一，不再通过 LoadBalancer 等方式将端口暴露出来，而是使用 Ingress 提供的反向代理负载均衡功能作为我们的唯一入口。通过以下步骤操作仔细体会。

> **注意：** 下面包含资源配置的步骤都是自行创建 YAML 配置文件通过 `kubectl create -f ` 和 `kubectl delete -f ` 部署和删除



##### 部署 Tomcat

部署 Tomcat 但仅允许在内网访问，我们要通过 Ingress 提供的反向代理功能路由到 Tomcat 之上

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: tomcat-app
spec:
  replicas: 2
  template:
    metadata:
      labels:
        name: tomcat
    spec:
      containers:
      - name: tomcat
        image: tomcat
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: tomcat-http
spec:
  ports:
    - port: 8080
      targetPort: 8080
  # ClusterIP, NodePort, LoadBalancer
  type: LoadBalancer
  selector:
    name: tomcat
```

##### 安装 Nginx Ingress Controller

Ingress Controller 有许多种，我们选择最熟悉的 Nginx 来处理请求，其它可以参考 [官方文档](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)

- 下载 Nginx Ingress Controller 配置文件

  ```sh
  # wget https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/mandatory.yaml
  ```
  
- 修改配置文件，找到配置如下位置 (搜索 `serviceAccountName`) 在下面增加一句 `hostNetwork: true`

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: nginx-ingress-controller
    namespace: ingress-nginx
    labels:
      app.kubernetes.io/name: ingress-nginx
      app.kubernetes.io/part-of: ingress-nginx
  spec:
    # 可以部署多个实例
    replicas: 1
    selector:
      matchLabels:
        app.kubernetes.io/name: ingress-nginx
        app.kubernetes.io/part-of: ingress-nginx
    template:
      metadata:
        labels:
          app.kubernetes.io/name: ingress-nginx
          app.kubernetes.io/part-of: ingress-nginx
        annotations:
          prometheus.io/port: "10254"
          prometheus.io/scrape: "true"
      spec:
        serviceAccountName: nginx-ingress-serviceaccount
        # 增加 hostNetwork: true，意思是开启主机网络模式，暴露 Nginx 服务端口 80
        hostNetwork: true
        containers:
          - name: nginx-ingress-controller
            image: quay.io/kubernetes-ingress-controller/nginx-ingress-controller:0.24.1
            args:
              - /nginx-ingress-controller
              - --configmap=$(POD_NAMESPACE)/nginx-configuration
              - --tcp-services-configmap=$(POD_NAMESPACE)/tcp-services
              - --udp-services-configmap=$(POD_NAMESPACE)/udp-services
              - --publish-service=$(POD_NAMESPACE)/ingress-nginx
  // 以下代码省略...
  ```

  

- 部署 Ingress

  Ingress 翻译过来是入口的意思，说白了就是个 API 网关（想想之前学的 Zuul 和 Spring Cloud Gateway）

  ```yaml
  apiVersion: networking.k8s.io/v1beta1
  kind: Ingress
  metadata:
    name: nginx-web
    annotations:
      # 指定 Ingress Controller 的类型
      kubernetes.io/ingress.class: "nginx"
      # 指定我们的 rules 的 path 可以使用正则表达式
      nginx.ingress.kubernetes.io/use-regex: "true"
      # 连接超时时间，默认为 5s
      nginx.ingress.kubernetes.io/proxy-connect-timeout: "600"
      # 后端服务器回转数据超时时间，默认为 60s
      nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
      # 后端服务器响应超时时间，默认为 60s
      nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
      # 客户端上传文件，最大大小，默认为 20m
      nginx.ingress.kubernetes.io/proxy-body-size: "10m"
      # URL 重写
      nginx.ingress.kubernetes.io/rewrite-target: /
  spec:
    # 路由规则
    rules:
    # 主机名，只能是域名，修改为你自己的
    - host: k8s.test.com
      http:
        paths:
        - path:
          backend:
            # 后台部署的 Service Name，与上面部署的 Tomcat 对应
            serviceName: tomcat-http
            # 后台部署的 Service Port，与上面部署的 Tomcat 对应
            servicePort: 8080
  ```

#### 验证是否成功

##### 查看 Tomcat

```bash
kubectl get deployment

# 输出如下
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
tomcat-app   2/2     2            2           88m
```

```bash
kubectl get service

# 输出如下
NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes    ClusterIP   10.96.0.1       <none>        443/TCP    2d5h
tomcat-http   ClusterIP   10.97.222.179   <none>        8080/TCP   89m
```

##### 查看 Nginx Ingress Controller

```bash
kubectl get pods -n ingress-nginx -o wide

# 输出如下，注意下面的 IP 地址，就是我们实际访问地址
NAME                                        READY   STATUS    RESTARTS   AGE   IP                NODE                 NOMINATED NODE   READINESS GATES
nginx-ingress-controller-76f9fddcf8-vzkm5   1/1     Running   0          61m   192.168.141.160   kubernetes-node-01   <none>           <none>
```

##### 查看 Ingress

```bash
kubectl get ingress

# 输出如下
NAME        HOSTS          ADDRESS   PORTS   AGE
nginx-web   k8s.test.com             80      61m
```

#### 测试访问

成功代理到 Tomcat 即表示成功

```bash
# 不设置 Hosts 的方式请求地址，下面的 IP 和 Host 均在上面有配置
curl -v http://192.168.141.160 -H 'host: k8s.test.com'
```

#### 扩展阅读

##### 解决无法下载 quay.io 地址镜像的问题

在实际操作中我们需要拉取 Nginx Ingress 镜像，默认地址为：`quay.io/kubernetes-ingress-controller/nginx-ingress-controller:0.24.1`，由于国内网络等原因，可能无法正常拉取该镜像，此时我们可以使用 Azure 提供的镜像加速器，将 `quay.io` 替换为 `quay.azk8s.cn`，其它类似地址的镜像无法下载均可尝试使用该方式解决，替换后的地址如：`quay.azk8s.cn/kubernetes-ingress-controller/nginx-ingress-controller:0.24.1`



### 6.3 Kubernetes 准备数据卷（持久化）

#### 概述

在 Docker 中就有数据卷的概念，当容器删除时，数据也一起会被删除，想要持久化使用数据，需要把主机上的目录挂载到 Docker 中去，在 K8S 中，数据卷是通过 Pod 实现持久化的，如果 Pod 删除，数据卷也会一起删除，k8s 的数据卷是 docker 数据卷的扩展，K8S 适配各种存储系统，包括本地存储 EmptyDir，HostPath， 网络存储（NFS，GlusterFS，PV/PVC）等。

我们以部署 MySQL8 为例，采用 **NFS + PV/PVC** 网络存储方案实现我们的 Kubernetes 数据持久化。

#### 什么是 NFS

NFS 是 Network File System 的简写，即网络文件系统，NFS 是 FreeBSD 支持的文件系统中的一种。NFS 基于 RPC (Remote Procedure Call) 远程过程调用实现，其允许一个系统在网络上与它人共享目录和文件。通过使用 NFS，用户和程序就可以像访问本地文件一样访问远端系统上的文件。NFS 是一个非常稳定的，可移植的网络文件系统。具备可扩展和高性能等特性，达到了企业级应用质量标准。由于网络速度的增加和延迟的降低，NFS 系统一直是通过网络提供文件系统服务的有竞争力的选择 。

##### NFS 原理

NFS 使用 RPC (Remote Procedure Call) 的机制进行实现，RPC 使得客户端可以调用服务端的函数。同时，由于有 VFS 的存在，客户端可以像使用其它普通文件系统一样使用 NFS 文件系统。经由操作系统的内核，将 NFS 文件系统的调用请求通过 TCP/IP 发送至服务端的 NFS 服务。NFS 服务器执行相关的操作，并将操作结果返回给客户端。

![](./img/nfs.jpg)

##### NFS 服务主要进程

- rpc.nfsd：最主要的 NFS 进程，管理客户端是否可登录
- rpc.mountd：挂载和卸载 NFS 文件系统，包括权限管理
- rpc.lockd：非必要，管理文件锁，避免同时写出错
- rpc.statd：非必要，检查文件一致性，可修复文件

##### NFS 的关键工具

- 主要配置文件：`/etc/exports`
- NFS 文件系统维护命令：`/usr/bin/exportfs`
- 共享资源的日志文件：`/var/lib/nfs/*tab`
- 客户端查询共享资源命令：`/usr/sbin/showmount`
- 端口配置：`/etc/sysc`

##### NFS 服务端配置

在 NFS 服务器端的主要配置文件为 `/etc/exports` 时，通过此配置文件可以设置共享文件目录。每条配置记录由 NFS 共享目录、NFS 客户端地址和参数这 3 部分组成，格式如下：

```text
[NFS 共享目录] [NFS 客户端地址 1 (参数 1, 参数 2, 参数 3……)] [客户端地址 2 (参数 1, 参数 2, 参数 3……)]
```

- NFS 共享目录：服务器上共享出去的文件目录
- NFS 客户端地址：允许其访问的 NFS 服务器的客户端地址，可以是客户端 IP 地址，也可以是一个网段 (192.168.141.0/24)
- 访问参数：括号中逗号分隔项，主要是一些权限选项

##### 访问权限参数

| 序号 | 选项 | 描述                                   |
| ---- | ---- | -------------------------------------- |
| 1    | ro   | 客户端对于共享文件目录为只读权限。默认 |
| 2    | rw   | 客户端对于共享文件目录具有读写权限     |

##### 用户映射参数

| 序号 | 选项           | 描述                                                         |
| ---- | -------------- | ------------------------------------------------------------ |
| 1    | root_squash    | 使客户端使用 root 账户访冋时，服务器映射为服务器本地的匿名账号 |
| 2    | no_root_squash | 客户端连接服务端时如果使用的是 root，那么也拥有对服务端分享的目录的 root 权限 |
| 3    | all_squash     | 将所有客户端用户请求映射到匿名用户或用户组（nfsnobody)       |
| 4    | no_all_squash  | 与上相反。默认                                               |
| 5    | anonuid=xxx    | 将远程访问的所有用户都映射为匿名用户，并指定该用户为本地用户(UID=xxx) |
| 6    | anongid=xxx    | 将远程访问的所有用户组都映射为匿名用户组账户，并指定该匿名用户组账户为本地用户组账户(GUI=xxx) |

##### 其它配置参数

| 序号 | 选项       | 描述                                                         |
| ---- | ---------- | ------------------------------------------------------------ |
| 1    | sync       | 同步写操作，数据写入存储设备后返回成功信息。默认             |
| 2    | async      | 异步写提作，数据在未完全写入存储设备前就返回成功信息，实际还在内存， |
| 3    | wdelay     | 延迟写入选项，将多个写提请求合并后写入硬盘，减少 I/O 次数， NFS 非正常关闭数据可能丢失。默认 |
| 4    | no_wdelay  | 与上相反，不与 async 同时生效，如果 NFS 服务器主要收到小且不相关的请求，该选项实际会降低性能 |
| 5    | subtree    | 若输出目录是一个子目录，则 NFS 服务器将检查其父目录的权限。默认 |
| 6    | no_subtree | 即使输出目录是一个子目录， NFS 服务器也不检查其父目录的权限，这样可以提高效率 |
| 7    | secure     | 限制客户端只能从小于 1024 的 TCP/IP 端口连接 NFS 服务器。默认 |
| 8    | insecure   | 允许客户端从大于 1024 的 TCP/IP 端口连接服务器               |



#### 安装 NFS 服务器

由于 NFS 是一套分布式文件系统，我们再创建一台独立的虚拟机作为我们 NFS 服务端，配置如下

| 主机名             | IP              | 系统                | CPU/内存 | 磁盘 |
| ------------------ | --------------- | ------------------- | -------- | ---- |
| kubernetes-volumes | 192.168.141.140 | Ubuntu Server 18.04 | 2核2G    | 20G  |

- 创建一个目录作为共享文件目录

```bash
mkdir -p /usr/local/kubernetes/volumes
```

- 给目录增加读写权限

```bash
chmod a+rw /usr/local/kubernetes/volumes
```

- 安装 NFS 服务端

```bash
apt-get update
apt-get install -y nfs-kernel-server
```

- 配置 NFS 服务目录，打开文件 `vi /etc/exports`，在尾部新增一行，内容如下
  - `/usr/local/kubernetes/volumes`：作为服务目录向客户端开放
  - *：表示任何 IP 都可以访问
  - rw：读写权限
  - sync：同步权限
  - no_subtree_check：表示如果输出目录是一个子目录，NFS 服务器不检查其父目录的权限

```text
/usr/local/kubernetes/volumes *(rw,sync,no_subtree_check)
```

- 重启服务，使配置生效

```bash
/etc/init.d/nfs-kernel-server restart
```



#### 安装 NFS 客户端

安装客户端的目的是验证是否可以上传文件到服务端，安装命令如下

```bash
apt-get install -y nfs-common
```

- 创建 NFS 客户端挂载目录

```bash
mkdir -p /usr/local/kubernetes/volumes-mount
```

- 将 NFS 服务器的 `/usr/local/kubernetes/volumes` 目录挂载到 NFS 客户端的 `/usr/local/kubernetes/volumes-mount` 目录

```bash
mount 192.168.141.140:/usr/local/kubernetes/volumes /usr/local/kubernetes/volumes-mount
```

- 使用 `df` 命令查看挂载信息

```bash
df

# 输出如下
Filesystem                                    1K-blocks    Used Available Use% Mounted on
udev                                             977556       0    977556   0% /dev
tmpfs                                            201732    1252    200480   1% /run
/dev/mapper/ubuntu--vg-ubuntu--lv              19475088 5490916  12971848  30% /
tmpfs                                           1008648       0   1008648   0% /dev/shm
tmpfs                                              5120       0      5120   0% /run/lock
tmpfs                                           1008648       0   1008648   0% /sys/fs/cgroup
/dev/loop0                                        90624   90624         0 100% /snap/core/6964
/dev/loop1                                        93184   93184         0 100% /snap/core/6350
/dev/sda2                                        999320  214252    716256  24% /boot
tmpfs                                            201728       0    201728   0% /run/user/0
# 有此输出表示挂载成功
193.192.168.141.140:/usr/local/kubernetes/volumes  19475200 5490944  12972032  30% /usr/local/kubernetes/volumes-mount
```

#### 验证 NFS 服务

- 测试文件上传

```bash
ip addr > /usr/local/kubernetes/volumes-mount/test.txt
```

- 查看 `/usr/local/kubernetes/volumes` 目录下是否有 `test.txt` 文件，有则表示成功

#### 取消 NFS 客户端挂载

> **注意：** 不要直接在挂载目录下执行，否则会报错

```bash
umount /usr/local/kubernetes/volumes-mount
```



### 6.4 Kubernetes 实现数据持久化

#### 概述

存储管理与计算管理是两个不同的问题。Persistent Volume 子系统，对存储的供应和使用做了抽象，以 API 形式提供给管理员和用户使用。要完成这一任务，我们引入了两个新的 API 资源：**Persistent Volume（持久卷）** 和 **Persistent Volume Claim（持久卷消费者）**。

Persistent Volume（PV）是集群之中的一块网络存储。跟 Node 一样，也是集群的资源。PV 跟 Volume (卷) 类似，不过会有独立于 Pod 的生命周期。这一 API 对象包含了存储的实现细节，例如 NFS、iSCSI 或者其他的云提供商的存储系统。Persistent Volume Claim (PVC) 是用户的一个请求。跟 Pod 类似，Pod 消费 Node 的资源，PVC 消费 PV 的资源。Pod 能够申请特定的资源（CPU 和内存）；Claim 能够请求特定的尺寸和访问模式（例如可以加载一个读写，以及多个只读实例）

#### PV 与 PVC

PV 是集群的资源。PVC 是对这一资源的请求，也是对资源的所有权的检验。PV 和 PVC 之间的互动遵循如下的生命周期。

- **供应：** 集群管理员会创建一系列的 PV。这些 PV 包含了为集群用户提供的真实存储资源，它们可利用 Kubernetes API 来消费。
- **绑定：** 用户创建一个包含了容量和访问模式的持久卷申请。Master 会监听 PVC 的产生，并尝试根据请求内容查找匹配的 PV，并把 PV 和 PVC 进行绑定。用户能够获取满足需要的资源，并且在使用过程中可能超出请求数量。如果找不到合适的卷，这一申请就会持续处于非绑定状态，一直到出现合适的 PV。例如一个集群准备了很多的 50G 大小的持久卷，（虽然总量足够）也是无法响应 100G 的申请的，除非把 100G 的 PV 加入集群。
- **使用：** Pod 把申请作为卷来使用。集群会通过 PVC 查找绑定的 PV，并 Mount 给 Pod。对于支持多种访问方式的卷，用户在使用 PVC 作为卷的时候，可以指定需要的访问方式。一旦用户拥有了一个已经绑定的 PVC，被绑定的 PV 就归该用户所有了。用户的 Pods 能够通过在 Pod 的卷中包含的 PVC 来访问他们占有的 PV。
- **释放：** 当用户完成对卷的使用时，就可以利用 API 删除 PVC 对象了，而且他还可以重新申请。删除 PVC 后，对应的卷被视为 “被释放”，但是这时还不能给其他的 PVC 使用。之前的 PVC 数据还保存在卷中，要根据策略来进行后续处理。
- **回收：** PV 的回收策略向集群阐述了在 PVC 释放卷的时候，应如何进行后续工作。目前可以采用三种策略：保留，回收或者删除。保留策略允许重新申请这一资源。在持久卷能够支持的情况下，删除策略会同时删除持久卷以及 AWS EBS/GCE PD 或者 Cinder 卷中的存储内容。如果插件能够支持，回收策略会执行基础的擦除操作（`rm -rf /thevolume/*`），这一卷就能被重新申请了。

#### 定义 PV

##### 持久卷插件

持久卷是以插件方式实现的，目前支持的插件如下：

- GCEPersistentDisk
- AWSElasticBlockStore
- **NFS（我们采用的是该方案）**
- iSCSI
- RBD (Ceph Block Device)
- Glusterfs
- HostPath (单节点测试使用)
- 本地持久卷

##### YAML 配置

创建一个名为 `nfs-pv-mysql.yml` 的配置文件

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv-mysql
spec:
  # 设置容量
  capacity:
    storage: 5Gi
  # 访问模式
  accessModes:
    # 该卷能够以读写模式被多个节点同时加载
    - ReadWriteMany
  # 回收策略，这里是基础擦除 `rm-rf/thevolume/*`
  persistentVolumeReclaimPolicy: Recycle
  nfs:
    # NFS 服务端配置的路径
    path: "/usr/local/kubernetes/volumes"
    # NFS 服务端地址
    server: 192.168.141.140
    readOnly: false
```

```bash
# 部署
kubectl create -f nfs-pv-mysql.yml
# 删除
kubectl delete -f nfs-pv-mysql.yml
# 查看
kubectl get pv
NAME           CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
nfs-pv-mysql   5Gi        RWX            Recycle          Available                                   29m
```

##### 配置说明

- **Capacity（容量）**

  一般来说，PV 会指定存储容量。这里需要使用 PV 的 capcity 属性。目前存储大小是唯一一个能够被申请的指标，今后会加入更多属性，例如 IOPS，吞吐能力等。

- **AccessModes（访问模式）**

  只要资源提供者支持，持久卷能够被用任何方式加载到主机上。每种存储都会有不同的能力，每个 PV 的访问模式也会被设置成为该卷所支持的特定模式。例如 NFS 能够支持多个读写客户端，但是某个 NFS PV 可能会在服务器上以只读方式使用。每个 PV 都有自己的一系列的访问模式，这些访问模式取决于 PV 的能力。访问模式的可选范围如下：
  - ReadWriteOnce：该卷能够以读写模式被加载到一个节点上
  - ReadOnlyMany：该卷能够以只读模式加载到多个节点上
  - ReadWriteMany：该卷能够以读写模式被多个节点同时加载

  在 CLI 下，访问模式缩写为：

  - RWO：ReadWriteOnce
  - ROX：ReadOnlyMany
  - RWX：ReadWriteMany

  另外，一个卷不论支持多少种访问模式，同时只能以一种访问模式加载。例如一个 GCE Persistent Disk 既能支持 ReadWriteOnce，也能支持 ReadOnlyMany。

- **RecyclingPolicy（回收策略）**

  当前的回收策略可选值包括：

  - Retain：人工重新申请
  - Recycle：基础擦除（`rm-rf/thevolume/*`）
  - Delete：相关的存储资产例如 AWS EBS，GCE PD 或者 OpenStack Cinder 卷一并删除

  目前，只有 NFS 和 HostPath 支持 Recycle 策略，AWS EBS、GCE PD 以及 Cinder 卷支持 Delete 策略。

- **阶段（Phase）**

  一个卷会处于如下阶段之一：

  - Available：可用资源，尚未被绑定到 PVC 上
  - Bound：该卷已经被绑定
  - Released：PVC 已经被删除，但该资源尚未被集群回收
  - Failed：该卷的自动回收过程失败

#### 定义 PVC

创建一个名为 `nfs-pvc-mysql-myshop.yml` 的配置文件

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-pvc-mysql-myshop
spec:
  accessModes:
  # 需要使用和 PV 一致的访问模式
  - ReadWriteMany
  # 按需分配资源
  resources:
     requests:
       storage: 1Gi
```

```bash
# 部署
kubectl create -f nfs-pvc-mysql-myshop.yml
# 删除
kubectl delete -f nfs-pvc-mysql-myshop.yml
# 查看
kubectl get pvc
```



#### 部署 MySQL8

> **注意：** 要确保每台 Node 都安装了 NFS 客户端，`apt-get install -y nfs-common`

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: mysql-myshop
spec:
  replicas: 1
  template:
    metadata:
      labels:
        name: mysql-myshop
    spec:
      containers:
        - name: mysql-myshop
          image: mysql
          # 只有镜像不存在时，才会进行镜像拉取
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3306
          # 同 Docker 配置中的 environment
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: "123456"
          # 容器中的挂载目录
          volumeMounts:
            - name: nfs-vol-myshop
              mountPath: /var/lib/mysql
      volumes:
        # 挂载到数据卷
        - name: nfs-vol-myshop
          persistentVolumeClaim:
            claimName: nfs-pvc-mysql-myshop
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-myshop
spec:
  ports:
    - port: 3306
      targetPort: 3306
  type: LoadBalancer
  selector:
    name: mysql-myshop
```

##### 解决权限问题

当你使用 `kubectl create -f ` 部署后，你会发现 Pod 状态为 Error，容器无法正常启动的情况，我们可以使用 `kubectl logs ` 看到一条日志

```text
chown: changing ownership of '/var/lib/mysql/': Operation not permitted
```

解决方案是在 NFS 服务端配置中增加一个参数 `no_root_squash`，即将配置修改为：`/usr/local/kubernetes/volumes *(rw,sync,no_subtree_check,no_root_squash)`

##### 测试运行

部署成功后可以使用 `kubectl get service` 查看我们 MySQL 的运行端口，再使用连接工具连接会报如下错误

![](./img/mysql_error.png)

意思为无法使用密码的方式登录，在 Docker 部署时我们可以在 YAML 中配置相关参数解决这个问题；下一节我们讲解在 Kubernetes 中采用 **ConfigMap** 的方式配置 MySQL



### 6.5 Kubernetes ConfigMap

#### 概述

ConfigMap 是用来存储配置文件的 Kubernetes 资源对象，所有的配置内容都存储在 etcd 中。它可以被用来保存单个属性，也可以用来保存整个配置文件或者 JSON 二进制对象。ConfigMap API 资源提供了将配置数据注入容器的方式，同时保证该机制对容器来说是透明的。配置应该从 Image 内容中解耦，以此来保持容器化应用程序的可移植性。

#### 使用 ConfigMap 配置 MySQL

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-myshop-config
data:
  # 这里是键值对数据
  mysqld.cnf: |
    [client]
    port=3306
    [mysql]
    no-auto-rehash
    [mysqld]
    skip-host-cache
    skip-name-resolve
    default-authentication-plugin=mysql_native_password
    character-set-server=utf8mb4
    collation-server=utf8mb4_general_ci
    explicit_defaults_for_timestamp=true
    lower_case_table_names=1
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: mysql-myshop
spec:
  replicas: 1
  template:
    metadata:
      labels:
        name: mysql-myshop
    spec:
      containers:
        - name: mysql-myshop
          image: mysql
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3306
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: "123456"
          volumeMounts:
            # 以数据卷的形式挂载 MySQL 配置文件目录
            - name: cm-vol-myshop
              mountPath: /etc/mysql/conf.d
            - name: nfs-vol-myshop
              mountPath: /var/lib/mysql
      volumes:
        # 将 ConfigMap 中的内容以文件形式挂载进数据卷
        - name: cm-vol-myshop
          configMap:
            name: mysql-myshop-config
            items:
                # ConfigMap 中的 Key
              - key: mysqld.cnf
                # ConfigMap Key 匹配的 Value 写入名为 mysqld.cnf 的文件中
                path: mysqld.cnf
        - name: nfs-vol-myshop
          persistentVolumeClaim:
            claimName: nfs-pvc-mysql-myshop
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-myshop
spec:
  ports:
    - port: 3306
      targetPort: 3306
      nodePort: 32036
  type: LoadBalancer
  selector:
    name: mysql-myshop
```

```bash
# 查看 ConfigMap
kubectl get cm
kubectl describe cm <ConfigMap Name>
```



#### 6.6  Kubernetes Dashboard

#### 概述

Kubernetes Dashboard 是 Kubernetes 集群的 Web UI，用于管理集群。

#### 安装

GitHub 地址：[Kubernetes Dashboard](https://github.com/kubernetes/dashboard)

下载配置文件

```bash
wget https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml
```

修改配置如下

```yaml
# 省略部分代码...

# ------------------- Dashboard Deployment ------------------- #

kind: Deployment
apiVersion: apps/v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
spec:
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s-app: kubernetes-dashboard
  template:
    metadata:
      labels:
        k8s-app: kubernetes-dashboard
    spec:
      containers:
      - name: kubernetes-dashboard
        # 修改镜像地址为阿里云
        image: registry.aliyuncs.com/google_containers/kubernetes-dashboard-amd64:v1.10.1
        ports:
        - containerPort: 8443
          protocol: TCP
        args:
          - --auto-generate-certificates
        volumeMounts:
        - name: kubernetes-dashboard-certs
          mountPath: /certs
        - mountPath: /tmp
          name: tmp-volume
        livenessProbe:
          httpGet:
            scheme: HTTPS
            path: /
            port: 8443
          initialDelaySeconds: 30
          timeoutSeconds: 30
      volumes:
      - name: kubernetes-dashboard-certs
        secret:
          secretName: kubernetes-dashboard-certs
      - name: tmp-volume
        emptyDir: {}
      serviceAccountName: kubernetes-dashboard
      tolerations:
      - key: node-role.kubernetes.io/master
        effect: NoSchedule

---
# ------------------- Dashboard Service ------------------- #

kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
spec:
  # 修改类型为 NodePort 访问
  type: NodePort
  ports:
    - port: 443
      targetPort: 8443
      # 设置端口号为 30001
      nodePort: 30001
  selector:
    k8s-app: kubernetes-dashboard
```

部署到集群

```yaml
# 部署
kubectl create -f kubernetes-dashboard.yaml

# 查看
kubectl -n kube-system get pods
kubectl -n kube-system get service kubernetes-dashboard
kubectl -n kube-system describe service kubernetes-dashboard
```

#### 访问

需要使用 NodeIP:30001 访问 Dashboard，因为证书原因除火狐浏览器外其它浏览器无法直接打开页面

Chrome 浏览器显示如下

![](./img/k8s_dashboard1.png)

Firefox 浏览器显示如下

![](./img/k8s_dashboard2.png)



点击 **接受风险并继续** 即可显示欢迎界面

![](./img/k8s_ds.png)



#### 登录

我们采用 Token 方式登录

- 创建登录账号，创建一个名为 `dashboard-adminuser.yaml` 的配置文件

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kube-system
```

```sh
kubectl create -f dashboard-adminuser.yaml
```

- 打印 Token 信息

```bash
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')

# 输出如下
Name:         admin-user-token-86cz9
Namespace:    kube-system
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: admin-user
              kubernetes.io/service-account.uid: 3902d3d4-8b13-11e9-8089-000c29d49c77

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  11 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLTg2Y3o5Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiIzOTAyZDNkNC04YjEzLTExZTktODA4OS0wMDBjMjlkNDljNzciLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.pA44wyarsahOwqH7X7RVlcdB1k3_j-L3gwOYlTQ4_Lu5ZmfXDFlhqN-Q1tdryJes_V1Nj_utocnXBAxsGzOGaVR4Te4oli3htSepI9MrggQAyeC3C0_QANXGCE6V5L6B5tGZ6tDsY92VDnlvz2N6OrHaH2IJJd2DlxzYvAPvfAFuPeHWuPeVxUisMfXeW42S7US6skZwbZ06JrPYAFxHjqv3zoxRxI8-bmekltvOamsrL0pAXvIUzaowgbjiQb2NgeLAw9O6qfYcz5DAi2C-7G_yAcve6pgnWcIGhVpKoim9DfJUhe1SVx4H4X5Na6GVaaD6FdUIb7UOgsO1FVpTPw
```

- 将 Token 输入浏览器，成功登陆后效果如下

  ![](./img/k8s_ds_home.png)