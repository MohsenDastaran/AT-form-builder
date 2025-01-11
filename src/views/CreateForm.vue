<template>
  <div class="p-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-8 text-right">ساخت فرم</h1>

      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-end items-center mb-6">
          <button
            @click="onSubmit"
            class="bg-gray-800 text-white px-4 py-2 rounded-md mb-6"
          >
            ذخیره فرم
          </button>
        </div>

        <div class="flex gap-5 mb-2">
          <div class="w-1/2">
            <BaseInput
              class=""
              v-model="formTitle"
              label="نام فرم"
              placeholder="یک عنوان برای فرم"
              rtl
            />
          </div>
          <div class="w-1/2">
            <label class="block text-sm font-medium mb-1 text-right"
              >دسته بندی</label
            >
            <select
              v-model="formCategory"
              class="w-full p-2 border rounded-md text-right"
            >
              <option value="public">عمومی</option>
              <option value="private">تخصصی</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-right"
            >توضیحات فرم</label
          >
          <textarea
            v-model="formDescription"
            class="w-full p-2 border rounded-md text-right"
            rows="3"
          ></textarea>
        </div>
      </div>

      <draggable
        v-model="questions"
        item-key="id"
        class="space-y-4"
        handle=".drag-handle"
      >
        <template #item="{ element }">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-end items-center mb-4">
              <!-- <div class="flex items-center gap-2">
              </div> -->
              <div class="flex gap-2">
                <Switch
                  label="پاسخ الزامی"
                  :value="element.required"
                  @change="element.required = $event"
                />
                <button class="drag-handle p-1 hover:bg-gray-100 rounded">
                  <ArrowDownUp />
                </button>
                <button
                  class="p-1 hover:bg-gray-100 rounded"
                  @click="duplicateQuestion(element)"
                >
                  <Copy />
                </button>
                <button
                  class="p-1 hover:bg-gray-100 rounded"
                  @click="deleteQuestion(element)"
                >
                  <Trash />
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <input
                  type="text"
                  v-model="element.title"
                  class="p-2 border rounded-md flex-grow mx-4 text-right"
                  placeholder="عنوان پرسش"
                />
                <select v-model="element.type" class="p-2 border rounded-md">
                  <option value="short">پاسخ کوتاه</option>
                  <option value="long">پاسخ بلند</option>
                  <option value="single">تک پاسخی</option>
                  <option value="multiple">چند پاسخی</option>
                  <option value="file">بارگذاری پیوست</option>
                </select>
              </div>

              <div v-if="['single', 'multiple'].includes(element.type)">
                <div
                  v-for="(option, index) in element.properties"
                  :key="index"
                  class="flex items-center gap-2 mb-2"
                >
                  <input
                    :type="element.type === 'single' ? 'radio' : 'checkbox'"
                    disabled
                  />
                  <input
                    type="text"
                    v-model="option.text"
                    class="p-2 border rounded-md flex-grow text-right"
                    :placeholder="`گزینه ${index + 1}`"
                  />
                  <button
                    @click="removeOption(element, index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
                <button
                  @click="addOption(element)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  + افزودن گزینه
                </button>
              </div>

              <div v-if="element.type === 'file'" class="text-right">
                <div class="upload-container" id="drop-zone">
                  <input type="file" id="file-input" multiple />
                  <button class="upload-button" id="file-button">
                    افزودن فایل
                  </button>
                  <p class="upload-hint">فرمت‌های مورد قبول: JPG, PNG, PDF</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <button
        @click="addQuestion"
        class="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        + پرسش جدید
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import draggable from "vuedraggable";
import BaseInput from "@/components/BaseInput.vue";
import Switch from "@/components/Switch.vue";
import { useFormStore } from "@/store/formStore";
import router from "@/router";
import { Copy, Trash, ArrowDownUp } from "lucide-vue-next";
const formTitle = ref("");
const formDescription = ref("");
const formCategory = ref("public");

interface Option {
  text: string;
}

interface Question {
  id: number;
  type: "short" | "long" | "single" | "multiple" | "file";
  title: string;
  required: boolean;
  properties: Option[];
}

const questions = ref<Question[]>([]);
let nextId = 1;

const addQuestion = () => {
  questions.value.push({
    id: nextId++,
    type: "short",
    title: "",
    required: false,
    properties: [],
  });
};

const duplicateQuestion = (question: Question) => {
  const newQuestion = { ...question, id: nextId++ };
  const index = questions.value.findIndex((q) => q.id === question.id);
  questions.value.splice(index + 1, 0, newQuestion);
};

const deleteQuestion = (question: Question) => {
  const index = questions.value.findIndex((q) => q.id === question.id);
  questions.value.splice(index, 1);
};

const addOption = (question: Question) => {
  question.properties.push({ text: "" });
};

const removeOption = (question: Question, index: number) => {
  question.properties.splice(index, 1);
};
const onSubmit = () => {
  const payload = {
    form_type: formCategory.value,
    form_title: formTitle.value,
    description: formDescription.value,
    sections: questions.value,
  };
  if (!!Object.keys(props.form).length) {
    useFormStore()
      .editForm(props.form.id, payload)
      .then(() => router.push("/"));
  } else
    useFormStore()
      .submitForm(payload)
      .then(() => router.push("/"));
};

const props = defineProps({ form: Object as any });
if (!!Object.keys(props.form).length) {
  formCategory.value = props.form.form_type;
  formTitle.value = props.form.form_title;
  formDescription.value = props.form.description;
  questions.value = props.form.sections;
}
</script>
<style scoped>
.upload-container {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  font-family: "IRANSans", sans-serif;
  position: relative;
  background-color: #fafafa;
}

.upload-container.dragover {
  border-color: #666;
  background-color: #f0f0f0;
}

#file-input {
  display: none;
}

.upload-button {
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}

.upload-button:hover {
  background-color: #e0e0e0;
}

.upload-hint {
  color: #888;
  font-size: 14px;
  margin-top: 10px;
}
</style>
