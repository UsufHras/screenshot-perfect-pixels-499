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

## Architecture rules

- Storefront content the admin edits lives in database tables read through public server functions (see `src/lib/products.functions.ts` + `src/lib/use-products.ts`); static sample data in `src/lib/data.ts` is only a fallback for the cart while products load. Keep this pattern when adding admin-managed services, articles, or settings.
- Product photos are stored in the private `products` storage bucket and served through the public read-only route `/api/public/product-image?path=<object-path>`; do not reference storage paths directly in `<img>` tags.
