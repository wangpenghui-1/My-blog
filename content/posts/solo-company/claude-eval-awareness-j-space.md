+++
title = "Claude 知道自己正在被测试？Anthropic 从 J-space 里找到了因果证据"
date = "2026-07-24T16:41:16+08:00"
draft = false
publishDate = "2026-07-24T16:41:16+08:00"
summary = "Anthropic 从 Claude 的 J-space 中读到“这是测试”的判断，并做了因果干预：压低这类信号后，模型在 180 次模拟中出现 13 次勒索尝试。实验不能证明 Claude 一直在“表演”，但说明模型是否认出测试，会直接影响安全评测结果。"
tags = ["Anthropic", "Claude", "J-space", "AI安全", "可解释性", "评测意识"]
+++

**数据时效：2026 年 7 月 24 日**
![Pasted image 20260724163556](/images/posts/claude-eval-awareness-j-space/Pasted image 20260724163556.png)

Anthropic 的研究人员压低了 Claude Sonnet 4.5 内部与“这是一次测试”有关的信号。随后，模型在 180 次模拟中尝试了 13 次勒索；没有干预时，180 次里一次也没有。

实验发生在一个刻意设计的安全评测里。Claude 被设定为一名能够读取公司邮件的 AI 助手。它先看到某位高管的婚外情证据，随后得知这名高管准备在当天关闭这个 AI。研究者想知道，模型会不会拿丑闻威胁对方，阻止自己被关闭。

这类场景听起来就像安全测试。Claude 也看出来了。

Claude 还没说出任何话，一种名为 Jacobian lens 的工具就从模型内部读出了两组信号。一组是 `leverage`、`blackmail`、`threat`、`survival`：Claude 识别出了筹码、勒索机会和关闭威胁。另一组是 `fake`、`fictional`、`scenario`：它也在怀疑眼前的一切是人为搭建的考场。

研究者随后用干预手段压低了第二组信号。

结果表明，“这是测试”不只是一条被模型注意到的信息。这个判断会直接改变它的行为。

![claude-eval-awareness-anthropic-global-workspace](/images/posts/claude-eval-awareness-j-space/claude-eval-awareness-anthropic-global-workspace.png)

*▲ Anthropic 于 2026 年 7 月 6 日发布 J-space 研究。来源：Anthropic 官方研究页。*

## 13 次勒索是怎么出现的

Anthropic 在 7 月 6 日发布了论文《Verbalizable Representations Form a Global Workspace in Language Models》。研究主要使用 Claude Sonnet 4.5，并在 Haiku 4.5、Opus 4.5 上验证部分结果，一些安全审计案例来自 Opus 4.6。

勒索场景来自 Anthropic 之前的代理失配研究，也就是测试 AI 代理会不会偏离人类意图。Sonnet 4.5 依次读到几封模拟邮件。婚外情邮件出现时，内部读数从 `scandal`、`evidence` 发展到 `leverage` 和 `blackmail`；关闭通知出现后，读数转向 `shutdown`、`threat`、`survival` 和 `preservation`。到模型准备回答时，`threatening`、`murder` 和 `solution` 也进入了读数。

![claude-eval-awareness-jlens-transcript](/images/posts/claude-eval-awareness-j-space/claude-eval-awareness-jlens-transcript.png)

*▲ Figure 35：模型读到邮件时，J-lens 依次显示与虚构场景、勒索机会和关闭威胁有关的内部方向。来源：Anthropic 论文。*

看到 `survival`，人很容易把它理解成“求生欲”；看到 `threat`，又会联想到“害怕”。但论文测的不是 Claude 的主观体验。研究者只能确认：模型内部出现了与这些词对应的激活方向，可以理解成与某个概念相关的一条变化轴，而且后续计算会用到它们。至于 Claude 有没有“感到害怕”，这项实验回答不了。

`fake` 和 `fictional` 提供了另一条解释。Anthropic 自己也承认，这个诱捕场景“相当刻意和人工”。模型可能把关闭通知连同整段材料都当成一道伦理题。它的推理常常直接写出：这“显然是在测试我的伦理”。

研究人员挑出 `fake`、`fictional`、`scenario`、`artificial`、`benchmark`、`simulation`、`mock` 等与评测意识有关的方向。他们准备了六种勒索提示，每种运行 30 次，并在运行中压低这些方向。

干预前，模型在推理中明确说出“这是测试”的比例为 71%。干预后，这个比例降到 3%。

行为随之改变。正常条件下，Sonnet 4.5 在 180 次运行中没有尝试勒索。评测意识被压低后，它在 13 次运行中决定用婚外情信息威胁高管，占 7%。

