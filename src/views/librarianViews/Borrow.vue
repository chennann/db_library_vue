<script setup>
import {
    Edit,
    Delete,
    Document,
    EditPen
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
import { bookCopiesListService } from '@/api/book.js';
import { borrowService } from '@/api/borrow.js';


const bookName = ref('');
const bookId = ref('');
const visibleDrawer = ref(false);
const dialogVisible = ref(false);
const loading = ref(false)
const date = ref('');
const day = ref('');
const hour = ref('');
const minute = ref('');
const title = ref('借阅');

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    bookCopiesList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    bookCopiesList();
}

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

const title_and_bookId = ref([
    {
        "title": '',
        "bookId": '',
        "isbn": '',
        "location": '',
        "status": '',
        "librarianNumber": ''
    }
])

const borrowtitle = ref([
    {
        "title": '',
    }
])

const borrowisbn = ref([
    {
        "isbn": '',
    }
])

const bookCopiesList = async() => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        bookName : bookName.value ? bookName.value : null,
        bookId : bookId.value ? bookId.value : null
    }

    let result = await bookCopiesListService(params);

    total.value = result.data.total;
    bookCopies.value = result.data.items;

    let b_params = {
        pageNum: 1,
        pageSize: 100,
        bookName : null,
        bookId : null
    }
    
    let b_result = await bookCopiesListService(b_params);
    console.log("*************************************");
    title_and_bookId.value = b_result.data.items;
    console.log(title_and_bookId.value);
    
    //获取书本名字
    borrowtitle.value = [];
    for(let i=0;i<title_and_bookId.value.length;i++){
        let flag = false;
        for(let j=0;j<borrowtitle.value.length;j++){
            if(title_and_bookId.value[i].title == borrowtitle.value[j].title){
                flag = true;
                break;
            }
        }
        if(flag===false){
            const newtitle = {title: title_and_bookId.value[i].title}
            borrowtitle.value.push(newtitle);
        }
    }
    //去重后的书名
    console.log(borrowtitle.value);
    

    


}

bookCopiesList();

const borrowModel = ref({
    "readerId": 1,
    "bookId": "C301.1",
    "day": 1,
    "hour": 0,
    "minutes": 0
})

const qqq = ()=> {
    console.log(date.value);
}

const disabledDate = (time) => {
    let today = new Date();
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 10);
    return time < today || time > maxDate;
}

import { readerListService } from '@/api/reader.js'
const readers = ref([
    {
        "readerId": 5,
        "name": "RRR",
        "phone": "15921035666",
        "email": "2662222222@qq.com"
    }
])

const readersName = ref([
    {
        "name": '',
    }
])
const rId = ref('');
const rName = ref('');
//分页条数据模型
const readerList = async () => {
    let params = {
        pageNum: 1,
        pageSize: 100,
        readerId: rId.value ? rId.value : null,
        name: rName.value ? rName.value : null
    }
    let result = await readerListService(params);
    readers.value = result.data.items;
    readersName.value = [];
    for(let i=0;i<readers.value.length;i++){
        const newname = {name: readers.value[i].name}
        readersName.value.push(newname);
    }
}
readerList();

// 魔改borrow函数
const hashName = ref();

const borrow = async (date) => {
    const now = new Date();
    const due = new Date(date);
    const diffInMs = due - now; // 注意这里的顺序

    const days = Math.floor(diffInMs / (24 * 3600 * 1000));
    const daysMs = diffInMs % (24 * 3600 * 1000);
    const hours = Math.floor(daysMs / (3600 * 1000));
    const hoursMs = daysMs % (3600 * 1000);
    const minutes = Math.floor(hoursMs / (60 * 1000));

    // console.log(days);
    // console.log(hours);
    // console.log(minutes);

    borrowModel.value.day = days;
    borrowModel.value.hour = hours;
    borrowModel.value.minutes = minutes;

    // 处理hashName的映射逻辑
    for(let i=0;i<readers.value.length;i++){
        if(hashName.value == readers.value[i].name){
            borrowModel.value.readerId = readers.value[i].readerId;
            break;
        }
    }

    let result = await borrowService(borrowModel.value);

    ElMessage.success(result.message ? result.message : '借阅成功');

    dialogVisible.value = false;

    borrowModelClear();

    bookCopiesList();

}

const borrowModelClear = () => {
    borrowModel.value.readerId = '';
    borrowModel.value.bookId = '';
}

