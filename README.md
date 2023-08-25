# Judini
**Judini**  is a Node.js library designed to interact seamlessly with the CodeGPTPlus API. It simplifies the process of sending messages to the API and managing the responses in an efficient and straightforward manner.

## Key Features
- API Interaction: Judini provides a user-friendly and straightforward interface to interact with the CodeGPTPlus API. You can effortlessly send requests and receive responses from the API.

- Response Handling: The library allows you to handle API responses efficiently. It can process the received data and convert it into a format that is easy to use and understand.

- Streaming Control: Judini also offers methods to check the streaming status and to stop the streaming at any given moment. This gives you complete control over the streaming process.

With Judini, working with the CodeGPTPlus API becomes a hassle-free and straightforward task. Whether you are sending messages, receiving responses, or controlling the streaming, Judini makes everything more manageable and simpler.

# Example of usage
Here's an example of how to use Judini to interact with the CodeGPTPlus API:

```js
import { CodeGPTPlus } from 'judini'

async function main() {
    // Replace with your own API Key
    const codegpt = new CodeGPTPlus('YOUR_API_KEY')

    // Define the message
    const msg = [{role: 'user', content: 'What is the capital of Australia?'}]

    // Send the message and process the response
    const res = await codegpt.chatCompletion({
        messages: msg,
        agentId: 'YOUR_AGENT_ID'
    }, (data) => {
        console.log(data)
    })
    console.log({res})
}

main()
```
