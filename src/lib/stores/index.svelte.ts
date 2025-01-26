import { browser } from '$app/environment';
import { PUBLIC_APP_NAME } from '$env/static/public';
import { getContext, setContext } from 'svelte';

export class PageState {
	title = $state('');
	actualTitle = $derived.by(() => {
		if (this.title.length > 0) {
			return `${this.title} | ${PUBLIC_APP_NAME}`;
		}
		return PUBLIC_APP_NAME;
	});
	isAnythingBackgroundUpdating = $state(false);
	constructor() {
		// $inspect("IS ANYTHING BACKGROUND UPDATING", this.isAnythingBackgroundUpdating);
		$effect(() => {
			const eventHandler = (event: BeforeUnloadEvent) => {
				event.preventDefault();
			}
			if (browser && this.isAnythingBackgroundUpdating) {
				console.log('Preventing unload');
				window.addEventListener('beforeunload', eventHandler)
			}
			return () => {
				console.log('Allowing unload');
				window.removeEventListener('beforeunload', eventHandler)
			}
		})
	}
}

const PageStateKey = Symbol('PageState');

export function setPageState() {
	return setContext(PageStateKey, new PageState());
}

export function getPageState() {
	return getContext<ReturnType<typeof setPageState>>(PageStateKey);
}
