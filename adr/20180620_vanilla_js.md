# Vanilla javascript

## Summary

Architecture Decision : Vanilla javascript.

Date : 20/06/2018.

Stakeholder involved in the decision : khrys63.

In the context of javascript development and facing multiple existing JS framework we decided to code this app with vanilla JS and JQuery (just for DOM manipuling and AJAX).

Status of decision : accepted.

## Context

We want manipulate DOM, templatize <Table> and call a RestWS.

We can choose AngularJS, Vue.js or just code that in vanilla Javascript.

## Solution 

We choose to write a simple internal TemplateEngine.

## Consequences

We don't need skills in a specific JS framework.
