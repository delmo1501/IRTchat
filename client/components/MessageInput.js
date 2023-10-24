export function MessageInput() {
    return (
        <form id="form" className="flex">
            <input type="text" name="message" id="input" placeholder="Type a message" className="flex-grow p-2 mr-2 border rounded" />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Send</button>
        </form>
    );
}
