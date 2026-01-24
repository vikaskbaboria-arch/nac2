'use client'

export default function MessageButton({ receiverId }) {
  const startConversation = async () => {
    try {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ member2Id: receiverId })
      })

      const data = await res.json()
      console.log('conversation:', data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button
      onClick={startConversation}
      className="mt-4 px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-700 transition"
    >
      Message
    </button>
  )
}
