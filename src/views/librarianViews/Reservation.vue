<script setup>
import {
    Edit,
    Delete,
    Document,
    DocumentDelete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { reservationListService, reservationCancelService, reservationAddService } from '@/api/reservation.js'
import { bookListService} from '@/api/book.js';
const rId = ref('');

const visibleDrawer = ref(false);
const loading = ref(false)

const reservations = ref([
    {
        "reservationId": 6,
        "readerId": 3,
        "isbn": "ISBN7-301-02368-9",
        "reservationTime": "2023-12-24T01:00:11",
        "days": "",
        "reservationDueTime": "2024-01-01T01:00:11",
        "bookId": ""
    }
])

const readers = ref([
    {
        "readerId": 5,
        "name": "RRR",
        "phone": "15921035666",
        "email": "2662222222@qq.com"
    }
])
import { readerListService } from '@/api/reader.js'

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    reservationList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    reservationList();
}
// const readerList = async () => {
//     let params = {
//         pageNum: pageNum.value,
//         pageSize: pageSize.value,
//     }

//     let result = await readerListService(params);

//     total.value = result.data.total;
//     readers.value = result.data.items;
// }
// readerList();


const reservationList = async () => {
    loading.value = true;
    let Rparams = {
        pageNum: 1,
        pageSize: 10
    }

    let Rresult = await readerListService(Rparams);

    readers.value = Rresult.data.items;

    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        readerId: rId.value ? rId.value : null
    }

    let result = await reservationListService(params);

    total.value = result.data.total;
    reservations.value = result.data.items;

    for (let i = 0; i < reservations.value.length; i++) {
        let reservation = reservations.value[i];
        if (reservation.bookId == null) reservation.bookId = '/'
        for (let j = 0; j < readers.value.length; j++) {
            if (reservation.readerId == readers.value[j].readerId) {
                reservation.readerName = readers.value[j].name;
            }
        }
    }
    loading.value = false;
}
reservationList();

const cancelReservation = async (readerId, isbn, bookId)=> {
    console.log(readerId, isbn, bookId);

    ElMessageBox.confirm(
    '核销该预约吗?',
    '🔔温馨提示🔔',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
        let reult = await reservationCancelService(readerId, isbn, bookId);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      reservationList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消',
      })
    })
}

const date = ref('')
const reservationModel = ref({
    "readerId":2,
    "isbn":"ISBN7-301-02368-9",
    "days":8
})

const reservationModelClear = ()=> {
    reservationModel.value.readerId = '';
    reservationModel.value.isbn = '';
    date.value = '';
}

const disabledDate = (time) => {
    let today = new Date();
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 10);
    return time < today || time > maxDate;
}

const reserve = async (date) => {
    const now = new Date();
    const due = new Date(date);
    const diffInMs = due - now; // 注意这里的顺序

    const days = Math.floor(diffInMs / (24 * 3600 * 1000));
    const daysMs = diffInMs % (24 * 3600 * 1000);
    const hours = Math.floor(daysMs / (3600 * 1000));
    const hoursMs = daysMs % (3600 * 1000);
    const minutes = Math.floor(hoursMs / (60 * 1000));

    reservationModel.value.days = days;

    let result = reservationAddService(reservationModel.value);

    ElMessage.success(result.message ? result.message : '预约成功');

    visibleDrawer.value = false;

    reservationModelClear();

    reservationList();
}

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

const bookisbn = ref([
    {
        "isbn": '',
    }
])

const books_for_isbn = ref([
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

const bookListforauto = async() => {
    let isbnparams = {
        pageNum: 1,
        pageSize: 100,
        title: null,
        isbn: null,
        author: null
    }
    let isbnresult = await bookListService(isbnparams);
    books_for_isbn.value = isbnresult.data.items;

    bookisbn.value = [];
    //赋值booktitle vue对象
    for(let i=0;i<books_for_isbn.value.length;i++){
        console.log(books_for_isbn.value[i].isbn);
        const newisbn = {isbn: books_for_isbn.value[i].isbn}
        bookisbn.value.push(newisbn);
    }
    console.log(bookisbn.value);
}
bookListforauto();

const results = ref([]);
const querySearch = (queryString) => {
    results.value = [];
    // results.value.length = 0;
    if(queryString){
        for (let i = 0; i < bookisbn.value.length; i++) {
        if(bookisbn.value[i].isbn.indexOf(queryString) === 0){
            const item = {isbn: bookisbn.value[i].isbn}
            results.value.push(item);
        }
    }
    }else{
        results.value = bookisbn.value;
    }
    
    for (let i = 0; i < results.value.length; i++) {
        results.value[i].value = results.value[i].isbn;
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
                <span>预约管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true">预约</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="读者Id：">
                <el-input name="rId" placeholder="请输入Id" v-model="rId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="reservationList">搜索</el-button>
                <el-button @click="rId = ''; reservationList()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table v-loading="loading" :data="reservations" style="width: 100%">
            <!-- <el-table-column label="序号" width="80" type="index"></el-table-column> -->
            <el-table-column label="姓名" prop="readerName"></el-table-column>
            <el-table-column label="ISBN" prop="isbn"> </el-table-column>
            <el-table-column label="书本编号" prop="bookId"></el-table-column>
            <el-table-column label="预约时间" prop="reservationTime"></el-table-column>
            <el-table-column label="到期时间" prop="reservationDueTime"></el-table-column>

            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="DocumentDelete" circle plain type="danger" @click="cancelReservation(row.readerId, row.isbn, row.bookId)"></el-button>
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


        <el-drawer v-model="visibleDrawer" title="预约管理" direction="rtl" size="50%">

            <!-- 添加文章表单 -->
            <el-form :model="reservationModel" label-width="100px" :rules="rules">
                <el-form-item label="readerId">
                    <el-input v-model="reservationModel.readerId" placeholder="请输入readerId"></el-input>
                </el-form-item>
                
                <!-- 自动补全输入框 -->
                <el-form-item label="isbn">
                    <el-autocomplete
                        name="title"
                        v-model="reservationModel.isbn"
                        :fetch-suggestions="querySearch"
                        clearable
                        class="inline-input w-50"
                        placeholder="请输入isbn"
                        @select="handleSelect"
                    />
                </el-form-item>

                <!-- <el-form-item label="isbn">
                    <el-input v-model="reservationModel.isbn" placeholder="请输入isbn"></el-input>
                </el-form-item> -->

                <el-form-item label="预约到期时间">
                    <el-date-picker
                        v-model="date"
                        type="datetime"
                        placeholder="选择到期时间"
                        format="YYYY-MM-DD HH:mm:ss"
                        date-format="MMM DD, YYYY"
                        time-format="HH:mm"
                        :disabled-date="disabledDate"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reserve(date)">确定</el-button>
                    <el-button type="info" @click="reservationModelClear(); visibleDrawer = false;">取消</el-button>
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