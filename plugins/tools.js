const axios = require('axios');
const { cmd } = require('../command');

// NASA APOD Command
cmd({
  pattern: 'nasa',
  alias: ['apod'],
  react: '🛰️',
  desc: 'Fetch NASA\'s Astronomy Picture of the Day',
  category: 'tools',
  filename: __filename
}, async (conn, mek, msg, { from, reply }) => {
  try {
    const { data } = await axios.get('https://api.nexoracle.com/details/nasa?apikey=e276311658d835109c');
    
    if (!data.result || data.status !== 200) {
      return reply('❌ Failed to fetch NASA data');
    }

    const { date, explanation, title, url } = data.result;
    const imageRes = await axios.get(url, { responseType: 'arraybuffer' });
    
    await conn.sendMessage(from, {
      image: Buffer.from(imageRes.data),
      caption: `*🚀 NASA Astronomy Picture of the Day*\n\n` +
               `*📛 Title:* ${title}\n` +
               `*📅 Date:* ${date}\n\n` +
               `*📝 Explanation:*\n${explanation}\n\n` +
               `_Powered by Kerm Md_`
    }, { quoted: mek });

  } catch (error) {
    console.error('NASA Error:', error);
    reply('❌ Failed to process NASA request');
  }
});

// WhatsApp Channel Stalker
cmd({
  pattern: 'whatsappchannelstalk',
  alias: ['chanstalk', 'wstalk'],
  react: '📢',
  desc: 'Get WhatsApp channel information',
  category: 'stalk',
  use: '.wstalk <channel-url>',
  filename: __filename
}, async (conn, mek, msg, { from, reply, args }) => {
  try {
    if (!args[0]) return reply('❌ Provide WhatsApp channel URL');
    
    const url = encodeURIComponent(args[0]);
    const { data } = await axios.get(`https://api.nexoracle.com/stalking/whatsapp-channel?apikey=e276311658d835109c&url=${url}`);
    
    if (!data.result || data.status !== 200) {
      return reply('❌ Invalid channel or API error');
    }

    const { title, followers, description, image, link } = data.result;
    const imageRes = await axios.get(image, { responseType: 'arraybuffer' });

    await conn.sendMessage(from, {
      image: Buffer.from(imageRes.data),
      caption: `*📢 WhatsApp Channel Info*\n\n` +
               `*🔖 Title:* ${title}\n` +
               `*👥 Followers:* ${followers}\n` +
               `*📄 Description:* ${description}\n\n` +
               `*🔗 Link:* ${link}\n\n` +
               `_Powered by Kerm Md_`
    }, { quoted: mek });

  } catch (error) {
    console.error('Channel Stalk Error:', error);
    reply('❌ Failed to fetch channel info');
  }
});

// IP Lookup Command
cmd({
  pattern: 'ip',
  alias: ['iplookup'],
  react: '🌐',
  desc: 'Lookup IP address information',
  category: 'stalk',
  use: '.ip <ip-address>',
  filename: __filename
}, async (conn, mek, msg, { from, reply, args }) => {
  try {
    if (!args[0]) return reply('❌ Provide IP address');
    
    const { data } = await axios.get(`https://api.nexoracle.com/stalking/ip?apikey=e276311658d835109c&q=${args[0]}`);
    
    if (!data.result || data.status !== 200) {
      return reply('❌ Invalid IP or API error');
    }

    const { ip, country, city, isp, org, lat, lon, timezone, mobile, proxy } = data.result;
    
    await reply(
      `*🌐 IP Address Information*\n\n` +
      `*🔢 IP:* ${ip}\n` +
      `*📍 Location:* ${city}, ${country}\n` +
      `*📡 ISP:* ${isp}\n` +
      `*🏢 Organization:* ${org}\n` +
      `*🌍 Coordinates:* ${lat}, ${lon}\n` +
      `*⏰ Timezone:* ${timezone}\n` +
      `*📱 Mobile:* ${mobile ? 'Yes' : 'No'}\n` +
      `*🛡️ Proxy:* ${proxy ? 'Yes' : 'No'}\n\n` +
      `_Powered by Kerm Md_`
    );

  } catch (error) {
    console.error('IP Error:', error);
    reply('❌ Failed to lookup IP address');
  }
});