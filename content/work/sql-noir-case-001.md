---
title: "SQL Noir: Case 001 – The Vanishing Briefcase"
description: "Solved a theft case using SQL by filtering suspects and using joins to validate the culprit through interview data."
image: "/images/work/sql-noir-series-thumb.jpg"
category: "sql"
date: 2026-04-26
source: "https://sqlnoir.com"
tools:
  - SQL
skills:
  - Filtering
  - Joins
  - Data exploration
  - Evidence-based reasoning
---

## Overview

**SQL Noir** is an interactive SQL learning platform that presents database challenges as detective-style investigations. Each case requires querying structured data, following narrative clues, and validating conclusions using relational tables.

I approached **SQL Noir Case 001** as a beginner-friendly data investigation. The goal was to identify the suspect responsible for stealing a valuable briefcase from the Blue Note Lounge by querying the available tables and validating the result with interview data.

## Objective

Use SQL to gather crime scene details, match suspects against the witness description, and confirm the culprit through an interview transcript.

## Tools & Skills

- SQL
- Filtering with `WHERE`, `LIKE`, and `IS NOT NULL`
- Joining tables with `JOIN`
- Evidence-based reasoning
- Reading schema and table relationships

## Approach

- Reviewed the schema before writing queries
- Queried the `crime_scene` table to gather the first clue
- Used the witness description to filter the `suspects` table
- Eliminated a false match based on scar placement
- Joined the `suspects` and `interviews` tables to verify the culprit

## Process

The case began with a stolen briefcase at the Blue Note Lounge. I first queried the `crime_scene` table to retrieve the incident details. The report described a man in a trench coat with a scar on his left cheek fleeing the scene.

Using that description, I filtered the `suspects` table for people wearing a trench coat and having a recorded scar. This returned three possible suspects: Frankie Lombardi, Vincent Malone, and Christopher Black.

Christopher Black was eliminated because his scar was on the right cheek, while the witness described the scar as being on the left cheek. This left two likely suspects: Frankie Lombardi and Vincent Malone.

To verify the result, I joined the `suspects` table with the `interviews` table using the shared key relationship between `suspects.id` and `interviews.suspect_id`.

## Key Query

```sql
SELECT s.name, i.transcript
FROM suspects s
JOIN interviews i
ON s.id = i.suspect_id
WHERE s.name IN ('Frankie Lombardi', 'Vincent Malone');
```

## Final Finding

The interview results showed that Frankie Lombardi had no available transcript, while Vincent Malone admitted involvement by saying, “I wasn't going to steal it, but I did.”

Based on the evidence, the culprit was:

- Vincent Malone

## Key Takeaways

This case reinforced the value of inspecting table structure before writing queries. It also showed how `JOIN` can reduce manual work by connecting related tables through keys.

Although this was a beginner-level case, it helped demonstrate a complete investigation workflow: gather clues, filter candidates, eliminate mismatches, and validate the conclusion with supporting evidence.

## Reflection

The biggest takeaway was understanding how joins save time and reduce errors. Instead of querying one table, manually copying IDs, and checking another table separately, I used the relationship between `suspects.id` and `interviews.suspect_id` to combine the relevant data in one query.

## Resources

- SQL Noir  
  https://sqlnoir.com