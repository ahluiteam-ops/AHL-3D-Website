# Claude project instructions

Codex and Claude share this project. Read `PROJECT-CONTEXT.md` completely at
the beginning of each task; it is the canonical project memory and handoff.
Also consult the relevant section of `README.md` and the source files involved.

Before finishing every meaningful task, update `PROJECT-CONTEXT.md`:

1. Fix stale current-state and outstanding-work notes.
2. Append a dated work-log entry covering the user's request, the result,
   files/assets changed, important decisions or mappings, checks run, and any
   unfinished item.
3. Preserve the existing history and leave enough detail for Codex to resume
   without asking the user to explain previous work again.
4. Do not store secrets, credentials, or hidden model reasoning.

When the context conflicts with the implementation, verify the implementation
and bring the context up to date.
