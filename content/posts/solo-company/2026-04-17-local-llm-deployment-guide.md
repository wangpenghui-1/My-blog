+++
title = "本地部署大模型完整指南（2026 年 4 月最新版）"
date = "2026-04-17T12:00:00+08:00"
draft = false
publishDate = "2026-04-17T12:00:00+08:00"
summary = "系统梳理 2026 年本地部署大语言模型的完整流程：工具选型（Ollama/LM Studio/llama.cpp）、主流模型横评（Qwen3.5/GLM-4.7-Flash/Gemma 4/DeepSeek-R1）、硬件显存门槛、与云端 API 的核心差异，以及对 Cline/OpenCode 等 Agent 工作流的支持情况。"
tags = ["LLM", "本地部署", "Ollama", "开源模型", "GLM", "Qwen", "AI工具", "技术指南"]
+++

# 本地部署大模型完整指南

> 本文系统梳理本地部署大语言模型（LLM）的完整流程，涵盖工具选型、模型选择、硬件门槛、与 API 调用的核心差异，以及对 Agent 工作流（如 OpenCode、Cline、Aider）的支持情况。
>
> **数据时效：2026-04**。当前开源模型已全面转向 **MoE（混合专家）架构**——总参数决定显存需求，激活参数决定推理速度，两者必须分开理解，不可混为一谈。

---

## 一、为什么要本地部署？

| 动机 | 说明 |
|------|------|
| **数据隐私** | 代码、文档、对话不出本机，适合处理敏感内容 |
| **无网络依赖** | 断网或网络受限环境下正常工作 |
| **零边际成本** | 硬件投入一次，后续推理不产生 token 费用 |
| **低延迟** | 消除网络 RTT，本地小模型响应极快 |
| **可控性** | 自定义系统提示、量化精度、上下文长度 |
| **学习目的** | 深入理解模型推理机制 |

---

## 二、本地部署框架选型

### 2.1 Ollama（入门首选）

**官网：** https://ollama.com | **平台：** macOS / Linux / Windows（原生）

Ollama 是目前生态最完善的本地推理框架，一行命令拉取并运行主流模型，模型库已收录 **4500+** 个模型。

```bash
ollama run qwen3:8b           # 通用对话
ollama run glm-4.7-flash      # 智谱 GLM，代理/代码任务
ollama run gemma4:9b          # 多模态，支持图像输入
ollama run qwen2.5-coder:14b  # 代码开发
ollama serve                  # 后台 API 服务模式
ollama list                   # 查看已下载模型
```

**核心特点：**
- 内置 REST API（`http://localhost:11434`），兼容 OpenAI 格式
- 支持 CUDA / Metal（Apple Silicon）/ ROCm / Vulkan 加速
- 主流新模型通常 day-0 上线

> ⚠️ **GLM-4.7 / GLM-4.7-Flash 注意**：模型已上架 Ollama，但部分用户反馈存在 chat template 兼容问题。如遇乱输出，优先改用 **LM Studio 或 llama.cpp**（均完全支持）。

---

### 2.2 LM Studio（GUI 首选）

**官网：** https://lmstudio.ai | **平台：** macOS / Windows / Linux

面向非技术用户的图形界面工具，内置 GGUF 模型搜索与下载，集成 Chat UI 和本地服务器。**GLM-4.7 系列在此运行最稳定**。

---

### 2.3 llama.cpp（底层高性能）

**仓库：** https://github.com/ggerganov/llama.cpp

C++ 纯推理引擎，是 Ollama / LM Studio 的底层基础。支持 CPU 纯推理，GGUF 格式，极致压缩内存，是 GLM-4.7-Flash GGUF 的**官方推荐**运行方式。

```bash
./llama-cli -m ./glm-4.7-flash.gguf -p "你好" --tool-call-parser glm47 -n 512
```

---

### 2.4 其他选项

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| **Jan** | 开源桌面客户端，界面美观 | 日常对话 |
| **Open WebUI** | 类 ChatGPT Web 界面，对接 Ollama | 团队/局域网共享 |
| **vLLM** | 高吞吐量生产级推理，支持 MoE、FP8 | 服务器部署、并发请求 |
| **SGLang** | 2026 高性能推理引擎 | 生产级高并发 |
| **Xinference** | 多模型并发，RESTful API | 多模型管理 |

