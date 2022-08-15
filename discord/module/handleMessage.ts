const { EmbedBuilder } = require('discord.js')
import colors from 'colors/safe'
import fetch from 'node-fetch'

export default async function main(msg: any, callback: any, options: any) {
  // msg.channel.send('Handler works')
  console.log(callback.$type)
  try {
    switch (callback.$type) {
      case 'message_reply': {
        try {
          if (options.cleanMsg) {
            msg.reply(options.cleanMsg)
          }
        } catch (err) {
          colors.red(`[${new Date().getTime()}] Failed To Reply: ${err}`)
        }
        break
      }
      case 'message_react': {
        try {
          msg.react(callback.$value)
        } catch (err) {
          console.log(
            colors.red(`[${new Date().getTime()}] Failed To React: ${err}`),
          )
        }
        break
      }
      case 'message_delete': {
        try {
          msg.delete()
        } catch (err) {
          console.log(
            colors.red(`[${new Date().getTime()}] Failed To Delete: ${err}`),
          )
        }
        break
      }
      case 'send_meme_embed': {
        try {
          // Send GET request using fetch
          fetch('https://www.reddit.com/r/memes/random/.json', {
            method: 'GET',
            redirect: 'follow',
          })
            .then((res) => res.json())
            .then((random) => {
              const meme = random[0].data.children[0].data
              const embed = new EmbedBuilder()
                .setTitle(`Random Meme | ${meme.title}`)
                .setImage(meme.url)
                .setColor('#FF00A6')
              msg.channel.send({ embeds: [embed] })
            })
        } catch (err) {
          console.log(
            colors.red(
              `[${new Date().getTime()}] Failed To Send Meme Embed: ${err}`,
            ),
          )
        }
        break
      }
    }
  } catch (err) {
    console.log(
      colors.red(`[${new Date().getTime()}] Failed To Execute: ${err}`),
    )
  }
}
