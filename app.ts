import { ArgumentParser } from 'argparse'
import { TapTap } from './taptap'



//解析命令行参数
function argparseHelper(){
    const parser =new ArgumentParser({
        version:'0.0.1',
        description:'TapTap资讯'
    })
    
    const command = parser.addSubparsers({
        title:'命令',
        dest:'command',
    })

    //榜单
    const top = command.addParser('top', {
        description:'榜单',
        help:'榜单'
    })
    top.addArgument(['--download'],{
        help:'下载榜',
        action:'storeTrue'
    })
    top.addArgument(['--new'],{
        help:'新品榜',
        action:'storeTrue'
    })
    top.addArgument(['--reserve'],{
        help:'预约榜',
        action:'storeTrue'
    })
    top.addArgument(['--sell'],{
        help:'热卖榜',
        action:'storeTrue'
    })
    top.addArgument(['--play'],{
        help:'热玩榜',
        action:'storeTrue'
    })

    //评论
    const reply = command.addParser('reply', {
        description:'评论',
        help:'评论'
    })
    
    reply.addArgument('--id',{
        help:'游戏id',
        action:'store',
    })
    
    return parser.parseArgs()
}


//主函数
async function mian(){
    const args = argparseHelper()

    //榜单
    if(args.command === TapTap.CommandType.top){
        if(args.download){
            await TapTap.command(TapTap.CommandType.top,{
                params:TapTap.TopType.download
            })
        }else if (args.new){
            await TapTap.command(TapTap.CommandType.top,{
                params:TapTap.TopType.new
            })
        }else if(args.reserve){
            await TapTap.command(TapTap.CommandType.top,{
                params:TapTap.TopType.reserve
            })
        }else if(args.sell){
            await TapTap.command(TapTap.CommandType.top,{
                params:TapTap.TopType.sell
            })
        }else if(args.play){
            await TapTap.command(TapTap.CommandType.top,{
                params:TapTap.TopType.played
            })
        }
    }else if(args.command === TapTap.CommandType.reply){
        //评论
        TapTap.command(TapTap.CommandType.reply,{
            id:args.id
        })
    }
}


mian()