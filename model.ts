export interface Printable {
    print():void
}

export class Game implements Printable{
    id:string //游戏id
    order:string //排名
    name:string 
    score:string //评分
    author:string //厂商
    category:string //分类
    desc:string // 简介
    tags:Array<string> = [] //标签

    /**
     * 打印game
     */
    print(){
        console.log(`id: ${this.id}`)
        console.log(`排名: ${this.order}`)
        console.log(`名称: ${this.name}`)
        console.log(`评分: ${this.score}`)
        console.log(`${this.author}`)
        console.log(`分类: ${this.category}`)
        console.log('标签:',...this.tags)
        console.log(`简介: ${this.desc}`)
        console.log('\n')
    }
}

export class Reply implements Printable{
    user:string //用户
    score:number //评分
    up:string //支持
    down:string //反对
    content:string //评论详情

    /**
     * 打印reply
     */
    print(){
        console.log(`用户: ${this.user}`)
        console.log(`评分: ${this.score}星`)
        console.log(`点赞: ${this.up}`)
        console.log(`踩踩: ${this.down}`)
        console.log(`内容: ${this.content}`)
        console.log('\n')
    }
}