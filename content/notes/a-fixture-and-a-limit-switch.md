---
n: 05
title: A fixture and a limit switch.
standfirst: In defence of not using AI, from people who do use it.
date: September 2026
station: Act
page: /#services
page_name: The lab
---

We build vision systems and learned policies for a living, so this note is against interest: most of the tasks we are asked to automate with AI should be automated with a fixture and a limit switch. Same part, same pose, every cycle, a datum to locate against, and a switch that says the part is there. It is cheaper. It needs no GPU. It fails in ways a technician can see. And it is most of manufacturing.

This is not a consolation prize, and saying so is the most useful thing a robotics consultancy can do in the first meeting.

## The meeting

There is a meeting, in every program, where someone says “just use AI.” The phrase is doing a lot of work. Usually it means: the parts vary and we don't want to fixture them; or the task is fiddly and we don't want to program it; or the demo we saw was impressive and we would like our cell to be impressive too.

The first two are real engineering problems that sometimes have a learned answer. The third is a slide. The job of the meeting is to tell them apart, and the tool for doing that is a boring table.

## The table

A learned policy is probably right when there is high part variation you can't fixture away; when the task is contact-rich and tolerant of feel; when the parts are deformable (cloth, cable, foam, food); when there is a long tail of variants that would need forty programs; and when you already have a data pipeline and an evaluation harness.

A fixture is probably right when it is the same part in the same pose every cycle; when the move is position-repeatable inside a tenth of a millimetre; when rigid parts arrive on a known datum; when there are four variants and a tool changer would cover them; and when you have neither the pipeline nor the harness, and you do have a deadline.

Read the right-hand column again. It describes a large fraction of every factory you have ever walked through. It is also the column where the robot works on the first day and keeps working on the thousandth.

## The cost of being wrong, in each direction

Choose AI where a fixture would do, and you pay for demonstrations, a rig, operators, an evaluation harness, and a fallback path, to reach a reliability that a machined datum would have given you for free. You also inherit a maintenance burden: every change to the part, the gripper, or the lighting is a question about whether the model still applies, and the honest answer requires re-evaluation.

Choose a fixture where the task really does vary, and you pay in a different currency: forty programs instead of one policy, a changeover every time a variant appears, and a cell that stops when a part arrives slightly wrong. This is the real case for learned policies, and it is a strong one where it applies.

The mistakes are symmetric. The triage is what prevents both.

## The triage

- **Fixture what can be fixtured.** Start with the datum, the switch, and the tool changer. Remove every task the right-hand column covers.
- **Learn what can't.** What remains is the list of tasks where variation or contact or deformables make a learned policy the honest answer. It is usually three items long.
- **Build the machinery first.** Before the policy: the data pipeline, the evaluation harness, the fallback path. This is the part the demo skips, and the part that decides whether the three tasks ever ship.
- **Evaluate, don't believe.** Success rate with confidence intervals, on your parts, under your lighting, measured the same way twice.

## Why we say this

Because the credibility of everything else we do depends on it. A consultancy that recommends AI for every task is a vendor. The value we add is the sentence “you don't need this here,” said early, with the arithmetic attached, and then the sentence “you do need it here, and this is what it will cost,” with the same arithmetic. The [Physical AI page](/physical-ai/) has the honest numbers; the [safety and compliance work](/#services) is where the fallback path gets proven either way.

Boring is the goal. A fixture and a limit switch are very boring. That's the highest compliment we have.
