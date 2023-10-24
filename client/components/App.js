import { MessageList } from './MessageList.js';
import { MessageInput } from './MessageInput.js';

export function App() {
    return (
        <section id="chat" className="bg-white border rounded shadow-md max-w-md mx-auto mt-10 p-4">
            <MessageList />
            <MessageInput />
        </section>
    );
}