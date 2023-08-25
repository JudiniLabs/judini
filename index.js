import https from 'https'

const JUDINI_TUTORIAL = 'https://docs.codegpt.co/docs/tutorial-ai-providers/judini'

export class CodeGPTPlus {
    constructor(apiKey) {
        this.apiKey = apiKey
        this.isStreaming = false
    }

    isLoading() {
        return this.isStreaming
    }

    stopStreaming() {
        this.isStreaming = false
    }

    async chatCompletion({ messages, agentId = ''}, callback = () => {}) {
        this.isStreaming = true

        const options = {
            hostname: 'plus.codegpt.co',
            port: 443,
            path: agentId ? `/api/v1/agent/${agentId}` : '/api/v1/agent',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.apiKey
            }
        }

        const body = {
            messages
        }

        // Creamos una nueva Promise que se resolverá cuando la solicitud se complete
        return new Promise((resolve, reject) => {
            let fullResponse = ''

            const request = https.request(options, response => {
                response.on('data', async (chunk) => {
                    if (!this.isStreaming) {
                        request.abort()
                        resolve(fullResponse)
                        return
                    }
                    const decoder = new TextDecoder('utf-8')
                    const text = decoder.decode(chunk)
                    if (text.includes('data: [DONE]')) {
                        return
                    }
                    try {
                        const datas = text.split('\n\n')
                        for (let i = 0; i < datas.length; i++) {
                            const data = JSON.parse(datas[i].replace('data: ', ''))
                            fullResponse+=data.data
                            callback(data.data)
                        }
                    } catch (e) { }
                })

                response.on('error', (e) => {
                    if (this.isStreaming) {
                        const errorMessage = `JUDINI: API Response was: Error ${e.message} ${JUDINI_TUTORIAL}`
                        callback(errorMessage)
                        fullResponse+=errorMessage
                        resolve(fullResponse)
                    }
                })

                response.on('close', () => {
                    this.isStreaming = false
                    resolve(fullResponse)
                })
            })

            request.write(JSON.stringify(body))
            request.end()
        })
    }
}
