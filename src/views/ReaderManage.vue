<script setup>
import {
    Edit,
    Delete,
    Document
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const readers = ref([
    {
        "readerId": 5,
        "name": "RRR",
        "phone": "15921035666",
        "email": "2662222222@qq.com"
    }
])
import { readerListService, readerAddService, readerDeleteService, readerUpdateService } from '@/api/reader.js'

const visibleDrawer = ref(false);
const dialogVisible = ref(false);
const loading = ref(false)

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    readerList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    readerList();
}

const rId = ref('');
const rName = ref('');
const readerList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        readerId: rId.value ? rId.value : null,
        name: rName.value ? rName.value : null
    }

    let result = await readerListService(params);

    total.value = result.data.total;
    readers.value = result.data.items;


}
readerList();

const readerModel = ref({
    readerId: '',
    name: '',
    phone: '',
    email: ''
})

const rules = {
    name: [
        { required: true, message: '请输入aa姓名', trigger: 'blur' },
        { min: 2, max: 5, message: '长度为1-16位非空字符', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入电话', trigger: 'blur' },
        { min: 11, max: 11, message: '11位电话', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type:'email', required: true, message: '请输入正确邮箱格式', trigger: 'blur' }
        
    ]
}


const readerModelClear = () => {
    readerModel.value.name = '';
    readerModel.value.phone = '';
    readerModel.value.email = '';
}

import { ElMessage, ElMessageBox } from 'element-plus';
const addReader = async () => {

    let result = await readerAddService(readerModel.value);

    ElMessage.success(result.message ? result.message : '添加成功');

    visibleDrawer.value = false;

    readerModelClear();

    readerList();
}

const deleteReader = async(readerId) => {

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
        let reult = await readerDeleteService(readerId);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      readerList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消',
      })
    })

}

const updateReader = async() => {
    let result = await readerUpdateService(readerModel.value);

    ElMessage.success(result.message ? result.message : '添加成功');

    dialogVisible.value = false;

    readerModelClear();

    readerList();
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>读者管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true">新增读者</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="读者Id：">
                <el-input name="rId" placeholder="请输入readerId" v-model="rId"></el-input>
            </el-form-item>

            <el-form-item label="读者姓名：">
                <el-input name="state" placeholder="请输入姓名" v-model="rName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="readerList">搜索</el-button>
                <el-button @click="rId = ''; rName = ''; readerList()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="readers" style="width: 100%">
            <el-table-column label="读者Id" width="80" prop="readerId"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="电话号码" prop="phone"> </el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Document" circle plain type="info" @click="readerModel.name = row.name;readerModel.phone = row.phone;readerModel.email = row.email;readerModel.readerId = row.readerId;dialogVisible = true;"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteReader(row.readerId)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <!-- <div class="pagination-container"> -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <!-- </div> -->

        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="新增读者" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="readerModel" label-width="100px" :rules="rules">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="readerModel.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone">
                    <el-input v-model="readerModel.phone" placeholder="请输入电话"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="readerModel.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addReader()">确定</el-button>
                    <el-button type="info" @click="readerModelClear(); visibleDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="readerModel" label-width="100px" :rules="rules">
                <el-form-item label="姓名">
                    <el-input v-model="readerModel.name" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone">
                    <el-input v-model="readerModel.phone" placeholder="请输入电话号码" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="readerModel.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false; readerModelClear()">取消</el-button>
                    <el-button type="primary" @click="updateReader"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
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