---
n: 04
title: Keep the raw.
standfirst: Three data decisions made in week one that determine whether you have a flywheel or a NAS.
date: September 2026
station: Capture
page: /cloud/
page_name: Robot data & cloud
---

Somewhere in month four, a team that built a very good robot cell discovers that it has filled a NAS. The discovery arrives as a ticket, or a bill, or a full disk that stops the recorder. The response, under pressure, is to delete the old data. And with that, the loop that was the entire point of the program, the recording that makes next week's policy better than this week's, is switched off.

This happens because the data architecture was designed after the robots arrived. Three decisions, made in week one, prevent it. None of them is technically difficult. All of them are hard to make later.

## Decision one: keep the raw

Keep the raw sensor data. Compressed, yes. Tiered to cold storage after a few weeks, yes. But keep it, because you will want to re-derive datasets with a labelling scheme you haven't invented yet.

The dataset you build today encodes today's assumptions: which frames matter, what counts as a success, how episodes begin and end. In six months, when the policy fails on a class of parts nobody anticipated, the question will be “what did the camera actually see?” If the raw is gone, the answer is a shrug and a re-collection. If the raw is there, the answer is a script.

Do the multiplication first. Four cameras at 1080p and thirty frames a second, two shifts, six robots, is a facilities decision and a recurring bill, not a folder. The [robot data math](/cloud/#calc) gives you the terabytes a month, the cost by tier, and the date it becomes a problem. Knowing the date in week one is what makes “keep the raw” a plan instead of a wish.

## Decision two: record provenance, not just data

A trajectory without its context is a video. To train on it, evaluate against it, or decide whether it still describes the cell you have, you need to know: which robot, which policy version, which gripper, which camera calibration, which part revision, which operator, which shift. All of it, on every record, at capture time.

Provenance is cheap to record and impossible to reconstruct. It is also what turns a change on the floor (a new gripper, a bumped mount) from “the dataset is now suspect” into “these 1,400 episodes are now suspect, and the rest are fine.” That difference is weeks.

## Decision three: decide retention on day one

Not because storage is expensive (it mostly isn't, tiered properly) but because “everything forever” is not a policy. If you don't write one, it will be written for you, badly, in a hurry, by whoever gets the bill. Decide what is kept hot, what goes warm, what goes cold, and what is deleted and when. Write down who can see the camera feeds, because every frame from a workplace has people in it, and write down how deletion actually happens.

## The conversion tax

The three decisions sit on top of a structural fact: the robot's operational format and the training side's dataset format are different things, for good reasons. On the robot, MCAP in rosbag2 handles heterogeneous, timestamped, multi-schema streams and is what you replay when something went wrong at 3 a.m. On the training side, episode-oriented dataset formats are what the tooling assumes.

The conversion between them is a pipeline you own forever. Make it deterministic, version it, and make it possible to regenerate every training set from raw with one command. Teams that skip this end up with datasets nobody can reproduce and a model nobody can explain.

## Training is the cheap part

People budget carefully for GPUs and loosely for everything else, which is backwards. Renting a serious card is a couple of dollars an hour. Fine-tuning a policy on a few hundred episodes is an overnight job. The costs that hurt are the demonstrations, the operators who perform them, the engineers who clean them, and the evaluation harness that says whether any of it worked. Compute is the line item everyone plans for and the one that matters least. The good news is that the expensive part is something you can be strategic about, starting with these three decisions.

Keep the raw. Record provenance. Decide retention. Week one. Then buy the robots.