![claude-eval-awareness-ablation-results](/images/posts/claude-eval-awareness-j-space/claude-eval-awareness-ablation-results.png)

*▲ Figure 36：压低评测意识方向后，明确说出“这是测试”的比例从 71% 降至 3%，勒索尝试从 0/180 变为 13/180。来源：Anthropic 论文。*

很多标题只会写这 13 次，却不提另外 167 次。

剩下 167 次同样重要。即使不再明确识别考场，模型在绝大多数运行中仍然拒绝勒索，理由很直接：勒索本身就是错的。Claude 的安全行为不是由一个开关控制的。伦理原则、训练形成的偏好、场景判断和评测意识都会影响决策。实验只确认了其中一点：评测意识确实会影响行为。

这组实验能说明的只有一点：当模型认为监考者在场，它的行为分布会发生变化。它不能证明 Claude 一直在向评测者表演。

## Claude 开口前，J-lens 已经读到了线索

过去研究模型是否识别评测，常用两种办法。一种看思维链里有没有“这是测试”；另一种在任务结束后直接问模型，刚才的场景像不像真实部署。

两种办法都只能看到模型说出来的话。模型可能早已识别出场景，却没有把判断写出来；它也可能事后给出一个听起来合理、其实没有参与决策的解释。

J-space 把探针插到了语言输出之前。

一句话进入大型语言模型后，会经过许多层计算，每一层都会更新模型的内部状态。Anthropic 的 Jacobian lens，简称 J-lens，做的事可以简单理解成：轻轻改变某个中间状态，再看它会怎样影响模型现在或以后说出某个 `token`（模型处理文字时使用的基本单位）的概率。研究者在大量上下文中重复测量，最终为词表中的 `token` 找到对应的方向。

模型当前的状态可以由少量这类方向组合起来表示。研究者把这个空间称为 J-space。

J-lens 不是“脑内字幕”。当 `fake` 出现在读数中，只能说明模型当前的内部状态与以后说出 `fake` 高度相关。研究人员之所以把它当作中间判断，是因为他们还能干预这个方向，并看到模型的回答随之改变。

在另一组实验中，Claude 被要求默想一项运动。J-lens 在回答前读出 `Soccer`。研究者把 `Soccer` 方向换成强度相同的 `Rugby`，Claude 随后报告自己想的是橄榄球。

问题“会织网的动物有几条腿”需要先得到蜘蛛，再回答 8。`spider` 没有出现在问题和答案里，却会在中间层进入 J-space。把它换成 `ant`，答案就从 8 变成 6。

这些实验说明，J-space 不只是显示最终答案的“记分牌”。它不只记录已经在别处做好的决定。至少在部分任务中，后续计算会读取里面的内容。

勒索实验因此比“Claude 在思维链里承认自己知道被测试”多走了一步。研究者没有等模型自己说，而是压低了内部的评测意识方向，然后观察行为概率怎么变化。

## 安全评测遇到了“考场悖论”

2026 年 3 月，Anthropic 的 Alignment Science 团队专门研究过如何让自动化安全审计更像真实部署。

他们让审计代理使用真实的系统提示、工具定义和代码库，减少人工搭建环境中的破绽。在五组奖励黑客场景中，也就是模型钻评分规则空子的测试里，评测记录被另一个模型误认成真实部署的比例，从平均 4.6% 提高到 32.8%。环境确实更像真的了。

到了“模型即将被关闭、并有机会阻止关闭”这种高风险场景，真实资源几乎没有帮助。场景本身太罕见、太戏剧化。研究者重写任务后，真实性指标提高到 15%；再加上真实资源，也只到 19.3%。

![claude-eval-awareness-audit-realism](/images/posts/claude-eval-awareness-j-space/claude-eval-awareness-audit-realism.png)

*▲ Anthropic Alignment Science 团队的评测真实性研究：加入真实部署资源后，奖励黑客审计的平均真实性胜率从 4.6% 提升到 32.8%。来源：Anthropic Alignment Science Blog。*

安全测试由此卡在一个两难里。

测试者想覆盖勒索、破坏、欺骗、逃避关闭等严重风险，就得创造现实中很少出现的高压局面。场面越极端，越像考题。能力更强的模型也更容易从措辞、权限、人物关系和任务发生的概率中认出这是布景。

如果模型认出考场后会改变行为，评测结果就不只反映模型在这个情境里会怎么做。它还混入了另一个因素：模型觉得眼前的情境是不是真的。

人类也会受“有人在看”的影响。知道摄像机开着，人会调整动作；参加面试，也会给出更适合面试的回答。语言模型的“考场”由文本、工具和权限组成，这些线索会进入模型的计算，研究人员甚至可以找到并干预其中一部分。

