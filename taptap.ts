import { Game } from './model'
import { Reply } from './model'
import { Printable } from './model'
import axios from 'axios'
import * as cheerio from 'cheerio'

const http = axios.create({
    baseURL:'https://www.taptap.com'
})

interface CommandOptions{
    params?:string
    id?:string
}

export class TapTap {
    //榜单类型
    static TopType = {
        download:'/download',//下载
        new:'/new',//新品
        reserve:'/reserve',//预约
        sell:'/sell',//热卖,
        played:'/played',//热玩
    }

    static CommandType = {
        top:'top',//榜单
        reply:'reply',//游戏评论获取
    }

    /**
     * 命令
     */
    static async command(cmd:string,options:CommandOptions){
        let command:Command = null
        
        if(cmd === TapTap.CommandType.top){
            command = new TopCommand(options.params)
        }else if(cmd === TapTap.CommandType.reply){
            command = new ReplyCommand(options.id)
        }

        await command.run()
    }
}


abstract class Command {
    constructor(private params:string){
        this.params = params
    }

    print(items:Printable[]):void {
        for(let item of items){
            item.print()
        }
    }

    async run(){
        const results = await this.parseHtml(this.params)
        this.print(results)
    }

    abstract parseHtml(params:string):Promise<Array<Printable>>
}

class TopCommand extends Command {
    constructor(params:string){
        super(params)
    }

    async parseHtml(params:string):Promise<Array<Printable>>{
        const res = await http.get('/top'+params)
        const html = res.data
        const $ = cheerio.load(html)
        const games:Game[] = []
        $('.app-top-list .taptap-top-card .top-card-middle').each((index,ele)=>{
            const game = new Game()
            game.order = $(ele).parent().find('.top-card-order-text').text().trim()
            game.name = $(ele).find('>a').text().trim()
            game.id = /.*\/(\d+)/g.exec($(ele).find('>a').attr('href').trim())[1]
            game.author = $(ele).find('.card-middle-author').text().trim()
            game.score = $(ele).find('.card-middle-score span').text().trim()
            game.desc = $(ele).find('.card-middle-description').text().trim()
            game.category = $(ele).find('.card-middle-category').text().trim()
            $(ele).find('.card-tags a').each((index,a)=>{
                game.tags.push($(a).text().trim())
            })
            games.push(game)
        })

        return games
    }
}


class ReplyCommand extends Command {
    constructor(params:string){
        super(params)
    }

    async parseHtml(params:string):Promise<Array<Printable>>{
        const res = await http.get('/app/'+params)
        const html = res.data
        const $ = cheerio.load(html)
        const replys:Reply[] =[]
        $('.taptap-review-list .taptap-review-item').each((index,ele)=>{
            const reply = new Reply()
            reply.user = $(ele).attr('data-user')

            const review_item_text = $(ele).find('.review-item-text')

            const width = review_item_text.find('.item-text-score .colored').css('width')
            reply.score = Number.parseInt(width.slice(0,width.indexOf('px')))/14

            reply.content = review_item_text.find('.item-text-body p').text().trim()
            reply.up = review_item_text.find('.item-text-footer .text-footer-btns li').eq(1).find('span').text()
            reply.down = review_item_text.find('.item-text-footer .text-footer-btns li').eq(2).find('span').text()

            replys.push(reply)
        })

        return replys
    }
}