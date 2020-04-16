const Koa = require('koa')
const app = new Koa();

const Router = require('koa-router')
const bodyParser = require("koa-bodyparser") //对传入的请求体进行解析
// const cors = require("koa2-cors"); //跨域

// app.use(bodyParser());

// let home = new Router()
// // 子路由1
// home.get('/', async ( ctx )=>{
//   let html = `
//     <ul>
//       <li><a href="/page/helloworld">/page/helloworld</a></li>
//       <li><a href="/page/404">/page/404</a></li>
//     </ul>
//   `
//   ctx.body = html
// })

// // 子路由2
// let page = new Router()
// page.get('/404', async ( ctx )=>{
//   ctx.body = '404 page!'
// }).get('/helloworld', async ( ctx )=>{
//   ctx.body = 'helloworld page!'
// })

// // 装载所有子路由
let main = new Router()

// router.use('/', home.routes(), home.allowedMethods())
// router.use('/page', page.routes(), page.allowedMethods())

function parsePostData(ctx) {
    return new Promise((resolve,reject)=>{
        try {
            let postdata = "";
            ctx.req.addListener('data',(data)=>{
                postdata += data
            })
            ctx.req.addListener('end',function(){
                let parseData = parseQueryStr(postdata)
                resolve(parseData);
            })
        } catch (err) {
            reject(err)
        }
    })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr( queryStr ) {
    let queryData = {}
    let queryStrList = queryStr.split('&')
    console.log( queryStrList )
    for (  let [ index, queryStr ] of queryStrList.entries()  ) {
      let itemList = queryStr.split('=')
      queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
    }
    return queryData
  }


main.get('/',async (ctx) => {
    let html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/home">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>nickName</p>
        <input name="nickName" /><br/>
        <p>email</p>
        <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `
    ctx.body = html
}).post('/',async (ctx) => {
    let data = await parsePostData(ctx);
    ctx.body = data;
});

let postData = new Router();

postData.post('/',async (ctx) => {
    let data = await parsePostData(ctx);
    ctx.body = data;
});

let router = new Router()
router.use('/home',main.routes())
// router.use('/',postData.routes())

app.use(router.routes());

// 监听
app.listen(3000,()=>{
    console.log('[demo] route-use-middleware is starting at port 3000')
});