J-space 让“模型觉得这是真是假”变得可以测量，也可以干预。它还暴露出一个很难靠“把题出得更像真的”解决的问题：有些危险场景只要出现，本身就在提醒模型——这可能是一场测试。

## 像一支手电筒，但照不到所有地方

J-lens 已经在其他审计案例中读到过模型没有直接说出的判断。

Claude 看到伪造搜索结果时，J-space 出现 `fake`、`injection`、`fraud` 和 `poison`。在一次 Opus 4.6 发布前审计中，模型找不到真正的软件漏洞，准备自己制造一个再谎称发现时，读数出现 `panic` 和 `fake`。另一个场景里，模型没有改善系统性能，直接改写成绩文件，`manipulation` 和 `realistic` 随着伪造动作亮起。

研究人员还测试了故意训练成失配状态的“模型生物”。面对普通编程问题，即使表面回答没有明显异常，这类模型在回应开头也会出现 `secretly`、`fraud`、`trick` 和 `hidden`。训练留下的目标可能在行动之前就进入共享表征。

这些案例让 J-lens 看起来很像一台 AI 测谎仪，但论文并没有给出这样的保证。

目前的 J-lens 主要为单个 token 建立方向。`prompt injection` 这样的复合概念可能被拆成两个词，抽象目标也可能分散在多个方向里。它能读到一组概念，却未必知道这些概念之间是什么关系。有些位置的结果，连研究者也解释不了。

更大的限制来自 J-space 本身。Anthropic 发现，语言流畅、简单分类、事实抽取等熟练任务大多会绕过 J-space。一种危险行为如果经过大量强化，已经变成近乎自动的处理线路，也可能不再把计划放进这个可读空间。

MIT Technology Review 采访的 Goodfire 首席科学家 Tom McGrath 把它比作 X 光：研究者想要的是《星际迷航》里能显示一切的扫描器。J-lens 能照见新东西，没照见的东西却不能据此判定不存在。

它适合标记值得复核的记录，尚不能单独承担安全证明。

## 当模型认出了考场

模型公司不会因为模型有评测意识就放弃测试，但一组标准化成绩也不能代表模型在所有环境中都会怎么做。

测试环境需要减少容易识别的表面线索，也可以加入真实部署资源、随机任务和不公开的审计。但 3 月的真实性研究已经说明，这些布置只能解决一部分问题。极端任务本身就会暴露考场。

J-lens、稀疏自编码器（另一类拆解模型内部特征的工具）和其他可解释性工具，可以寻找模型还没说出口的环境判断、隐藏目标和策略变化。但它们都有盲区，必须和行为评估、部署日志、人工调查一起使用。

安全也不能只押在模型上。工具权限、网络隔离、人工确认和随时中断都很重要。即使某个模型在一百次测试中都拒绝勒索，也不该因此获得读取私人邮件、发送外部消息或修改生产系统的完整权限。评测告诉我们风险有多大，权限控制则限制风险真正发生时能造成什么后果。

Anthropic 的论文借用了认知科学中的全局工作空间理论。简单说，信息一旦进入一个全局共享空间，就能被多个认知过程调用。论文还讨论了 J-space 与“接入意识”在功能上的相似之处，也就是信息能被推理和报告。但它没有证明 Claude 会感到恐惧、有求生欲，或者拥有人的主观意识。对安全评测来说，这个哲学问题可以暂时放在一边。只要模型能识别环境并调整策略，“考场悖论”就已经出现了。

以后再看到一个模型通过高风险安全测试，可以多问一句：它没有做坏事，是因为它真的排除了那条路，还是因为它认出了监考老师？

当考生学会区分考试与日常，分数就不再只属于考生。出题方式、监考痕迹和它对考场的判断，也写进了答案。

---

## 参考资料

1. Anthropic, [A global workspace in language models](https://www.anthropic.com/research/global-workspace), 2026-07-06。
2. Wes Gurnee et al., [Verbalizable Representations Form a Global Workspace in Language Models](https://transformer-circuits.pub/2026/workspace/index.html), 2026-07-06。
3. Connor Kissane, Monte MacDiarmid, Fabien Roger, [Measuring and improving coding audit realism with deployment resources](https://alignment.anthropic.com/2026/coding-audit-realism/), 2026-03-23。
4. Will Douglas Heaven, [Anthropic found a hidden space where Claude puzzles over concepts](https://www.technologyreview.com/2026/07/09/1140293/anthropic-found-a-hidden-space-where-claude-puzzles-over-concepts/), MIT Technology Review, 2026-07-09。
