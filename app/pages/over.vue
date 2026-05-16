<script setup lang="ts">
const phases = [
  {
    name: 'Briefing',
    body: 'Een gesprek over vorm, gebruik en context. Soms is er al een bestand, soms een idee — beide werken.',
  },
  {
    name: 'Modelleren',
    body: 'We tekenen het object 3D in onze studio. Geen sjablonen — elk model is op maat van de briefing.',
  },
  {
    name: 'Printen',
    body: 'Lokaal, lagen van 0,1 tot 0,3 mm. We kiezen samen het materiaal dat past bij het gebruik.',
  },
  {
    name: 'Nabewerking',
    body: 'Schuren, polijsten, verzegelen — alleen waar het object er beter van wordt.',
  },
  {
    name: 'Verzending',
    body: 'Verpakt in herbruikbaar materiaal. Levering binnen 3–5 werkdagen in NL.',
  },
]

const materials = [
  {
    name: 'PLA',
    label: 'Mat, biobased',
    body: 'Gemaakt van plantaardige stoffen — composteerbaar onder industriële omstandigheden. Hoge resolutie en een matte, papierachtige afwerking. Werkt voor decoratieve objecten en binnen-toepassingen.',
  },
  {
    name: 'PETG',
    label: 'Sterk en glad',
    body: 'Een transparante variant van het materiaal in plastic flessen. Slijtvast, vochtbestendig en mooi met licht. Voor vazen, gebruiksvoorwerpen en objecten die af en toe buiten staan.',
  },
  {
    name: 'ASA',
    label: 'UV-bestendig',
    body: 'Houdt zijn kleur en sterkte ook in de zon. De juiste keuze voor buitenobjecten — plantenpotten, lampen, gevelornamenten.',
  },
]
</script>

<template>
  <div class="over">
    <section class="shell over__intro">
      <div class="over__copy">
        <h1 class="h1">
          Een studio die <span class="serif over__accent">maakt</span>.
        </h1>
        <p class="over__lead">
          MAAKM is een kleine 3D-printstudio in Raamsdonksveer. We ontwerpen en printen op
          bestelling — geen voorraad, geen verspilling. De catalogus is wat we zelf
          gemaakt hebben; het maatwerk is wat we voor anderen maken.
        </p>
        <div class="over__ctas">
          <NuxtLink to="/shop"><MBtn>Bekijk shop</MBtn></NuxtLink>
          <NuxtLink to="/maatwerk"
            ><MBtn variant="ghost">Iets op maat</MBtn></NuxtLink
          >
        </div>
      </div>
      <div class="over__hero">
        <img src="/hero-cover.png" alt="Op bestelling geprinte vaas" />
      </div>
    </section>

    <section id="proces" class="shell over__proces">
      <div class="over__section-head">
        <h2 class="h2">Hoe het gaat.</h2>
        <p class="over__section-lead">
          Een korte werkdag, een lange werkweek. Wat tussen de briefing en de
          verzending gebeurt:
        </p>
      </div>

      <div class="phases">
        <article v-for="p in phases" :key="p.name" class="phase">
          <h3 class="h3 phase__name">{{ p.name }}</h3>
          <p class="phase__body">{{ p.body }}</p>
        </article>
      </div>
    </section>

    <section id="materialen" class="shell over__materialen">
      <div class="over__section-head">
        <h2 class="h2">
          Drie materialen.
          <span class="serif over__accent">eindeloos.</span>
        </h2>
        <p class="over__section-lead">
          We kiezen op basis van gebruik, niet op basis van wat we op voorraad hebben.
          Vraag gerust om advies.
        </p>
      </div>

      <div class="mats">
        <article v-for="m in materials" :key="m.name" class="mat">
          <div class="mat__name mono">{{ m.name }}</div>
          <h3 class="h3 mat__label">{{ m.label }}</h3>
          <p class="mat__body">{{ m.body }}</p>
        </article>
      </div>
    </section>

    <section class="shell">
      <div class="cta">
        <div>
          <h2 class="h2 cta__title">
            Iets specifieks?
            <span class="serif cta__accent">wij printen het.</span>
          </h2>
          <p class="cta__body">
            Stuur een 3D-bestand of beschrijf wat je zoekt — we sturen een
            prijsindicatie binnen één werkdag.
          </p>
        </div>
        <NuxtLink to="/maatwerk"
          ><MBtn variant="accent" size="lg">Start een briefing</MBtn></NuxtLink
        >
      </div>
    </section>
  </div>
</template>

<style scoped>
.over > section {
  padding-top: var(--spacing-3xl);
}

.over__intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: end;
  padding-bottom: var(--spacing-3xl);
  border-bottom: 1px solid var(--color-line);
}

.over__copy {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 30ch;
}

.over__accent {
  color: var(--color-accent);
}

.over__lead {
  color: var(--color-ink-2);
  font-size: 17px;
  line-height: 1.55;
  max-width: 44ch;
}

.over__ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.over__ctas a {
  text-decoration: none;
}

.over__hero {
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-line-2);
  max-height: 520px;
}

.over__hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.over__section-head {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 48px;
  max-width: 50ch;
}

.over__section-lead {
  color: var(--color-ink-2);
  font-size: 16px;
  line-height: 1.6;
}

.phases {
  display: flex;
  flex-direction: column;
}

.phase {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  padding: 24px 0;
  border-top: 1px solid var(--color-line);
  align-items: start;
}

.phase:last-child {
  border-bottom: 1px solid var(--color-line);
}

.phase__name {
  letter-spacing: -0.02em;
}

.phase__body {
  color: var(--color-ink-2);
  font-size: 15px;
  line-height: 1.6;
  max-width: 56ch;
}

.mats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.mat {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  background: var(--color-paper);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
}

.mat__name {
  color: var(--color-ink-3);
  font-size: 12px;
}

.mat__label {
  letter-spacing: -0.02em;
}

.mat__body {
  color: var(--color-ink-2);
  font-size: 14px;
  line-height: 1.6;
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

@media (max-width: 1024px) {
  .over__intro {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .mats {
    grid-template-columns: 1fr;
  }
  .phase {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (max-width: 720px) {
  .cta {
    grid-template-columns: 1fr;
    padding: 32px;
  }
}
</style>
