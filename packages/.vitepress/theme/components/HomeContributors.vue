<script setup lang="ts">
const contributors = ['ajiu9']
const contributorsAvatars: Record<string, string> = {}
export interface Contributor {
  name: string
  avatar: string
}
function getAvatarUrl(name: string) {
  return `https://avatars.githubusercontent.com/${name}?v=4`
}

const contributorList = (contributors as string[]).reduce((acc, name) => {
  contributorsAvatars[name] = getAvatarUrl(name)
  acc.push({ name, avatar: contributorsAvatars[name] })
  return acc
}, [] as Contributor[])
</script>

<template>
  <div class="vp-doc">
    <h2 op50 font-normal pt-5 pb-2>
      contributorList
    </h2>
  </div>
  <div text-lg max-w-200 text-center leading-7 p-10>
    <div flex="~ wrap gap-1" justify-center>
      <a v-for="{ name, avatar } of contributorList" :key="name" :href="`https://github.com/${name}`" m-0 rel="noopener noreferrer" :aria-label="`${name} on GitHub`">
        <img loading="lazy" :src="avatar" width="40" height="40" rounded-full min-w-10 min-h-10 h-10 w-10 :alt="`${name}'s avatar`">
      </a>
    </div>
    <br>
  </div>
</template>
