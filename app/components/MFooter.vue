<script setup lang="ts">
type FooterLink = { to: string; label: string };
type FooterColumn = { title: string; links: FooterLink[] };

withDefaults(
    defineProps<{
        columns?: FooterColumn[];
        tagline?: string;
    }>(),
    {
        tagline:
            "Een gecureerde shop van de studio. Op bestelling geprint in jouw kleur en materiaal — geen voorraad, geen verspilling.",
        columns: () => [
            {
                title: "Shop",
                links: [
                    { to: "/shop", label: "Alle producten" },
                    { to: "/collecties", label: "Collecties" },
                    { to: "/maatwerk", label: "Maatwerk" },
                ],
            },
            {
                title: "Studio",
                links: [
                    { to: "/over", label: "Over" },
                    { to: "/over#proces", label: "Proces" },
                    { to: "/over#materialen", label: "Materialen" },
                ],
            },
            {
                title: "Klantenservice",
                links: [
                    { to: "/verzending", label: "Verzending" },
                    { to: "/retour", label: "Retour" },
                    { to: "/contact", label: "Contact" },
                ],
            },
        ],
    },
);

const year = new Date().getFullYear();
</script>

<template>
    <footer class="footer">
        <div class="shell">
            <div class="footer__grid">
                <div class="footer__brand">
                    <NuxtLink to="/" class="footer__wordmark"
                        >MAAKM<span class="footer__dot">.</span>shop</NuxtLink
                    >
                    <p class="footer__tagline">{{ tagline }}</p>
                </div>

                <div
                    v-for="col in columns"
                    :key="col.title"
                    class="footer__col"
                >
                    <h5 class="footer__title">{{ col.title }}</h5>
                    <ul class="footer__list">
                        <li v-for="link in col.links" :key="link.to">
                            <NuxtLink :to="link.to" class="footer__link">{{
                                link.label
                            }}</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="footer__bottom">
                <span>© {{ year }} MAAKM Studio · Raamsdonksveer</span>
                <span>Op bestelling geprint · NL</span>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background: var(--color-bg-2);
    border-top: 1px solid var(--color-line);
    margin-top: var(--spacing-3xl);
}

.footer__grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 32px;
    padding: 60px 0 32px;
}

.footer__brand {
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 36ch;
}

.footer__wordmark {
    font-weight: 600;
    letter-spacing: -0.02em;
    font-size: 18px;
    color: var(--color-ink);
}
.footer__dot {
    color: var(--color-accent);
}

.footer__tagline {
    color: var(--color-ink-2);
    font-size: 14px;
    line-height: 1.55;
}

.footer__title {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    margin-bottom: 14px;
    font-weight: 500;
}

.footer__list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.footer__link {
    font-size: 14px;
    color: var(--color-ink-2);
    transition: color var(--duration-fast) ease;
}
.footer__link:hover {
    color: var(--color-ink);
}

.footer__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
    border-top: 1px solid var(--color-line);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-3);
}

@media (max-width: 720px) {
    .footer__grid {
        grid-template-columns: 1fr 1fr;
        gap: 28px 20px;
    }
    .footer__brand {
        grid-column: 1 / -1;
    }
}
</style>
