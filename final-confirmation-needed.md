# Halal ratings v2: final confirmation needed

Only what is still open. Everything else is decided and built (history is in
`questions-for-project-manager.md` and `rating-v2-confirmation.md`).

Closed by the latest product manager reply (no further action):
- Common Parameters and all parameters are added by the admin on the parameter screens (built; nothing hardcoded).
- Mandatory-for-class and the points for each parameter are set by the admin on those screens (built; nothing hardcoded).
- 100-point cap: restored for restaurant and cruise parameters (built). Hotels already had it.
- Null class: no badge, only the score.
- Public activities page now lists every activity, not only those with a manager (built, including the custom holiday builder).
- Admin activity list has a Category column (built; confirmed it is the activity's own category).
- Activity 100-point cap: Common Parameters plus any one subcategory cannot total more than 100 (built).
- Report panel text for restaurant, cruise and activity is a neutral HalalExplore default (built); hotels keep their own text.
- Activities with no score (0%) stay hidden: the server hides them and the site now filters them out too (decided after the earlier "show them" answer). No backend change is needed.

## A. Product manager

Nothing open. Their last answers are built (see the closed list above).

## B. Backend

| # | Question | Answer |
| --- | --- | --- |
| 1 | `POST /admin/activity-halal-ratings` accepts `rating: 0`, but `PATCH` with `rating: 0` returns 403 `validationErrors.rating = "rating is required"`. The spec says "at least 0". The dashboard now requires points above 0 on create and edit for activity, restaurant and cruise parameters, so both calls agree. Please confirm 0 points is not meant to be allowed (or fix `PATCH` to accept 0). | |

## C. Testing and access (needs people, not code)

| # | Question | Answer |
| --- | --- | --- |
| 1 | Write tests: DONE on the live API (all `ZZ-TEST` records removed; real records re-saved unchanged and identical afterwards), including the cruise parameter edit and delete. Not tested: creating a cruise parameter from the screen (blocked by design while the catalog is at 100), and other roles. Is that enough? | |
| 2 | Test accounts for admin, employee and manager, plus one user with `activity-all`, `cruise-all` or `restaurant-all`, to check menus and the rating star. | |
| 3 | The backend lets a record's assigned manager save scores without the "update halal ratings" permission, but the admin shows the rating star only with that permission. Should the star also show for the assigned manager of each record? | |

## D. Concerns (no answer needed, for awareness)

| # | Concern |
| --- | --- |
| 1 | **Slow filtering on the booking site.** Choosing a halalness band on the restaurant page replaces the page with a full loader while it refetches; one test took over a minute. Existing behaviour, not traced to the server or the page. |
| 2 | **Empty halalness bands.** The lowest restaurant is 48% and all 31 cruise packages are 76-98%, so the lower bands are mostly empty. This follows the data. |
| 3 | **More activities now visible.** Removing the manager rule lists activities that were hidden before (for example Riyadh went from 0 to 8). Some may be missing prices or images; this has only been spot-checked. |
| 4 | **Lint.** Dashboard: no real problems, only style warnings and the project-wide `v-slot` pattern errors. Booking site: not linted. |
| 5 | **Browser coverage.** Everything on the public site was checked on a desktop browser with a resized window. The unrated-ship message was checked with a browser-only simulation, because no real package is on an unrated ship. Real phones and other browsers were not tested. |
