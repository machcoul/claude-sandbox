import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from './App.vue'
import { supabase } from './lib/supabase'

// On mocke intégralement le client Supabase : AUCUN appel réseau ni base réelle.
// `from()` est un vi.fn() qu'on configure test par test dans beforeEach.
vi.mock('./lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

let orderMock
let selectMock
let insertMock

// Prépare la chaîne d'appels Supabase utilisée par App.vue :
//   from('messages').select('*').order(...)      -> lecture
//   from('messages').insert({...})               -> écriture
function setupSupabase({ messages = [], selectError = null, insertError = null } = {}) {
  orderMock = vi.fn().mockResolvedValue({ data: messages, error: selectError })
  selectMock = vi.fn(() => ({ order: orderMock }))
  insertMock = vi.fn().mockResolvedValue({ error: insertError })
  supabase.from.mockReturnValue({ select: selectMock, insert: insertMock })
}

beforeEach(() => {
  vi.clearAllMocks()
  setupSupabase()
})

describe('Livre d’or — formulaire', () => {
  it('affiche les champs nom + message et le bouton Signer', async () => {
    const wrapper = mount(App)
    await flushPromises()

    // Champ nom
    const nameInput = wrapper.find('input[type="text"]')
    expect(nameInput.exists()).toBe(true)

    // Champ message
    const messageInput = wrapper.find('textarea')
    expect(messageInput.exists()).toBe(true)

    // Bouton de soumission
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Signer')
  })
})

describe('Livre d’or — liste des messages', () => {
  it('affiche correctement la liste à partir des données fournies', async () => {
    setupSupabase({
      messages: [
        { id: 1, author: 'Alice', content: 'Bonjour !', created_at: '2026-01-01T10:00:00Z' },
        { id: 2, author: null, content: 'Message anonyme', created_at: '2026-01-02T12:00:00Z' },
      ],
    })

    const wrapper = mount(App)
    await flushPromises()

    const articles = wrapper.findAll('article.message')
    expect(articles).toHaveLength(2)

    // Contenu des messages
    expect(wrapper.text()).toContain('Bonjour !')
    expect(wrapper.text()).toContain('Message anonyme')

    // Auteur affiché, et fallback « Anonyme » quand author est null
    expect(articles[0].text()).toContain('Alice')
    expect(articles[1].text()).toContain('Anonyme')
  })

  it('affiche l’état vide quand aucun message n’est fourni', async () => {
    setupSupabase({ messages: [] })

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.find('.empty').exists()).toBe(true)
    expect(wrapper.findAll('article.message')).toHaveLength(0)
  })
})

describe('Livre d’or — soumission', () => {
  it('déclenche l’appel d’insertion Supabase avec les valeurs saisies', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find('input[type="text"]').setValue('Bob')
    await wrapper.find('textarea').setValue('Super livre d’or')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // L'insertion a bien été appelée, une seule fois, avec les bonnes données
    expect(insertMock).toHaveBeenCalledTimes(1)
    expect(insertMock).toHaveBeenCalledWith({
      author: 'Bob',
      content: 'Super livre d’or',
    })
  })

  it('n’insère rien quand le message est vide', async () => {
    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find('input[type="text"]').setValue('Bob')
    // message laissé vide
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(insertMock).not.toHaveBeenCalled()
  })
})