---

## 三、可选模型一览（2026 年 4 月）

> **⚠️ 重要区分：** 本节区分"可本地部署（消费级/专业级硬件）"和"仅适合云端/集群"的模型，避免误导实操选型。

---

### 3.1 通用推理 / 对话模型

| 模型 | 来源 | 架构 | 本地可行性 | 推荐规格 | 特点 |
|------|------|------|-----------|---------|------|
| **Qwen3.5** | 阿里 | MoE (397B/17B) | ✅ 高配可用 | 122B Q4 (~60GB) | LM Arena 中国榜首（全球第五），中文顶级 |
| **Mistral Small 4** | Mistral | 稠密 24B | ✅ 单卡可用 | 24B Q4 (~14GB) | 256K 上下文，工具调用稳定 |
| **Gemma 4** | Google | 多规格 MoE | ✅ 极友好 | 见下方详表 | 256K 上下文，多模态，day-0 Ollama 支持 |
| **GLM-4.7-Flash** | 智谱 | MoE (30B/3B) | ✅ 极友好 | Q4 (~5–6GB) | **200K 上下文**，Agent 原生，详见 §3.4 |
| **Llama 4** | Meta | MoE (671B/37B) | ⚠️ 需高配 | 70B 蒸馏 Q4 (~40GB) | 超越 GPT-4.5，128K 上下文 |
| **DeepSeek-V3.2** | DeepSeek | MoE (~671B/37B) | ⚠️ 需高配 | 蒸馏版本可用 | MIT 许可，商业友好，媲美 GPT-5 |
| **DeepSeek-R1** | DeepSeek | MoE (671B/37B) | ✅ 蒸馏版 | 32B / 14B Q4 | 强推理链，蒸馏小版本性价比高 |
| **GLM-5 / GLM-5.1** | 智谱 | MoE (744B/40B) | ❌ 集群专用 | FP8 需 860GB 显存 | 综合榜第一/第二，本地需多张 H100，建议调 API |
| **Kimi K2.5** | Moonshot | MoE (1T/32B) | ❌ 集群专用 | — | 原生多模态 Agent，调 API 更合适 |
| **MiniMax M2.5** | MiniMax | MoE (229B/10B) | ❌ 集群专用 | — | 2026.02 开源，效率高，调 API 更合适 |

**Gemma 4 各规格详解（本地最友好，Google 出品）：**

| 规格 | 有效参数 | VRAM | 运行设备 |
|------|---------|------|---------|
| **E2B** | 2.3B effective | < 1.5 GB | 手机 / 树莓派 |
| **E4B** | 4.5B effective | ~3 GB | 8GB 内存笔记本 |
| **26B MoE (A4B)** | 3.8B active / 26B total | ~18 GB Q4 | RTX 3090 / 4090 |
| **31B Dense** | 31B | ~17 GB Q4 | RTX 4090 / 5090 量化可用 |

---

### 3.2 代码专用模型

| 模型 | 架构 | VRAM (Q4) | 上下文 | 特点 |
|------|------|----------|--------|------|
| **Qwen3-Coder-Next** ⭐ | MoE (80B/3B) | ~45 GB | 256K | 本地最强代码模型，媲美 Claude Sonnet 4.5；Ollama 已上架 |
| **GLM-4.7-Flash** ⭐ | MoE (30B/3B) | ~5–6 GB | 200K | **性价比之王**：6GB 显存跑 200K 上下文，Agent 原生，HumanEval 媲美 30B+ 稠密模型 |
| **Qwen2.5-Coder** | 稠密 | 14B: ~8 GB / 32B: ~18 GB | 128K | 依然优秀，HumanEval 7B 版 88.4%，Apache 2.0 |
| **DeepSeek-Coder-V2** | MoE (236B/21B) | ~130 GB | 128K | 代码推理突出，需高配 |
| **GLM-5.1** | MoE (744B/40B) | ❌ 860GB FP8 | 200K | SWE-bench Pro 第一，仅云端可用 |

