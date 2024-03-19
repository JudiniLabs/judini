const baseUrl = 'https://api-beta.codegpt.co/api/v1'
const JUDINI_TUTORIAL = 'https://api-beta.codegpt.co/api/v1/docs'
export class CodeGPTPlus {
  constructor({ apiKey, orgId }) {
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
      source: 'api',
      channel: 'sdk-js',
      ...(orgId && { 'CodeGPT-Org-Id': orgId })
    }
    this.isStreaming = false
  }

  isLoading() {
    return this.isStreaming
  }

  stopStreaming() {
    this.isStreaming = false
  }

  /**
   * Initiates a chat with the specified agent and handles the streaming of responses.
   *
   * @param {Object} params - The parameters for the chat.
   * @param {Array<Object>} params.messages - An array of message objects to be sent to the agent. Each object should have a `role` (which can be 'system', 'user', or 'assistant') and `content` which is the actual message.   * @param {string} params.agentId - The ID of the agent to chat with.
   * @param {Function} [callback=(chunk) => {}] - An optional callback function to handle streaming responses.
   * @returns {Promise<string>} The full response from the chat.
   * @throws {Error} If the API response is not ok.
   */
  async chatCompletion({ messages, agentId }, callback = () => {}) {
    if (messages.length === 0) {
      throw new Error('JUDINI: messages array should not be empty')
    }

    if (!agentId) {
      throw new Error('JUDINI: agentId should not be empty')
    }

    this.isStreaming = true

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      let fullResponse = ''

      const body = {
        agentId,
        stream: true,
        format: 'json',
        messages
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
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
          this.isStreaming = false
          resolve(fullResponse)
          break
        }
        const decoded = decoder.decode(value)
        const data = JSON.parse(decoded)
        const text = data.choices[0].delta.content
        callback(text)
        fullResponse += text
        // if (text.includes('data: [DONE]')) {
        //   this.isStreaming = false
        //   resolve(fullResponse)
        //   break
        // }
        // const datas = text.split('\n\n')
        // for (let i = 0; i < datas.length; i++) {
        //   try {
        //     const data = JSON.parse(datas[i].replace('data: ', ''))
        //     const text = data.choices[0].delta.content
        //     callback(text)
        //     fullResponse += text
        //   } catch {}
        // }
      }
    })
  }

  /**
   * Initiates a chat with the specified agent and handles the streaming of responses using a ReadableStream.
   *
   * @param {Object} params - The parameters for the chat.
   * @param {Array<Object>} params.messages - An array of message objects to be sent to the agent. Each object should have a `role` (which can be 'system', 'user', or 'assistant') and `content` which is the actual message.
   * @param {string} params.agentId - The ID of the agent to chat with.
   * @returns {ReadableStream} A ReadableStream that emits the responses from the chat.
   * @throws {Error} If the API response is not ok.
   */
  async experimental_AIStream({ messages, agentId }) {
    if (messages.length === 0) {
      throw new Error('JUDINI: messages array should not be empty')
    }

    if (!agentId) {
      throw new Error('JUDINI: agentId should not be empty')
    }

    this.isStreaming = true

    const body = {
      agentId,
      stream: true,
      format: 'json',
      messages
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    const encoder = new TextEncoder()

    return new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            controller.close()
            return
          }
          const data = decoder.decode(value)
          const chunks = data.split('\n\n')
          for (const chunk of chunks) {
            try {
              if (!chunk) continue
              const json = JSON.parse(chunk.trim().replace('data: ', ''))
              const message = json?.choices?.[0]?.delta?.content
              if (message) {
                controller.enqueue(encoder.encode(message))
              }
            } catch {}
          }
        }
      },
      cancel() {
        reader.releaseLock()
      }
    })
  }

  /**
   * Retrieves a list of all the agents from the CodeGPTPlus API.
   *
   * @returns {Promise<Array<{
   *   status: string,
   *   name: string,
   *   documentId: string[],
   *   description: string,
   *   prompt: string,
   *   topk: number,
   *   model: string,
   *   welcome: string,
   *   maxTokens: number,
   *   id: string,
   *   user_created: string,
   *   date_created: string
   * }>>} An array of objects, each representing an agent.
   */
  async getAgents() {
    const response = await fetch(`${baseUrl}/agent`, {
      method: 'GET',
      headers: this.headers
    })

    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  /**
   * Retrieves a specific agent from the CodeGPTPlus API.
   *
   * @param {string} agentId - The ID of the agent you want to retrieve from the CodeGPTPlus API.
   * @returns {Promise<{
   *   status: string,
   *   name: string,
   *   documentId: string[],
   *   description: string,
   *   prompt: string,
   *   topk: number,
   *   model: string,
   *   welcome: string,
   *   maxTokens: number,
   *   id: string,
   *   user_created: string,
   *   date_created: string
   * }>} An object containing details about the agent.
   */
  async getAgent(agentId) {
    const response = await fetch(`${baseUrl}/agent/${agentId}`, {
      method: 'GET',
      headers: this.headers
    })
    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }
    return await response.json()
  }

  /**
   * Creates a new agent in the CodeGPTPlus API.
   *
   * @param {Object} agent - The agent object to be created.
   * @param {string} agent.name - The name of the agent.
   * @param {number} agent.topk - The number of tokens to consider for each step.
   * @param {string} agent.model - The model to be used by the agent. For example, 'gpt-3.5-turbo'.
   * @param {string} agent.welcome - The welcome message of the agent.
   * @param {string} agent.prompt - The prompt of the agent.
   * @returns {Promise<Object>} The created agent object.
   * @throws {Error} If the API response is not ok.
   */
  async createAgent(agent) {
    const response = await fetch(`${baseUrl}/agent`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(agent)
    })
    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }
    return await response.json()
  }

  /**
   * Updates an existing agent in the CodeGPTPlus API.
   *
   * @param {string} agentId - The ID of the agent to be updated.
   * @param {Object} agent - The agent object with updated values.
   * @param {string} [agent.name] - The updated name of the agent.
   * @param {string} [agent.model] - The updated model to be used by the agent. For example, 'gpt-3.5-turbo'.
   * @param {string} [agent.prompt] - The updated prompt of the agent.
   * @param {number} [agent.topk] - The updated number of tokens to consider for each step.
   * @param {string} [agent.welcome] - The updated welcome message of the agent.
   * @param {boolean} [agent.is_public] - The updated visibility of the agent. If true, the agent is public.
   * @param {string} [agent.pincode] - The updated pincode of the agent.
   * @returns {Promise<Object>} The updated agent object.
   * @throws {Error} If the API response is not ok.
   */
  async updateAgent(agentId, agent) {
    const response = await fetch(`${baseUrl}/agent/${agentId}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(agent)
    })
    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }
    return await response.json()
  }

  /**
   * Deletes an existing agent in the CodeGPTPlus API.
   *
   * @param {string} agentId - The ID of the agent to be deleted.
   * @returns {Promise<string>} A message indicating the deletion was successful.
   * @throws {Error} If the API response is not ok.
   */
  async deleteAgent(agentId) {
    const response = await fetch(`${baseUrl}/agent/${agentId}`, {
      method: 'DELETE',
      headers: this.headers
    })
    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }
    return 'Agent deleted successfully'
  }

  /**
   * Updates the documents of a specific agent in the CodeGPTPlus API.
   *
   * @param {string} agentId - The ID of the agent whose documents are to be updated.
   * @param {Array<string>} documents - An array of document IDs to be associated with the agent.
   * @returns {Promise<Object>} The updated agent object.
   * @throws {Error} If the API response is not ok or if the agentId or documents are empty.
   */
  async updateAgentDocuments(agentId, documents) {
    if (!agentId || !documents) {
      throw new Error('JUDINI: agentId and documents should not be empty')
    }

    const body = {
      agent_documents: documents
    }

    const response = await fetch(`${baseUrl}/agent/${agentId}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  /**
   * Retrieves all documents from the CodeGPTPlus API.
   *
   * @returns {Promise<Array<Object>>} An array of document objects.
   * @throws {Error} If the API response is not ok.
   */
  async getDocuments() {
    const response = await fetch(`${baseUrl}/document`, {
      method: 'GET',
      headers: this.headers
    })

    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  /**
   * Retrieves a specific document from the CodeGPTPlus API.
   *
   * @param {string} documentId - The ID of the document to be retrieved.
   * @returns {Promise<Object>} The document object.
   * @throws {Error} If the API response is not ok or if the documentId is empty.
   */
  async getDocument(documentId) {
    if (!documentId) {
      throw new Error('JUDINI: documentId should not be empty')
    }

    const response = await fetch(`${baseUrl}/document/${documentId}`, {
      method: 'GET',
      headers: this.headers
    })

    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  /**
   * Deletes a specific document from the CodeGPTPlus API.
   *
   * @param {string} documentId - The ID of the document to be deleted.
   * @returns {Promise<string>} A message indicating the deletion was successful.
   * @throws {Error} If the API response is not ok or if the documentId is empty.
   */
  async deleteDocument(documentId) {
    if (!documentId) {
      throw new Error('JUDINI: documentId should not be empty')
    }

    const response = await fetch(`${baseUrl}/document/${documentId}`, {
      method: 'DELETE',
      headers: this.headers
    })

    if (!response.ok) {
      const errorMessage = `JUDINI: API Response was: ${response.status} ${response.statusText} ${JUDINI_TUTORIAL}`
      throw new Error(errorMessage)
    }

    return 'Document deleted successfully'
  }
}
