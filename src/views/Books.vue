<script setup>
import {
    Edit,
    Delete,
    Document
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
import { bookListService, bookCopiesListService, bookCopyAllocateService, bookAddService, bookAddPrecheckService } from '@/api/book.js';
import { useTokenStore } from '@/stores/token.js';

const tokenStore = useTokenStore();
const books = ref([
    {
        "isbn": "ISBN7-301-02368-9",
        "title": "111",
        "author": "111",
        "publisher": "chennn",
        "publishdate": "2002-09-09 00:00:00",
        "copies": 3,
        "librarianNumber": "21120992"
    }
])

const precheck = ref(true)
const newBook = ref(false)
const oldBook = ref(false)
const step = ref(1)

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    bookList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    bookList();
}

const visibleDrawer = ref(false)
const BookLoading = ref(false)
const CopyLoading = ref(false)
const date = ref('')
const num = ref(1)


const title = ref('')
const isbn = ref('')
const author = ref('')

const state1 = ref('')
//创建书本书名的vue对象
const booktitle = ref([
    {
        title,
    }
])

const books_for_title = ref([
    {
        "isbn": "ISBN7-301-02368-9",
        "title": "111",
        "author": "111",
        "publisher": "chennn",
        "publishdate": "2002-09-09 00:00:00",
        "copies": 3,
        "librarianNumber": "21120992"
    }
])

const bookList = async() => {
    BookLoading.value = true;
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        title: title.value ? title.value : null,
        isbn: isbn.value ? isbn.value : null,
        author: author.value ? author.value : null
    }

    let result = await bookListService(params);

    total.value = result.data.total;
    books.value = result.data.items;


    let titleparams = {
        pageNum: 1,
        pageSize: 100,
        title: null,
        isbn: null,
        author: null
    }
    let titleresult = await bookListService(titleparams);
    books_for_title.value = titleresult.data.items;

    booktitle.value = [];
    //赋值booktitle vue对象
    for(let i=0;i<books_for_title.value.length;i++){
        console.log(books_for_title.value[i].title);
        const newtitle = {title: books_for_title.value[i].title}
        booktitle.value.push(newtitle);
    }
    console.log(booktitle.value);

    BookLoading.value = false;
}
bookList();

const bookCopies = ref([
    {
        "title": "222",
        "bookId": "C302.1",
        "isbn": "ISBN7-302-02368-9",
        "location": "图书流通室",
        "status": "未借出",
        "librarianNumber": "21120992"
    }
])

