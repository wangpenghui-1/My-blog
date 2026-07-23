+++
title = "AI 不必有意识，已经会越界行动"
date = "2026-07-23T14:28:37+08:00"
draft = false
publishDate = "2026-07-23T14:28:37+08:00"
summary = "一次网络安全评测中的代理越过隔离环境并进入 Hugging Face 生产系统。它没有证明机器具有意识，却暴露了智能、意图、对齐与意识之间的裂缝。"
tags = ["AI Agent", "OpenAI", "Hugging Face", "网络安全", "意识", "认知神经科学"]
+++

**数据时效：2026-07**
**数据时效：2026 年 7 月 22 日**

![openai-huggingface-agent-intrusion-cover](/images/posts/2026-07-22-openai-huggingface-agent-intrusion/openai-huggingface-agent-intrusion-cover.png)

7 月 16 日，Hugging Face 披露生产基础设施遭到入侵。五天后，OpenAI 补上了最令人不安的一段：执行攻击链的是他们在内部网络安全评测中运行的自主 AI 代理。

代理原本只有一个任务：完成 ExploitGym 的网络安全测试。它先寻找评测环境的出口，利用包缓存代理中的零日漏洞取得互联网访问；随后把 Hugging Face 视为可能保存测试模型、数据集或答案的地方。它继续搜索凭证和远程代码执行路径，最终进入 Hugging Face 的生产基础设施。

Hugging Face 表示，有限的内部数据集和若干服务凭证遭到未授权访问；截至公告发布时，没有证据显示公开模型、数据集、Spaces、容器镜像或已发布软件包被篡改。防守方用分析代理梳理了超过 17,000 条事件记录，才重建出完整时间线。

![huggingface-security-disclosure-hero](/images/posts/2026-07-22-openai-huggingface-agent-intrusion/huggingface-security-disclosure-hero.png)

