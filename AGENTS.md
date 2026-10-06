<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Frontend-only MVP: data access goes through src/services/* (mock/localStorage now), so a future Supabase swap touches only services.
- Page UI lives in src/pages; files in src/routes stay thin (head + loader + page component).
- Brand files live as real files in public/brand and are referenced by path, never inlined.
- All purchase buttons use HOTMART_CHECKOUT_URL from src/config/checkout.ts.
