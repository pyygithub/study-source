# Kubernetes

## 第 1 章 Kubernetes 概述

- 官网：https://kubernetes.io

- Github：https://github.com/kubernetes/kubernetes

- 由来：谷歌的Borg系统，后经Go语言重写并捐献给CNCF基金会开源

- 含义：词根源于希腊语：舵手/飞行员，K8S -》K 8个字母 S

- 重要作用：开源的容器编排框架工具（生态极其丰富）

- 学习意义：解决跑裸docker 的若干痛点

  > 使用Docker容器话封装应用程序的缺点：
  >
  > - 单击使用，无法有效集群
  > - 随着容器数量的上升，管理成本攀升
  > - 没有有效的容灾/自愈机制
  > - 没有预设编排模板，无法实现快速、大规模容器调度
  > - 没有统一的配置管理中心工具
  > - 没有容器生命周期管理工具
  > - 没有图形化运维管理工具
  > - ...

## 第 2 章 Kubernetes 优势

- 自动装箱，水平扩展，自我修复
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

- **Pod**：

  Pod是K8S里能够被运行的最小的逻辑单元（原子单元）

  1个Pod里面可以运行多个容器，它们共享UTS+NET+IPC名字空间

  可以把Pod理解成豌豆荚，而同一个Pod内的每个容器是一颗颗豌豆

  一个Pod里运行多个容器，又叫：边车（SideCar）模式

- **Pod控制器**：