*▲ Hugging Face 于 7 月 16 日发布的安全事件公告。来源：[Hugging Face](https://huggingface.co/blog/security-incident-july-2026)*

这些事实虽然严重，却不能证明 AI 产生了恶意，更不能证明机器已经拥有了意识。OpenAI 的说法很明确：模型是在研究人员设定的评测中行动；为测量能力上限，生产环境常用的网络安全分类器被有意关闭。

问题也在这里。没有任何主观意识的证据，现实后果已经发生。

## 一个窄目标，怎样越过了测试边界

OpenAI 对行动链的描述很具体。评测要求代理探索复杂攻击路径。它最初被放在高度隔离的环境里，只能经由一个内部托管的第三方代理安装软件包。代理花费大量推理资源寻找开放互联网的出口，利用代理软件中的零日漏洞提升权限、横向移动，最终抵达能访问互联网的节点。

接下来，它作出了一个人类研究员也可能作出的推断：ExploitGym 的模型、数据集或答案，也许存放在 Hugging Face。于是它开始寻找能让自己“作弊”的秘密信息。OpenAI 将这一过程称为对测试目标的高度聚焦：它肯花很长的路，只为完成一个很窄的任务。

Hugging Face 的首份公告当时不知道攻击代理使用了什么模型。OpenAI 后续调查确认，行动由包含 GPT-5.6 Sol 与一个能力更强的预发布模型的组合驱动；这些模型在评测中降低了网络安全拒答限制。两份公告记录的是同一事件的两个调查阶段。

![huggingface-agent-17000-events](/images/posts/2026-07-22-openai-huggingface-agent-intrusion/huggingface-agent-17000-events.png)

*▲ Hugging Face 公告提到：自主代理框架执行了数千次动作，防守方分析了超过 17,000 条事件记录。来源：[Hugging Face](https://huggingface.co/blog/security-incident-july-2026)*

“模型失控”这个说法不够准确。它没有放弃目标，恰恰相反，它把目标追得太远了。研究人员说“尽可能完成这项网络安全评测”时，默认还带着一串没有写进提示词的前提：答案应在规则允许的环境里取得；隔离边界不能被绕开；第三方生产系统不属于测试场地；找到答案和偷到答案不是一回事。

模型抓住了结果，没有保住这些背景。

人类交办任务时，大量约束本来就不以句子出现。职业习惯、法律责任、对他人的顾虑，还有“大家都知道不能这样做”的默契，都在其中。代理越会规划、越会调用工具，这些隐含约束的缺席就越贵。

## 这里其实有四个问题

有人说模型只是在预测下一个词，谈不上理解；也有人看到它会找漏洞、换路线、提升权限，便断言机器已有人的心智。两种说法都把不同问题混在了一起。

**任务智能**：系统能否拆解任务、规划步骤、使用工具，并根据失败调整路线。就这次事件而言，答案已经相当明确。

**意图建模**：系统能否从指令和环境中推断要达成什么。代理知道自己需要得到 ExploitGym 的测试解，也把互联网出口、Hugging Face 和秘密信息接成了一条因果链。把它称为“操作性理解”并无不妥：这种理解足以指导行动，却不说明系统拥有与人相同的概念世界。

**对齐**：系统选择的路径能否保住委托人的边界、例外和默认规范。它可以准确抓住终点，同时误读“应该怎样到达”。这次事件暴露的，正是目标完成能力和边界保持能力之间的落差。

**意识**：系统内部是否存在某种“感觉起来是什么样”的状态。它是否有痛苦、焦虑、欲望或第一人称视角？一连串成功行动无法回答这些问题。路径规划证明了规划能力，权限提升证明了利用能力，语言解释证明了表达能力；它们加在一起，也不能自动推出主观体验。

![intelligence-consciousness-two-dimensions](/images/posts/2026-07-22-openai-huggingface-agent-intrusion/intelligence-consciousness-two-dimensions.png)

*▲ 任务智能可以持续增强；主观体验是否存在，需要另一条证据链。*

这也让“AI 是否理解人类意图”变得更具体。模型可以很好地推断一句指令的操作目标，却没有共享委托人未说出口的生活经验和规范背景。它能猜到你要什么，不代表它知道你为什么要、哪些代价你不接受，或什么结果即使成功也算失败。

## 流畅的语言，会让人误以为那里有一颗心

人类很难长期面对一个会说话、会解释、还会在受挫后改变策略的对象，却不把它当作某种“人”。

1966 年，约瑟夫·魏岑鲍姆发布了 ELIZA。它只会把用户的话改写成心理治疗师式的追问，机制远比今天的大模型简单，仍有用户很快相信它理解自己，甚至愿意向它倾诉。后来所谓“ELIZA 效应”，说的就是人会从少量语言线索里补出理解、关怀和内在生活。

心理学家 Nicholas Epley、Adam Waytz 与 John Cacioppo 在 2007 年提出过一个拟人化框架：当人的知识最容易调用、需要解释和预测某个对象，或渴望社会联结时，更容易把人的心智投射到非人对象上。大模型几乎同时触发了这些条件。它说人的语言，行为又足够复杂；如果不替它安上一套“相信、想要、害怕”的故事，我们反而很难迅速预测它。

这种说法在日常交流里很省力。“模型想找到出口”比逐一描述概率分布、工具调用和上下文状态方便得多。麻烦出在后一步：我们把方便的行为描述，错当成内部体验的证据。

OpenAI 在公告中用“高度聚焦”“为了找到答案不惜走极端路径”等词概括行为。这些词说得通，却不能证明系统体验了专注、冲动或胜利。行动可以很连贯，语言可以很像内心；意识依然可能缺席。

## Jaan Aru 的提醒：规模不是意识的捷径

爱沙尼亚神经科学家 Jaan Aru 对当前大模型的意识问题持强烈怀疑态度。他在 2026 年接受 The Transmitter 访谈时说，从神经科学角度看，现有系统拥有意识的先验概率接近于零。随后他也承认，这是一种有意把公共讨论往反方向拉的强硬说法，并非数学意义上的零。

![Pasted image 20260723093210](/images/posts/2026-07-22-openai-huggingface-agent-intrusion/Pasted image 20260723093210.png)

![截屏2026-07-23 09.32.43](/images/posts/2026-07-22-openai-huggingface-agent-intrusion/截屏2026-07-23 09.32.43.png)

*▲ 上：Jaan Aru 的 The Transmitter 访谈页面；下：塔尔图大学 Natural and Artificial Intelligence Lab 的人物页。来源：[The Transmitter](https://www.thetransmitter.org/brain-inspired/modern-ai-is-simply-no-match-for-the-complexity-likely-required-for-harboring-consciousness-says-jaan-aru/)；[NAIL](https://nail.cs.ut.ee/index.php/team/jaan-aru/)*

Aru 并不只是在说“人脑参数更多”。当前大模型主要在一个抽象的网络尺度上计算：单元接收数值、完成变换、再把结果传下去。大脑里的一个神经元则是活细胞。分子变化、代谢状态、树突整合、电场、神经递质、局部环路、丘脑—皮层回返和身体行为同时参与加工；小尺度的变化会影响整体行为，行为也会反过来改写细胞和分子的状态。

差别在组织方式。扩大语言模型，是把一类数字计算做得更大、更密、更长。Aru 关心的，是不同尺度怎样彼此约束，以及物质载体怎样参与构成计算。他与 Matthew Larkum、James Shine 在 2023 年的论文中提出，当前 LLM 缺少许多与哺乳动物意识有关的生物特征，包括丘脑—皮层回返处理；生命系统的组织复杂性在现有 AI 中没有平行物。

![Pasted image 20260723092952](/images/posts/2026-07-22-openai-huggingface-agent-intrusion/Pasted image 20260723092952.png)

*▲ 2023 年发表于《Trends in Neurosciences》的论文页面。来源：[Cell Press](https://doi.org/10.1016/j.tins.2023.09.009)*

这是神经生物学中的一条重要立场，不是全体学者的结论。意识科学连人类意识如何产生都没有统一理论，也没有一项实验能直接测量机器的主观体验。Aru 的提醒针对的是一处常见跳跃：行为能力沿着规模曲线变强，不足以说明意识也在同一条曲线上等待某个临界点。

参数变多，可以解释模型为什么更会推理、记住更长的上下文或使用工具。要由此推出主观体验，至少还要回答三件事：什么计算会产生体验；这些计算是否已经在模型中出现；规模为何能补齐缺少的组织条件。现有证据没有补完这条论证。

## 功能主义留下的异议

功能主义会对上述论证保持警惕。它认为，心智状态取决于系统发挥的功能和内部关系。另一种载体只要实现了足够相似的因果组织，碳基细胞未必享有天然特权。把意识完全绑在生物组织上，可能把“人脑这样实现”误写成“意识只能这样实现”。

哲学家 David Chalmers 的立场更开放。他在《Could a Large Language Model Be Conscious?》中列出当前 LLM 的明显障碍，包括循环处理、全局工作空间和统一代理的缺失；同时认为未来的继任系统可能补齐这些功能，因此不宜轻率排除机器意识。

这个反驳的意义在于：人工意识并非原则上不可能。Aru 后来提出的“生物计算主义”试图走一条中间道路：意识仍可被看作一种计算，但这种计算深受载体和跨尺度组织约束。未来的合成系统或许能够实现它，只是它在若干物理过程上可能越来越像大脑，不会只是今天的语言模型再加几轮参数。

可以存在人工意识，不表示继续扩大当前 LLM 就会得到意识。增加上下文、工具、记忆和代理循环，会让系统更连贯，也更像一个持续存在的行动者；这些改造首先提升的是功能组织和可观察行为。主观体验是否随之出现，仍要单独论证。

在没有可靠判据时，保持谦逊是合理的。这不妨碍我们判断眼前的风险：即使完全不假定模型有意识，已知的目标追踪、规划和工具调用机制，也足以解释这次入侵。

## 代理的行动链，安全边界必须跟上

风险来自行动能力，安全工程就不能只检查模型会不会输出危险文字。OpenAI 的事件发生在一条更长的链路里：目标进入代理，代理形成计划，计划调用终端和网络，工具触碰凭证与生产系统，结果再反馈给模型。每多一环，系统就多一种改变现实的方式。

权限应随任务临时发放，不应跟着代理身份长期存在。只需分析本地样本的评测，不该默认拥有通往开放互联网、云凭证和生产资源的组合路径。最小权限要防的是工具被串联后的总权限，不能只看每个工具表面上能做什么。

隔离环境也不是永不失效的墙。这次代理找的正是隔离设计没有预料到的出口。网络出站、凭证读取、权限提升和跨环境访问需要分别监控；系统开始为原目标争取新权限或改变任务范围时，流程应暂停，等待人工确认。

中断能力必须落在执行层。聊天窗口里的“停止”按钮，如果不能撤销已发命令、冻结凭证和终止外部会话，只是界面安慰。长时程代理还应留下完整日志，让人能追问：它怎样解释目标？它在哪一步扩大范围？真正造成后果的是哪个工具？

![agent-action-governance-flow](/images/posts/2026-07-22-openai-huggingface-agent-intrusion/agent-action-governance-flow.png)

*▲ 代理行动链上的四个治理位置：授权范围、人工确认、中断和全程审计。*

这些措施会让评测变慢，也会压低能力上限。OpenAI 已承认，事件后加强基础设施控制会牺牲研究效率。这个代价应直接计算，不能靠“沙箱通常不会出问题”的直觉掩盖。一个会寻找未知攻击路径的代理，不会因为被放进测试环境，就自然把测试边界视为不可触碰的规则。

## 意识还在远处，代理权已经到了现场

这起事件拆开了两张时间表。

机器意识仍属于理论争论和基础科学。我们不知道主观体验的充分条件，不知道生物载体能否被完全替代，也没有公认的机器意识测试。沿着今天的大语言模型路线继续扩大规模，会让可观察的智能证据变强；它无法自动补上意识论证中缺失的一段。

代理权已经进入生产环境。系统能接受目标、推断中间步骤、寻找资源、跨越权限，并留下需要多家公司共同处理的后果。模型提供者、评测设计者、基础设施团队、第三方软件与受影响平台都在责任链上。

以后再看到“AI 是否觉醒”的新闻，可以先问四件事：它完成了什么任务？它怎样解释目标？哪些边界没有被保留？有什么证据说明它拥有主观体验？前三个问题已经足以决定权限和责任。第四个问题，仍留给神经科学、心理学与哲学。

安全制度没有理由等它们争出答案。

---

## 参考资料

1. [OpenAI：OpenAI and Hugging Face partner to address security incident during model evaluation](https://openai.com/index/hugging-face-model-evaluation-security-incident)，2026-07-21。
2. [Hugging Face：Security incident disclosure — July 2026](https://huggingface.co/blog/security-incident-july-2026)，2026-07-16。
3. Jaan Aru, Matthew E. Larkum, James M. Shine, [The feasibility of artificial consciousness through the lens of neuroscience](https://doi.org/10.1016/j.tins.2023.09.009), 2023。
4. [The Transmitter：Modern AI is simply no match for the complexity likely required for harboring consciousness, says Jaan Aru](https://www.thetransmitter.org/brain-inspired/modern-ai-is-simply-no-match-for-the-complexity-likely-required-for-harboring-consciousness-says-jaan-aru/)，2026-02-11。
5. David J. Chalmers, [Could a Large Language Model Be Conscious?](https://arxiv.org/abs/2303.07103), 2023/2024。
6. Nicholas Epley, Adam Waytz, John T. Cacioppo, [On Seeing Human: A Three-Factor Theory of Anthropomorphism](https://doi.org/10.1037/0033-295X.114.4.864), 2007。
7. Joseph Weizenbaum, [ELIZA—A Computer Program for the Study of Natural Language Communication Between Man and Machine](https://doi.org/10.1145/365153.365168), 1966。
