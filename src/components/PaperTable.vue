<template>
  <table class="table" :class="tableClass">
    <thead>
    <slot name="columns">
      <th v-for="column in columns" :key="column">{{ column }}</th>
    </slot>
    </thead>
    <tbody>
    <tr v-for="(item, index) in data" :key="index">
      <slot :row="item">
        <td v-for="(column, index) in columns"
            :key="index"
            v-if="hasValue(item, column)">
          <span v-html="itemValue(item, column)"></span>
        </td>
      </slot>
    </tr>
    </tbody>
  </table>
</template>
<script>
  export default {
    name: 'paper-table',
    props: {
      columns: Array,
      data: Array,
      type: {
        type: String, // striped | hover
        default: 'striped'
      },
      title: {
        type: String,
        default: ''
      },
      subTitle: {
        type: String,
        default: ''
      }
    },
    computed: {
      tableClass () {
        return `table-${this.type}`;
      }
    },
    methods: {
      hasValue (item, column) {
        return item[column] !== 'undefined';
      },
      itemValue (item, column) {
        if (typeof item[column] === 'object') {
          return Object.keys(item[column]).reduce((a, k) => `${a} ${k} <strong>${item[column][k]}</strong></br>`, '')
        }
        return item[column];
      }
    }
  };
</script>
<style>
</style>
