import { PUBLIC_API_VERSION } from "$env/static/public"

export default async function deleteHabit(id: number) {
    const res = await fetch(`/api/${PUBLIC_API_VERSION}/habits`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    if (!res.ok) {
        throw new Error('Failed to delete habit')
    }
    const resp = await res.json()
    return resp
}