+++
title = "把大模型装进自己的电脑：2026 年完整实操指南"
date = "2026-04-17T12:00:00+08:00"
draft = false
publishDate = "2026-04-17T12:00:00+08:00"
summary = "从「你的代码正在被谁看到」讲起，完整梳理本地大模型部署的工具选型、模型推荐（GLM-4.7-Flash、Qwen3-Coder-Next 等）、显存门槛与成本对比，帮开发者在自己的机器上跑出私密、零成本的 AI 编程助手。"
tags = ["AI", "大模型", "本地部署", "Ollama", "开发者工具", "GLM", "Qwen"]
+++

**数据时效：2026-04**

---

## 你的代码，正在被谁看到？

2026 年，大多数开发者的工作流里已经跑着某个 AI 助手——Cursor、Cline、Claude Code、Qwen Code，或者别的什么。你把代码粘进去，它帮你找 Bug、写注释、做重构。

这套流程确实顺手。但有一件事大多数人没有仔细想过：

**你粘进去的那些代码，走的是什么路？**

答案是：离开了你的机器，进入某家公司的服务器，参与了一次推理，然后返回结果。不管是 Anthropic、OpenAI、阿里、还是智谱，都不例外。

这不是阴谋论，这是这些服务的基本架构。大多数厂商的隐私条款里写得清楚——数据用于改进服务，部分情况下会被人工审核。你公司内网的业务逻辑、还没开源的核心算法、客户数据相关的代码……都在其中。

除了隐私，还有两个现实问题：

**成本**。Claude API 每百万输出 token 约 15 美元，高频使用一个月几百上千人民币很正常，更别提企业级别的调用量。

**可用性**。网络不稳定、厂商限流、服务宕机、账号被封——这些事情一旦发生，你的开发流程就直接中断。

本地部署大模型，解决的正是这三个问题：数据不出机器、硬件投入一次性、断网照常工作。

代价是什么？需要一块够用的显卡，需要花半小时配置，需要接受本地模型在某些任务上弱于顶级云端 API 的现实。

这个代价值不值得，取决于你的使用场景。本文会把所有信息摆清楚，让你自己判断。

---

## 一、本地部署到底在做什么

很多人对"本地部署大模型"有误解，以为需要自己训练模型，或者需要专业服务器。

实际上不是。

你需要做的，是把别人已经训练好的模型权重文件下载到本地，然后用一个推理引擎（软件）把它跑起来。整个过程类似于：下载一个大软件，然后运行它。

目前最省事的工具是 **Ollama**。

```bash
# 安装 Ollama 后，一行命令下载并运行模型
ollama run qwen3:8b
```

运行之后，Ollama 会在本地启动一个 API 服务（`http://localhost:11434`），格式与 OpenAI API 完全兼容。这意味着 Cline、Continue.dev、OpenCode 等几乎所有 AI 编程工具，把 API 地址改成本地地址就能接入，不需要改别的任何配置。

这就是本地部署的全貌：**下载模型 → 启动服务 → 接入工具**。

---

## 二、用什么工具跑模型

### Ollama：入门首选

官网：https://ollama.com | 支持：Windows / macOS / Linux

Ollama 把"下载模型、管理模型、提供 API"三件事合并成一个工具，并内置了 4500+ 个主流开源模型的索引。

```bash
ollama run glm-4.7-flash      # 智谱 GLM，代码 + Agent 任务
ollama run gemma4:9b          # Google Gemma 4，支持图像输入
ollama run qwen2.5-coder:14b  # 阿里代码专用模型
ollama serve                  # 以后台 API 模式运行
```

**一个注意事项**：GLM-4.7 系列在 Ollama 上有少数用户报告过 chat template 兼容问题，如果输出乱码，改用 **LM Studio** 或 **llama.cpp** 即可解决。

---

### LM Studio：不想用命令行就用这个

官网：https://lmstudio.ai | 支持：Windows / macOS / Linux

图形界面，内置模型搜索和下载，集成对话 UI。GLM-4.7 系列在 LM Studio 上运行最稳定。适合不熟悉命令行的用户。

---

### llama.cpp：底层引擎，偶尔直接用

