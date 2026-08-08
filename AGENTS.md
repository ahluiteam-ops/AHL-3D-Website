# Shared project memory

This repository is worked on by both Codex and Claude. Before making changes,
read `PROJECT-CONTEXT.md` completely, then read the relevant parts of
`README.md` and the source files for the task.

`PROJECT-CONTEXT.md` is the canonical cross-assistant handoff. After every
meaningful task, update it before replying to the user:

1. Correct any stale statements in the current-state or outstanding-work sections.
2. Append a dated entry to the work log with the request, outcome, files/assets
   changed, important decisions or mappings, verification performed, and any
   remaining issue.
3. Record enough detail for the other assistant to continue without asking the
   user to repeat project history.
4. Preserve existing history. Do not replace the file with a short summary.
5. Never store credentials, tokens, private keys, or hidden model reasoning.

If code and documentation disagree, inspect the code and update the shared
context to reflect the verified current state.
