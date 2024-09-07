<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	// Redirect to "/login"
	if(browser){
	goto('/login', {invalidateAll: true});
	}
</script>
