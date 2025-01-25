import { PUBLIC_API_VERSION } from "$env/static/public"

export default async function deleteHabitInstance(id: number) {
    const res = await fetch(`/api/${PUBLIC_API_VERSION}/habits/habit`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    if (!res.ok) {
        throw new Error('Failed to delete habit instance')
    }
    const resp = await res.json()
    return resp
}