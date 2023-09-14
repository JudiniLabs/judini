# Judini
**Judini**  is a Node.js library designed to interact seamlessly with the CodeGPTPlus API. It simplifies the process of sending messages to the API and managing the responses in an efficient and straightforward manner.

## Key Features
- **API Interaction**: Judini provides a user-friendly and straightforward interface to interact with the CodeGPTPlus API. You can effortlessly send requests and receive responses from the API.

- **Response Handling**: The library allows you to handle API responses efficiently. It can process the received data and convert it into a format that is easy to use and understand.

- **Streaming Control**: Judini also offers methods to check the streaming status and to stop the streaming at any given moment. This gives you complete control over the streaming process.

With Judini, working with the CodeGPTPlus API becomes a hassle-free and straightforward task. Whether you are sending messages, receiving responses, or controlling the streaming, Judini makes everything more manageable and simpler.

# Example of usage
Here's an example of how to use Judini to interact with the CodeGPTPlus API:

```js
import { CodeGPTPlus } from 'judini'

async function main () {
    // Replace with your own API Key
    const codegpt = new CodeGPTPlus('YOUR_API_KEY')

    // Define the message
    const msg = [{ role: 'user', content: 'What is the capital of Australia?' }]

    // Send the message and process the response
    const res = await codegpt.chatCompletion({
        messages: msg,
        agentId: 'YOUR_AGENT_ID'
    }, (chunk) => {
        console.log(chunk) // show the streaming response
    })
    console.log({ res }) // show the final response

    codegpt.getAgents().then((res) => { // get all agents
        console.log(res)
    })

    codegpt.getAgent('YOUR_AGENT_ID').then((res) => { // get a specific agent
        console.log(res)
    })
}

main()

```


# codegpt.chatCompletion

The `chatCompletion` method is a key feature of the Judini library. This function allows you to send your chat message to the CodeGPTPlus API and handle the response. Here's a brief overview of how it works:

```js
const response = await codegpt.chatCompletion({ messages, agentId } , callback);
```

## Parameters

- **messages**: An array of message objects that you want to send to the CodeGPTPlus API. Each object should have a `role` (which can be 'system', 'user', or 'assistant') and `content` which is the actual message.

- **agentId** (Optional): This optional parameter specifies the ID of the agent you want to use for the conversation. If no agentId is provided, the default agent is used.

- **callback** (Optional): This optional parameter is a function that will be called once the response is received from the API. The callback function is passed the response from the API as a parameter.

## Return Value

The `chatCompletion` method returns the complete string of the response from the CodeGPTPlus API. This allows you to easily access and manipulate the API response.

Please note that the `agentId` and `callback` parameters are optional. 

# codegpt.getAgents

The `getAgents` method allows you to retrieve a list of all the agents from the CodeGPTPlus API. Here's a brief overview of how to use it:

```js
const agents = await codegpt.getAgents();
```

## Parameters
This method does not take any parameters.

## Return Value
The `getAgents` method returns an array of objects, each representing an agent. Each object contains details about an agent, such as its ID, name, etc.

# codegpt.getAgent

The `getAgent` method allows you to retrieve a specific agent from the CodeGPTPlus API. Here's a brief overview of how to use it:

```js
const agent = await codegpt.getAgent(agentId);
```

## Parameters

- **agentId**: The ID of the agent you want to retrieve from the CodeGPTPlus API.

## Return Value

The `getAgent` method returns an object containing details about the agent. The object contains details such as the agent's ID, name, etc.
