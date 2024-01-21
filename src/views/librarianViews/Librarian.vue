<script setup>
import {
    Edit,
    Delete,
    Document
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js';

import { ElMessage } from 'element-plus';

const userInfoStore = useUserInfoStore();
const librarians = ref([
    {
        "librarianNumber":"",
        "name": ""
    }
])
import { librarianAddService,librarianInfoService, librarianListService } from '@/api/librarian.js'
const AddLibrarian = async () => {
    let result = await librarianAddService(librarianModel.value);
    ElMessage.success(result.message ? result.message : '添加成功。。。。。。');
    visibleDrawer.value = false;
    librarianModelClear();
    librarianList();
}
const visibleDrawer = ref(false);

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    librarianList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    librarianList();
}

const librarianList = async () => {

    let result = await librarianListService();
    librarians.value = result.data;
}
librarianList();

const librarianModel = ref({
    librarianNumber: '',
    name: ''
})

const rules = {
    librarianNumber: [
        { required: true, message: '请输入管理员账号', trigger: 'blur' },
        { min: 1, max: 16, message: '长度为1-16位非空字符', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入管理员用户名', trigger: 'blur' },
        { min: 1, max: 8, message: '长度为1-8位非空字符', trigger: 'blur' }
    ]
}

const librarianModelClear = () => {
    librarianModel.value.librarianNumber = '';
    librarianModel.value.name = '';
}

</script>

<template>
 <div class="container">
    <el-card class="box-card">
        <div class="text item" style="font-size: 25px;">
            <p style="font-size: 30px;">当前账号: <br>
                <el-text tag="mark" style="font-size: 25px; font-weight: bold; margin-left: 20px;">{{ userInfoStore.info.librarianNumber ? userInfoStore.info.librarianNumber : '' }}</el-text></p>

            <p style="font-size: 30px;">当前用户名: <br>
                <el-text tag="mark" style="font-size: 25px; font-weight: bold; margin-left: 20px;">{{ userInfoStore.info.name ? userInfoStore.info.name : '' }}</el-text></p>

        </div>
    </el-card>

    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>管理员列表</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true">新增管理员</el-button>
                </div>
            </div>
        </template>
        
        <el-table :data="librarians" style="width: 100%">
            <el-table-column label="管理员账号" prop="librarianNumber"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="新增管理员" direction="rtl" size="30%">
            <el-form :model="librarianModel" label-width="100px" :rules="rules">
                <el-form-item label="账号" prop="librarianNumber">
                    <el-input v-model="librarianModel.librarianNumber" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="librarianModel.name" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="AddLibrarian()">确定</el-button>
                    <el-button type="info" @click="librarianModelClear(); visibleDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
 </div>
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

.container {
  display: flex;
}

.page-container {
    width: 70%;
}

.box-card {
  width: 30%; 
  margin-right: 10px;
}
</style>