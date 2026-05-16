<script setup lang="ts">
import {
    PRODUCTS_QUERY,
    type ShopifyProductsResponse,
    toProductCardData,
} from "~/utils/shopify";

const { shopifyFetch } = useShopify();

const { data, error } = await useAsyncData("home-featured", async () => {
    const res = await shopifyFetch<ShopifyProductsResponse>(PRODUCTS_QUERY, {
        first: 8,
    });
    return res.products.edges.map((e) => toProductCardData(e.node));
});

const products = computed(() => data.value ?? []);
const featured = computed(() => products.value.slice(0, 4));
const freshDrops = computed(() => products.value.slice(4, 8));

const materials = [
    {
        name: "PLA",
        label: "Mat, biobased",
        body: "Plantaardig, hoge resolutie, ideaal voor decoratieve objecten zonder zware belasting.",
    },
    {
        name: "PETG",
        label: "Sterk en glad",
        body: "Slijtvast en vochtbestendig — voor vazen, gebruiksvoorwerpen en lichte buitentoepassing.",
    },
    {
        name: "ASA",
        label: "UV-bestendig",
        body: "Houdt zijn kleur en sterkte in de zon. De juiste keuze voor buitenobjecten en plantenpotten.",
    },
];
</script>

<template>
    <div class="home">
        <section class="hero shell">
            <div class="hero__copy">
                <h1 class="h1">
                    Objecten van
                    <span class="serif hero__accent">echte</span>
                    kwaliteit.
                </h1>
                <p class="hero__lead">
                    Een gecureerde shop uit onze studio. Elk object wordt op
                    bestelling geprint in jouw kleur en materiaal — geen
                    voorraad, geen verspilling.
                </p>
                <div class="hero__ctas">
                    <NuxtLink to="/shop"
                        ><MBtn variant="accent">Bekijk shop</MBtn></NuxtLink
                    >
                    <NuxtLink to="/maatwerk"
                        ><MBtn variant="ghost">Iets op maat</MBtn></NuxtLink
                    >
                </div>
                <dl class="hero__stats">
                    <div>
                        <dt class="kicker">Levertijd</dt>
                        <dd>3–5 dagen</dd>
                    </div>
                    <div>
                        <dt class="kicker">Materialen</dt>
                        <dd>PLA · PETG · ASA</dd>
                    </div>
                    <div>
                        <dt class="kicker">Verzending vanaf</dt>
                        <dd>€4,95</dd>
                    </div>
                </dl>
            </div>

            <div class="hero__collage">
                <div class="hero__main">
                    <img
                        src="/hero-cover.png"
                        alt="Op bestelling geprinte vaas"
                    />
                </div>
                <div
                    class="hero__side hero__side--placeholder"
                    aria-hidden="true"
                />
                <div
                    class="hero__side hero__side--placeholder hero__side--moss"
                    aria-hidden="true"
                />
            </div>
        </section>

        <section class="shell">
            <MSectionHeader
                title="De favorieten"
                link-to="/shop"
                link-label="Bekijk alles"
            />

            <div v-if="error" class="state state--error">
                Fout bij ophalen producten: {{ error.message }}
            </div>

            <div v-else-if="featured.length === 0" class="state">
                Nog geen producten gevonden. Check of je product op ACTIVE staat
                en gepubliceerd is naar het Headless-kanaal.
            </div>

            <div v-else class="grid grid--4">
                <MProductCard v-for="p in featured" :key="p.id" :product="p" />
            </div>
        </section>

        <section class="shell materials">
            <div class="materials__title">
                <h2 class="h2">
                    Drie materialen.
                    <span class="serif materials__accent">eindeloos.</span>
                </h2>
                <p class="materials__body">
                    We kiezen het materiaal samen met jou — vorm, gebruik en
                    plek bepalen welke combinatie het beste werkt. Onderstaande
                    zijn onze drie standaarden.
                </p>
            </div>

            <div class="materials__grid">
                <article v-for="m in materials" :key="m.name" class="material">
                    <div class="material__name">{{ m.name }}</div>
                    <h3 class="h3 material__label">{{ m.label }}</h3>
                    <p class="material__body">{{ m.body }}</p>
                </article>
            </div>
        </section>

        <section v-if="freshDrops.length" class="shell">
            <MSectionHeader
                title="Net binnen"
                link-to="/shop"
                link-label="Catalogus"
            />
            <div class="grid grid--4">
                <MProductCard
                    v-for="p in freshDrops"
                    :key="p.id"
                    :product="p"
                />
            </div>
        </section>

        <section class="shell">
            <div class="cta">
                <div>
                    <h2 class="h2 cta__title">
                        Iets specifieks in gedachten?
                        <span class="serif cta__accent">wij printen het.</span>
                    </h2>
                    <p class="cta__body">
                        Lever een 3D-bestand of beschrijf wat je zoekt — we
                        lopen het samen door en sturen een prijsindicatie binnen
                        één werkdag.
                    </p>
                </div>
                <NuxtLink to="/maatwerk"
                    ><MBtn variant="accent" size="lg"
                        >Start een briefing</MBtn
                    ></NuxtLink
                >
            </div>
        </section>

        <MMarquee
            :items="[
                'Op bestelling geprint',
                'Levertijd 3–5 dagen',
                'Gratis verzending vanaf €50',
                'Geen voorraad, geen verspilling',
                'Lokaal · Raamsdonksveer',
            ]"
        />
    </div>