Ollama 和 LM Studio 的底层都是 llama.cpp。如果你需要精细控制推理参数，或者部署在资源受限的设备上，可以直接用 llama.cpp：

```bash
./llama-cli -m ./glm-4.7-flash-q4_k_m.gguf --tool-call-parser glm47 -n 512
```

---

## 三、可以跑哪些模型（2026 年 4 月）

**先说一个重要区分**，本节把模型分成两类：

- ✅ **本地可部署**：消费级或专业级 GPU 可以跑
- ❌ **仅适合调 API**：需要数据中心级硬件，本地跑不动

这个区分非常重要。很多文章把 GLM-5、Kimi K2.5 列入"推荐本地模型"，但实际上 GLM-5 全精度需要 860GB 显存，就算 2-bit 极度量化也需要 241GB 磁盘空间和 128GB 以上内存。绝大多数开发者的机器根本跑不动，只会浪费时间。

---

### 通用对话 / 推理模型

**GLM-4.7-Flash**（智谱，✅ 本地友好）

这是 2026 年初最值得关注的本地模型之一。架构是 MoE（混合专家），总参数 30B，但每次推理只激活约 3B——速度接近 3B 小模型，知识容量远超 3B。

实际数字：Q4 量化约占用 **5–6 GB 显存**，RTX 4060（8GB）即可流畅运行，在 RTX 4090 上推理速度可达 120–220 tokens/s，媲美 API 调用的响应速度。上下文窗口 **200K tokens**，放整个代码仓库都够用。

它有一个叫"Preserved Thinking"的 Agent 模式，在多轮工具调用时保持推理链不断裂，专门为代码 Agent 设计。许可证是 MIT，完全商业可用。

**Qwen3.5**（阿里，✅ 高配可用）

MoE 架构，总参数 397B，激活约 17B。LM Arena 盲测全球第五，中文顶级。122B 版本 Q4 量化约占 60GB 显存，需要双卡或 Apple Silicon 高配机器。

**DeepSeek-R1 蒸馏版**（✅ 本地可用）

推理链任务首选。原版 671B 本地跑不动，但官方提供的 14B、32B 蒸馏版性价比很高。14B Q4 约占 8GB，32B Q4 约占 18GB。

**Gemma 4**（Google，✅ 最友好）

有四种规格，从手机到专业 GPU 全覆盖。支持图像输入，256K 上下文，Ollama day-0 上线：

| 规格 | 有效参数 | 显存需求 | 适合硬件 |
|------|---------|---------|---------|
| E2B | 2.3B | < 1.5 GB | 手机 / 树莓派 |
| E4B | 4.5B | ~3 GB | 8GB 笔记本 |
| 26B MoE | 3.8B active | ~18 GB Q4 | RTX 3090 / 4090 |
| 31B Dense | 31B | ~17 GB Q4 | RTX 4090 / 5090 |

**Mistral Small 4**（Mistral AI，✅ 单卡可用）

稠密 24B 模型，256K 上下文，Q4 约 14GB，工具调用稳定。

---

### 代码专用模型

**Qwen3-Coder-Next**（阿里，⭐ 旗舰）

MoE，80B 总参数，3B 激活，256K 上下文。公开 benchmark 上接近 Claude Sonnet 4.5 的代码能力。Q4 约占 45GB 显存，需要双卡 RTX 4090 或 Apple Silicon 高配机型。Ollama 已上架。

**GLM-4.7-Flash**（⭐ 性价比之王）

上面通用模型里已经介绍，代码任务同样适用。HumanEval 成绩媲美参数量是其十倍的稠密模型。6GB 显存 + 200K 上下文，是目前入门级硬件上最强的代码 Agent 选项。

**Qwen2.5-Coder**（阿里，✅ 稳定可靠）

稠密模型，7B / 14B / 32B 多规格。7B 版 HumanEval 88.4%，Apache 2.0 许可。14B Q4 约 8GB，32B Q4 约 18GB，是中配机器的稳妥选择。

---

### 不要试图本地跑这些模型

以下模型综合能力很强，但本地部署基本不可行，调 API 是正确选择：

- **GLM-5 / GLM-5.1**（智谱）：744B 参数，FP8 全精度需 860GB 显存，综合排行榜全球第一/第二，只能调 API
- **Kimi K2.5**（月之暗面）：1T 总参数，原生多模态 Agent，只能调 API
- **MiniMax M2.5**：229B 参数，MIT 许可，只能调 API

