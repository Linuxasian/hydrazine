import fs from 'fs'
import 'dotenv/config'

import client from './client'
import Database from '../module/database'
import formatMessage from '../module/formatMessage'
import handleMessage from '../module/handleMessage'
import actBaseActions from '../module/actBaseActions'
import discordClientActions from '../module/discordClientActions'

const config: any = JSON.parse(
  fs.readFileSync(`../engine/${fs.readdirSync('./engine')[0]}`, 'utf-8'),
)

const DB = new Database()
const envs = Object.keys(config?.$ENV || {})

if (config.$cinfo) {
  for (let i = 0; i < config.$cinfo.$onInitListeners.length; i++) {
    const listener = config.$cinfo.$onInitListeners[i]
    const actions = listener.$actions
    switch (listener.$type) {
      case 'process': {
        for (let j = 0; j < actions.length; j++) {
          const action = actions[j]
          actBaseActions(action)
          discordClientActions(action)
        }
        break
      }
      case 'on_client_ready': {
        client.on('ready', () => {
          actions.forEach((action: any) => {
            actBaseActions(action)
            discordClientActions(action)
          })
        })
        break
      }
    }
  }
}

if (config.$cinfo) {
  for (let i = 0; i < envs.length; i++) {
    const env = envs[i]
    const value = config?.$ENV[env]
    process.env[env] = value
  }
}

console.log(config.$cinfo)
if (config.$cinfo) {
  for (let i = 0; i < config.$cinfo.$onInitListeners.length; i++) {
    const event = config.$cinfo.$onInitListeners[i]
    const callbacks = event.$actions || []

    console.log(event.$type)
    switch (event.$type) {
      case 'text_command': {
        client.on('ready', () => {
          client.on('messageCreate', async (message) => {
            if (message.author.bot) return
            for (let i = 0; i < callbacks.length; i++) {
              const callback = callbacks[i]
              const conditions = callback.$conditions

              const equals = Object.keys(conditions?.$equals || {}) || []
              const cleanMsg = formatMessage(callback.$value, {
                MESSAGE_ID: message.id,
                AUTHOR_ID: message.author.id,
                AUTHOR_TAG: message.author.tag,
                AUTHOR_USERNAME: message.author.username,
              })

              handleMessage(message, callback, { cleanMsg })
            }
          })
        })
        break
      }
    }
  }
}

client.login(process.env.TOKEN).then((token) => {
  const PRESENCE: any = config.$GLOBAL?.$PRESENCE
  client.user.setActivity(PRESENCE)
  client.user.setPresence({
    status: 'idle',
  })
})
