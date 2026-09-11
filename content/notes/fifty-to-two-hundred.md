---
n: 02
title: Fifty to two hundred.
standfirst: What imitation learning actually costs per task, and how to pick the three tasks worth it.
date: September 2026
station: The hub
page: /physical-ai/
page_name: Physical AI
---

Ask how many demonstrations an imitation-learning policy needs and the honest answer is a range: roughly fifty to two hundred teleoperated demonstrations per task, depending on the task. The range is wide because tasks are wide. A rigid pick from a known pose sits at the bottom. A contact-rich insertion with tolerances you can feel sits at the top, and sometimes above it.

The range is the easy part. The arithmetic around it is what surprises people, usually in month five.

## The arithmetic

A cell with twenty distinct tasks, each with a few variants of part or pose, needs somewhere between one and four thousand demonstrations. Someone has to perform every one of them in a teleop rig, at a few minutes each, and someone has to throw out the bad ones. With a usable-take rate around seventy percent (which is good) you perform closer to five thousand to keep three and a half.

At four minutes a demonstration that's over three hundred teleop hours. At thirty productive hours a week per operator (not forty; teleop is tiring and people have meetings) that's ten operator-weeks. Two operators, five weeks, before anyone has trained anything, and before the evaluation episodes, which are held out from the same pool and re-collected every time the policy changes enough to matter.

None of that is the expensive part yet. The expensive part is the second collection, when the gripper changes.

## The hidden costs

- **Quality control.** Every episode gets looked at. The engineer who does that is more expensive than the operator who performed it.
- **Re-collection.** A new gripper, a new camera mount, a new part revision, and a fraction of the dataset stops describing the cell you have. Provenance tells you which fraction. Without it, you guess, and you guess conservatively.
- **The task you were excited about.** It is usually the hardest one, it usually needs the most demonstrations, and it is usually not the one that pays for itself first.

## How to pick three

Most task lists have twenty entries and three that deserve a learned policy. Picking them is a triage, not a vision exercise, and it runs on four questions.

**Variation.** Does the part, the pose, or the environment vary in ways you can't fixture away? If it doesn't, a fixture and a limit switch will do the job for a fraction of the cost and no GPU. That is most of manufacturing, and it isn't a consolation prize.

**Contact.** Does the task depend on feel: insertion, seating, routing a cable? Learned policies are good at this, and it is also where the demonstration count climbs, because feel is hard to demonstrate consistently.

**Payback.** Multiply the demonstration budget by the loaded cost, add the evaluation harness, and compare it with what the task costs you today. Rank by that number, not by how interesting the task is.

**Risk.** What happens when the policy is wrong? A dropped tote and a scratched fixture are different answers, and the fallback path has to be designed either way.

Run the four questions and the list sorts itself. The [demonstration budget calculator](/physical-ai/#calc) does the multiplication for whatever list you have, and it will tell you, kindly, when the number is the kind that kills programs.

## When simulation changes the answer

Simulation can remove a large fraction of the real demonstrations for tasks that transfer well: rigid picking, locomotion, gross motion. It removes far fewer for contact and deformables. It also costs weeks of engineering to build the environment, and that cost is fixed while the savings scale with the task list. So at small task counts the simulator costs more weeks than it saves, and at large counts it obviously pays. The calculator shows both lines at once so you can find the crossover for your list, rather than taking our word for where it is.

Fifty to two hundred per task. It's a small phrase. Do the multiplication before you fall in love with the demo.