---

### 3.3 轻量 / 边缘模型（低配设备首选）

| 模型 | 规格 | VRAM | 特点 |
|------|------|------|------|
| **Gemma 4 E2B** | 2.3B effective | < 1.5 GB | 手机级，256K 上下文 |
| **Gemma 4 E4B** | 4.5B effective | ~3 GB | 8GB 笔记本可用，多模态 |
| **GLM-4.7-Flash Q4** | 30B total / 3B active | ~5–6 GB | 仅 6GB 显存获得 200K 上下文 + Agent 原生能力 |
| **Phi-4-mini** | 3.8B 稠密 | ~4 GB | 数理推理出色 |
| **Qwen3.5 1.5B / 3B** | 稠密 | 1–3 GB | 中文效果好 |
| **SmolLM2** | 1.7B / 360M | 1–2 GB | HuggingFace 出品，极轻量 |

---

### 3.4 GLM-4.7-Flash 专项说明

GLM-4.7-Flash 是智谱 AI（Z.AI）于 2026 年 1 月发布的**本地部署最值得关注的新模型之一**，核心卖点：

| 特性 | 数值 | 意义 |
|------|------|------|
| 架构 | MoE (30B total / 3B active) | 速度接近 3B 稠密模型 |
| Q4_K_M 显存 | **~5–6 GB** | RTX 4060（8GB）即可流畅运行 |
| 上下文 | **200K tokens** | 超大代码库分析 |
| 推理速度 | 120–220 tok/s（RTX 4090）| 媲美 API 响应速度 |
| Agent 模式 | **"Preserved Thinking"** | 多轮工具调用时保持推理链，减少幻觉 |
| 工具调用 | 原生支持 | 适合 Cline / Continue / OpenCode |
| 许可证 | MIT | 完全商业可用 |

**部署方式（推荐优先级）：**

```bash
# 方式一：LM Studio（最稳定，推荐）
# 搜索 glm-4.7-flash，下载 Q4_K_M 量化版

# 方式二：llama.cpp（官方推荐 GGUF 运行方式）
./llama-cli -m ./glm-4.7-flash-q4_k_m.gguf --tool-call-parser glm47 -n 512

# 方式三：Ollama（已上架，部分用户报告 chat template 兼容问题）
ollama run glm-4.7-flash
```

---

## 四、硬件要求详解

### 4.1 量化精度速查

| 量化精度 | 每参数字节数 | 说明 |
|----------|------------|------|
| FP16 / BF16 | 2 字节 | 全精度，效果最好 |
| Q8_0 | 1 字节 | 轻微精度损失，推荐 |
| Q4_K_M | ~0.5 字节 | 主流平衡方案 |
| Q2_K | ~0.25 字节 | 极度压缩，质量明显下降 |

**稠密模型显存速查（MoE 模型以总参数量计算显存，以激活参数量估算速度）：**

| 参数量 | FP16 | Q4_K_M | Q2_K |
|--------|------|--------|------|
| 3B | ~6 GB | ~2 GB | ~1 GB |
| 7B | ~14 GB | ~4 GB | ~2 GB |
| 14B | ~28 GB | ~8 GB | ~4 GB |
| 32B | ~64 GB | ~18 GB | ~9 GB |
| 70B | ~140 GB | ~40 GB | ~20 GB |

---

### 4.2 GPU 推理显存门槛

| 显存规格 | 可运行模型（Q4_K_M）| 典型显卡（2026）|
|----------|-------------------|----------------|
| **4–6 GB** | Gemma 4 E4B / Phi-4-mini | RTX 4060 |
| **6–8 GB** | **GLM-4.7-Flash**（200K，Agent 原生）/ Qwen3.5 7B | RTX 4060 Ti |
| **10–12 GB** | 14B 稠密 Q4 / GLM-4.7-Flash Q8 | RTX 3060 12G / 4070 |
| **16 GB** | 14B Q8 / Mistral Small 4 Q4（24B，256K）| RTX 4080 |
| **24 GB** | 32B Q4 / Gemma 4 26B MoE Q4 / Qwen3-Coder-Next 部分层 | RTX 3090 / 4090 |
| **32 GB** | 32B Q8 / Qwen3.5 中型 MoE Q4 | **RTX 5090**（32GB GDDR7）|
| **48 GB** | 70B Q4 / Qwen3.5 122B MoE Q4 | RTX 6000 Ada |
| **80 GB** | Llama 4 蒸馏 / Qwen3.5 397B MoE Q2 | H100 / A100 |
| **集群 (860GB+)** | GLM-5 / GLM-5.1 全精度 | H100 × 8+ |