---

## 四、你的显卡够用吗

本地部署的核心限制是**显存（VRAM）**。模型权重必须装进显存才能 GPU 加速推理，装不下就溢出到内存，速度会慢到难以使用。

**理解量化**：模型有不同精度的版本，精度越低，显存占用越小，质量轻微下降。常用的 Q4_K_M（4-bit 量化）是性能和质量的最佳平衡点，本文的显存数字均以此为基准。

**MoE 模型特殊说明**：MoE 模型（GLM-4.7-Flash、Gemma 4 26B、Qwen3-Coder-Next 等）的显存占用由**总参数**决定，但推理速度由**激活参数**决定。GLM-4.7-Flash 总参数 30B，显存需要 ~5–6 GB；但每次推理只激活 3B，速度接近 3B 小模型。

按显存选型：

| 显存规格 | 推荐模型 | 典型显卡 |
|---------|---------|---------|
| 4–6 GB | Gemma 4 E4B（多模态）/ Phi-4-mini | RTX 4060 |
| **6–8 GB** | **GLM-4.7-Flash Q4（200K，Agent 原生）**/ Qwen3.5 7B | RTX 4060 Ti |
| 10–12 GB | 14B 稠密 Q4 / GLM-4.7-Flash Q8 | RTX 3060 12G / 4070 |
| 16 GB | 14B Q8 / Mistral Small 4 Q4 | RTX 4080 |
| 24 GB | Qwen2.5-Coder 32B Q4 / Gemma 4 26B MoE Q4 | RTX 3090 / 4090 |
| 32 GB | Qwen3.5 32B Q8 | RTX 5090（32GB GDDR7）|
| 48 GB | Qwen3.5 122B MoE Q4 / Qwen3-Coder-Next 80B MoE Q4 | RTX 6000 Ada |

**Apple Silicon 用户**：M 系列芯片统一内存架构，CPU 和 GPU 共享同一内存池，Metal 加速效果出色，是目前消费级本地推理性价比最高的平台。

- M4 Pro 48GB → Qwen3.5 32B Q4 / Mistral Small 4
- M3/M4 Max 96GB → Qwen3-Coder-Next 80B MoE Q4 / Llama 4 70B Q4

**没有 GPU 怎么办**：可以用 CPU 推理，但速度慢很多，GLM-4.7-Flash Q4（3B active）在 CPU 上约 2–5 tokens/s，勉强可用于测试。

---

## 五、本地部署 vs. 云端 API：什么时候选哪个

这不是非此即彼的选择，很多开发者两者都用——隐私敏感的代码走本地，复杂的架构讨论走 API。

| 维度 | 本地部署 | 云端 API |
|------|----------|---------|
| 数据隐私 | ✅ 不出本机 | ⚠️ 上传服务商服务器 |
| 边际成本 | 零（硬件已摊销）| 按 token 计费 |
| 顶级能力 | 本地最强约为 Qwen3.5-Max 级别 | GLM-5.1 / GPT-5 / Claude 4 |
| 延迟 | GPU 极低（无网络）| 网络 + 排队延迟 |
| 可用性 | 断网照常工作 | 依赖服务商 SLA |
| 上下文 | GLM-4.7-Flash 200K / Gemma 4 256K | 最高 1M tokens |
| 多模态 | Gemma 4 支持图像 | GPT-4V / Gemini 3 更成熟 |

**成本临界点**：

- RTX 4060 8GB（约¥3,000）：同等质量 API 约¥30/天，约 3 个月回本
- RTX 4090 24GB（约¥15,000）：约¥100/天，约 5 个月回本

日常开发者如果每天使用量在 10 万 tokens 以下，调 API 成本其实不高，不一定值得买显卡。**高频使用、处理敏感代码、需要离线工作**，才是本地部署真正的适用场景。

**2026 年的实际格局**：GLM-4.7-Flash 在 6GB 显存上实现 200K 上下文 + Agent 原生能力，Gemma 4 31B 单卡跑出 GPT-4 级别效果——本地模型和云端 API 的能力差距比一年前小了很多，但顶级任务（复杂多步推理、跨仓库重构）云端仍有优势。

