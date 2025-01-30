import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import documentRoute from './document'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.onError((err,c)=>{
    if(err instanceof HTTPException){
        return err.getResponse();
    }
    return c.json({
        error:err.message
    })
})

const routes=app.route('/documents',documentRoute)

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Resumate!',
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const PATCH= handle(app)
type AppType=typeof routes
export default AppType