> **Apple Silicon 说明：** M 系列统一内存 CPU/GPU 共享，Metal 加速效果出色：
> - **M4 Pro 48GB** → Qwen3.5 32B Q4 / Mistral Small 4 流畅
> - **M3/M4 Max 96–128GB** → Qwen3-Coder-Next 80B MoE Q4 / Llama 4 70B Q4

---

### 4.3 CPU 推理（无 GPU 方案）

| 内存规格 | 可用模型 | 实际体验 |
|---------|---------|---------|
| 8 GB | GLM-4.7-Flash Q4 / Gemma 4 E4B | 约 2–5 tok/s，可用 |
| 16 GB | 14B Q4 | 约 1–3 tok/s，慢但可用 |
| 32 GB | 32B Q4 | 约 0.5–1 tok/s，较慢 |
| 64 GB | 70B Q4 | 极慢，不推荐 |

> **MoE 模型 CPU 推理优势**：GLM-4.7-Flash（3B active）在 CPU 上速度远快于同等显存消耗的 7B 稠密模型。

---

### 4.4 存储要求

- 7B Q4 ≈ 4–5 GB；GLM-4.7-Flash Q4 ≈ 5–6 GB；32B Q4 ≈ 18–20 GB；70B Q4 ≈ 40–45 GB
- 超大 MoE 模型（Qwen3.5 397B Q4 ≈ 200+ GB）需要大容量专用存储
- 推荐 NVMe SSD，模型加载速度与磁盘 I/O 直接相关

---

## 五、Ollama 完整部署流程（以 Windows 为例）

### 第一步：安装 Ollama

访问 https://ollama.com/download 下载安装包，安装后作为系统服务运行。

```bash
ollama --version  # 验证安装
```

### 第二步：下载并运行模型

```bash
# ── 通用对话 ───────────────────────────────────────────
ollama run qwen3:8b               # 中文通用，约 5 GB

# ── 代码 + Agent（核心推荐）──────────────────────────
ollama run glm-4.7-flash          # 智谱，200K 上下文，~5 GB，Agent 原生
                                  # ⚠️ 如遇异常改用 LM Studio
ollama run qwen2.5-coder:14b      # 阿里代码模型，约 8 GB
ollama run qwen3-coder-next:q4_K_M  # 旗舰代码，约 45 GB，需高配

# ── 推理任务 ──────────────────────────────────────────
ollama run deepseek-r1:14b        # 推理链，约 8 GB

# ── 多模态 ────────────────────────────────────────────
ollama run gemma4:9b              # 图像 + 文本，约 6 GB

# ── 轻量/低配 ─────────────────────────────────────────
ollama run gemma4:e4b             # 3 GB，笔记本可用

# 浏览全部模型：https://ollama.com/library
```

### 第三步：配置 GPU 加速

```bash
ollama ps  # GPU 列显示 "100%" 表示完全 GPU 推理
```

若 GPU 未被识别：
1. 确认安装最新 NVIDIA 驱动（CUDA 12.x+）
2. 设置 `OLLAMA_GPU_LAYERS=999` 强制全 GPU

### 第四步：配置为 API 服务

Ollama 默认监听 `http://localhost:11434`，暴露 OpenAI 兼容接口：

```bash
# OpenAI 兼容格式（适配大多数 Agent 工具）
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4.7-flash",
    "messages": [{"role": "user", "content": "帮我写一个快速排序"}]
  }'
```

### 第五步：配置 Open WebUI（可选）

```bash
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
# 访问 http://localhost:3000
```

