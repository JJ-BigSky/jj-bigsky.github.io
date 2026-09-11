---
n: 01
title: Your average latency is a lie.
standfirst: The p99.9 argument, with a worked example of a pipeline that passes every test and breaks on the second shift.
date: September 2026
station: Decide
page: /embedded/
page_name: On-robot autonomy
---

Every inference benchmark you will ever be shown is a mean. The vendor's slide says 20 milliseconds. Your own test says 20 milliseconds. The dashboard, averaged over the last hour, says 20 milliseconds. And the robot put a gripper through a fixture on the second shift, because for one frame in every few thousand the answer took 140.

Robots are broken by tails. This note is about why the mean hides them, how to measure the number that matters, and what to do with it once you have it.

## A worked example

Take a perception stack that runs a detector and a pose estimator, feeding a policy at 30 Hz. The control period is 33 milliseconds. Mean pipeline time is 20. There are 13 milliseconds of headroom, which is comfortable, and the acceptance test, which runs for ten minutes on a Tuesday morning, passes with room to spare.

Now look at the distribution instead of the mean. Once every few thousand frames, something happens: a garbage-collection pause, a memory allocation that wasn't warm, an interrupt that landed on the wrong core, a GPU clock that dropped because the enclosure hit forty-five degrees. That frame takes 140 milliseconds. At 30 frames a second, “every few thousand frames” is every couple of minutes. The policy misses four control periods in a row. If the robot is mid-move, it keeps moving on a stale command.

On the first shift, in a cool building, with a fresh boot, the tail is rare and the misses are short. On the second shift, after six hours of thermal soak, the tail is fatter and the misses are longer. Nothing in the acceptance test measured that, because the test was ten minutes long and the mean was fine.

## The number that matters

The number that breaks robots is the 99.9th percentile: the latency that one frame in a thousand exceeds. For a loop at 30 Hz, that's a frame every 33 seconds. If p99.9 sits above the control period, the robot is late roughly twice a minute, whatever the mean says. If p99.9 sits inside the period, the tail is contained and the mean is a curiosity.

Measure it properly, which means four things at once: on the real hardware, with the real model, under the real load, and after the enclosure has been at operating temperature for long enough to matter. A benchmark on a developer workstation with a fan the size of a dinner plate tells you about the workstation.

## Budget for the tail

Once you have the distribution, the latency budget is a design document rather than a hope. Every stage gets a p99.9 allocation, not a mean, and the stages have to fit inside the period with the tails included. When they don't, the choices are honest ones: cut a stage, quantize and re-validate, distill a smaller model, or slow the loop and say so. The [latency budget builder](/embedded/#lab) is that document with a slider on it.

## Design the fallback for the tail

Even a good budget will be exceeded, because the world is bigger than the test. So the last part of the design is what the controller does when the answer doesn't arrive: a defined, boring behaviour. Hold position. Re-approach. Ask a human. The exact choice depends on the task; the requirement doesn't. It has to be proven, not assumed, and it has to be proven to the same standard as the rest of the safety architecture, because it is part of the safety architecture.

A learned policy that is late is not a slightly worse policy. It is no policy at all for the duration of the miss, and the cell needs to be safe for exactly that long.

## What to put in the document

- The p99.9 latency of each stage and of the whole pipeline, measured as above, with the date and the enclosure temperature.
- The control period, the headroom with tails included, and what was cut to get there.
- The late-answer behaviour, the threshold that triggers it, and the test that proved it.
- A note on what the sustained clock is, as opposed to the datasheet peak, because the summer afternoon is coming.

None of this is exotic. It is the ordinary discipline of real-time systems applied to a component that vendors prefer to describe with a mean. Measure the tail. Budget for the tail. Design the fallback for the tail. The robot doesn't care about the average.
