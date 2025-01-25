import { PUBLIC_API_VERSION } from "$env/static/public"
import type { HabitInstancePutSchema } from "../../../routes/api/v1/habits/habit/+server"

export default async function insertHabitInstance({ date, habitId }: HabitInstancePutSchema) {
    const res = await fetch(`/api/${PUBLIC_API_VERSION}/habits/habit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, habitId })
    })
    if (!res.ok) {
        throw new Error('Failed to insert habit instance')
    }
    const resp = await res.json()
    return resp
}