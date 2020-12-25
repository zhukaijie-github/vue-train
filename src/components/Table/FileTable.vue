<template>
  <el-table :data="tableData" border default-expand-all style="width: 100%;">
    <el-table-column type="expand" v-if="expand">
      <template slot-scope="props">
        <span>{{ props.row }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="文件名"
      min-width="180"
    ></el-table-column>
    <el-table-column
      prop="type"
      label="文件类型"
      min-width="180"
    ></el-table-column>
    <el-table-column prop="size" label="文件大小" min-width="180">
      <template slot-scope="scope">
        <div>{{ $formSize(scope.row.size) }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="percentage" label="上传进度" min-width="180">
      <template slot-scope="scope">
        <div>{{ scope.row.percentage }} %</div>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="180">
      <template slot-scope="scope">
        <div>
          <slot :scope="scope" />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    expand: {
      type: Boolean,
      default: false
    }
  }
};
</script>
