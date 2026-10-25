# Halal ratings v2: confirmation from backend

Covers activity, restaurant and cruise (hotels unchanged). Answers from the backend, dated 19 Oct 2026.
Questions for the project manager are in `questions-for-project-manager.md`.
Observations come from read-only checks of the live API (`api.halalexplore.com/v1`).

## A1. Activity

| # | Question | Answer |
| --- | --- | --- |
| 1 | Is "Main category => category, category => subcategory" UI wording only, or is the API being renamed? Live API still uses `mainCategory`, `category`, `...-main-categories`; `...-subcategories` returns 404. | UI wording only, API not renamed. Devs: `mainCategory`/`category`; UI: Category/Subcategory. |
| 2 | Will activities get a `halal_class`? It is not in the activity spec. | No. Activities have no class; do not read `halal_class`. |
| 3 | One activity has parameters in two subcategories: 95 points but 100%. How is 100% derived? Is a cleanup planned for such rows (save rejects them)? | % = ceil(earned / (common + selected subcategories)). 618 activities have 2+ subcategories, 180 are 95 pts at 100%. Not rewritten; save is rejected until one remains. |
| 4 | Live data has no Common Parameters yet. Expected? | Yes, expected. Add via the parameter screen when the PM supplies them. No subcategory and no common = 0%. |
| 5 | Do activity parameters have per-parameter scores (full/partial/none)? The spec shows points only. | No. Checked or not checked; body stays `{ ratingIds: [ids] }`. |
| 6 | Is "create/update/delete = super admin only" enforced on the server? Any permission string for other roles? | Enforced; other roles get 401 code 13332. No permission string. Activity save: super-admin, `activity-all`, `activity-update_halal_ratings`, or assigned manager. |
| 7 | Does the Excel report use the v2 fields (Provided, Rating %, Details) as the spec says? | Yes, v2 fields; `export_type=current_page` or `current_list`. |

## A2. Restaurant and cruise (shared)

| # | Question | Answer |
| --- | --- | --- |
| 1 | Does the server round the percentage up (`Math.ceil`) like the preview? (92/95 shows 97, which matches.) | Yes, same helper on save and recalculation. |
| 2 | Confirm class rule: 80+ platinum, 60-79 gold, 40-59 silver, below 40 bronze, then walk down on mandatory parameters; unmet bronze = `null`. | Confirmed as described. |
| 3 | How long does the background recalculation take after a catalog change? How do we know it finished? | Queue job after the response; seconds today (779 restaurants, 50 ships, 1000 per chunk). No status flag, refetch on open. Renaming a parameter does not recalculate. |
| 4 | No parameter is mandatory for any class yet, so everything at 80%+ is Platinum. Expected for now? | Yes for now; class equals the percentage band until a parameter is mandatory. |
| 5 | Can `halal_class` return anything except the four classes or `null`? | No. Only the four classes or `null`. |
| 6 | Should the server reject duplicate parameter ids (today they count twice)? | No, not rejected and not deduped; duplicates count twice. Send each id once. |

## A3. Restaurant

| # | Question | Answer |
| --- | --- | --- |
| 1 | All 10 restaurants on the first admin page show 92-97% Platinum. Is that the expected migration result? | Yes. First page is the top of the sort. 781 restaurants: 402 platinum, 76 gold, 301 silver, 2 unscored. |
| 2 | The 0-5 star `rating` is unrelated to the halal rating, right? | Yes, unrelated (star `rating` vs `halal_ratings_*`). |
| 3 | Catalog totals 95, not 100. Intended? | Yes. Denominator is the sum of weights; not forced to 100. |
| 4 | Is `halalness: [min, max]` inclusive? What is the tie order when `sort` is omitted? | Inclusive both ends. Ties have no second sort key, so order is unstable. |
| 5 | Should the admin restaurant list have a halalness filter and sort? The dashboard has none. | Yes. The endpoint already accepts `halalness` and `sort`; add the controls in the dashboard. |
| 6 | Unrated restaurant detail returns 403 "Restaurant not found". Any code or message the site should key on? | HTTP 403, message `Restaurant not found`, code 13333 (also used for unknown ids). No separate unrated code. |
| 7 | Are any categories added, renamed or merged? | No. Categories are Food and Kitchen, Dine-in Area, Common Area; name only. |

## A4. Cruise

| # | Question | Answer |
| --- | --- | --- |
| 1 | Cruise menu permissions were copied from hotels; I changed them to `cruise-halal-rating` and `cruise-halal-rating-category` (and `restaurant-all`). Are these the real permission strings? | No, not real permissions. Real: `cruise-all`, `cruise-master_data`, `cruise-ship`, `cruise-package`, `cruise-update_manager`, `cruise-update_halal_ratings`. Catalog create/update/delete = super-admin role only. |
| 2 | A ship's score change updates all its packages at once. Any cache delay? | No cache, no package write. Packages read `ship.*` live on each request. |
| 3 | Many ships show 0 (e.g. Carnival Pride, Celebrity Solstice), so their packages vanish from public search. How many packages? | None. The 36 unscored ships have 0 packages. All 43 packages are on scored ships (76-98%); 12 are hidden only because the departure date passed. |
| 4 | Are the 85% Platinum ships on packages really scored, or migrated defaults? | Migrated scores (each checked parameter = 1), not a default. 30 ships have 8 checked parameters adding to 85. |
| 5 | Should the public ship dropdown (`/user/cruise/ships`) include unrated ships? | Yes, keep unrated ships. Endpoint returns name and shipLine only. |
| 6 | Is a cruise catalog of exactly 100 points intended? | Yes: 79 + 15 + 6 = 100. Not enforced; the denominator follows the weights. |
