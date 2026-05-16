<script setup lang="ts">
type Briefing = {
  name: string
  email: string
  projectType: string
  quantity: number
  material: string
  color: string
  description: string
  reference: string
  budget: string
}

const initial = (): Briefing => ({
  name: '',
  email: '',
  projectType: 'Vaas',
  quantity: 1,
  material: 'Geen voorkeur',
  color: '',
  description: '',
  reference: '',
  budget: '',
})

const form = reactive<Briefing>(initial())
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref<string | null>(null)

function reset() {
  Object.assign(form, initial())
  submitted.value = false
  submitError.value = null
}

async function submit() {
  submitError.value = null
  if (!form.name.trim() || !form.email.trim() || !form.description.trim()) {
    submitError.value = 'Naam, e-mail en omschrijving zijn verplicht.'
    return
  }
  submitting.value = true
  try {
    // Phase 4b: log the briefing — actual delivery (email / CRM) wires up later.
    // eslint-disable-next-line no-console
    console.log('briefing-submit', { ...form })
    await new Promise((r) => setTimeout(r, 400))
    submitted.value = true
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Versturen mislukt.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mw shell">
    <header class="mw__header">
      <h1 class="h1">
        Iets <span class="serif mw__accent">specifieks</span>?
      </h1>
      <p class="mw__lead">
        Stuur ons een briefing — een paar zinnen over wat je zoekt, het gebruik, en
        eventueel een referentiebeeld of 3D-bestand. We sturen binnen één werkdag een
        prijsindicatie en een eerste reactie.
      </p>
    </header>

    <div class="mw__grid">
      <aside class="mw__aside">
        <h2 class="h3">Wat we nodig hebben</h2>
        <ul class="mw__list">
          <li>
            <MIcon name="check" :size="16" />
            <span>Een omschrijving van het object — vorm, gebruik, plek.</span>
          </li>
          <li>
            <MIcon name="check" :size="16" />
            <span>Maten of een grof formaat (lengte × breedte × hoogte).</span>
          </li>
          <li>
            <MIcon name="check" :size="16" />
            <span>Eventueel een 3D-bestand (.stl, .obj) of een referentiebeeld.</span>
          </li>
          <li>
            <MIcon name="check" :size="16" />
            <span>Een datum of deadline, als die er is.</span>
          </li>
        </ul>

        <div class="mw__note">
          <div class="kicker">Geen 3D-bestand?</div>
          <p>
            Geen probleem. Met een schets of een paar foto's modelleren wij het object
            voor je. Dat zit in de prijsindicatie.
          </p>
        </div>
      </aside>

      <section class="mw__form-wrap">
        <div v-if="submitted" class="mw__done">
          <div class="kicker mw__done-kicker">Verstuurd</div>
          <h2 class="h2">
            Dank<span class="serif mw__accent"> — we lezen mee.</span>
          </h2>
          <p>
            Je hoort binnen één werkdag van ons op
            <strong>{{ form.email }}</strong
            >. Tot snel.
          </p>
          <div class="mw__done-cta">
            <NuxtLink to="/shop"><MBtn>Bekijk shop</MBtn></NuxtLink>
            <MBtn variant="ghost" @click="reset">Nieuwe briefing</MBtn>
          </div>
        </div>

        <form v-else class="mw__form" @submit.prevent="submit">
          <div class="mw__row">
            <MField label="Naam">
              <input v-model="form.name" type="text" required placeholder="Voornaam Achternaam" />
            </MField>
            <MField label="E-mailadres">
              <input v-model="form.email" type="email" required placeholder="naam@voorbeeld.nl" />
            </MField>
          </div>

          <div class="mw__row">
            <MField label="Type project">
              <select v-model="form.projectType">
                <option>Vaas</option>
                <option>Plantenpot</option>
                <option>Lamp</option>
                <option>Object</option>
                <option>Onderdeel</option>
                <option>Iets anders</option>
              </select>
            </MField>
            <MField label="Aantal">
              <input v-model.number="form.quantity" type="number" min="1" max="500" />
            </MField>
          </div>

          <div class="mw__row">
            <MField label="Voorkeur materiaal">
              <select v-model="form.material">
                <option>Geen voorkeur</option>
                <option>PLA</option>
                <option>PETG</option>
                <option>ASA</option>
              </select>
            </MField>
            <MField label="Voorkeur kleur">
              <input v-model="form.color" type="text" placeholder="Bijv. terracotta, antraciet" />
            </MField>
          </div>

          <MField label="Omschrijving" hint="Wat zoek je, waar gaat het staan, hoe wordt het gebruikt?">
            <textarea
              v-model="form.description"
              required
              placeholder="Een vaas van ongeveer 25cm hoog voor op de eettafel, in een warme tint…"
            />
          </MField>

          <div class="mw__row">
            <MField label="Referentie (URL)" hint="Bestandsdeel, Dropbox, WeTransfer">
              <input
                v-model="form.reference"
                type="url"
                placeholder="https://…"
              />
            </MField>
            <MField label="Indicatief budget" hint="Optioneel">
              <input v-model="form.budget" type="text" placeholder="Bijv. €100" />
            </MField>
          </div>

          <div v-if="submitError" class="mw__error">{{ submitError }}</div>

          <div class="mw__submit">
            <MBtn variant="accent" size="lg" type="submit" :loading="submitting">
              {{ submitting ? 'Versturen…' : 'Verstuur briefing' }}
            </MBtn>
            <span class="mw__assurance">Antwoord binnen één werkdag.</span>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.mw {
  padding-top: var(--spacing-3xl);
  padding-bottom: var(--spacing-3xl);
}

.mw__header {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--color-line);
  margin-bottom: 56px;
}

.mw__accent {
  color: var(--color-accent);
}

.mw__lead {
  color: var(--color-ink-2);
  font-size: 17px;
  line-height: 1.55;
  max-width: 56ch;
}

.mw__grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 56px;
  align-items: start;
}

.mw__aside {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mw__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0;
  color: var(--color-ink-2);
  font-size: 15px;
  line-height: 1.55;
}

.mw__list li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.mw__list li :first-child {
  color: var(--color-accent);
  flex-shrink: 0;
  margin-top: 3px;
}

.mw__note {
  background: var(--color-bg-2);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--color-ink-2);
  font-size: 14px;
  line-height: 1.55;
}

.mw__form-wrap {
  background: var(--color-paper);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 32px;
}

.mw__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mw__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.mw__error {
  font-size: 13px;
  color: var(--color-accent);
  padding: 10px 14px;
  background: rgba(214, 90, 49, 0.08);
  border: 1px solid rgba(214, 90, 49, 0.3);
  border-radius: var(--radius-sm);
}

.mw__submit {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
}

.mw__assurance {
  color: var(--color-ink-3);
  font-size: 13px;
}

.mw__done {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mw__done-kicker {
  color: var(--color-accent);
}

.mw__done-cta {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.mw__done-cta a {
  text-decoration: none;
}

@media (max-width: 1024px) {
  .mw__grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .mw__aside {
    position: static;
  }
}

@media (max-width: 600px) {
  .mw__row {
    grid-template-columns: 1fr;
  }
  .mw__form-wrap {
    padding: 24px;
  }
}
</style>
