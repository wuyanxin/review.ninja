# Webhooks

This guide will detail which GitHub webhooks ReviewNinja uses to trigger actions, what those actions are, 
and how you may test these webhooks locally.

## General

A webhook is added to a repo in one of two ways:
1) a user with admin access adds ReviewNinja to his repos
2) a user with admin access clicks on the 'add webhook' button

This webhook looks like this:
```
http://app.review.ninja/github/webhook/:id
```

Where id is the ReviewNinja id of the user who added the webhook. This id is used later to retrieve the 
necessary credentials in order toperform administrative 
tasks (such as updating the PR status) when the webhook is activated.
