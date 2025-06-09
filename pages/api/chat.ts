
import { OpenAIStream, Message } from '../../utils/OpenAIStream';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const { messages } = await req.json();
  const stream = await OpenAIStream(messages as Message[]);
  return new Response(stream);
}
