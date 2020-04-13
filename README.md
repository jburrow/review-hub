# review-hub

a browser based, version control agnostic, code review tool

# Why?

Great quesiton, been pondering this myself. In world where github exists this amy seem a bit odd, pointless. It is, in some regards.

However, consider this use-case.

"I am a developer using SVN - i want a pull request review flow like git + github users without having to migrate off SVN"

With a thin API to initialize a "pull request", and similiar api to "rebase it". This tool attempts to fill in a tools gap for developers using older version control system.

# Demo

Check out the demo page - https://jburrow.github.io/review-hub/dist/

# Features

- Ability to browse all commits, and file revisions
- Ability to diff between file revisions
- Ability to edit the file and stage the change
- Ability to comment on code and stage the comment
- Ability to generally comment on the code [ not at file level]

# Approach

The whole state is managed as a event-source. The current state calculated by reducing the events. All events are immutable. This project heavily leverages monaco-review and monaco, these libraries combined give a powerful way to view, edit and comment on source-code.

There are 3 main domains with-in the application. Each one has their own event types and reducer. - Comments - Version-Control - Application Interactions

These 3 domains of state are combined into the application state|store in the root of the application.

The view is written with react, and everything is a functional component with hooks.

# Notes

NOTE: I am using the "domain language" of git but it has no parity with git in terms of version-control features. The event-source|reducers for version control only support a very simple linear flow. The conclusion of a review cycle, a developer would download|export their code-change and commit them back to SVN.

NOTE: This tool is client-side only, you will need to implement a simple interface for persistence and implement the end-point yourself. This avoids much of the complexity around intellilectual property and ownership associated with code in corporate environments

In due course, i will publish a reference implementation of the API.
