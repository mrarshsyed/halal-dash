<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import "../../package/ckeditor/build/ckeditor.js";

const props = defineProps({
  modelValue: {
    type: [String, null],
    default: () => "",
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  updateContent: {
    type: [String, null],
    default: () => null,
  },
  height: {
    type: String,
    default: () => "380px",
  },
  focusOnCreate: {
    type: Boolean,
    default: () => false,
  },
  placeholder: {
    type: String,
    default: () => "",
  },
});

const emit = defineEmits([
  "ready",
  "update:modelValue",
  "error",
  "focus",
  "blur",
  "destroy",
]);

let editor = null;
const editor_ref = ref(null);
onMounted(async () => {
  if (editor_ref.value) {
    // eslint-disable-next-line no-undef
    editor = await ClassicEditor.create(editor_ref.value, props.options);
    emit("ready", editor);
  }
  if (!editor) {
    emit("error", "Editor failed to load");
  } else {
    setEditorData(props.modelValue);
    if (props.focusOnCreate) editor.focus();
    editor.model.document.on("change:data", () => {
      emit("update:modelValue", editor.getData());
    });
    editor.editing.view.document.on(
      "change:isFocused",
      (event, data, isFocused) => {
        isFocused ? emit("focus", event) : emit("blur", event);
      }
    );
  }
});
onBeforeUnmount(async () => {
  await editor.destroy();
  emit("destroy");
});
const setEditorData = (data) => {
  editor.setData(data);
};
watch(
  () => props.updateContent,
  (data) => {
    if (typeof props.updateContent === "string") setEditorData(data);
  }
);
</script>

<template>
  <div class="skn-ck-editor">
    <textarea
      ref="editor_ref"
      :placeholder="placeholder"
    />
  </div>
</template>

<style scoped>
:deep(.ck-content) {
  height: v-bind(height);
}
:deep(.ck-toolbar) {
  background: rgb(249 250 251 / 1) !important;
}
</style>