</template>

<style scoped>
.home > section {
    padding-top: var(--spacing-3xl);
}

.hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: end;
    padding-bottom: var(--spacing-3xl);
}

.hero__copy {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 18ch;
}

.hero__copy .h1 {
    max-width: 14ch;
}

.hero__accent {
    color: var(--color-accent);
}

.hero__lead {
    max-width: 42ch;
    color: var(--color-ink-2);
    font-size: 17px;
    line-height: 1.55;
}

.hero__ctas {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.hero__ctas a {
    color: inherit;
    text-decoration: none;
}

.hero__stats {
    display: flex;
    gap: 32px;
    margin-top: 18px;
    flex-wrap: wrap;
}

.hero__stats > div {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-top: 1px solid var(--color-line);
    padding-top: 12px;
    min-width: 140px;
}

.hero__stats dd {
    font-size: 16px;
    font-weight: 500;
}

.hero__collage {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 16px;
    height: 560px;
}

.hero__main {
    grid-row: 1 / -1;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-line-2);
}

.hero__main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero__side {
    border-radius: var(--radius-md);
    overflow: hidden;
}

.hero__side--placeholder {
    background:
        repeating-linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.03) 0 2px,
            transparent 2px 14px
        ),
        linear-gradient(135deg, #e8e3d6, #ddd6c5);
}

.hero__side--moss {
    background:
        repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.05) 0 2px,
            transparent 2px 14px
        ),
        linear-gradient(135deg, #3a4a37, var(--color-accent-2));
}

.grid {
    display: grid;
    gap: 24px;
}

.grid--4 {
    grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
    .grid--4 {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 720px) {
    .grid--4 {
        grid-template-columns: repeat(2, 1fr);
    }
    .hero {
        grid-template-columns: 1fr;
    }
    .hero__collage {
        height: 360px;
    }
}

.state {
    padding: 32px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-md);
    color: var(--color-ink-2);
    background: var(--color-paper);
}

.state--error {
    border-color: var(--color-accent);
    color: var(--color-accent);
}

.materials {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: start;
}

.materials__title {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.materials__accent {
    color: var(--color-accent);
}

.materials__body {
    color: var(--color-ink-2);
    max-width: 50ch;
    font-size: 16px;
    line-height: 1.55;
}

.materials__grid {
    display: flex;
    flex-direction: column;
}

.material {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 24px;
    padding: 24px 0;
    border-top: 1px solid var(--color-line);
}

.material:last-child {
    border-bottom: 1px solid var(--color-line);
}

.material__name {
    font-family: var(--font-mono);
    font-size: 13px;
    letter-spacing: 0.06em;
    color: var(--color-ink-3);
    padding-top: 4px;
}

.material__label {
    margin-bottom: 6px;
}

.material__body {
    color: var(--color-ink-2);
    font-size: 15px;
    line-height: 1.55;
    max-width: 48ch;
}

@media (max-width: 720px) {
    .materials {
        grid-template-columns: 1fr;
    }
    .material {
        grid-template-columns: 1fr;
        gap: 8px;
    }
}

.cta {
    display: grid;
    grid-template-columns: 1.4fr auto;
    gap: 32px;
    align-items: center;
    padding: 56px;
    background: var(--color-bg-2);
    border-radius: var(--radius-lg);
}

.cta__title {
    max-width: 22ch;
}

.cta__accent {
    color: var(--color-accent);
}

.cta__body {
    color: var(--color-ink-2);
    margin-top: 14px;
    max-width: 50ch;
    font-size: 16px;
    line-height: 1.55;
}

.cta a {
    text-decoration: none;
}

@media (max-width: 720px) {
    .cta {
        grid-template-columns: 1fr;
        padding: 32px;
    }
}
</style>
