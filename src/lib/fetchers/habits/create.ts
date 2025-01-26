import { PUBLIC_API_VERSION } from "$env/static/public"
import type { HabitsPostSchema } from "../../../routes/api/v1/habits/+server"

export default async function createHabit(body: HabitsPostSchema) {
    const res = await fetch(`/api/${PUBLIC_API_VERSION}/habits`, {
        method: 'POST',
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