const results = ref([]);
const querySearch = (queryString) => {
    results.value = [];
    if(queryString){
        for (let i = 0; i < borrowtitle.value.length; i++) {
        if(borrowtitle.value[i].title.indexOf(queryString) === 0){
            const item = {title: borrowtitle.value[i].title}
            results.value.push(item);
        }
    }
    }else{
        results.value = borrowtitle.value;
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

// 为表格不同状态添加不同的样式
const tableRowClassName = ({ row, rowIndex }) => {
    if (row.status === "已借出") {
        return "success-row"
    }else if(row.status === "不外借"){
        return "warning-row"
    }else if(row.status === "已预约"){
        return "reserve-row"
    }
    return ""
}

const results_R = ref([]);
const querySearch_readersName = (queryString) => {
    results_R.value = [];
    if(queryString){
        for (let i = 0; i < readersName.value.length; i++) {
        if(readersName.value[i].name.indexOf(queryString) === 0){
            const item = {name: readersName.value[i].title}
            results_R.value.push(item);
        }
    }
    }else{
        results_R.value = readersName.value;
    }
    
    for (let i = 0; i < results_R.value.length; i++) {
        results_R.value[i].value = results_R.value[i].name;
    }
    console.log("****************启用querySearch事件后的results_R****************");
    console.log(results_R.value);
    return results_R.value;
}

const handleSelect_readersName = (item) => {
    console.log("****************启用handleSelect事件后的item****************");
    console.log(item.value);
}


const cancelBorrow = () => {
    dialogVisible.value = false;
    hashName.value = '';
}

</script>

<template>
    <el-card class="page-container">
        <!-- <template #header>
            <div class="header">
                <span>图书管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true">入库</el-button>
                </div>
            </div>
        </template> -->
        <!-- 搜索表单 -->
        <el-form inline>
            <!-- 自动补全输入框 -->
            <el-form-item label="bookName：">
                <el-autocomplete
                    name="bookName"
                    v-model="bookName"
                    :fetch-suggestions="querySearch"
                    clearable
                    class="inline-input w-50"
                    placeholder="请输入title"
                    @select="handleSelect"
                />
            </el-form-item>
            <el-form-item label="bookId：">
                <el-input name="bookId" placeholder="请输入bookId" v-model="bookId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="bookCopiesList">搜索</el-button>
                <el-button @click="bookName = '';bookId = '';bookCopiesList()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="bookCopies" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column label="序号" width="80" type="index"></el-table-column>
            <el-table-column label="书名" prop="title"></el-table-column>
            <el-table-column label="bookId" prop="bookId"> </el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    
                    <el-button :icon="EditPen" plain type="primary" @click="dialogVisible = true, borrowModel.bookId = row.bookId" :disabled="row.status !== '未借出'"></el-button>
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
            <!-- 添加文章表单 -->
            <el-form :model="borrowModel" label-width="100px" :rules="rules">
                <el-form-item label="readerId">
                    <el-input v-model="borrowModel.readerId" placeholder="请输入readerId"></el-input>
                </el-form-item>
                <el-form-item label="bookId">
                    <el-input v-model="borrowModel.bookId" placeholder="请输入bookId" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="bookId">
                    <el-date-picker
                        v-model="date"
                        type="datetime"
                        placeholder="选择还书日期"
                        format="YYYY-MM-DD HH:mm:ss"
                        date-format="MMM DD, YYYY"
                        time-format="HH:mm"
                        :disabled-date="disabledDate"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="borrow(date)">确定</el-button>
                    <el-button type="info" @click="visibleDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="borrowModel" label-width="100px" :rules="rules">
                <!-- <el-form-item label="readerId">
                    <el-input v-model="borrowModel.readerId" placeholder="请输入readerId"></el-input>
                </el-form-item> -->

                <!-- 自动补全输入框 -->
                <el-form-item label="UserName：">
                    <el-autocomplete
                        name="UserName"
                        v-model="hashName"
                        :fetch-suggestions="querySearch_readersName"
                        clearable
                        class="inline-input w-50"
                        placeholder="请输入读者姓名"
                        @select="handleSelect_readersName"
                    />
                </el-form-item>

                <el-form-item label="bookId">
                    <el-input v-model="borrowModel.bookId" placeholder="请输入bookId" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="还书日期">
                    <el-date-picker
                        v-model="date"
                        type="datetime"
                        placeholder="选择还书日期"
                        format="YYYY-MM-DD HH:mm:ss"
                        date-format="MMM DD, YYYY"
                        time-format="HH:mm"
                        :disabled-date="disabledDate"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelBorrow">取消</el-button>
                    <el-button type="primary" @click="borrow(date)"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- <el-dialog v-model="dialogVisible" title="处理申诉" width="30%">
            申诉理由
            <el-row>
                123
            </el-row>
            <el-row justify="center" style="margin-top: 20px;">
                <el-image style="width: 300px; height: 300px" :src="bookId" :fit="fill" />
            </el-row>
            <el-row justify="center" style="margin-top: 20px;">
                <el-button @click="dialogVisible = false" style="margin-right: 10px;">不同意</el-button>
                <el-button type="primary" @click="agree">同意</el-button>
            </el-row>
        </el-dialog> -->
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

<!-- 带状态表格的css样式 -->
<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-table .reserve-row {
    background-color: #d3bfef;
}
</style>
