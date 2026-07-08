<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabase'

const author = ref('')
const content = ref('')
const messages = ref([])
const loading = ref(false)
const submitting = ref(false)
const errorMsg = ref('')

async function loadMessages() {
  loading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    errorMsg.value = error.message
  } else {
    messages.value = data
  }
  loading.value = false
}

async function sign() {
  if (!content.value.trim()) return
  submitting.value = true
  errorMsg.value = ''

  const { error } = await supabase.from('messages').insert({
    author: author.value.trim() || null,
    content: content.value.trim(),
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    author.value = ''
    content.value = ''
    await loadMessages()
  }
  submitting.value = false
}

function formatDate(value) {
  return new Date(value).toLocaleString('fr-FR')
}

onMounted(loadMessages)
</script>

<template>
  <main class="page">
    <h1>📖 Livre d'or</h1>

    <form class="card form" @submit.prevent="sign">
      <label>
        Nom
        <input v-model="author" type="text" placeholder="Votre nom (facultatif)" />
      </label>
      <label>
        Message
        <textarea v-model="content" rows="3" placeholder="Laissez un message…" required></textarea>
      </label>
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Envoi…' : 'Signer' }}
      </button>
    </form>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <section class="messages">
      <p v-if="loading">Chargement…</p>
      <p v-else-if="messages.length === 0" class="empty">
        Aucun message pour l'instant. Soyez le premier à signer !
      </p>
      <article v-for="m in messages" :key="m.id" class="card message">
        <header>
          <strong>{{ m.author || 'Anonyme' }}</strong>
          <time>{{ formatDate(m.created_at) }}</time>
        </header>
        <p>{{ m.content }}</p>
      </article>
    </section>
  </main>
</template>
