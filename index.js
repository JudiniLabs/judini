const JUDINI_TUTORIAL = 'https://docs.codegpt.co/docs/tutorial-ai-providers/judini'

export class CodeGPTPlus {
  constructor (apiKey) {
    this.apiKey = apiKey
    this.isStreaming = false
  }

  isLoading () {
    return this.isStreaming
  }

  stopStreaming () {
    this.isStreaming = false
  }

  async chatCompletion ({ messages, agentId = '' }, callback = () => {
  }) {
    this.isStreaming = true

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      let fullResponse = ''

      const body = {
        messages
      }

      const response = await fetch(agentId ? `https://plus.codegpt.co/api/v1/agent/${agentId}` : 'https://plus.codegpt.co/api/v1/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.apiKey
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
        throw new Error(errorMessage)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        const text = decoder.decode(value)
        if (text.includes('data: [DONE]')) {
          this.isStreaming = false
          resolve(fullResponse)
          break
        }
        try {
          const datas = text.split('\n\n')
          for (let i = 0; i < datas.length; i++) {
            const data = JSON.parse(datas[i].replace('data: ', ''))
            callback(data.data)
            fullResponse += data.data
          }
        } catch {}
      }
    })
  }

  async getAgents () {
    const response = await fetch('https://plus.codegpt.co/api/v1/agent', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.apiKey
      }
    })

    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  async getAgent (agentId) {
    const response = await fetch(`https://plus.codegpt.co/api/v1/agent/${agentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.apiKey
      }
    })
    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }
    return (await response.json())[0]
  }
}
