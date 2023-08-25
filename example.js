import { CodeGPTPlus } from './index.js'

async function main() {
    const codegpt = new CodeGPTPlus('90ec4c44-946f-4214-ab02-e0b6aeae84fd')
    const msg = [{role: 'user', content: 'quien es martin ortiz?'}]
    const res = await codegpt.chatCompletion({
        messages: msg,
        agentId: '6eb7b8e2-64e6-4b42-a07c-b7826ae0b684'
    }, (data) => {
        console.log(data)
    })
    console.log({res})
}

main()
