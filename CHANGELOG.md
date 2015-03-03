# 1.1.0

## Features

- **thresholds**: you can now set the number of required ninja stars in order to achieve 
a successful status.
- **disable PR comments**: if you find these annoying, head over to settings and disable!
- **team view**: we have a new "team tab", see who has the most ninja stars, merged the 
most PRs, or invite your collaborators to join you in ReviewNinja.
- **control github permission scopes**: you can now explicitly set ReviewNinja to review 
only pulic or public AND private repos. (Default: public-only)
- **.ninjaignore**: works just like your ``.gitignore`` file. Any file patterns listed
here will be ignored by ReviewNinja. (We just hide the diff by default, you can still 
expand and review, if desired)

## Bug Fixes

Fixes a nasty bug where some users were unable to create issues on PRs. When a user opens
an issue in ReviewNinja we simulateously open a milestone as a "container" for all issues
relating to the PR. Sometimes, a milestone would be removed from GitHub and on the next
PR we would try to create a milestone that violates our unique index.

In order to resolve this issue we now store the milestone id as the unique identifier.

**Note for ReviewNinja enterprise users**: If you update to ReviewNinja 1.1.0 be sure to
reinstall all dependances with ``npm install``. We have implemented a migration strategy
(described in more detail below) which will automatically be applied to your persistence 
on app startup.

## Migrations

Release 1.1.0 introduces our migrations strategy. We are using 
[mongo migrate](https://github.com/afloyd/mongo-migrate)'s programmatic API to 
automatically apply any available migrations against the peristence layer. Migrations
are only applied if they have not already been applied, and only if the migration
file exists. 

Please refer to [app.js](https://github.com/reviewninja/review.ninja/blob/master/src/server/app.js#L139) 
to see how we are doing this.
