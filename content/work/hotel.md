---
title: "Hotel Bookings Data Cleaning"
description: "Processed messy hotel bookings dataset using the R language and RStudio/Posit Cloud."
image: "/images/work/hotel_thumb.jpeg"
category: "cleaning"
date: 2025-09-18
---

This project demonstrates how I cleaned a simulated hotel bookings dataset using **R** within **RStudio/Posit Cloud**, as part of the Google Data Analytics Capstone course.

### Dataset Source
Provided by the [Google Data Analytics Professoinal Certificate Program](https://www.coursera.org/professional-certificates/google-data-analytics) on [Coursera](https://www.coursera.org).

> **Note:** According to the course scenario, the dataset was compiled from two hotel systems and exported as a `.csv` file. The data contained inconsistencies such as null values, misnamed columns, and type mismatches. It was intended for data cleaning practice using R and RStudio.
> This entire course assignment was hosted in [Posit cloud](https://posit.cloud/), a cloud-based version of RStudio. However, as of July 2025, Posit Cloud deprecated publishing for our projects, and is no longer accessible. I will republish this using the desktop version of RStudio and push this as a repo on GitHub in the future.

---

### Tools & Packages Used

- 📦 `tidyverse` – data wrangling and manipulation
- 📦 `skimr` – quick data overviews
- 📦 `janitor` – cleaning and renaming column names

---

### Key Cleaning Tasks

- Imported `.csv` file using `read_csv()`
- Previewed structure with `head()`, `str()`, `glimpse()`, and `skim_without_charts()`
- Selected and renamed relevant columns for clarity (`hotel`, `lead_time`, etc.)
- Created derived fields (e.g., total guests per booking)
- Combined year and month columns for date analysis
- Summarized basic metrics (e.g., number of cancellations, average lead time)

---

While this project focused primarily on **data cleaning and preparation**, the cleaned dataset is ready for deeper analysis — such as:
- Booking seasonality
- Cancellation trends
- Hotel occupancy patterns

{{< loom id="c372310d032645b096cf97927130a9e7" >}}