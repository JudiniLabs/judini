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
    const codegpt = new CodeGPTPlus({ apiKey: 'YOUR_API_KEY' }) // optional orgId

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

- **agentId**: This parameter specifies the ID of the agent you want to use for the conversation. If no agentId is provided, the default agent is used.

- **callback**: (Optional): This optional parameter is a function that will be called once the response is received from the API. The callback function is passed the response from the API as a parameter.

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

# codegpt.createAgent

The `createAgent` method allows you to create a new agent in the CodeGPTPlus API. Here's a brief overview of how to use it:

```js
const agent = await codegpt.createAgent({
    name: 'My New Agent',
    topk: 5,
    model: 'gpt-3.5-turbo',
    welcome: 'Welcome to my new agent!',
    prompt: 'This is a prompt for my new agent.'
});
```

## Parameters

- **name**: The name of the new agent you want to create.
- **topk**: The top-k value for the new agent (the number of context chunks to consider for the completion).
- **model**: The model to be used for the new agent.
- **welcome**: The welcome message for the new agent.
- **prompt**: The system prompt for the new agent.

## Return Value

The `createAgent` method returns an object containing details about the newly created agent. The object contains details such as the agent's ID, name, etc.

# codegpt.updateAgent

The `updateAgent` method allows you to update an existing agent in the CodeGPTPlus API. Here's a brief overview of how to use it:


```js
const agent = await codegpt.updateAgent(agentId, {
    name: 'My Updated Agent',
    model: 'gpt-3.5-turbo',
    prompt: 'This is an updated prompt for my agent.',
    topk: 10,
    welcome: 'Welcome to my updated agent!',
    is_public: true,
    pincode: '1234'
});
```

## Parameters

- **agentId**: The ID of the agent you want to update in the CodeGPTPlus API.
- **agent**: An object containing the updated values for the agent. The object can contain the following properties:
  - **name**: The updated name of the agent.
  - **model**: The updated model to be used by the agent. For example, 'gpt-3.5-turbo'.
  - **prompt**: The updated prompt of the agent.
  - **topk**: The updated number of tokens to consider for each step.
  - **welcome**: The updated welcome message of the agent.
  - **is_public**: The updated visibility of the agent. If true, the agent is public.
  - **pincode**: The updated pincode of the agent.

## Return Value

The `updateAgent` method returns an object containing details about the updated agent. The object contains details such as the agent's ID, name, etc.

# codegpt.deleteAgent

The `deleteAgent` method allows you to delete an existing agent from the CodeGPTPlus API. Here's a brief overview of how to use it:

```js
const message = await codegpt.deleteAgent(agentId);
```

## Parameters

- **agentId**: The ID of the agent you want to delete from the CodeGPTPlus API.

## Return Value

The `deleteAgent` method returns a message indicating that the deletion was successful.

# codegpt.updateAgentDocuments

The `updateAgentDocuments` method allows you to update the documents of an existing agent in the CodeGPTPlus API. Here's a brief overview of how to use it:

```js
const agent = await codegpt.updateAgentDocuments(agentId, [
    'documentId1',
    'documentId2'
]);
```

## Parameters

- **agentId**: The ID of the agent whose documents you want to update in the CodeGPTPlus API.
- **documents**: An array of document IDs to be associated with the agent.

## Return Value

The `updateAgentDocuments` method returns an object containing details about the updated agent. The object contains details such as the agent's ID, name, etc.

# codegpt.getDocument

The `getDocument` method allows you to retrieve a specific document from the CodeGPTPlus API. Here's a brief overview of how to use it:

```js
const document = await codegpt.getDocument(documentId);
```

## Parameters

- **documentId**: The ID of the document you want to retrieve from the CodeGPTPlus API.

## Return Value

The `getDocument` method returns an object containing details about the document. The object contains details such as the document's ID, name, etc.


# codegpt.getDocuments

The `getDocuments` method allows you to retrieve a list of all the documents from the CodeGPTPlus API. Here's a brief overview of how to use it:

```js
const documents = await codegpt.getDocuments();
```

## Parameters

This method does not take any parameters.

## Return Value

The `getDocuments` method returns an array of objects, each representing a document. Each object contains details about a document, such as its ID, name, etc.

# codegpt.deleteDocument

The `deleteDocument` method allows you to delete an existing document from the CodeGPTPlus API. Here's a brief overview of how to use it:

```js
const message = await codegpt.deleteDocument(documentId);
```

## Parameters

- **documentId**: The ID of the document you want to delete from the CodeGPTPlus API.

## Return Value

The `deleteDocument` method returns a message indicating that the deletion was successful.

# codegpt.experimental_AIStream

The `experimental_AIStream` method is a feature of the Judini library, which allows you to stream messages to the CodeGPTPlus API and handle the streaming response. This method is particularly useful for applications that require real-time and dynamic interaction with the API.  It's important to note that this method relies on the [Vercel AI SDK](https://sdk.vercel.ai/docs) to function. 

The [Vercel AI SDK](https://sdk.vercel.ai/docs) provides the StreamingTextResponse class, which is used to return the streaming response from the experimental_AIStream method. This SDK is designed to work with various frameworks such as `React/Next.js`, `Svelte/SvelteKit`, `Vue/Nuxt`, `Node.js`, `Serverless`, and the `Edge Runtime`, making it a versatile tool for many different types of applications.  

Here's a brief overview of how to use it:

```js
import { StreamingTextResponse } from 'ai'
import { CodeGPTPlus } from 'judini'

export async function POST(req){
    const {messages, agentId } = await req.json()
  
    const codegpt = new CodeGPTPlus({ apiKey: 'YOUR_API_KEY' }) // optional orgId
    const stream = await codegpt.experimental_AIStream({ messages, agentId });
    
    return new StreamingTextResponse(stream)
}
```

## Parameters

- **messages**: An array of message objects that you want to stream to the CodeGPTPlus API. Each object should have a `role` (which can be 'system', 'user', or 'assistant') and `content` which is the actual message.
- **agentId**: This parameter specifies the ID of the agent you want to use for the conversation. If no agentId is provided, the default agent is used.

## Return Value

The `experimental_AIStream` method returns a ReadableStream object that can be used to handle the streaming response from the CodeGPTPlus API. This object can be used to process the streaming response and convert it into a format that is easy to use and understand.
