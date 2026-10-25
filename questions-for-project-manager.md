# Halal ratings v2: questions for the project manager

Covers activity, restaurant and cruise (hotels unchanged). Fill in the Answer column.
Backend questions are in `rating-v2-confirmation.md` (all answered).

## What is still open


| Work or decision                                                          | Needs answer |
| --------------------------------------------------------------------------- | -------------- |
| Activities with no subcategory score 0% until Common Parameters exist     | 1.7          |
| Which restaurant and cruise parameters are mandatory for which class      | 2.1          |
| Should restaurant and cruise enforce the 100-point cap like hotels        | 2.2          |
| Badge for a null class: none (today) or "Not Rated" like hotels           | 2.5          |

Decided: 1.1, 1.3, 1.4, 1.5, 1.6, 2.3, 2.4, 2.6, 2.7, 3.1, 4.1, 4.2, 4.3. Skipped for now: sections 5 and 6.

## 1. Activity


| # | Question                                                                                                                                                                                                            | Answer                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1 | Booking-site activity card (backend: activities will NOT get a `halal_class`): neutral card with no tier, or tiers derived from the percentage (please give the thresholds)? | Decided (recommendation accepted): hotel-style card and inline report with the score, no tier. Built for the search card, details page and custom-holiday cards. |
| 2 | Admin wording is now Category / Subcategory / Parameter.                                                                                                                                                            | Answered by backend: UI wording is Category / Subcategory; the API names stay `mainCategory` / `category`. |
| 3 | Should the admin activity list and details show points and the selected parameters?                                                                                                                                 | Decided: show them. Built: Points column on the list, points and grouped parameters in the details.        |
| 4 | The 100-point cap was removed on activity parameters. Confirm.                                                                                                                                                      | Confirmed.                                                                                                 |
| 5 | Activities saved with two subcategories (618 of them): fix by hand, or backend migration? (Backend will not rewrite them.) (Save is blocked until one subcategory is chosen.)                                       | Decided: Save stays blocked until one subcategory is chosen.                                               |
| 6 | Unrated activities are hidden from public search and details (the backend confirmed this is how the server works). Intended from a business view?                                                                   | Decided: stay hidden.                                                                                      |
| 7 | No Common Parameters exist yet (the backend says to add them from the parameter screen when the product owner supplies them). Who supplies the list and when? Until then an activity with no subcategory scores 0%. |                                                                                                            |

## 2. Restaurant and cruise (shared)


| # | Question                                                                                                                                                                                                                       | Answer                                                                                                                                                                                                                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | Which parameters are mandatory for which class, for restaurants and for cruise?                                                                                                                                                | Open. How hotels do it: set per parameter on the hotel parameter screen ("Mandatory For Class" multi-select). The restaurant and cruise screens now work the same way. Still need which parameters are mandatory for which class. |
| 2 | The 100-point cap was removed on restaurant and cruise parameters (hotels keep it). Confirm catalogs need not total 100.                                                                                                       | Open. How hotels do it: the hotel parameter screen blocks a total above 100 and disables Add at 100. Restaurant and cruise do not enforce it (the server does not require it). Should they enforce it like hotels?                |
| 3 | Reuse the hotel Halalness card and report modal as is, with the same tier colours and labels?                                                                                                                                  | Decided: use the inline expanding card like the hotel list (desktop), not a modal. Built for restaurant and cruise cards; mobile still opens the modal.                                                                           |
| 4 | Report modal text mentions the hotel assessment framework. Please supply restaurant and cruise wording and the Assessment Details (method, assessed by, data source).                                                          | Decided: use whatever suits restaurant and cruise. Built: same layout as the hotel inline card, with "Restaurant Contact" / "Cruise Line Contact" in place of "Hotel Contact".                                                    |
| 5 | `null` class = no badge (hotels show "Level Not Achieved"). Confirm.                                                                                                                                                           | Open. How hotels do it: a null class shows "Not Rated" (grey), and a non-compliant hotel shows "Level Not Achieved". Restaurant and cruise currently show no badge, only the score. Show "Not Rated" instead?                     |
| 6 | Score labels: Full / Partial / None (doc) or Matched / Partially Matched / Not Matched (hotel)?                                                                                                                                | Decided: as hotel (Matched / Partially Matched / Not Matched). Admin popups and details updated; the booking-site legend already uses the hotel wording.                                                                          |
| 7 | Unrated restaurants are hidden publicly. Cruise packages on an unrated ship are hidden in search but the detail page still opens (today no package is on an unrated ship: the 36 unrated ships have 0 packages). Confirm both. | Confirmed.                                                                                                                                                                                                                        |

## 3. Restaurant


| # | Question                                                                                         | Answer                              |
| --- | -------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 1 | Rename the list column "Rating(%)" to "Halal Rating(%)" to avoid confusion with the star rating? | Decided: keep as it is (no rename). |

## 4. Cruise


| # | Question                                                                                                                   | Answer                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1 | Package card shows the ship's score. Label it "Ship halal rating"?                                                         | Decided: keep as it is. |
| 2 | Confirm the admin package column label "Ship Halal Rating(%)".                                                             | Decided: keep as it is. |
| 3 | The package detail page for a ship with no score says "This ship has not been rated yet." (no badge). Confirm the wording. | Confirmed.              |

## 5. Admin testing and access (all modules)


| # | Question                                                                                                                                                                                                                                       | Answer           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| 1 | Write tests have not run (save ratings; create, edit, delete categories and parameters). There is no staging server. Who runs them, and may they use throwaway `ZZ-TEST` records on the live API? Or should I run them once you approve?       | Skipped for now. |
| 2 | Please provide test accounts for each role (admin, employee, manager) and one with `activity-all`, `cruise-all` or `restaurant-all`, to check the menus and the rating star.                                                                   | Skipped for now. |
| 3 | The backend lets a record's assigned manager save scores even without the "update halal ratings" permission, but the admin shows the rating star only with that permission. Should the star also show for the assigned manager of each record? | Skipped for now. |

## 6. Other


| # | Question                                                                                                                                                                                                                                                                                                                                            | Answer           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 1 | The activity typeahead (`search-preview`) returns unrated activities (percentage 0) while public search and details hide them, so a user could pick one and get "Activity not found". The booking site has no activity typeahead today. Should the backend hide unrated activities there, or will the site handle it? (Needs the backend team too.) | Closed: unrated activities stay hidden. The site has no activity typeahead; if one is added, it must hide 0% results. |
| 2 | The holiday packages card on the booking site still reads the old `halal_ratings` fields. It is not covered by either v2 document. Does the holiday module need a v2 change? | Closed: not needed. The holiday packages API returns no halal or rating fields, so that block never renders. (The custom holiday builder is separate and already uses v2.) |
| 3 | The public activities page only lists activities that have an assigned manager (an existing rule). Rated activities without a manager never appear: Riyadh 0 of 8, Dammam 0 of 1, Al-Ula 0 of 10, while Dubai shows 97 of 98. Is the manager rule still intended now that the score decides what is shown, or should the page list every rated activity? | |