---

## 六、接入 AI 编程工具

Ollama 在本地启动后，OpenAI 兼容接口地址是 `http://localhost:11434/v1`。

**Cline（VS Code）**：设置里选 Ollama 作为 Provider，填入模型名即可：`glm-4.7-flash`、`qwen2.5-coder:14b` 等。

**Continue.dev**（`.continue/config.json`）：

```json
{
  "models": [
    {
      "title": "GLM-4.7-Flash（入门首选）",
      "provider": "ollama",
      "model": "glm-4.7-flash"
    },
    {
      "title": "Qwen3-Coder-Next（旗舰）",
      "provider": "ollama",
      "model": "qwen3-coder-next:q4_K_M"
    }
  ]
}
```

**OpenCode / Aider**：

```json
{
  "model": {
    "provider": "ollama",
    "id": "glm-4.7-flash",
    "base_url": "http://localhost:11434"
  }
}
```

**一个实操建议**：工具调用（Function Calling）对模型能力要求较高，7B 以下稠密模型容易格式出错。GLM-4.7-Flash 虽然只有 3B 激活参数，但经过 Agent 专项训练，稳定性好于同显存的普通小模型，这是它在入门硬件上做 Agent 的核心优势。

---

## 七、按显存的最终选型建议

```
你的 GPU 显存是多少？
│
├─ < 6 GB
│   └─ Gemma 4 E4B（~3GB，多模态，256K 上下文）
│      或 Phi-4-mini（~4GB，数理推理强）
│
├─ 6–8 GB  ← GLM-4.7-Flash 是这个档位的最优解
│   ├─ 代码/Agent → GLM-4.7-Flash Q4（5–6GB，200K，Agent 原生）
│   └─ 通用对话  → Qwen3.5 7B / Gemma 4 E4B
│
├─ 12–16 GB
│   ├─ 代码任务  → Qwen2.5-Coder 14B Q8（~16GB）
│   ├─ 通用对话  → Mistral Small 4 Q4（24B，256K，~14GB）
│   └─ 推理任务  → DeepSeek-R1 14B Q4（~8GB）
│
├─ 24 GB（RTX 3090 / 4090）
│   ├─ 代码任务  → Qwen2.5-Coder 32B Q4（~18GB）
│   ├─ 通用对话  → Gemma 4 26B MoE Q4（多模态，256K）
│   └─ 推理任务  → DeepSeek-R1 32B Q4（~18GB）
│
├─ 32 GB（RTX 5090）
│   └─ Qwen3.5 32B Q8 / Llama 4 70B MoE Q2
│
├─ 48GB+（双卡 / A6000）
│   └─ Qwen3-Coder-Next 80B MoE Q4 / Qwen3.5 122B MoE Q4
│
└─ Apple Silicon
    ├─ M4 Pro 48GB  → Mistral Small 4 / Qwen3.5 32B Q4
    ├─ M3/M4 Max 96GB → Qwen3-Coder-Next 80B MoE Q4
    └─ M2/M3 Ultra 192GB → Qwen3.5 397B MoE Q4

⚠️ GLM-5 / GLM-5.1 / Kimi K2.5 / MiniMax M2.5：
   综合排行前列，但本地需要 860GB+ 显存，调 API 才是正确选择。
```

---

## 常见问题

**GLM-4.7-Flash 在 Ollama 里输出乱码怎么办？**
改用 LM Studio（最稳定）或 llama.cpp（加 `--tool-call-parser glm47` 参数）。

**模型加载很慢？**
把模型文件移到 NVMe SSD，I/O 速度直接影响加载时间。

**GPU 没有被识别？**
确认安装了最新 NVIDIA 驱动（CUDA 12.x+），或设置环境变量 `OLLAMA_GPU_LAYERS=999`。

**想提升上下文长度？**
在 Modelfile 里设置 `PARAMETER num_ctx 65536`（注意别超过显存上限）。

---

本地部署大模型没有想象中复杂。如果你有一块 8GB 显存的显卡，今天下午就可以把 GLM-4.7-Flash 跑起来，接入 Cline，用上完全私密、零成本的 AI 编程助手。

剩下的事，跑起来再说。