---

## 六、本地部署 vs. 调用云端 API

### 6.1 综合对比

| 维度 | 本地部署 | 云端 API |
|------|----------|---------|
| **数据隐私** | ✅ 数据不出本机 | ⚠️ 数据上传服务商 |
| **成本结构** | 一次性硬件，后续零成本 | 按 token 计费 |
| **顶级模型** | GLM-5/5.1 本地不可行，需接受能力折中 | 可用 GLM-5.1、GPT-5、Claude 4 等全量模型 |
| **本地可用最强** | GLM-4.7-Flash / Qwen3-Coder-Next / Qwen3.5 | — |
| **速度** | GPU 无网络延迟；CPU 较慢 | 网络延迟 + 排队 |
| **稳定性** | 硬件稳定则高可用 | 依赖服务商 SLA |
| **可控性** | 完全控制参数、Modelfile | 受服务商政策限制 |
| **上下文** | GLM-4.7-Flash 200K / Gemma 4 / Mistral Small 4 256K | 最高 1M tokens |
| **多模态** | Gemma 4 系列支持图像 | GPT-4V / Gemini 3 成熟 |
| **适合场景** | 私密内容、离线、高频低成本 | 顶级能力需求、低频、不便部署 |

### 6.2 2026 年能力格局

- **GLM-5 / GLM-5.1**：综合排行榜 #1/#2，**本地不可行**（860 GB VRAM），建议调用智谱 API
- **Qwen3.5-Max**：LM Arena 全球第五，高配本地可用（122B MoE Q4 ~60GB）
- **GLM-4.7-Flash**：**本地能力最亮眼的新星**，6GB 显存实现 200K 上下文 + Agent 原生
- **Gemma 4 31B**：单卡 17GB Q4，GPT-4 级能力，85 tok/s，极具性价比

> **结论：** 日常开发/写作本地 6–24GB 显存已够用（GLM-4.7-Flash / Qwen2.5-Coder 14B）；需要 GLM-5.1 级别能力，调 API 更务实。

### 6.3 成本临界点估算

| 硬件投入 | 每日 API 等效费用 | 回本周期（参考）|
|---------|----------------|--------------|
| RTX 4060 8GB（~¥3,000）| GLM-4.7-Flash 同等质量 API ~¥30/天 | ~3 个月 |
| RTX 4090 24GB（~¥15,000）| Qwen3.5 32B 级 API ~¥100/天 | ~5 个月 |
| RTX 5090 32GB（~¥25,000+）| Qwen3.5 122B 级 API ~¥200/天 | ~4 个月 |

---

## 七、本地模型对 Agent 工作流的支持

### 7.1 Agent 对模型的核心要求

1. **工具调用（Function Calling）**：必须支持结构化 JSON 工具调用
2. **长上下文**：代码 Agent 常需 32K–200K tokens
3. **指令遵循**：严格按格式输出
4. **推理能力**：复杂任务分解与规划
5. **多轮稳定性**：多步工具调用不丢失上下文

### 7.2 代码 Agent 模型推荐（2026 最新）

| 配置等级 | 推荐模型 | VRAM | 上下文 | 实际体验 |
|---------|---------|------|-------|---------|
| **旗舰** | Qwen3-Coder-Next 80B MoE Q4 | ~45 GB | 256K | 媲美 Claude Sonnet 4.5，Ollama 已上架 |
| **高配** | Qwen2.5-Coder 32B Q4 | ~18 GB | 128K | 接近 GPT-4o 代码能力 |
| **推荐** | Qwen2.5-Coder 14B Q8 | ~16 GB | 128K | 优秀，日常够用 |
| **性价比之王** ⭐ | **GLM-4.7-Flash Q4** | **~5–6 GB** | **200K** | 超低显存获得超长上下文 + Agent 原生；"Preserved Thinking" 模式多轮推理不断链 |
| **多模态** | Gemma 4 26B MoE Q4 | ~18 GB | 256K | 支持图像输入，适合 UI 相关开发 |
| **轻量** | Gemma 4 E4B | ~3 GB | 256K | 低配设备可用 |

