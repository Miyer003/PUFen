import 'reflect-metadata';
import app from './app';

const PORT = Number(process.env.PORT) || 5000;

app.listen({ port: PORT }, (err: Error | null, address: string) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`服务端启动成功: ${address}`);
});