<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ comment.body }}
      </p>
    </div>

    <div class="card-footer">
      <AppLink
        name="profile"
        :params="{ username: comment.author.username }"
        class="comment-author"
      >
        <img
          :src="comment.author.image"
          class="comment-author-img"
          :alt="comment.author.username"
        />
      </AppLink>

      &nbsp;

      <AppLink
        name="profile"
        :params="{ username: comment.author.username }"
        class="comment-author"
      >
        {{ comment.author.username }}
      </AppLink>

      <span class="date-posted">{{
        new Date(comment.createdAt).toLocaleDateString("en-US")
      }}</span>

      <span class="mod-options">
        <i
          v-if="showRemove"
          tabindex="0"
          role="button"
          aria-label="Delete comment"
          class="ion-trash-a"
          @click="emit('remove-comment')"
          @keypress.enter="emit('remove-comment')"
        />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Comment } from "src/services/api";

interface Props {
  comment: Comment;
  username?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "remove-comment"): boolean;
}>();

const showRemove = computed(
  () =>
    props.username !== undefined &&
    props.username === props.comment.author.username,
);
</script>