### 7.3 通用 Agent / 工作流

| 推荐模型 | 规格 | 说明 |
|---------|------|------|
| **Qwen3.5 122B MoE** | Q4 (~60GB) | 2026 最强中文通用 Agent |
| **GLM-4.7-Flash** | Q4 (~5–6GB) | 工具调用强，200K，Agent 专项优化 |
| **Gemma 4 26B MoE** | Q4 (~18GB) | 256K，多模态，单卡可用 |
| **Mistral Small 4** | 24B Q4 (~14GB) | 256K，工具调用稳定，欧洲出品 |
| **DeepSeek-R1 32B** | Q4 (~18GB) | 推理链任务首选 |

### 7.4 Ollama 对接 Agent 工具配置

**Cline（VS Code 插件）：**
选择 "Ollama" 作为 Provider，填入模型名称，例如 `glm-4.7-flash` 或 `qwen2.5-coder:14b`。

**Continue.dev（`.continue/config.json`）：**
```json
{
  "models": [
    {
      "title": "GLM-4.7-Flash（性价比首选）",
      "provider": "ollama",
      "model": "glm-4.7-flash"
    },
    {
      "title": "Qwen3-Coder-Next（旗舰）",
      "provider": "ollama",
      "model": "qwen3-coder-next:q4_K_M"
    },
    {
      "title": "Qwen2.5-Coder 14B（备用）",
      "provider": "ollama",
      "model": "qwen2.5-coder:14b"
    }
  ]
}
```

**OpenCode / Aider：**
```json
{
  "model": {
    "provider": "ollama",
    "id": "glm-4.7-flash",
    "base_url": "http://localhost:11434"
  }
}
```

### 7.5 本地模型 Agent 的局限性

- **工具调用稳定性**：7B 稠密模型以下格式容易出错；**GLM-4.7-Flash 虽仅 3B active，但 Agent 原生训练，稳定性优于同显存稠密模型**
- **顶级 Agent 任务**：GLM-5.1 在 SWE-bench Pro / Terminal Bench 排名第一，但本地不可用；复杂跨仓库重构仍推荐云端 API
- **量化损失**：Q2_K 精度下工具调用出错率显著升高，建议 Agent 任务最低使用 Q4_K_M

---

## 八、进阶配置与优化

### 8.1 Modelfile 自定义（Ollama）

```dockerfile
FROM glm-4.7-flash

SYSTEM """
你是一名专业的 Python 开发专家，擅长代码审查和调试。
回答时优先给出可运行代码示例，并说明关键逻辑。
"""

PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER num_ctx 65536
```

```bash
ollama create my-glm-coder -f ./Modelfile
ollama run my-glm-coder
```

### 8.2 关键推理参数

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| `temperature` | 越低越确定 | 代码 / Agent：0.1–0.2；对话：0.7 |
| `top_p` | 采样概率阈值 | 0.9 |
| `num_ctx` | 上下文窗口（tokens）| 按 VRAM 尽量调大；GLM-4.7-Flash 可设 64K–128K |
| `num_gpu` | GPU 层数 | -1（全部放 GPU）|
| `repeat_penalty` | 重复惩罚 | 1.1 |

### 8.3 多 GPU / 性能优化

```bash
export OLLAMA_GPU_LAYERS=999        # 所有层放 GPU
export OLLAMA_NUM_PARALLEL=4        # 并发请求数
export OLLAMA_MAX_LOADED_MODELS=3   # 内存中保留模型数

# 查看实时推理速度
ollama run glm-4.7-flash --verbose
```

---

## 九、常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| GLM-4.7 Ollama 输出乱码 / 格式错误 | chat template 兼容性问题 | 改用 **LM Studio** 或 **llama.cpp**（加 `--tool-call-parser glm47`）|
| 模型加载极慢 | 磁盘 I/O 瓶颈 | 将模型移至 NVMe SSD |
| GPU 未被识别 | 驱动版本过旧 | 更新 NVIDIA 驱动（CUDA 12.x+）|
| MoE 模型速度慢 | VRAM 不足，部分层溢出到 CPU | 确保 VRAM 能容纳全部参数 |
| 工具调用格式出错 | 模型能力不足 | 升级到 GLM-4.7-Flash 或 14B+ 模型；降低 temperature |
| 上下文溢出 | num_ctx 过小 | 调大 num_ctx（注意 VRAM 上限）|
| Ollama 服务未启动 | 服务未运行 | `ollama serve` 或重启 Ollama 应用 |

