---
n: 06
title: AI in a safety function.
standfirst: What the 2025 robot-safety revision and the 2027 EU machinery rules mean if your policy is learned. Descriptive, dated, and not legal advice.
date: September 2026
station: Act · Decide
page: /physical-ai/
page_name: Physical AI
---

Most conversations about learned policies in robot cells are about capability. This one is about what changed in the rules, on what dates, and what that means for the design of a cell where a learned policy participates in something safety-related. It is descriptive: here is what changes and when. It is not legal or certification advice, and your notified body, assessor, or counsel has the last word on your machine.

## What changed in ISO 10218

ISO 10218 is the robot-safety standard the industry cites, and it was substantially revised in 2025. ISO 10218-1:2025 covers industrial robots; ISO 10218-2:2025 covers robot applications and cells. Both supersede the 2011 editions. Among the changes, the revision makes functional-safety requirements explicit where they used to be implied, and conflicting national standards are to be withdrawn by March 2027. A cell designed against the 2011 text is designed against a standard that no longer exists, and the people who will read your safety file know that.

## What changes in the EU

The EU Machinery Regulation, (EU) 2023/1230, applies from 20 January 2027 and replaces the Machinery Directive 2006/42/EC. It is a regulation rather than a directive, so it applies directly, and it introduces specific provisions for machinery incorporating AI and machine learning. In particular, machinery where an AI system performs a safety function is treated as high-risk under Annex I, which changes the conformity route.

An AI-driven robot in the EU therefore sits at the intersection of three frameworks: the Machinery Regulation for the machine, the AI Act for the AI system, and GDPR for the data, including the people in the background of every camera frame.

## What that means for a learned policy

The design consequence is a question you can ask in week one: *does the learned policy participate in a safety function, or not?*

If it does not (the policy decides what to pick and how, while a conventional, verifiable safety system decides when the robot may move at all), the policy is a performance component and the safety case is the familiar one. This is the architecture we prefer wherever the task allows it, and it is a strong reason to keep speed-and-separation monitoring, protective stops, and interlocks on hardware and logic that can be assessed the ordinary way.

If it does (a model's output gates a protective function, or a learned perception system is what detects a person in the zone), the compliance path changes, and the evidence you need changes with it: how the system was validated, on what data, with what failure modes, and what happens when it is late or uncertain. That evidence is exactly what an evaluation harness produces when it is built for the purpose, and exactly what a demo never does.

Either way, the fallback path, meaning what the cell does when the policy is uncertain or doesn't answer in time, is part of the safety architecture and is designed and proven to the same standard as the e-stop. Not bolted on after the model works.

## What to do this quarter

- Inventory which functions the policy touches, and which of those are safety functions. Most teams have never written this down.
- Decide the architecture on purpose: keep the learned components out of the safety function where the task allows, and document where it doesn't.
- Update the standards references in your safety file to the 2025 editions, and check what your national standards are doing before March 2027.
- If you sell into the EU, start the conversation with your notified body about the January 2027 date now, with the architecture decision in hand.

The dates are real, they are close, and they are a legitimate reason to design the cell properly this quarter rather than next year. That is the whole of our position, and the reason our [fallbacks and interlocks work](/physical-ai/) connects to our [safety and compliance work](/#services): same discipline, same file, one architecture.

<p class="small muted">Descriptive, not legal or certification advice. Standards position current as of September 2026.</p>