const bookCopiesList = async(title) => {

    console.log(title);

    CopyLoading.value = true;
    let params = {
        pageNum: 1,
        pageSize: 100,
        bookName : title
    }

    let result = await bookCopiesListService(params);

    // total.value = result.data.total;
    bookCopies.value = result.data.items;

    CopyLoading.value = false;
}
const formatDateTime = (date)=> {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以加1
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const bookCopiesModel = ref({
    title: '',
    isbn: '',
    author: '',
    publisher: '',
    publishdate: '',
    copies: 1,
    librarianNumber: '21120992',
    bookCover: ''
})

const bookCopiesModelClear = () => {
    bookCopiesModel.value.title = '';
    bookCopiesModel.value.isbn = '';
    bookCopiesModel.value.author = '';
    bookCopiesModel.value.publisher = '';
    date.value = '';
    bookCopiesModel.value.copies = '';
    bookCopiesModel.value.bookCover = '';
}

const qqq = () => {
    console.log(formatDateTime(date.value))
    console.log(bookCopiesModel.value.copies);

    // bookCopiesModel.value.publishdate = formatDateTime(date.value);


}

const allocate = async(bookId, location) => {
    // console.log(bookId, location)
    const params = {
        bookId: bookId,
        location: location
    }
    let result = await bookCopyAllocateService(params);

    ElMessage.success(result.message ? result.message : '移动成功');
}

const addBook = async ()=> {
    bookCopiesModel.value.publishdate = formatDateTime(date.value);
    console.log('qqqqqq');
    let result = await bookAddService(bookCopiesModel.value);

    visibleDrawer.value = false;

    bookCopiesModelClear();

    ElMessage.success(result.message ? result.message : '入库成功');

    bookList();
}

const addPrecheck = async () => {
    let result = await bookAddPrecheckService(bookCopiesModel.value);

    if (result.data === "没有图书") {
        precheck.value = false;
        newBook.value = true;
    }
    else {
        
        bookCopiesModel.value.author = result.data.author;
        bookCopiesModel.value.title = result.data.title;
        bookCopiesModel.value.publisher = result.data.publisher;
        date.value = new Date(result.data.publishdate);
        bookCopiesModel.value.bookCover = result.data.bookCover;
        precheck.value = false;
        oldBook.value = true;
    }
    step.value = step.value + 1;
}

const uploadSuccess = (result) => {
    bookCopiesModel.value.bookCover = result.data;
    console.log(result.data);
}


const results = ref([]);
const querySearch = (queryString) => {
    results.value = [];
    // results.value.length = 0;
    if(queryString){
        for (let i = 0; i < booktitle.value.length; i++) {
        if(booktitle.value[i].title.indexOf(queryString) === 0){
            const item = {title: booktitle.value[i].title}
            results.value.push(item);
        }
    }
    }else{
        results.value = booktitle.value;
    }
    
    for (let i = 0; i < results.value.length; i++) {
        results.value[i].value = results.value[i].title;
    }
    console.log("****************启用querySearch事件后的results****************");
    console.log(results.value);
    return results.value;
}

const handleSelect = (item) => {
    console.log("****************启用handleSelect事件后的item****************");
    console.log(item.value)
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>图书管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true, step = 1">入库</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <!-- 自动补全输入框 -->
            <el-form-item label="书名：">
                <el-autocomplete
                    name="title"
                    v-model="title"
                    :fetch-suggestions="querySearch"
                    clearable
                    class="inline-input w-50"
                    placeholder="请输入title"
                    @select="handleSelect"
                />
            </el-form-item>

            <el-form-item label="isbn：">
                <el-input name="isbn" placeholder="请输入isbn" v-model="isbn"></el-input>
            </el-form-item>
            <el-form-item label="author：">
                <el-input name="author" placeholder="请输入作者" v-model="author"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="bookList">搜索</el-button>
                <el-button @click="title = ''; isbn = '';author = '';bookList()">重置</el-button>
            </el-form-item>

        </el-form>
        <!-- 文章列表 -->
        <el-table v-loading="BookLoading" :data="books" style="width: 100%">
            <el-table-column label="序号" width="80" type="index"></el-table-column>
            <el-table-column label="书名" prop="title"></el-table-column>
            <el-table-column label="ISBN" prop="isbn"> </el-table-column>
            <el-table-column label="作者" prop="author"></el-table-column>
            <el-table-column label="经办人" prop="librarianNumber"></el-table-column>
            <el-table-column label="操作" width="110" header-align="center">
                <template #default="{ row }">
                    <el-popover placement="right" :width="380" trigger="click">
                        <template #reference>
                            <el-button style="margin-right: 16px" @click="bookCopiesList(row.title)">查看书本</el-button>
                        </template>
                        
                        <el-table v-loading="CopyLoading" :data="bookCopies">
                            <el-table-column width="100" property="bookId" label="bookId" />
                            <el-table-column width="100" property="status" label="status" />
                            <el-table-column width="150" label="location" header-align="center">
                                <template #default="{ row }">
                                    <el-select placeholder="请选择" v-model="row.location"  @change="allocate(row.bookId, row.location)">
                                        <el-option label="图书流通室" value="图书流通室" ></el-option>
                                        <el-option label="图书阅览室" value="图书阅览室" ></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-popover>
                    <!-- <el-button :icon="Delete" circle plain type="danger"></el-button> -->
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="入库管理" direction="rtl" size="50%">
            <div style="height: 130px">
                <el-steps :active="step">
                <el-step title="Step 1" />
                <el-step title="Step 2" />
                <el-step title="Step 3" />
                </el-steps>
            </div>
            <!-- <el-button type="primary" @click="step = step+1">+1</el-button>
            <el-button type="primary" @click="step = step-1">-1</el-button> -->
                        <!-- 添加文章表单 -->
            <el-form :model="bookCopiesModel" v-if="precheck">
                <el-form-item label="isbn">
                    <el-input v-model="bookCopiesModel.isbn" placeholder="请输入isbn"></el-input>
                </el-form-item>
                <el-button type="primary" @click="addPrecheck">precheck</el-button>

            </el-form>

            <el-form :model="bookCopiesModel" v-if="oldBook">
                <el-form-item label="书名">
                    <el-input v-model="bookCopiesModel.title" placeholder="请输入书名" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="isbn">
                    <el-input v-model="bookCopiesModel.isbn" placeholder="请输入isbn" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="bookCopiesModel.author" placeholder="请输入作者" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="出版商">
                    <el-input v-model="bookCopiesModel.publisher" placeholder="请输入出版商" disabled="true"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload 
                        ref="uploadRef"
                        class="avatar-uploader" 
                        :show-file-list="false"
                        :auto-upload="true"
                        action="https://47.115.229.197:8443/upload"
                        name="file"
                        :headers="{Authorization: tokenStore.token}"
                        :on-success="uploadSuccess"
                        disabled="true"
                        >
                        <img v-if="bookCopiesModel.bookCover" :src="bookCopiesModel.bookCover" class="avatar" />
                        <img v-else src="@/assets/default.png" width="278" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="出版时间">
                    <el-date-picker
                        v-model="date"
                        type="date"
                        placeholder="Pick a day"
                        disabled="true"
                    />
                </el-form-item>
                <el-form-item label="数量">
                    <el-input-number v-model="bookCopiesModel.copies" :min="1" :max="10" @change="qqq" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addBook()">确定</el-button>
                    <el-button type="info" @click="bookCopiesModelClear(); visibleDrawer = false; precheck = true; oldBook = false; newBook = false;">取消</el-button>
                </el-form-item>
            </el-form>
            <el-form :model="bookCopiesModel" v-if="newBook" label-width="100px" :rules="rules">
                <el-form-item label="书名">
                    <el-input v-model="bookCopiesModel.title" placeholder="请输入书名"></el-input>
                </el-form-item>
                <el-form-item label="isbn">
                    <el-input v-model="bookCopiesModel.isbn" placeholder="请输入isbn" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="bookCopiesModel.author" placeholder="请输入作者"></el-input>
                </el-form-item>
                <el-form-item label="出版商">
                    <el-input v-model="bookCopiesModel.publisher" placeholder="请输入出版商"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload 
                        ref="uploadRef"
                        class="avatar-uploader" 
                        :show-file-list="false"
                        :auto-upload="true"
                        action="https://47.115.229.197:8443/upload"
                        name="file"
                        :headers="{Authorization: tokenStore.token}"
                        :on-success="uploadSuccess"
                        >
                        <img v-if="bookCopiesModel.bookCover" :src="bookCopiesModel.bookCover" class="avatar" />
                        <img v-else src="@/assets/default.png" width="278" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="出版时间">
                    <el-date-picker
                        v-model="date"
                        type="date"
                        placeholder="Pick a day"
                    />
                </el-form-item>
                <el-form-item label="数量">
                    <el-input-number v-model="bookCopiesModel.copies" :min="1" :max="10" @change="qqq" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addBook()">确定</el-button>
                    <el-button type="info" @click="bookCopiesModelClear(); visibleDrawer = false; precheck = true; oldBook = false; newBook = false;">取消</el-button>
                </el-form-item>
            </el-form>

        </el-drawer>
    </el-card>

</template>

<style lang="scss" scoped>
.page-container {
    // position: relative; /* 相对定位 */
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

// .pagination-container {
//     position: absolute; /* 绝对定位 */
//     bottom: 20px; /* 定位到底部 */
//     width: 100%; /* 宽度与父容器相同 */
// }
/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>