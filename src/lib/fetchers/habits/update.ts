import { PUBLIC_API_VERSION } from "$env/static/public"
import type { HabitsPatchSchema } from "../../../routes/api/v1/habits/+server"

export default async function updateHabit(body: HabitsPatchSchema) {
    const res = await fetch(`/api/${PUBLIC_API_VERSION}/habits`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        throw new Error('Failed to create habit')
    }
    const resp = await res.json()
    return resp
}