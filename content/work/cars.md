---
title: "1985 Cars Data Cleaning"
description: "Performed cleaning and normalization on an automotive dataset from 1985 using SQL queries."
image: "/images/work/yellow_vw_thumb.jpeg"
category: "cleaning"
date: 2025-09-18
---
This project focused on cleaning and normalizing a classic automotive dataset from 1985. The dataset included specifications for various cars such as horsepower, fuel type, origin, and mileage (mpg). The raw data had several inconsistencies — missing values, improper data types, and duplicate entries.

Using SQL queries in BigQuery, I performed data cleaning by:

- Replacing `?` placeholder values with NULLs
- Casting numeric fields like `horsepower` and `mpg` into proper data types
- Removing or deduplicating rows with conflicting entries
- Normalizing text-based categories for consistency

After cleaning, the dataset became more reliable for future analysis. This foundational step ensures better results in future data visualization and modeling tasks.

## Tools Used
- SQL
- Google BigQuery

## Dataset Source
Provided by the [Google Data Analytics Professoinal Certificate Program](https://www.coursera.org/professional-certificates/google-data-analytics) on [Coursera](https://www.coursera.org). According to the course, this is data from an external source that contains historical sales data on car prices and their features in the year 1985.

{{< loom id="f0eb98dae43e4db29b2b34794c1b6f53" >}}