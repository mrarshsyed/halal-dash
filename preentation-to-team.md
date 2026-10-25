# Halal ratings v2: team presentation

Screen-share script. Log in as super admin. All steps below are safe to show: they only open
screens and dialogs. **Do not press Save** unless a step says so.

---

# 1. Admin dashboard

## 1.1 Activity

1. **Menu: Activity.** Point out the new entries: *Categories*, *Subcategories*, *Parameters*.
2. **Categories** (`/activity/ratings-main-category`): two rows, *Category specific Parameters* (can have subcategories: Yes) and *Common Parameters* (No).
3. **Subcategories** (`/activity/ratings-category`): Activity Type, Common Area, Food Details, each under a Category.
4. **Parameters** (`/activity/ratings`):
   - Table shows Points, Category and Subcategory.
   - Click **+ Add New Parameter**: choosing *Common Parameters* hides Subcategory; choosing *Category specific Parameters* shows it (required).
   - *Cap demo:* Food Details + 21 points, press Save. It is refused ("cannot total more than 100 points"), nothing is saved.
   - *Points demo:* enter 0, press Save. "Points is required (above 0)".
   - Close the dialog.
5. **List** (`/activity/list`): new **Category** and **Points** columns next to Rating(%).
6. Click the **eye** icon: details show percentage, points and the selected parameters grouped (Common first, then each subcategory).
7. Click the **star** icon: common parameters, one subcategory dropdown, its checkboxes, and a live "Selected points X out of Y (Z%)". Switch the subcategory to show the other group's checks clear. Close.

## 1.2 Cruise

1. **Menu: Cruise.** New entries: *Categories*, *Parameters*.
2. **Parameters** (`/cruise/ratings`):
   - Columns: Points, Category, **Mandatory For Class**.
   - "Total Points: 100 / 100" and the **Add button is disabled** (no module can go above 100).
   - Click the pencil on any row to show the edit form and the *Mandatory For Class* dropdown (Platinum, Gold, Silver, Bronze). Close.
3. **Ship** (`/cruise/ship`): the Rating(%) column now shows the score plus a **class badge** (for example 78 Gold).
4. Click the **star** on a ship: parameters grouped by category, each with *Matched / Partially Matched / Not Matched*, and a preview showing percentage and class. Close.
5. Click the **eye** icon on a ship: halal rating, class, points and the scored parameters.
6. **Package** (`/cruise/package`): new **Ship Halal Rating(%)** column with the class badge. A package has no rating of its own; it shows its ship's.

## 1.3 Restaurant

1. **Menu: Restaurant.** New entries: *Categories*, *Parameters*.
2. **Parameters** (`/restaurant/ratings`):
   - "Total Points: 95 / 100" and the Add button is enabled.
   - *Cap demo:* + Add New Parameter, any name, 6 points, any category, Save. Refused ("Total points cannot go above 100"). Try 0 points: "Points is required (above 0)". Close.
   - Show the **Mandatory For Class** dropdown in the same dialog.
3. **Restaurants** (`/restaurant/restaurant`):
   - Rating(%) column now shows score plus class badge (97 Platinum).
   - New **halal rating filter**: min 60, max 66, Apply (76 results). Set *Sort by halal rating* to Lowest first. Press **Reset**.
4. Click the **star** on a restaurant: parameters grouped by category with the three-way score, preview percentage and class. Close.
5. Click the **eye** icon: halal rating, class, points and the scored parameters.

## 1.4 Admin talking points (30 seconds)

- Everything is added by the admin: categories, subcategories, parameters, points and mandatory classes. Nothing is hardcoded.
- Every module is capped at 100 points.
- Activities have a score and points but no class badge. Restaurants and cruise have a class badge.

---

# 2. Public site

Show it on the booking site (desktop width first). Everything below only browses; nothing is saved.
Numbers are examples from today's data and can change.

## 2.1 Activity

1. **Activities** (`/halal-friendly-activities-worldwide`): search *Dubai* with future dates. Every rated activity now appears (the old "needs a manager" rule is gone); activities with no score stay hidden.
2. Each card has the **halalness card**: score out of 100 and "N Halal Parameters Assessed". There is **no tier badge** for activities.
3. Click **View Halalness Report**: the report opens **inside the card** with the score, parameters grouped (Food Details, Common Area, Activity Type), the Assessment Details box and the legend. Click *Hide Report*.
4. **Filter and sort:** the Halalness bands no longer overlap (75-100, 50-74, 25-49, 0-24). Pick 0-24 for a few low scores, then *All*. Sort by *Halalness Low To High* then *High To Low*.
5. **See Details:** the details page has the same card; clicking it opens the report in a **modal**.
6. **Phone width** (shrink the window under 768px): "View Halalness Report" opens the modal instead of expanding in place.
7. **Custom Holiday** (activity step): the same cards appear there. *See Details* opens the activity step with the halalness card, and clicking it opens the report.

## 2.2 Cruise

1. **Cruise packages** (`/best-halal-friendly-cruise-packages`): each package card shows its **ship's score and class badge** (for example 76 Gold, 98 Platinum). A package has no rating of its own.
2. Click **View Halalness Report**: inline report with grouped parameters and the Assessment Details box.
3. **Filter and sort:** halalness bands (75-100 holds every package today; 50-74 shows the empty message), then *Halalness High To Low* and *Low To High*.
4. **See Details:** the *Ship Info* section has the ship's halalness card. Click it to open the report in the modal.
5. **Phone width:** same click opens the modal.

## 2.3 Restaurant

1. **Restaurants** (`/best-halal-restaurants`): about 779 restaurants; each card shows the score and **class badge** (for example 97 Platinum). Restaurants with no score are hidden.
2. Click **View Halalness Report**: inline report, grouped by category, with the Assessment Details box.
3. **Filter and sort:** pick *50% - 74%* (about 376 restaurants), then *All*. Sort *Halalness Low To High* (starts at 48) then *High To Low* (97).
4. **See Details:** the details page has the halalness card; click it for the modal. An unrated restaurant's page shows "No Data Found".
5. **Phone width:** the report opens in the modal.

## 2.4 Public talking points (30 seconds)

- Activities, restaurants and cruise now share the same halalness card and report as hotels, desktop inline and mobile modal.
- Restaurants and cruise show a class badge; activities show only the score.
- Hotel pages are unchanged and were re-checked.
- The report text (assessment method, assessed by, data source) is a neutral HalalExplore default for activity, restaurant and cruise.