---

## 十、快速选型指南（2026 年 4 月）

```
你的 GPU 显存是多少？
│
├─ < 6 GB VRAM
│   └─ 通用/代码 → Gemma 4 E4B（~3GB，多模态，256K）
│                   或 Phi-4-mini（~4GB，数理推理）
│
├─ 6–8 GB VRAM  ← 强烈推荐 GLM-4.7-Flash
│   ├─ 代码/Agent → GLM-4.7-Flash Q4（~5–6GB，200K 上下文，Agent 原生）
│   └─ 通用对话  → Qwen3.5 7B / Gemma 4 E4B
│
├─ 12–16 GB VRAM
│   ├─ 代码任务  → Qwen2.5-Coder 14B Q8（~16GB）
│   ├─ 通用对话  → Mistral Small 4 Q4（24B，256K，~14GB）
│   └─ 推理任务  → DeepSeek-R1 14B Q4（~8GB）
│
├─ 24 GB VRAM（RTX 3090 / 4090）
│   ├─ 代码任务  → Qwen2.5-Coder 32B Q4（~18GB）
│   ├─ 通用对话  → Gemma 4 26B MoE Q4（~18GB，多模态，256K）
│   └─ 推理任务  → DeepSeek-R1 32B Q4（~18GB）
│
├─ 32 GB VRAM（RTX 5090）
│   ├─ 通用/代码 → Qwen3.5 32B Q8（~32GB）
│   └─ 高质量   → Llama 4 70B MoE Q2（激活 37B）
│
├─ 双卡 / 48GB+（3090×2 / A6000）
│   └─ 旗舰     → Qwen3.5 122B MoE Q4 / Qwen3-Coder-Next 80B MoE Q4
│
└─ Apple Silicon
    ├─ M4 Pro 48GB  → Mistral Small 4 / Qwen3.5 32B Q4
    ├─ M3/M4 Max 96GB → Qwen3-Coder-Next 80B MoE Q4 / Llama 4 70B Q4
    └─ M2/M3 Ultra 192GB → Qwen3.5 397B MoE Q4（旗舰体验）

⚠️ GLM-5 / GLM-5.1 / Kimi K2.5 / MiniMax M2.5：
   综合排行前列，但本地部署需 860GB+ 显存，建议直接调 API。
```

---

## 参考资源

- [Ollama 模型库（4500+）](https://ollama.com/library)
- [GLM-4.7-Flash Ollama 页面](https://ollama.com/library/glm-4.7-flash)
- [GLM-4.7-Flash 本地部署指南 – DEV Community](https://dev.to/purpledoubled/how-to-run-glm-47-flash-locally-with-ollama-30b-quality-at-3b-speed-2lii)
- [GLM-4.7-Flash GGUF 指南 – Unsloth Docs](https://unsloth.ai/docs/models/glm-4.7-flash)
- [Qwen3-Coder-Next Ollama 页面](https://ollama.com/library/qwen3-coder-next)
- [Best Open Source LLMs 2026 – BenchLM.ai](https://benchlm.ai/blog/posts/best-open-source-llm)
- [Open Source LLM Leaderboard 2026 – Onyx AI](https://onyx.app/open-llm-leaderboard)
- [Gemma 4 本地部署指南 – Lushbinary](https://lushbinary.com/blog/gemma-4-developer-guide-benchmarks-architecture-local-deployment-2026/)
- [RTX 5090 规格 – NVIDIA 官方](https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/)
- [Open-Source LLMs Compared 2026 – Till Freitag](https://till-freitag.com/en/blog/open-source-llm-comparison)
- [GGUF 量化说明 – llama.cpp](https://github.com/ggerganov/llama.cpp/blob/master/docs/gguf.md)
