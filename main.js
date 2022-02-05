const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const discordvoice = require('@discordjs/voice');
const Seviye = require('discord-xp')



const prefix = '*'

client.on('ready', () => {
    console.log("Bot Aktif!")
})


client.on('guildMemberAdd', guidlMember =>{
    let welcomeRole = guidlMember.guild.cache.find(role => role.id === '937634766142980148')
    guidlMember.roles.add(welcomeRole)
})

client.on('message', async ( message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase()

    if (command === 'sa') {
        message.channel.send("as")
    }

    if (command === 'merhaba') {
        message.channel.send("merhaba!")
    }

    if (command === 'iyimisin') {
        message.channel.send("Iyiyim, Sen")
    }

    if (command === 'iyiyim') {
        message.channel.send("Iyi olduguna sevindim!")
    }

    if (command === 'instagram') {
        message.channel.send("Instagram hesabimiz yoktur")
    }

    if (command === 'facebook') {
        message.channel.send("Facebook hesabimiz yoktur")
    }

    if (command === 'youtube') {
        message.channel.send(" https://www.youtube.com/channel/UC_DjHVyQdmD8px-CXK-lHJg ")
        message.channel.send("Youtube Kanalimizdir Abone Olmayi Like Atmayi Ve Yorum Yapmayi Unutma!")
    }

    if (command === 'kick') {
        const member = message.mentions.member.first();
        if(!member) return;
        if (message.member.permissions.has("KICK_MEMBERS")) {
            const memberTarget = message.guild.members.cache.get(member.id)
            memberTarget.kick()
            message.channel.send("Kullanici Kiclenmistir!")
        }


        else {
            message.channel.send("Kisiyi Etiketlemedin Veya Kiclemek Icin Yetkin Yoktur!")
        }
    }

    if (command === 'ban') {
        const member = message.mentions.member.first();
        if(!member) return;
        if (message.member.permissions.has("BAN_MEMBERS")) {
            const memberTarget = message.guild.members.cache.get(member.id)
            memberTarget.ban()
            message.channel.send("Kullanici Banlanmistir!")
        }


        else {
            message.channel.send("Kisiyi Etiketlemedin Veya Kisiyi Banlamak Icin Yetkin Yoktur!")
        }
    }

    

    if(command === 'sil'){
        if(!args[0]) return message.reply("Lütfen sayının miktarını girin!")
        if(isNaN(args[0])) return message.reply("Lütfen sayı giriniz!")

        if(args[0] > 100) return message.reply("100'den fazla mesajı silemezsiniz!")
        if(args[0] < 1) return message.reply("Sayınız en az 1 olmalıdır!")
        
        await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
            message.channel.bulkDelete(messages);
        });
    }


    if(command === 'oynat'){

        const voiceChannel =  message.member.voice.channel;


        if(!voiceChannel) return message.channel.send("Bir Ses Kanalina Girmelisin!")
        let permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("Gerekli Yetkin Yoktur!")
        if(!permissions.has('SPEAK')) return message.send("Gerekli Yetkilerin Yoktur")
        if(!args.length) return message.channel.send("Lutfen Sarki Adin Veya Sarki Link Gir")

        let connection = joinVoiceChannel(
        {
            channelId: message.member.voice.channel,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        const videoFinder = async (query) => {
            const videoResult =  ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null

        }
        let video = await videoFinder(args.join(' '));
        if(video){
            const stream = ytdl(video.url, {filter: 'audioonly'})
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () =>{
                voiceChannel.leave();
            })

            await message.reply(`**🎶 Simdi Oynanan Muzik ${video.title} **`)
        }

        else{
            message.reply("Muzik Sonuclari Bulunamamistir!")
        }
    }

    if(command === 'yardım'){
        const { MessageEmbed } = require('discord.js');

// inside a command, event listener, etc.
const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Nep Bot Yardım Menüsü')
	.setURL('https://www.youtube.com/channel/UC_DjHVyQdmD8px-CXK-lHJg')
	.setAuthor({ name: 'Nep', iconURL: 'https://cdn.discordapp.com/attachments/935570921924747404/938888297118326824/18.jpg', url: 'https://www.youtube.com/channel/UC_DjHVyQdmD8px-CXK-lHJg' })
	.setDescription('Yardım Menüsü Başlangıç')
	.setThumbnail('https://cdn.discordapp.com/attachments/935570921924747404/938888297118326824/18.jpg')
	.addFields(
		{ name: 'Sa Komutu', value: '`*sa`' },
		{ name: 'Yotube', value: '`*youtube`'},
		{ name: 'sil', value: '`*sil silinecek_mesaj_sayisi`'},
        { name: 'ban', value: '`*ban @banlanacak_kisi`'},
        { name: 'kick', value: '`*kick @kicklenecek_kisi`'},
        { name: 'susturma', value: '`EKLENECEKTIR`'},
        { name: 'level_sistemi', value: '`EKLENECEKTIR`'}

	)
	.addField('Muzik', '`BOZUKTUR`')
	.setImage('https://cdn.discordapp.com/attachments/935570921924747404/938888297118326824/18.jpg')
	.setTimestamp()
	.setFooter({ text: 'Yardım Menüsü Bitişi', iconURL: 'https://cdn.discordapp.com/attachments/935570921924747404/938888297118326824/18.jpg' });

    message.channel.send({ embeds: [exampleEmbed] });

    }

    if(command === 'kayıt'){
        message.channel.send("**KAYIT OLMAK ICIN ISIM YAS YAZMANIZ VE BEKLEMENIZ YETERLIDIR!**")
        message.channel.send("**YETKILILERIMIZ SIZI HEMEN KAYDETCEKTIR!**")
    }

    
})

client.login('OTM3OTcwMTYzMTQyMjQ2NDAx.YfjeyQ.VPDoBMGrfbOAuS3yJajy-UZWqVI')