---
n: 03
title: The simulator lied to you, and that's fine.
standfirst: Reality gap as a measurable, task-shaped, budgetable quantity rather than a disappointment.
date: September 2026
station: Imagine
page: /world-models/
page_name: Simulation & world models
---

Every team that trains a policy in simulation and deploys it on a real robot discovers the same thing on the same day: the simulator lied. The policy that succeeded ninety-five percent of the time in the environment succeeds sixty on the cell, or forty, or it does something baffling with the suction cup. The usual reaction is disappointment, followed by three weeks of making the simulator prettier.

The disappointment is misplaced and the three weeks are usually wasted. The reality gap is not a betrayal. It is a quantity, and it has three properties that make it manageable: it is measurable, it is task-shaped, and it can be budgeted.

## It is task-shaped

The gap is not one number for your simulator. It is one number per task, and the number is predictable from the physics before you build anything.

Locomotion transfers well: the dynamics are rigid, the contacts are brief, and domain randomization covers the rest. Rigid pick-and-place transfers well for the same reasons. Contact-rich assembly transfers badly, because the outcome depends on compliance and friction at the millimetre scale, and simulators approximate both. Deformables transfer badly and expensively, because the models are slow and still wrong. Anything that depends on the exact behaviour of a suction cup on a slightly dusty part transfers about as well as a weather forecast.

This is knowable in week one. A team that spends three months on a photoreal digital twin to train a task that was always going to need real contact data has not made a mistake of execution. They made a mistake of triage, and it was free to avoid. The [reality-gap meter](/world-models/#calc) is our read of how much of each task type sim can honestly do; treat it as a starting position to argue with.

## It is measurable

The measurement is simple to describe and tedious to maintain, which is why it gets skipped. Define the task once. Score it the same way in both places. Run the same policy in the simulator and on the cell, on the same schedule, and track the difference over time.

That difference is the gap, in units you can put in a document: “this policy succeeds 91% in sim and 74% real on task B, and the difference has been stable for six weeks.” The number tells you three things the feeling never does. It tells you whether the simulator is good enough for this task. It tells you when a change to the environment made it worse. And it tells you when the real cell drifted (a bumped camera, a worn gripper), because the sim number stayed put and the real one moved.

The harness is more valuable than the simulator it measures, and it outlives every engine you will ever use.

## It can be budgeted

Once the gap is a number per task, it is a line in a plan. For a task where sim honestly covers eighty percent of the work, most of the training and almost all of the rare-event testing happens where it is free, and the real-world budget is validation plus the last stretch. For a task where sim covers thirty percent, sim buys approach, collision avoidance, and gross motion, and the real budget carries the insertion, which is where the schedule goes. Pretending the second task is the first is how programs lose a quarter.

The budget also decides fidelity. A modest simulator you have honestly characterised against the cell is worth more than a beautiful one you trust. Spend on the measurement and the randomization before spending on the render.

## What closes the gap

- **System identification.** Measure the real actuators, the real compliance, the real friction, and put them in the model instead of the defaults.
- **Randomization with reasons.** Vary the things that actually vary on your floor, wider than feels reasonable, and write down why each range is what it is.
- **Assets that match.** Your CAD is not a simulation asset; collision geometry, masses, and materials have to be made, and remade when the design changes.
- **Real data for the last stretch.** For contact and deformables, plan on demonstrations for the final centimetres, and treat sim as the tool that gets the robot there safely.

## What sim will never fix

It will not tell you which parts are shiny enough to break your depth sensor. It will not model the tangled ones in the bin. It will not predict what the Wi-Fi does when a forklift passes. These are bench problems and site problems, and the fastest way to find them is to stand next to the cell.

So: the simulator lied. It always will, by an amount you can measure, per task, and plan around. That's fine. That's the job.
