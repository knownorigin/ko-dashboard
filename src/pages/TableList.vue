<template>
  <div class="row">
    <div class="col-12">
      <card title="Events" subTitle="All events in order">
        <div slot="raw-content" class="table-responsive">
          <paper-table :data="koEvents" :columns="['blockNumber', 'event', 'eventValues']" v-if="koEvents">

          </paper-table>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
  import { db } from '../firebase';
  import { PaperTable } from '@/components';

  export default {
    components: {
      PaperTable
    },
    firestore () {
      return {
        koEvents: db.collection('raw').doc('mainnet').collection('events').orderBy('blockNumber')
      };
    }
  };
</script>
<style>
</style>
