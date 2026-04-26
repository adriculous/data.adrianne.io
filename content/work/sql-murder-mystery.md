---
title: "SQL Murder Mystery"
description: "Solved a fictional murder case using SQL queries, joins, filters, and evidence-based reasoning across multiple relational tables."
image: "/images/work/sql-murder-mystery-thumb.jpg"
category: "sql"
date: 2026-04-25
source: "https://mystery.knightlab.com"
tools:
  - SQL
  - SQLite
skills:
  - Data exploration
  - Filtering
  - Joins
  - Aggregation
  - Evidence-based analysis
---

# SQL Murder Mystery

## Overview
I approached **SQL Murder Mystery** as a real-world data investigation, using SQL to identify a murderer and uncover the mastermind behind the crime.

## Objective
Use SQL to follow clues, inspect tables, connect related records, and validate the final suspects using evidence from multiple tables.

## Tools & Skills

- SQL / SQLite
- Filtering with `WHERE`, `AND`, `LIKE`, `IN`, `BETWEEN`
- Sorting with `ORDER BY`
- Aggregation with `COUNT`, `GROUP BY`, `HAVING`
- Joining tables with `JOIN`
- Evidence-based reasoning

## Approach

- Explored table structures before writing queries
- Translated narrative clues into SQL filters
- Narrowed results iteratively using multiple conditions
- Cross-referenced results across tables to validate conclusions

## Process
I started by querying the crime scene report for a murder in SQL City on January 15, 2018. The report identified two witnesses: one living at the last house on Northwestern Drive, and another named Annabel on Franklin Avenue.

The first witness, Morty Schapiro, provided clues about a Get Fit Now Gym bag, a gold membership ID beginning with “48Z,” and a car plate containing “H42W.” Using filters and joins across the gym membership and driver's license tables, I narrowed the suspect pool and identified Jeremy Bowers as the murderer.

The second witness, Annabel Miller, confirmed that the suspect had been at the gym on January 9, reinforcing the timeline but not eliminating either suspect. The license plate clue became the deciding factor.

After confirming Jeremy Bowers as the murderer, the challenge revealed a second layer: he had been hired by a mastermind. Jeremy’s interview described a wealthy woman with red hair, height between 65–67 inches, a Tesla Model S, and attendance at the SQL Symphony Concert three times in December 2017.

I used joins and aggregation to cross-check the driver's license, person, event check-in, and income tables. This led to Miranda Priestly, whose profile matched the physical, behavioral, vehicle, and income clues.

## Final Findings
- Murderer: Jeremy Bowers
- Mastermind: Miranda Priestly

## Key Takeaways
This project helped me practice translating narrative clues into SQL filters. I also learned the importance of inspecting table structure before querying, validating assumptions, and combining multiple tables to avoid jumping to conclusions.

One important lesson came from the “Red Korb” result: even when a name looked unexpected, the data confirmed the record matched the filter. This reinforced that analysis should rely on evidence, not assumptions.

This project reinforced that effective SQL analysis requires combining structured queries with contextual reasoning, rather than relying on assumptions.

## Reflection
SQL Murder Mystery was a useful beginner-friendly project because it made SQL feel practical and investigative. Instead of writing isolated queries, I had to follow a trail of evidence across multiple tables and validate each conclusion before moving forward.

---

## Resources

- SQL Murder Mystery (Knight Lab)  
  https://mystery.knightlab.com