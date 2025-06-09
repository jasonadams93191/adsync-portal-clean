
import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = res.body;
    if (!data) return;

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      assistantMessage += decoder.decode(value);
      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>ACS Chat</title>
      </Head>
      <div className="min-h-screen bg-white text-gray-900">
        <header className="bg-[#0054A6] text-white p-4 flex justify-between items-center">
          <img src="/logo.png" alt="ACS" className="h-10" />
          <h1 className="text-xl font-bold">Adams Law AI Chat</h1>
        </header>
        <main className="p-4 max-w-2xl mx-auto">
          <div className="space-y-2 mb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded p-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage} className="bg-[#0054A6] text-white px-4 rounded">
              Send
            </button>
          </div>
          {loading && <p className="text-sm text-gray-500 mt-2">Thinking...</p>}
        </main>
      </div>
    </>
  );
}
